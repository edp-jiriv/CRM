using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.IO;
using System.Text;
using System.Configuration;
using Newtonsoft.Json;

public class MessageRest
{
    static string TxtReturn = "";
    static string responseFromServer = "";
    
    public MessageRest()
	{
	}

    public static bool CheckRESTServer()
    {
        bool rtValue = false;
        try
        {
            string TxtRequest = "topictest";
            TxtReturn = SendMessage(TxtRequest);

            if (TxtReturn.Contains("Fehlercode" + (char)5 + "00"))
            {
                rtValue = true;
            }
        }
        catch
        {
            rtValue = false;
        }

        return rtValue;
    }

    public static string SendMessage(string message)
    {
        string ResponseMessage = string.Empty;
        try
        {
            try
            {
                ResponseMessage = WebRequestPOST(ConfigurationManager.AppSettings["BrokerREST-PASOE"].ToString(), message);
            }
            catch (Exception ex)
            {
                ResponseMessage = "Fehlercode" + (char)5 + "-1" + ex.ToString();
            }
        }
        catch (Exception ex)
        {
            // generell exception
            ResponseMessage = "Fehlercode" + (char)5 + "-1" + ex.ToString();
        }
        return ResponseMessage;

    }


    private static string WebRequestGET(string RESTurl, string postData)
    {
        string url = RESTurl + "?filter=" + postData;
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "GET";
        request.ContentType = "application/json";

        WebResponse response = request.GetResponse();
        Stream dataStream = response.GetResponseStream();
        StreamReader reader = new StreamReader(dataStream, System.Text.Encoding.UTF8);

        string str = reader.ReadToEnd();
        // die Korektur der Werten mit Unicode
        str = str.Replace("\\\\", "\\");
        responseFromServer = ExtractResponse(str);

        dataStream.Close();
        response.Close();
        return responseFromServer;
    }

    private static string WebRequestPOST(string RESTurl, string postData)
    {
        //RESTurl = "http://10.151.0.28:8081/RESTVerb/rest/RESTVerbService/code";
        string url = RESTurl;
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "POST";
        //request.Method = "DELETE";
        request.ContentType = "application/json";

        postData = postData.Replace("\"", "'");
        postData = postData.Replace("%", "%25");
        postData = postData.Replace("" + (char)3, "%03");
        postData = postData.Replace("" + (char)4, "%04");
        postData = postData.Replace("" + (char)5, "%05");
        postData = postData.Replace("" + (char)6, "%06");
        postData = postData.Replace("" + (char)7, "%07");
        postData = postData.Replace("" + (char)8, "%08");
        postData = postData.Replace("" + (char)9, "%09");
        postData = postData.Replace("" + (char)10, "%0a");
        postData = postData.Replace("" + (char)13, "%0d");

        postData = "{\"request\":{\"filter\":\"" + postData + "\"}}";
        //postData = "{\"request\":{\"codeWert\":\"D1\"}}";

        /* POST with Bytes */
        byte[] byteArray = Encoding.UTF8.GetBytes(postData);
        request.ContentLength = byteArray.Length;

        Stream dataStream = request.GetRequestStream();

        /* POST with Bytes */
        dataStream.Write(byteArray, 0, byteArray.Length);
        dataStream.Close();

        // Antwort aus dem Server
        WebResponse response = request.GetResponse();
        dataStream = response.GetResponseStream();
        StreamReader reader = new StreamReader(dataStream, System.Text.Encoding.UTF8);

        string str = reader.ReadToEnd();
        // die Korektur der Werten mit Unicode
        str = str.Replace("\\\\", "\\");

        responseFromServer = ExtractResponse(str);
        return responseFromServer;
    }

    private static string ExtractResponse(string str)
    {

        StringReader strRead = new StringReader(str);
        JsonTextReader reader = new JsonTextReader(strRead);
        string responseFromServer = "";
        while (reader.Read())
        {
            if (reader.TokenType.ToString() == "PropertyName" &&
                reader.Value.ToString() == "messageResponse")
            {
                reader.Read();
                if (responseFromServer != "") responseFromServer = responseFromServer + (char)7;
                responseFromServer = responseFromServer + reader.Value.ToString();
            }
        }
        return responseFromServer;
    }
}
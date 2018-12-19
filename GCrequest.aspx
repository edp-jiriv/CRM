<%@ Page Language="C#" %>
<%@ Import namespace="System" %>
<%@ Import namespace="System.Web" %>
<%@ Import namespace="System.Web.UI" %>
<%@ Import namespace="System.Web.UI.WebControls" %>
<%@ Import namespace="System.Net" %>
<%@ Import namespace="System.IO" %>
<%@ Import namespace="System.Text" %>
<%@ Import namespace="System.Configuration" %>

	<script runat="server">

    static string txtAuthCode = "";
    static string RESTurl = "";
    static string postData = "";
    static string TxtState = "";
    static string[] items;
    static string param = "";
	static string ret;
	static string retURL;
    

	public void Page_Load(object sender, EventArgs e)
	{
		txtAuthCode = Request.QueryString["code"];
	        txtAuthCode = txtAuthCode.Substring(2, txtAuthCode.Length - 2);
        //Response.Write("CODE:" + txtAuthCode + "<br/>");

		string TxtState = Request.QueryString["state"];
		items = TxtState.Split((char)4);
        int n_items = items.Length - 1;
		param = "";
        for (int i1 = 0; i1 <= n_items; i1++)
        {
            param += "&" + items[i1];
        }
        retURL = items[n_items].Substring(7, items[n_items].Length - 7);
		
		param = param.Replace("+", "%2B");
		
       	RESTurl = "https://10.151.200.100:8980/GCService/GC";
		postData = param + "&code=" + txtAuthCode;
		//Response.Write("postData:" + postData);
		ret = WebRequestGET(RESTurl, postData);
		//Response.Write(ret);
	}

	protected override void Render(HtmlTextWriter outputHtml)
	{
		string TxtReturn = "<span>" + ret + "</span><br/><br/>" +
						   "<a style='display: block; width: 115px; height: 25px; text-decoration : none; " +
						   "background: linear-gradient(rgb(250,250,250),rgb(200,200,200)); padding: 10px; text-align: center; " +
						   "border-style: outset; border-width : 1px 1px 1px 1px;border-radius: 15px; color: black; font-weight: bold;' " +
						   "href='" + retURL + "' >" +
						   "<span style='display: block; padding: 0.2em 20px; font: bold 16px Helvetica;'>Return</span></a>";
		StringBuilder sbHTML = new StringBuilder(TxtReturn);
		outputHtml.Write(sbHTML);
	}
	
	private static string WebRequestGET(string RESTurl, string postData)
    {
		string url = RESTurl + "?" + postData;
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "GET";
        request.ContentType = "application/json";

        WebResponse response = request.GetResponse();
        Stream dataStream = response.GetResponseStream();
        StreamReader reader = new StreamReader(dataStream, System.Text.Encoding.UTF8);

        string str = reader.ReadToEnd();
        dataStream.Close();
        response.Close();
		return str;
    }

  </script>

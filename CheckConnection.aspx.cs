using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CheckConnection : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            Response.Write("RESTServer: " + MessageRest.CheckRESTServer().ToString());
        }
        catch (Exception ex)
        {
            Response.Write("RESTServer: error");
            Response.Write("<br><hr>" + ex.ToString());
        }
        Response.End();
    }
}
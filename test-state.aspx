<%@ Page Language="C#"  %>
<script runat="server">
	static string TxtCode = "";
	static string TxtState = "";
	string[] item;

	public void Page_Load(object sender, EventArgs e) {
		TxtCode = Request.QueryString["code"];
		//TxtState = Request.QueryString["state"];
		item = TxtState.Split((char)4);
	}

	protected override void Render(HtmlTextWriter outputHtml) {
		//StringBuilder sbHTML = new StringBuilder(TxtCode + " " + item[0] + " " + item[1]);
		StringBuilder sbHTML = new StringBuilder(TxtCode);
		outputHtml.Write(sbHTML);
		//return TxtReturn;
	}
</script>

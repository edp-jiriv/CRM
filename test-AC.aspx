<%@ Page Language="C#"  %>
<script runat="server">
	static string TxtReturn = "";

	public void Page_Load(object sender, EventArgs e) {
		TxtReturn = Request.QueryString["code"];
	}

	protected override void Render(HtmlTextWriter outputHtml) {
		StringBuilder sbHTML = new StringBuilder(TxtReturn);
		outputHtml.Write(sbHTML);
	}
</script>

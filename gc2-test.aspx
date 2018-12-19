<!--
  Copyright (c) 2011 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not
  use this file except in compliance with the License. You may obtain a copy of
  the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
  License for the specific language governing permissions and limitations under
  the License.

  To run this sample, replace YOUR API KEY with your application's API key.
  It can be found at https://code.google.com/apis/console/?api=plus under API Access.
  Activate the Google+ service at https://code.google.com/apis/console/ under Services
-->
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8' />
<script  language="C#" runat="server">
public void Page_Load(object sender, EventArgs e)
	{Response.Write("abc");}

protected override void Render(HtmlTextWriter outputHtml)
{
	StringBuilder sbHTML = new StringBuilder("123");
	outputHtml.Write(sbHTML);
}
</script>
</head>
<body>
 <script type="text/javascript">
	  document.write("error");
	alert("abc");
    </script>
 </body>
</html>
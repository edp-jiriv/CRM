<%@ Language="VBScript" %>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
    	<p>Sie befinden sich auf der Site entw-crm.faros.ch!!</p>
        <%
        for each x in Request.ServerVariables
            response.write(x & ": " & Request.ServerVariables(x) & "<br>")
        next
        %>     

    </body>
</html>

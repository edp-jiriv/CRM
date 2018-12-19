<%@ Page Language="C#" AutoEventWireup="true" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>faros web:crm</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta charset="utf-8" />

    <link rel="stylesheet" type="text/css" href="./jqm/jquery.mobile-1.3.2.min.css"/>
    <link rel="stylesheet" type="text/css" href="./jqm/jqm-datebox.min.css" />
    <link rel="stylesheet" type="text/css" href="./css/CRM.css" />

    <script type="text/javascript" src="./jqm/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="./jqm/jquery.mobile-1.2.1.min.js"></script>

    <script type="text/javascript" src="./jqm/jqm-datebox.core.min.js"></script>
    <script type="text/javascript" src="./jqm/jqm-datebox.mode.calbox.min.js"></script>
    <script type="text/javascript" src="./jqm/jqm-datebox.mode.datebox.min.js"></script>
    <script type="text/javascript" src="./jqm/jquery.mobile.datebox.i18n.de.asc.js"></script>

    <script type="text/javascript">
        function RadioChange() {
            var val = $("input[type='radio'][name='radio']:checked").val();
            visibleFields(val);
        }

        function visibleFields(val) {
            if (val == "Liste") {
                for (var i1 = 1; i1 <= 5; i1++) {
                    $("#Liste" + i1).css({ "display": "block" });
                }
                for (var i1 = 1; i1 <= 11; i1++) {
                    $("#Neu" + i1).css({ "display": "none" });
                }
            } else {
                for (var i1 = 1; i1 <= 5; i1++) {
                    $("#Liste" + i1).css({ "display": "none" });
                }
                for (var i1 = 1; i1 <= 11; i1++) {
                    $("#Neu" + i1).css({ "display": "block" });
                }
            }
        }


        function setParam() {
			actURL = window.location.href;
            var bt = $("#GoogleKalStart_save");
            var href = bt.attr("href");

            var val = $("input[type='radio'][name='radio']:checked").val();

            if (val == "Liste") {
                var timeMin = $("#ListeVon").val();
                if (timeMin != "") {
                    timeMin = timeMin.substr(6, 4) + "-" + timeMin.substr(3, 2) + "-" + timeMin.substr(0, 2);
                    timeMin += "T00:00:00Z";
                    timeMin = "timeMin=" + timeMin;
                }
                var timeMax = $("#ListeBis").val();
                if (timeMax != "") {
                    timeMax = timeMax.substr(6, 4) + "-" + timeMax.substr(3, 2) + "-" + timeMax.substr(0, 2);
                    timeMax += "T00:00:00Z";
                    timeMax = "timeMax=" + timeMax;
                }
                href += "&state=action=list" + "%04" + timeMin + "%04" + timeMax;

            } else {
                var startDat = $("#NeuStartDat").val();
                if (startDat != "") {
                    startDat = startDat.substr(6, 4) + "-" + startDat.substr(3, 2) + "-" + startDat.substr(0, 2);
                    var startTime = $("#NeuStartZeit").val();
                    if (startTime != "")
                        startTime = "T" + startTime + ":00%2B01:00";
                    else
                        startTime = "T00:00:00Z";
                    startDat = "startEvent=" + startDat + startTime;
                }
                var endDat = $("#NeuEndeDat").val();
                if (endDat != "") {
                    endDat = endDat.substr(6, 4) + "-" + endDat.substr(3, 2) + "-" + endDat.substr(0, 2);
                    var endTime = $("#NeuEndeZeit").val();
                    if (endTime != "")
                        endTime = "T" + endTime + ":00%2B01:00";
                    else
                        endTime = "T00:00:00Z";
                    endDat = "endEvent=" + endDat + endTime;
                }

                var summary = "summaryEvent=" + $("#Name").val();
                var description = "descriptionEvent=" + $("#Beschreibung").val();

                href += "&state=action=insert" + "%04" + startDat + "%04" + endDat + "%04" + summary + "%04" + description;
            }
            //alert(href);
			href += "%04" + "actURL=" + actURL;
            bt = $("#GoogleKalStart");
            href = bt.attr("href", href);
            bt[0].click();
        }

        $(document).ready(function () {
            $('#ListeVon, #ListeBis, #NeuStartDat, #NeuStartZeit, #NeuEndeDat, #NeuEndeZeit').click(function () {
                $(this).datebox('open');
            });

            visibleFields("Liste");
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <div data-role="page" id="review" data-title="faros web:crm">

        <div data-role="content">
            <!--
            <a data-role="button" id="GoogleKalStart1" href="https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/calendar&redirect_uri=https:%2F%2Fentw-crm.faros.ch%2Ftest.aspx&response_type=code&client_id=649152847109-kajbv2klm50ejkuj87e6or0u43m1gm68.apps.googleusercontent.com&state=2016-01-01T08:00:00Z" style='display:none;' runat='server'>Google Kalendar</a>
            -->
            <a id="GoogleKalStart_save" href="https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/calendar&redirect_uri=https:%2F%2Fentw-crm.faros.ch%2FGCrequest.aspx&response_type=code&client_id=649152847109-kajbv2klm50ejkuj87e6or0u43m1gm68.apps.googleusercontent.com" style='display:none;' runat='server'>Google Kalendar</a>
            <a data-role="button" id="GoogleKalStart" href="https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/calendar&redirect_uri=https:%2F%2Fentw-crm.faros.ch%2FGCrequest.aspx&response_type=code&client_id=649152847109-kajbv2klm50ejkuj87e6or0u43m1gm68.apps.googleusercontent.com" style='display:none;' runat='server'>Google Kalendar</a>
            <fieldset data-role="controlgroup" onChange="RadioChange()" style="width: 50%"><legend>Auswahl für Google Kalender:</legend>
                <input type="radio" name="radio" id="radio-1" value="Liste" checked="checked"/>
                <label for="radio-1">Übersicht der Ereignisse</label>

                <input type="radio" name="radio" id="radio-2" value="Neues"/>
                <label for="radio-2">Neues Ereignis</label>
            </fieldset>

            <div style="overflow:hidden;">
    		    <div id="Liste1" style="float:left">
                    <p>
                        <asp:label>Datum von:&nbsp;&nbsp;<asp:label>
                    </p>
                </div>
    		    <div id="Liste2" style="float:left">
                    <asp:TextBox runat="server" id="ListeVon" class="rapp-date right-round"
                             data-role="datebox" data-theme="c"
                             data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>

    		    <div id="Liste3">
                    <br/><br/><br/>
                </div>
    		    <div id="Liste4" style="float:left">
                    <p>
                        <asp:label>Datum bis:&nbsp;&nbsp;<asp:label>
                    </p>
                </div>
    	    	<div id="Liste5" style="float:left">
                    <asp:TextBox runat="server" id="ListeBis" class="rapp-date right-round"
                             data-role="datebox" data-theme="c"
                             data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>


                <div id="Neu1" style="float:left">
                    <p>
                        <asp:label>Datum von:&nbsp;&nbsp;<asp:label>
                    </p>
                </div>

                <div id="Neu2" style="float:left">
                    <asp:TextBox runat="server" id="NeuStartDat" class="rapp-date right-round"
                         data-role="datebox" data-theme="c"
                         data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>

                <div id="Neu3" style="float:left">
                    <asp:TextBox type="time" runat="server" id="NeuStartZeit" class="rapp-time"
                         data-role="datebox" data-theme="c"
                         data-options='{"mode":"timebox", "themeHeader":"c", "themeButton":"c", "useNewStyle":true}'/>
                </div>
    		    <div id="Neu4">
                    <br/><br/><br/>
                </div>

                <div id="Neu5" style="float:left">
                    <p>
                        <asp:label>Datum bis:&nbsp;&nbsp;<asp:label>
                    </p>
                </div>

                <div id="Neu6" style="float:left">
                    <asp:TextBox runat="server" id="NeuEndeDat" class="rapp-date right-round"
                         data-role="datebox" data-theme="c"
                         data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>

                <div id="Neu7" style="float:left">
                    <asp:TextBox type="time" runat="server" id="NeuEndeZeit" class="rapp-time"
                         data-role="datebox" data-theme="c"
                         data-options='{"mode":"timebox", "themeHeader":"c", "themeButton":"c", "useNewStyle":true}'/>
                </div>
    		    <div id="Neu8">
                    <br/><br/><br/><br/>
                    <span>Name:</span>
                    <br/>
                </div>
                <div id="Neu9" style="float:left">
                    <asp:TextBox runat="server" id="Name" TextMode="Multiline" rows="4" cols="60"/>
                </div>
    		    <div id="Neu10">
                    <br/><br/><br/><br/>
                    <span>Beschreibung:</span>
                    <br/>
                </div>
                <div id="Neu11" style="float:left">
                    <asp:TextBox runat="server" id="Beschreibung" TextMode="Multiline" rows="4" cols="60"/>
                </div>


                <br/><br/><br/><br/>
    		    <div style="float:left">
                    <a data-role="button" id="Btn_GC" href="#" onclick="setParam()">Google Kalender</a>
                </div>
            </div>
        </div>
    </div>
    </div>
    </form>
</body>
</html>

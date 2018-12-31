<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CRM.aspx.cs" Inherits="message" validateRequest="false" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>faros web:crm</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta charset="utf-8" />

    <link rel="stylesheet" type="text/css" href="./css/jquery.jqplot.min.css" />
    <link rel="stylesheet" type="text/css" href="./jqm/jquery.mobile-1.3.2.min.css"/>
    <link rel="stylesheet" type="text/css" href="./jqm/jqm-datebox.min.css" />
    <link rel="stylesheet" type="text/css" href="./css/CRM.css" />

    <script type="text/javascript" src="./jqm/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="./jqm/jquery.mobile-1.2.1.min.js"></script>

    <script type="text/javascript" src="./jqm/jqm-datebox.core.min.js"></script>
    <script type="text/javascript" src="./jqm/jqm-datebox.mode.calbox.min.js"></script>
    <script type="text/javascript" src="./jqm/jqm-datebox.mode.datebox.min.js"></script>
    <script type="text/javascript" src="./jqm/jquery.mobile.datebox.i18n.de.asc.js"></script>

    <script type="text/javascript" src="./js/CRM-func.js"></script>
    <script type="text/javascript" src="./js/CRM-init.js"></script>
    <script type="text/javascript" src="./js/CRM-filters.js"></script>
    <script type="text/javascript" src="./js/CRM-ready.js"></script>

    <script type="text/javascript" src="./js/jquery.jqplot.min.js"></script>
    <script type="text/javascript" src="./js/jqplot.barRenderer.min.js"></script>
    <script type="text/javascript" src="./js/jqplot.categoryAxisRenderer.min.js"></script>
    <script type="text/javascript" src="./js/jqplot.highlighter.min.js"></script>

    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
</head>
<body onmousedown="whichElement(event)">
    <form id="form1" runat="server" data-ajax="false" onkeydown="return TestKeyCode(event.keyCode);">
    <div>

    <div data-role="page" id="empty">
    </div>

    <!-- Login-Dialog -->
    <div data-role="page" id="login" data-dialog="true" data-overlay-theme="e" style="padding-top:0px" data-title="faros web:crm">
        <div data-role="header" data-position="fixed" data-theme="d">
            <h1>Anmeldung</h1>
        </div>

        <div data-role="content" data-theme="b">	
                <img src="icons/favicon.ico" alt="" style="height:20px"/>
                <span style="padding-left:5px">faros web:crm</span><br />
                <asp:label id="Mandant" runat="server" style="font-size:12px"/><br />
                <span style="font-size:12px">Version 6.0.0005.web:crm.0005</span><br /><br />
                <div>Bitte melden Sie sich an</div>
            <div data-role="fieldcontain" class="ui-hide-label">
                <asp:TextBox runat="server" id="Benutzer" placeholder="Benutzername" style="width:96%" /><br />
                <asp:TextBox runat="server" id="Passwort" TextMode="Password" value="" placeholder="Passwort" style="width:96%" />
            </div>
            <div id="disp-message" style="display:none;">
                <asp:label id="TxtMessage" runat="server" style="display:block;background:rgb(225,200,200);padding:10px;border:1px solid rgb(150,150,150);"/>
            </div>

    		<div style="float:left;width:45%">
               	<select id="FlipSign" name="FlipSign" data-role="slider" class="ui-btn-down-c" style="float:left;width:60%" onChange="FlipChange()">
   	            	<option value="Off">&#187;Anmelden&#187;</option>
           	    	<option value="On"></option>
                </select>
            </div>

            <div style="display:none">
                <asp:Button runat="server" ID="BtnAnmelden" data-role="button" style='display:none;' OnClick="Anmelden"/>
            </div>

            <asp:HiddenField id="H_TimeoutOfSession" runat="server"/>
            <asp:HiddenField id="H_FaviconPath" runat="server"/>
            <asp:HiddenField id="H_Login" runat="server"/>
            <asp:HiddenField id="H_ASPX" runat="server"/>
            <asp:HiddenField id="H_Part" runat="server"/>
            <asp:HiddenField id="H_Page" runat="server"/>
            <asp:HiddenField id="H_Return" runat="server"/>
            <asp:HiddenField id="H_IndexT" runat="server"/>
            <asp:HiddenField id="H_IndexM" runat="server"/>
            <asp:HiddenField id="H_IndexR" runat="server"/>
            <asp:HiddenField id="H_IndexK" runat="server"/>
            <asp:HiddenField id="H_Message" runat="server"/>
            <asp:HiddenField id="H_Info" runat="server"/>
            <asp:HiddenField id="H_Rowid" runat="server"/>
            <asp:HiddenField id="H_RowidH" runat="server"/>
            <asp:HiddenField id="H_IndrappTH" runat="server" value=""/>
            <asp:HiddenField id="H_TermineD" runat="server"/>
            <asp:HiddenField id="H_TermineP" runat="server" value="0"/>
            <asp:HiddenField id="H_TermineN" runat="server" value="1"/>
            <asp:HiddenField id="H_Fazit" runat="server"/>
            <asp:HiddenField id="H_Kunden" runat="server"/>
            <asp:HiddenField id="H_KundenM" runat="server" value="1"/>
            <asp:HiddenField id="H_Kundbeznr" runat="server"/>
            <asp:HiddenField id="H_KundenNav" runat="server" value="0"/>
            <asp:HiddenField id="H_Zust" runat="server"/>
            <asp:HiddenField id="H_KundRappO" runat="server"/>
            <asp:HiddenField id="H_KundRappE" runat="server"/>
            <asp:HiddenField id="H_Indrapp" runat="server"/>
            <asp:HiddenField id="H_Indkund" runat="server"/>
            <asp:HiddenField id="H_IndrappO" runat="server" value=""/>
            <asp:HiddenField id="H_IndrappE" runat="server" value=""/>
            <asp:HiddenField id="H_Indzust" runat="server"/>
            <asp:HiddenField id="H_Memos" runat="server"/>
            <asp:HiddenField id="H_RowidMemo" runat="server"/>

            <a data-role="button" id="loginCookies" style='display:none;' runat='server' OnServerClick='LoginCookies'>LoginCookies</a>
            <a data-role="button" id="reviewDet" style='display:none;' runat='server' OnServerClick='ReviewDet'>ReviewDet</a>
            <a data-role="button" id="rapportDet" style='display:none;' runat='server' OnServerClick='RapportDet'>RapportDet</a>
        </div>
    </div>

    <div id="InfoPage" data-role="page" data-overlay-theme="d">
        <div data-role="header" data-position="fixed" data-theme="c">
            <h1 class="header">Meldung</h1>
        </div> 
        <div data-role="content" data-theme="c" style="text-align:center;" >
            <div style="text-align:center">
                <b>faros web:crm</b><br/>
            </div>
            <div style="text-align:center;">
                <asp:label id="InfoMessage" runat="server" style="color:blue;"/>
            </div>
            <a id="InfoRef" href="#detail" data-role="button" data-theme="d" data-inline="true">
                <span id="InfoRefText"></span>
            </a>
        </div>
    </div>

    <div id="QuestionPage" data-role="page" data-overlay-theme="d">
        <div data-role="header" data-position="fixed" data-theme="c">
            <h1 class="header">Frage</h1>
        </div> 
        <div data-role="content" data-theme="c" style="text-align:center;" >
            <div style="text-align:center">
                <b>faros web:crm</b><br/>
            </div>
            <div style="text-align:center;">
                <asp:label id="QuestionMessage" runat="server" style="color:blue;"/>
            </div>
		    <div style="float:left">
                <a id="QuestionNo" href="#" data-role="button" data-theme="d" data-inline="true"
                   OnClick="questionL(false)">Nein</a>
            </div>
		    <div style="float:right">
                <a id="QuestionOK" href="#" data-role="button" data-theme="d" data-inline="true"
                   OnClick="questionL(true)">Ja</a>
            </div>
        </div>
    </div>

    <div data-role="page" id="review" data-title="faros web:crm">
        <div data-role="header" data-position="fixed" data-theme="c">
            <asp:Button runat="server" ID="BtnAbmelden" class="ui-btn-left" data-mini="true" Text="Abmelden"
                        data-inline="true" data-icon="arrow-l" OnClientClick="Abmelden()" OnClick="Abmelden"/>
            <h1 class="header">Termine</h1>
            <asp:Button runat="server" ID="BtnKunden" class="ui-btn-right" data-mini="true" Text="Kunden"
                        data-inline="true" data-icon="arrow-r" OnClientClick="KundenM('1')" OnClick="getKundenSuchen"/>
        </div> 
        <div data-role="content">
    		<div class="filter" style="float:left;width:32%">
           		<input type="search" class="search left-round" name="search-mini" id="searchTerm" value=""/>
            </div>
    		<div class="filterdat" style="float:left;width:37%">
                <asp:TextBox runat="server" id="TermineD" class="rapp-date right-round" onchange="TermRefresh()"
                             data-role="datebox" data-theme="c"
                             data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
            </div>
    		<div class="filtertyp" style="float:left;width:31%;">
                <asp:DropDownList runat="server" id="TermineTyp" data-inline="true" data-mini="true"
                                  onChange="TermTypChange()">
                   	<asp:ListItem Value="0" Selected="True">offene</asp:ListItem>
                	<asp:ListItem Value="1">erledigte</asp:ListItem>
                </asp:DropDownList>
            </div>
            <br /><br />
            <div id="norapp">
                <br />
                Keine aktuellen Termine gefunden. Zur Anzeige von abgelaufenen und
                unerledigten Terminen klicken Sie bitte <a href="#" OnClick="TermPrev()">hier.</a>
            </div>
            <div class='LV_Term'>
                <asp:label id="LV_Term" runat="server"></asp:label>
            </div>
        </div>

        <div style="display:none">
            <asp:Button runat="server" id="PTermineS" data-role="button" onclick="TermPrev"/>
            <asp:Button runat="server" id="ATermineS" data-role="button" OnClick="Refresh"/>
            <asp:Button runat="server" id="NTermineS" data-role="button" onclick="TermNext"/>
        </div>

        <div data-role="footer" data-position="fixed">
            <div data-role="navbar" data-mini="true">
                <ul>
                    <li class="PTermine">
                        <a id="PTermine" href="#" data-role="button"
                            data-corners="false" data-icon="arrow-l" data-iconpos="top"
                            OnClick="TermPrev()">Früher</a></li>
            	    <li class="Refresh">
                        <a id="ATermine" data-role="button"
                            data-corners="false" data-theme="d" data-icon="refresh" data-iconpos="top"
                            OnClick="TermRefresh()">Neu laden</a></li>
                    <li class="NTermine">
                        <a id="NTermine"  data-role="button"
                            data-corners="false" data-icon="arrow-r" data-iconpos="top"
                            OnClick="TermNext()">Später</a></li>
                </ul>
            </div>
        </div> 
    </div>

    <div data-role="page" id="detail" data-title="faros web:crm">
        <asp:label id="l_detail_header" runat="server"></asp:label>
        <div data-role="content">
		    <div style="float:right">
                <asp:LinkButton runat="server" id="Btn_edit" Text="Edit"
                                data-icon="gear" data-role="button" data-theme="d" 
                                OnClientClick="showEdit('#detail')" href="#fazit"/>
            </div>

		    <div>
                <strong>Kunde</strong><br />
                <asp:label id="TkundBeznr" runat="server" style='display:none;'></asp:label>
                <asp:label id="kname" runat="server"></asp:label><br/>
                <asp:label id="strasse" runat="server"></asp:label>&nbsp;<asp:label id="hnr" runat="server"></asp:label><br/>
	            <asp:label id="PLZ" runat="server"></asp:label>&nbsp;<asp:label id="ort" runat="server"></asp:label><br/>
                <asp:label id="telefonK_det" runat="server"></asp:label>
                <asp:label id="emailK_det" runat="server"></asp:label><br/>

                <strong><asp:label id="name" runat="server"></asp:label></strong><br/>
                <asp:label id="titelA_det" runat="server"></asp:label>
                <asp:label id="telefonA_det" runat="server"></asp:label>
                <asp:label id="emailA_det" runat="server"></asp:label><br/>

                <strong><u>Rapport</u></strong><br />
                <asp:Image src="" id="rappaktivIcon" runat="server" alt="" />
                <strong><asp:label id="rappaktiv" runat="server"></asp:label></strong><br/>
                <strong><asp:label id="rappdatum" runat="server"></asp:label>&nbsp;<asp:label id="rappzeit" runat="server"></asp:label></strong><br/>
                <asp:label id="rapptext" runat="server" style="font-style: italic"></asp:label><br/>

                <strong><u>Termin</u></strong><br />
                <asp:Image src="" id="termaktivIcon" runat="server" alt="" />
                <strong><asp:label id="termaktiv" runat="server"></asp:label></strong><br/>
                <strong><asp:label id="termday" runat="server"></asp:label></strong>
                <strong><asp:label id="termdatum" runat="server"></asp:label></strong>
                <strong><asp:label id="termzeit" runat="server"></asp:label></strong><br/>

                <asp:label id="objekt" runat="server"></asp:label>
                <asp:label id="termtext" runat="server" style="font-style: italic"></asp:label><br/>
            </div>

            <asp:label id="collapsible_hist" runat="server" data-role="collapsible" data-collapsed="false" data-inline="true" data-theme="c">
                <h3>History</h3>
           		<input type="search" class="search" id="searchHist" value="" data-mini="true" />
                <asp:label id="LV_Hist" runat="server"></asp:label>
                <a id="HistNumRec" runat="server" data-role="button" class="ui-btn-up" data-icon="arrow-d" data-inline="true"
                    onClick="dispHistoryButton()" onServerClick="showHistoryT">Vorherige 5 Rapporte</a>
            </asp:label>
        </div>

        <div data-role="footer" class="nav-glyphish" data-position="fixed" data-theme="c">
            <div data-role="navbar" class="nav-glyphish" data-mini="true">
                <ul>
                    <li><a class="call" href="#telefon" data-rel="dialog" data-icon="custom">Telefon</a></li>
                    <li><a class="map" href="#mapkrPage" data-icon="custom">Karte</a></li>
                    <li><a class="mail" href="#email" data-rel="dialog" data-icon="custom">E-Mail</a></li>
                    <li><a class="message" href="#sms" data-rel="dialog" data-icon="custom">SMS</a></li>
                </ul>
            </div>
        </div> 
    </div>

    <div data-role="page" id="edit" data-title="faros web:crm"> 
        <div data-role="header" data-position="fixed" data-theme="c">
            <a href="#" onclick="getBack()" data-icon="arrow-l">Zurück</a>
            <h1 class="header">Edit</h1>
        </div> 
        <div data-role="content">
            <strong>Kunde</strong><br/>
            <asp:label id="edit_kname" runat="server"></asp:label>
            <asp:label id="edit_strasse" runat="server"></asp:label>&nbsp;<asp:label id="edit_hnr" runat="server"></asp:label><br/>
            <asp:label id="edit_plz" runat="server"></asp:label>&nbsp;<asp:label id="edit_ort" runat="server"></asp:label>

            <h2 style="margin-bottom:0px;">Rapport</h2>
            <div>
                <asp:DropDownList runat="server" id="edit_RKontakt" data-inline="true" onChange="KontaktChange('edit_R')"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<asp:label runat="server" id="edit_Rtitel"></asp:label>
                <asp:TextBox runat="server" id="edit_RKontaktNew" style="display:none"/>
            </div>

            <div style="overflow:hidden;">
                <div style="float:left;">
                    <asp:DropDownList runat="server" id="edit_RappAktiv" data-inline="true" />
                </div>
                <div style="float:left;">
                    <asp:TextBox runat="server" id="edit_RappDatum" class="rapp-date" onchange="checkDate('fazit', this.value)"
                                 data-role="datebox" data-theme="c" onfocus="checkDateBox()"
                                 data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>
                <div style="float:left;">
                    <asp:TextBox type="time" runat="server" id="edit_RappZeit" class="rapp-time" onchange="checkTime('fazit', this.value)"
                                 data-role="datebox" data-theme="c"
                                 data-options='{"mode":"timebox", "themeHeader":"c", "themeButton":"c", "useNewStyle":true}'/>
                </div>
            </div>

            <br/>
            
            <strong>Rapport-Text</strong><br/>
            <asp:TextBox runat="server" id="edit_RappText" TextMode="Multiline" rows="6" cols="60"/>

            <br/><br/>
            <div>
                <asp:DropDownList runat="server" id="edit_AKontakt" data-inline="true" onChange="KontaktChange('edit_A')"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<asp:label runat="server" id="edit_Atitel"></asp:label>
                <asp:TextBox runat="server" id="edit_AKontaktNew" style="display:none"/>
            </div>

            <div style="overflow:hidden;">
                <div style="float:left;">
                    <asp:DropDownList runat="server" id="edit_TermAktiv" data-inline="true" />
                </div>
                <div style="float:left;">
                    <asp:TextBox runat="server" id="edit_TermDatum" class="rapp-date" onchange="checkDate('edit', this.value)"
                                 data-role="datebox" data-theme="c"
                                 data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>
                <div style="float:left">
                    <asp:TextBox type="time" runat="server" id="edit_TermZeit" class="rapp-time" onchange="checkTime('edit', this.value)"
                                 data-role="datebox" data-theme="c"
                                 data-options='{"mode":"timebox", "themeHeader":"c", "themeButton":"c", "useNewStyle":true}'/>
                </div>
            </div>

            <br/>
            <strong>Termin-Text</strong><br/>
            <asp:TextBox runat="server" id="edit_TermText" TextMode="Multiline" rows="4" cols="60"/>

            <br/><br/>
            <a data-role="button" href="#" data-theme="a" OnClick="editSave()">Speichern</a>
        </div>
    </div>

    <div data-role="page" id="fazit" data-title="faros web:crm"> 
        <div data-role="header" data-position="fixed" data-theme="c">
            <a href="#" onclick="getBack()" data-icon="arrow-l">Zurück</a>
            <h1 class="header">Edit</h1>
        </div> 
        <div data-role="content">
            <strong>Kunde</strong><br/>
            <asp:label id="fazit_kname" runat="server">FAZIT</asp:label>
        </div>
    </div>

    </div>
    </form>
</body>
</html>

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
<body>
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
                <span style="font-size:12px">Version 6.0.0005.web:crm.0006</span><br /><br />
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
            <asp:HiddenField id="H_Page" runat="server"/>
            <asp:HiddenField id="H_Return" runat="server"/>
            <asp:HiddenField id="H_Mitbeznr" runat="server"/>
            <asp:HiddenField id="H_Default" runat="server"/>
            <asp:HiddenField id="H_Message" runat="server"/>
            <asp:HiddenField id="H_Info" runat="server"/>
            <asp:HiddenField id="H_Rowid" runat="server"/>
            <asp:HiddenField id="H_RowidH" runat="server"/>
            <asp:HiddenField id="H_Rapport" runat="server"/>
            <asp:HiddenField id="H_History" runat="server"/>
            <asp:HiddenField id="H_HistoryDet" runat="server"/>
            <asp:HiddenField id="H_IndrappTH" runat="server" value=""/>
            <asp:HiddenField id="H_Umsatz" runat="server"/>
            <asp:HiddenField id="H_TermineD" runat="server"/>
            <asp:HiddenField id="H_TermineP" runat="server" value="0"/>
            <asp:HiddenField id="H_TermineN" runat="server" value="1"/>
            <asp:HiddenField id="H_KontaktR" runat="server"/>
            <asp:HiddenField id="H_Kontakt" runat="server"/>
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
            <asp:HiddenField id="H_DokuDownload" runat="server"/>
            <asp:HiddenField id="H_DokuUpload" runat="server"/>
            <asp:HiddenField id="H_RowidMemo" runat="server"/>

            <a data-role="button" id="loginCookies" style='display:none;' runat='server' OnServerClick='validTermid'>LoginCookies</a>
            <a data-role="button" id="histServer" style='display:none;' runat='server' OnServerClick='getHistory'>History</a>
            <a data-role="button" id="zustServer" style='display:none;' runat='server' OnServerClick='getKundDet'>KundDet</a>
            <a data-role="button" id="dokDwnlShow" style='display:none;' runat='server' OnServerClick='getDwnlShow'>getDwnlShow</a>
            <a data-role="button" id="dokUpld" style='display:none;' runat='server' OnServerClick='fileUpld'>fileUpld</a>
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
            <a id="InfoRef" href="#detail" data-role="button" data-theme="d" data-inline="true">OK</a>
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
                <a id="QuestionOK" href="#" data-role="button" data-theme="d" data-inline="true"
                   OnClick="questionL(true)">Ja</a>
            </div>
		    <div style="float:right">
                <a id="QuestionNo" href="#" data-role="button" data-theme="d" data-inline="true"
                   OnClick="questionL(false)">Nein</a>
            </div>
        </div>
    </div>

    <div id="FormUmsatz" data-role="page" data-overlay-theme="d">
        <div data-role="header" data-position="fixed" data-theme="c">
            <h1 class="header">Umsatz</h1>
        </div> 
        <div data-role="content" data-theme="c" style="text-align:center;" >
            <div style="text-align:center">
                <b>faros web:crm</b><br/>
            </div>
            <div data-role="fieldcontain">
            	<label for="UmsatzJahrLabel" id="FormUmsatzMessage"></label>
                <asp:DropDownList runat="server" id="UmsatzJahr" name="UmsatzJahrLabel" data-inline="true" data-mini="true">
                </asp:DropDownList>
            </div>
		    <div style="float:left">
                <a id="FormUmsatzOK" href="#" data-role="button" data-theme="d" data-inline="true"
                   OnClick="formUmsatzL(true)">OK</a>
            </div>
		    <div style="float:right">
                <a id="FormUmsatzNo" href="#" data-role="button" data-theme="d" data-inline="true"
                   OnClick="formUmsatzL(false)">Zurück</a>
            </div>
        </div>
    </div>

    <div id="FormMail" data-role="page" data-overlay-theme="d">
        <div data-role="header" data-position="fixed" data-theme="c">
            <h1 class="header">Mitteilung</h1>
        </div> 
        <div data-role="content" data-theme="c" style="text-align:center;" >
            <div style="text-align:center">
                <b>faros web:crm</b><br/>
            </div>
            <div data-role="fieldcontain">
            	<label for="mailAdr" id="FormMailMessage"></label>
	            <asp:TextBox runat="server" id="mailAdr" name="mailAdr"/>
            </div>
			Text:<br/>
            <asp:TextBox runat="server" id="mailBody" TextMode="Multiline" rows="4" cols="60"/>

		    <div style="float:left">
                <a id="FormMailNo" href="#" data-role="button" data-theme="d" data-inline="true"
                   OnClick="formMailL(false)">Zurück</a>
            </div>
		    <div style="float:right">
                <a id="FormMailOK" href="#" data-role="button" data-theme="d" data-inline="true"
                   OnClick="formMailL(true)">OK</a>
            </div>
            <div style="display:none">
                <asp:Button runat="server" id="Btn_Mail" data-role="button" OnClick="sendMail"/>
            </div>
        </div>
    </div>

    <div id="FormKundenkarte" data-role="page" data-overlay-theme="d">
        <div data-role="header" data-position="fixed" data-theme="c">
            <h1 class="header">Kundenkarte</h1>
        </div> 
        <div data-role="content" data-theme="c" style="text-align:center;" >
            <div style="text-align:center">
                <b>faros web:crm</b><br/>
            </div>
            <div>
                <asp:DropDownList runat="server" id="KundKarteFormular" data-inline="true" onChange="KundKarteChange()"/>
            </div>
            Erscheingungsdatum von-bis <br />
            <div style="float:left;">
    	        <asp:TextBox runat="server" id="datVon" name="datVon"
                             class="rapp-date" onchange="checkDate('FormKundenkarte', this.value)"
                             data-role="datebox" data-theme="c"
                             data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
            </div>
            <div style="float:right;">
    	        <asp:TextBox runat="server" id="datBis" name="datBis"
                             class="rapp-date" onchange="checkDate('FormKundenkarte', this.value)"
                             data-role="datebox" data-theme="c"
                             data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
            </div>
            <br /><br /><br />
            Abschlussdatum von-bis<br />
            <div style="float:left;">
    	        <asp:TextBox runat="server" id="datAbschlVon" name="datAbschlVon"
                             class="rapp-date" onchange="checkDate('FormKundenkarte', this.value)"
                             data-role="datebox" data-theme="c"
                             data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
            </div>
            <div style="float:right;">
    	        <asp:TextBox runat="server" id="datAbschlBis" name="datAbschlBis"
                             class="rapp-date" onchange="checkDate('FormKundenkarte', this.value)"
                             data-role="datebox" data-theme="c"
                             data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
            </div>
            <br /><br /><br />
		    <div style="float:left">
                <a id="FormKundenKarteNo" href="#" data-role="button" data-theme="d" data-inline="true">Zurück</a>
            </div>
		    <div style="float:right">
                <asp:LinkButton runat="server" id="Btn_kundenkarte" Text="OK" data-role="button"
                                OnClick="kundenKarte"/>
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
            <div class='LW_Term'>
                <div id="Termine" runat="server"></div>
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
        <div data-role="header" id="detail_header" data-position="fixed">
            <a href="#review" onclick="toDetail()" data-icon="arrow-l" data-theme="c">Termine</a>
            <h1 class="header">Detail</h1>
        </div> 
        <div data-role="content">
		    <div style="float:right">
                <asp:LinkButton runat="server" id="Btn_fazit" Text="Fazit"
                                data-icon="check" data-role="button" data-theme="a" 
                                OnClientClick="beforeUpdate('T')" OnClick="beforeFazit"/>
                <asp:LinkButton runat="server" id="Btn_edit" Text="Edit"
                                data-icon="gear" data-role="button" data-theme="d" 
                                OnClientClick="beforeUpdate('T')" OnClick="beforeEdit"/>
                <asp:Button runat="server" id="Btn_chart" Text="Umsatz" data-icon="grid" data-role="button"
                            OnClientClick="beforeUmsatz('T')" OnClick="getUmsatz"/>
                <asp:LinkButton runat="server" id="Btn_memosd" Text="Memos"
                                data-icon="info" data-role="button"
                                OnClientClick="beforeUpdate('T')" OnClick="getMemos"/>
                <a href="#" class="email" data-role="button" data-icon="custom" onclick="formMail('E-Mail:','#empty')">Mitteilung</a>
                <a href="#" id="KK" data-role="button" data-icon="info" onclick="formKundenKarte('#detail')">Kundenblatt</a>
                <asp:LinkButton runat="server" id="Btn_Dokuments" Text="Dokumente"
                                data-icon="info" data-role="button"
                                OnClientClick="beforeUpdate('T')" OnClick="getDokumente"/>
            </div>

		    <div>
                <strong>Kunde</strong><br/>
                <span id="kname"></span><br/>
                <span id="strasse"></span>&nbsp;<span id="hnr"></span><br/>
	            <span id="PLZ"></span>&nbsp;<span id="ort"></span><br/>
                <span id="telefonK_det"></span>
                <span id="emailK_det"></span><br/>

                <strong><span id="name"></span></strong>
                <span id="titelA_det"></span>
                <span id="telefonA_det"></span>
                <span id="emailA_det"></span><br/>

                <strong><u>Rapport</u></strong><br/>
                <img src="" id="rappaktivIcon" alt="" />
                <strong><span id="rappaktiv"></span></strong><br/>
                <strong><span id="rappdatum"></span>&nbsp;<span id="rappzeit"></span></strong><br/>
                <span id="rapptext" style="font-style: italic"></span><br/>

                <strong><u>Termin</u></strong><br/>
                <img src="" id="termaktivIcon" alt="" />
                <strong><span id="termaktiv"></span></strong><br/>
                <strong><span id="termday"></span></strong>
                <strong><span id="termdatum"></span></strong>
                <strong><span id="termzeit"></span></strong><br/>

                <span id="objekt"></span>
                <div id="termtext" style="font-style: italic"></div><br/>
            </div>

            <div class="collapsible-hist" data-role="collapsible" data-collapsed="false" data-inline="true" data-theme="c">
                <h3>History</h3>
           		<input type="search" class="search" id="searchHist" value="" data-mini="true" />
                <div class='LW_Hist'>
                    <div id="liHistory" class="scroll"></div>
                </div>
            </div>
            <a data-role="button" id="HistNumRec" class="ui-btn-up" data-icon="arrow-d" data-inline="true" onclick="dispHistoryButton()">Vorherige 5 Rapporte</a>
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
            <a href="#" data-icon="arrow-l" onclick="toDetail()">Zurück</a>
            <h1 class="header">Edit</h1>
        </div> 
        <div data-role="content">
            <strong>Kunde</strong><br/>
            <span id="edit_kname"></span>
            <span id="edit_strasse"></span>&nbsp;<span id="edit_hnr"></span><br/>
            <span id="edit_plz"></span>&nbsp;<span id="edit_ort"></span>

            <h2 style="margin-bottom:0px;">Rapport</h2>
            <div>
                <asp:DropDownList runat="server" id="edit_RKontakt" data-inline="true" onChange="KontaktChange('edit_R')"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="edit_Rtitel"></span>
                <asp:TextBox runat="server" id="edit_RKontaktNew" style="display:none"/>
            </div>

            <div style="overflow:hidden;">
                <div style="float:left;">
                    <asp:DropDownList runat="server" id="edit_RappAktiv" data-inline="true" />
                </div>
                <div style="float:left;">
                    <asp:TextBox runat="server" id="edit_RappDatum" class="rapp-date" onchange="checkDate('edit', this.value)"
                                 data-role="datebox" data-theme="c" onfocus="checkDateBox()"
                                 data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>
                <div style="float:left;">
                    <asp:TextBox type="time" runat="server" id="edit_RappZeit" class="rapp-time" onchange="checkTime('edit', this.value)"
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
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="edit_Atitel"></span>
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
            <div style="display:none">
                <asp:Button runat="server" id="BtnSave_edit" data-role="button" OnClick="saveRapport"/>
            </div>
        </div>
    </div>

    <div data-role="page" id="fazit" data-title="faros web:crm">
        <div data-role="header" data-position="fixed" data-theme="c">
            <a href="#" data-icon="arrow-l" onclick="toDetail()">Zurück</a>
            <h1 class="header">Fazit</h1>
        </div> 
        <div data-role="content">
            <strong>Kunde</strong><br/>
            <span id="fazit_kname"></span><br/>
            <span id="fazit_strasse"></span>&nbsp;<span id="fazit_hnr"></span><br/>
            <span id="fazit_plz"></span>&nbsp;<span id="fazit_ort"></span>

            <br/><br/>
            <h2 style="margin-bottom:0px;">Rapport</h2>
            <div>
                <asp:DropDownList runat="server" id="fazit_RKontakt" data-inline="true" onChange="KontaktChange('fazit_R')"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="fazit_Rtitel"></span>
                <asp:TextBox runat="server" id="fazit_RKontaktNew" style="display:none"/>
            </div>

            <div style="overflow:hidden;">
                <div style="float:left;">
                    <asp:DropDownList runat="server" id="fazit_RappAktiv" data-inline="true" />
                </div>
                <div style="float:left;">
                    <asp:TextBox runat="server" id="fazit_RappDatum" class="rapp-date" onchange="checkDate('fazit', this.value)"
                                 data-role="datebox" data-theme="c" onfocus="checkDateBox()"
                                 data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>
                <div style="float:left;">
                    <asp:TextBox type="time" runat="server" id="fazit_RappZeit" class="rapp-time" onchange="checkTime('fazit', this.value)"
                                 data-role="datebox" data-theme="c"
                                 data-options='{"mode":"timebox", "themeHeader":"c", "themeButton":"c", "useNewStyle":true}'/>
                </div>
            </div>

            <br/>
            
            <strong>Rapport-Text</strong><br/>
            <asp:TextBox runat="server" id="fazit_RappText" TextMode="Multiline" rows="6" cols="60"/>

            <div style="overflow:hidden;">
                <div style="float:left;">
                    <h2 style="margin-bottom:0px;">Neuer Termin</h2>
                </div>
                <div id="div_fazit_neu" style="float:left; margin-top:16px">
                    <select name="slider" id="fazit_neu" data-role="slider" onChange="fazitNeu()" >
		                <option value="yes">Ja</option>
		                <option value="no">Nein</option>
	                </select>
                </div>
            </div>

            <div>
                <asp:DropDownList runat="server" id="fazit_AKontakt" data-inline="true" onChange="KontaktChange('fazit_A')"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="fazit_Atitel"></span>
                <asp:TextBox runat="server" id="fazit_AKontaktNew" style="display:none"/>
            </div>

            <div style="overflow:hidden;">
                <div style="float:left;">
                    <asp:DropDownList runat="server" id="fazit_TermAktiv" data-inline="true" />
                </div>
                <div style="float:left;">
                    <asp:TextBox runat="server" id="fazit_TermDatum" class="rapp-date" onchange="checkDate('fazit', this.value)"
                                 data-role="datebox" data-theme="c"
                                 data-options='{"mode":"calbox", "overrideCalStartDay":1, "themeHeader":"c", "themeDate":"c", "themeDateToday":"a", "useNewStyle":true}'/>
                </div>
                <div style="float:left;">
                    <asp:TextBox type="time" runat="server" id="fazit_TermZeit" class="rapp-time" onchange="checkTime('fazit', this.value)"
                                 data-role="datebox" data-theme="c"
                                 data-options='{"mode":"timebox", "themeHeader":"c", "themeButton":"c", "useNewStyle":true}'/>
                </div>
            </div>

            <br/>
            <strong>Termin-Text</strong>
            <br/>
            <asp:TextBox runat="server" id="fazit_TermText" TextMode="Multiline" rows="6" cols="40"/>
            
            <br/><br/>
            <a data-role="button" href="#" data-theme="a" OnClick="fazitSave()">Speichern</a>
            <div style="display:none">
                <asp:Button runat="server" id="BtnSave_fazit" Text="Speichern" data-role="button"
                            data-theme="a" OnClick="saveRapport"/>
            </div>
        </div>
    </div>

    <!-- Telefon-Dialog -->
    <div data-role="page" id="telefon" data-title="faros web:crm">
        <div data-role="header">
            <h1>Anruf starten</h1>
        </div>
        <div data-role="content">
            <div id="telnum">Es gibt keine Telefonnummer</div>
        </div>
    </div>

    <div data-role="page" id="email" data-title="faros web:crm">
        <div data-role="header">
            <h1>Email schreiben</h1>
        </div>
        <div data-role="content">
            <div id="emails"></div>
        </div>
    </div>

    <!-- SMS-Dialog -->
    <div data-role="page" id="sms" data-title="faros web:crm">
        <div data-role="header">
            <h1>SMS schreiben</h1>
        </div>
        <div data-role="content">	
            <div id="SMSnum"></div>
        </div>
    </div>

    <div data-role="page" id="mapkrPage" data-title="faros web:crm">
        <div data-role="header" data-theme="c">
            <a data-rel="back" data-icon="arrow-l">Detail</a>
            <h1 class="header">Karte</h1>
        </div>
        <div data-role="content" style="text-align:center">	
            <div class="ui-bar-c ui-corner-all ui-shadow" style="padding:3px;">
                <div id="mapkr" style="height:370px;"></div>
            </div>
        </div>
    </div>
    
    <div data-role="page" id="umsatz" data-title="faros web:crm"> 
        <div data-role="header" data-theme="c">
            <a href="#" data-icon="arrow-l" onclick="toDetail()">Zurück</a>
            <h1 class="header">Umsatz</h1>
            <a href="#" class="chart" data-icon="custom" onclick="formUmsatz('Jahr:','#empty')">Jahr</a>
        </div> 
        <div data-role="content">
            <div id="ViewUmsatz"></div>
            <div id="diagram" style="margin: 0 auto;"></div>
        </div>
        <div data-role="footer" data-position="fixed">
            <div data-role="navbar" data-mini="true">
                <ul>
                    <li><a href="" data-theme="c" data-role="button" onclick="Diagram(orientTyp)">Diagram</a></li>
                    <li><a href="" data-theme="c" data-role="button" onclick="Umsatz()">Tabelle</a></li>
                </ul>
            </div>
        </div>
    </div>
    
    <div data-role="page" id="rappdetail" data-title="faros web:crm"> 
        <div data-role="header" id="history_header" data-position="fixed" data-theme="c">
            <a href="#" data-icon="arrow-l" data-theme="c" onclick="toDetail()">Zurück</a>
            <h1 class="header">Detail</h1>
        </div> 
        <div data-role="content">
		    <div style="float:right">
                <asp:LinkButton runat="server" id="Btn_fazitHr" Text="Fazit"
                                data-icon="check" data-role="button" data-theme="a" 
                                OnClientClick="beforeUpdate('H')" OnClick="beforeFazitHR"/>
                <asp:LinkButton runat="server" id="Btn_editHr" Text="Edit"
                                data-icon="gear" data-role="button" data-theme="d"
                                OnClientClick="beforeUpdate('H')" OnClick="beforeEditHR"/>
                <asp:Button runat="server" id="Btn_chartHr" Text="Umsatz" data-role="button" data-icon="grid"
                                OnClientClick="beforeUmsatz('H')" OnClick="getUmsatz"/>
                <asp:LinkButton runat="server" id="Btn_MemosHr" Text="Memos"
                                data-icon="info" data-role="button"
                                OnClientClick="beforeUpdate('H')" OnClick="getMemos"/>
                <a href="#" class="email" data-role="button" data-icon="custom" onclick="formMail('E-Mail:','#empty')">Mitteilung</a>
            </div>
    	    <div>
                <strong>Kunde</strong><br />
                <span id="h_kname"></span><br/>
                <span id="h_strasse"></span>&nbsp;<span id="h_hnr"></span><br/>
	            <span id="h_PLZ"></span>&nbsp;<span id="h_ort"></span><br/>
                <span id="h_telefonK"></span>
                <span id="h_emailK"></span><br/>

                <strong><span id="h_name"></span></strong>
                <span id="h_titelA"></span>
                <span id="h_telefonA"></span>
                <span id="h_emailA"></span><br/>

                <strong><u>Rapport</u></strong><br />
                <img src="" id="h_rappaktivIcon" alt="" />
                <strong><span id="h_rappaktiv"></span></strong><br/>
                <strong><span id="h_rappdatum"></span>&nbsp;<span id="h_rappzeit"></span></strong><br/>
                <span id="h_rapptext" style="font-style: italic"></span><br/>

                <strong><u>Termin</u></strong><br />
                <img src="" id="h_termaktivIcon" alt="" />
                <strong><span id="h_termaktiv"></span></strong><br/>
                <strong><span id="h_termday"></span></strong>
                <strong><span id="h_termdatum"></span></strong>
                <strong><span id="h_termzeit"></span></strong><br/>

                <span id="h_objekt"></span>
                <div id="h_termtext" style="font-style: italic"></div><br/>
            </div>

            <div class="collapsible-hist" data-role="collapsible" data-collapsed="false" data-inline="true" data-theme="c">
                <h3>History</h3>
           		<input type="search" class="search" id="searchHistH" value="" data-mini="true" />
                <div class='LW_HistH'>
                    <div id="liHistoryH" class="scroll"></div>
                </div>
            </div>
            <a data-role="button" id="HistNumRecH" class="ui-btn-up" data-icon="arrow-d" data-inline="true" onclick="dispHistory(2)">Vorherige 5 Rapporte</a>
        </div>
    </div>
    
    <div data-role="page" id="kunden" data-title="faros web:crm">
    
        <div data-role="header" data-position="fixed" data-theme="c">
            <a data-role="button" class="ui-btn-left" href="#" onclick="toReview()" data-icon="arrow-l" data-inline="true">Termine</a>
            <h1>Kunden</h1>
        </div>
    
        <div data-role="content" data-theme="c">
            <div class="filter" style="float:left; width:68%; padding-top:2px">
                <asp:TextBox runat="server" id="searchKund" type="search" class="search left-round"/>
            </div>
            <div class="filterdat" style="float:left;width:15%">
                <asp:Button runat="server" id="BtnKundenSuchen" class="right-round" data-role="button" Text="Suchen"
                            data-theme="c" data-inline="true" OnClientClick="KundenM('1')" onclick="getKundenSuchen"/>
            </div>

            <br /><br /><br /><br />
            <div class='LW_Kund'>
                <div id="liKund" class="scroll"></div>
            </div>
        </div>

        <div data-role="footer" data-position="fixed">
            <div data-role="navbar" data-mini="true">
                <ul>
                    <!--
                    <li><asp:LinkButton runat="server" id="PKunde" Text="Vorherige"
                                data-role="button" data-icon="arrow-u" data-iconpos="top"
                                OnClientClick="KundenPrev()" onclick="getKundenSuchen"/></li>
                    -->
            	    <li><asp:LinkButton runat="server" id="Rkunde" Text="Aktualisieren"
                                data-role="button" data-icon="refresh" data-iconpos="top"
                                OnClientClick="KundenM('0')" OnClick="getKundenSuchen"/></li>
                    <li><asp:LinkButton runat="server" id="NKunde" Text="N&auml;chste"
                                data-role="button" data-icon="arrow-d" data-iconpos="top"
                                OnClientClick="KundenNext()" onclick="getKundenSuchen"/></li>
                </ul>
            </div>
        </div>
    </div>

    <div data-role="page" id="kundendetail" data-title="faros web:crm">
    	<div data-role="header" data-theme="c" data-position="fixed">
    		<a data-role="button" class="ui-btn-left" data-icon="arrow-l" href="#kunden" data-inline="true">Kunden</a>
	    	<h1>Kundendetails</h1>
	    </div>

    	<div data-role="content">
            <div style="overflow:hidden;">
    		    <div style="float:right">
                    <asp:LinkButton runat="server" Text="Neues Fazit"
                                    data-theme="a" data-icon="plus" data-role="button"
                                    OnClientClick="beforeUpdate('K')" OnClick="beforeFazitK"/>
                    <asp:Button runat="server" id="Btn_chartK" Text="Umsatz"
                                    data-icon="grid" data-role="button" 
                                    OnClientClick="beforeUmsatz('K')" OnClick="getUmsatz"/>
                    <asp:LinkButton runat="server" id="Btn_memosk" Text="Memos" data-icon="info" data-role="button"
                                    OnClientClick="beforeUpdate('K')" OnClick="getMemos"/>
                    <a href="#" class="email" data-role="button" data-icon="custom" onclick="formMail('E-Mail:','#empty')">Mitteilung</a>
                    <a href="#" id="KundenKarte" data-role="button" data-icon="info" onclick="formKundenKarte('#kundendetail')">Kundenblatt</a>
                    <asp:LinkButton runat="server" id="Btn_dokumentsK" Text="Dokumente" data-icon="info" data-role="button"
                                    OnClientClick="beforeUpdate('K')" OnClick="getDokumente"/>
	    	    </div>

    		    <div style="float:left">
                    <strong><span id="kunde_name"></span></strong><br />
                    <div id="disp-kunde_zusatz1" style="display:none;">
                        <span id="kunde_zusatz1"></span><br/>
                    </div>
                    <div id="disp-kunde_zusatz2" style="display:none;">
                        <span id="kunde_zusatz2"></span><br/>
                    </div>
                    <span id="kunde_strasse"></span>&nbsp;<span id="kunde_hnr"></span><br/>
                    <span id="kunde_plz"></span>&nbsp;<span id="kunde_ort"></span>
                    <span id="kunde_Telefon"></span>
                    <span id="kunde_Email"></span>

                    <div id="kunde_web_disp" style="display:none">
       	    	        <a href="" target="_blank" id="kunde_web" rel="external" data-icon="home" data-role="button" data-mini="true">web</a>
                    </div>
	    	    </div>
            </div>

    		<div>
    			<h3 id="kunddet-anspers" style="margin-bottom:0px;">Ansprechpersonen:</h3>
           		<input type="search" class="search" id="searchZust" value="" data-mini="true"/>
                <div class='LW_Zust'>
                    <div id="liZust" class="scroll"></div>
                </div>

    			<h3 id="kunddet-rappO" style="margin-bottom:0px;">Offene:</h3>
           		<input type="search" class="search" id="searchKundRappO" value="" data-mini="true" />
                <div class='LW_RappO'>
                    <div id="liKundRappO" class="scroll"></div>
                </div>

    			<h3 id="kunddet-rappE" style="margin-bottom:0px;">Erledigte:</h3>
           		<input type="search" class="search" id="searchKundRappE" value="" data-mini="true" />
                <div class='LW_RappE'>
                    <div id="liKundRappE" class="scroll"></div>
                </div>
                <a data-role="button" id="HistNumRecKund" class="ui-btn-up" data-icon="arrow-d" data-inline="true" onclick="dispKundRapp('E')">Nächste 5 Rapporte</a>
	    	</div>
        </div>
        <div data-role="footer" class="nav-glyphish" data-position="fixed" data-theme="c">
            <div data-role="navbar" class="nav-glyphish" data-mini="true">
                <ul>
                    <li><a class="call" href="#telefon" data-rel="dialog" data-icon="custom">Telefon</a></li>
                    <li><a class="map" href="#mapkPage" data-icon="custom">Karte</a></li>
                    <li><a class="mail" href="#email" data-rel="dialog" data-icon="custom">E-Mail</a></li>
                    <li><a class="message" href="#sms" data-rel="dialog" data-icon="custom">SMS</a></li>
                </ul>
            </div>
        </div> 
    </div>

    <div data-role="page" id="mapkPage" data-title="faros web:crm">
        <div data-role="header" data-theme="c">
            <a data-rel="back" data-icon="arrow-l">Zurück</a>
            <h1 class="header">Karte</h1>
        </div>
        <div data-role="content" style="text-align:center">	
            <div class="ui-bar-c ui-corner-all ui-shadow" style="padding:3px;">
                <div id="mapk" style="height:370px;"></div>
            </div>
        </div>
    </div>

    <div data-role="page" id="zustandig" data-title="faros web:crm">
    	<div data-role="header" data-theme="c" data-position="fixed">
    		<a data-role="button" class="ui-btn-left" data-icon="arrow-l"
                        href="#kundendetail" onclick="toKundeDetail()" data-inline="true">Zurück</a>
	    	<h1>Ansprechperson</h1>
	    </div>

    	<div data-role="content">	
    		<div style="float:left">
                <strong><span id="zust_name"></span></strong><br />
                <span id="zust_strasse"></span>&nbsp;<span id="zust_hnr"></span><br/>
                <span id="zust_plz"></span>&nbsp;<span id="zust_ort"></span><br/><br/>
                <span id="zust_tel"></span><br/><br/>
                <span id="zust_email"></span><br/><br/>
                <div id="zust_web_disp" style="display:none">
       	    	    <a href="" target="_blank" id="zust_web" rel="external" data-icon="home" data-role="button" data-mini="true">web</a>
                </div>
	    	</div>
        </div>
        <div data-role="footer" class="nav-glyphish" data-position="fixed" data-theme="c">
            <div data-role="navbar" class="nav-glyphish" data-mini="true">
                <ul>
                    <li><a class="call" href="#telefon" data-rel="dialog" data-icon="custom" onclick="Telefon_Ansprech()">Telefon</a></li>
                    <li><a class="map" href="#mapzPage" data-icon="custom">Karte</a></li>
                    <li><a class="mail" href="#email" data-rel="dialog" data-icon="custom" onclick="Email_Ansprech()">E-Mail</a></li>
                    <li><a class="message" href="#sms" data-rel="dialog" data-icon="custom" onclick="Telefon_Ansprech()">SMS</a></li>
                </ul>
            </div>
        </div> 
    </div>

    <div data-role="page" id="mapzPage" data-title="faros web:crm">
        <div data-role="header" data-theme="c">
            <a data-rel="back" data-icon="arrow-l">Zurück</a>
            <h1 class="header">Karte</h1>
        </div>
        <div data-role="content" style="text-align:center">	
            <div class="ui-bar-c ui-corner-all ui-shadow" style="padding:3px;">
                <div id="mapz" style="height:370px;"></div>
            </div>
        </div>
    </div>


    <div data-role="page" id="memos" data-title="faros web:crm">
        <div data-role="header" data-theme="c">
            <a onclick="toDetail()" data-icon="arrow-l">Zurück</a>
            <h1 class="header">Memos</h1>
        </div>
        <div data-role="content">	
    		<div style="float:left">
                <strong><span id="memos_name"></span></strong><br />
                <span id="memos_strasse"></span>&nbsp;<span id="memos_hnr"></span><br/>
                <span id="memos_plz"></span>&nbsp;<span id="memos_ort"></span>
	    	</div>
    		<div style="float:right">
                <!--
                <asp:LinkButton runat="server" Text="Neues Memo" data-theme="a" data-icon="plus"
                                data-role="button" style="width:150px;margin:0.5em 4px"
                                OnClientClick="neuesMemo()"/>
                -->
                <a data-role="button" href="#memosd" data-theme="a"
                   style="background:linear-gradient(rgb(250,250,250),rgb(0,0,0))"
                   OnClick="neuesMemo()">Neues Memo</a>
            </div>
    		<br /><br /><br /><br />
            <div class='LW_Memos'>
                <div id="liMemos" class="scroll"></div>
            </div>
        </div>
    </div>

    <div data-role="page" id="memosd" data-title="faros web:crm">
        <div data-role="header" data-theme="c">
            <a data-role="back" runat='server' data-icon="arrow-l" onServerClick="getMemos">Zurück</a>
            <h1 class="header">Memo Details</h1>
        </div>
        <div data-role="content">	
    		<div style="float:left">
                <strong><span id="memosd_name"></span></strong><br />
                <span id="memosd_strasse"></span>&nbsp;<span id="memosd_hnr"></span><br/>
                <span id="memosd_plz"></span>&nbsp;<span id="memosd_ort"></span>
	    	</div>

    		<br /><br /><br /><br />
            <div id="memosd_drp">
                <asp:DropDownList runat="server" id="memo_Kontakt" data-inline="true" onChange="KontaktChange('memo')"/>
            </div>

            <span id="memosd_datum"></span><br />
            <span id="memosd_benutzer"></span><br />
            <asp:TextBox runat="server" id="memosd_TermText" TextMode="Multiline" rows="4" cols="60"/>
    		<br />

    		<div id="memosd_del" style="float:left;display:block">
                <a data-role="button" href="#" data-theme="a" OnClick="delMemo()">Löschen</a>
            </div>
    		<div style="display:none">
                <asp:Button runat="server" id="BtnDel_memosd" data-role="button" OnClick="delMemo"/>
            </div>

    		<div style="float:right">
                <asp:Button runat="server" id="BtnSave_memosd" data-role="button" style="width:120px"
                            Text="Speichern" OnClick="saveMemo"/>
            </div>
        </div>
    </div>

    <div data-role="page" id="dokumente" data-title="faros web:crm">
        <div data-role="header" data-theme="c">
            <a onclick="toDetail()" data-icon="arrow-l">Zurück</a>
            <h1 class="header">Dokumente</h1>
        </div>
        <div data-role="content">	
    		<div style="float:left">
                <strong><span id="dok_name"></span></strong><br />
                <span id="dok_strasse"></span>&nbsp;<span id="dok_hnr"></span><br/>
                <span id="dok_plz"></span>&nbsp;<span id="dok_ort"></span>
	    	</div>
            <br /><br /><br /><br />
            <hr>
            <strong><span>Upload</span></strong><br />
            <!--
            <span style="margin:auto;display:table;"><input type="file" id="FileUpload" size="50" onchange="fileUpld()"/></span>
            -->
            <span><input type="file" id="FileUpload" size="50" onchange="fileUpld()"/></span>
            <br /><br />
            <hr>
            <strong><span>Download</span></strong><br />
    		<asp:label id="dokumente_files" runat="server"></asp:label>
        </div>
    </div>

    </div>
    </form>
</body>
</html>

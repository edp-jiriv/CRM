/* CRM-init.js */

var timeoutOfSession = 10;
var cookies_login = "";
var cookies_termid = "";
var cookies_email = "";
var logout = false;

var startTime = new Date();
var actTime = new Date();
var dat_heute = startTime.getFullYear() + "-" + FormNum(startTime.getMonth() + 1, 2) + "-" +
    FormNum(startTime.getDate(), 2);
var d_heute = FormNum(startTime.getDate(), 2) + "." + FormNum(startTime.getMonth() + 1, 2) + "." +
    startTime.getFullYear();
var morgen = new Date();
morgen.setTime(startTime.getTime() + 24 * 60 * 60 * 1000);
var d_morgen = FormNum(morgen.getDate(), 2) + "." + FormNum(morgen.getMonth() + 1, 2) + "." +
    morgen.getFullYear();
var lastYear = Number(dat_heute.substr(0, 4)) - 1;
var nextYear = Number(dat_heute.substr(0, 4)) + 1;

var Firma;
var Benutzer = "";
var Passwort;
var Mitbeznr = 0;
var termTyp = "0";  // offene Rapporte
var indrapp;        // aktueller Rapport
var indkund;        // aktueller Kunde
var indzust;        // aktueller Zuständige
var indrappTH;      // aktueller historische Rapport aus Detail in Terminen
var indrappO;       // aktueller offene Rapport
var indrappE;       // aktueller erledigte Rapport
var induniv;        // universal Index
var Termid = "";
var cPage = "";
var cReturn = "";
var orientTyp = "portrait";
var qL = false; // wird in der Funktion questionL gesetzt
var qU = false; // wird in der Funktion formL gesetz und in der Funktion beforeUmsatz benutzt

var weekday = new Array(7);
weekday[0] = "Sonntag";
weekday[1] = "Montag";
weekday[2] = "Dienstag";
weekday[3] = "Mittwoch";
weekday[4] = "Donnerstag";
weekday[5] = "Freitag";
weekday[6] = "Samstag";

var monat = new Array(12);
monat[0] = "Januar";
monat[1] = "Februar";
monat[2] = "M&auml;rz";
//monat[2] = "März";
monat[3] = "April";
monat[4] = "Mai";
monat[5] = "Juni";
monat[6] = "Juli";
monat[7] = "August";
monat[8] = "September";
monat[9] = "Oktober";
monat[10] = "November";
monat[11] = "Dezember";

var TelTyp = new Array(4);
TelTyp[0] = "G:";
TelTyp[1] = "D:";
TelTyp[2] = "P:";
TelTyp[3] = "M:";

var plot1;
var value;
var values;
var n_rapp = 0;
var n_rapph;
var n_aktiv;
var n_zust;
var n_kundrappo;
var n_kundrappe;
var n_memos;
var rapporte = new Array();     // für aktuelle mkrappor Einträge
var rapporteH = new Array();    // für historische Einträge
var HistNumRec = 5;
var aktivits = new Array();     // für den Stamm der Aktivitäten
var jahr1 = new Array();
var jahr2 = new Array();
var group = new Array();
var itemsRec = new Array();
var items = new Array();
var kunden = new Array();
var zust = new Array();
var KundRappO = new Array();    // für offene Rapporte des Kundes
var KundRappE = new Array();    // für erledigte Rapporte des Kundes
var HistNumRecKund = 5;
var memos = new Array();
var newMemo = false;
var dokumente = new Array();
var l_date = false;
var l_time = false;

var mtype = "roadmap";          // satellite, hybrid, terrain

var chr3 = String.fromCharCode(3);
var chr4 = String.fromCharCode(4);
var chr5 = String.fromCharCode(5);
var chr6 = String.fromCharCode(6);
var chr7 = String.fromCharCode(7);
var chr10 = String.fromCharCode(10);
var chr12 = String.fromCharCode(12);
var chr13 = String.fromCharCode(13);

// URL string feststellen
var crm_URL = window.location.href;
crm_URL = crm_URL.slice(0, crm_URL.indexOf('.ch')) + ".ch/";

// das Gerät feststellen
var deviceAgent = navigator.userAgent.toLowerCase();
var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
var deviceType = "PC";
if (agentID != null) {
    if (agentID.indexOf("android") >= 0 | agentID.indexOf("iphone") >= 0) deviceType = "Mobile";
    if (agentID.indexOf("ipod") >= 0) deviceType = "iPod";
    if (agentID.indexOf("ipad") >= 0) deviceType = "iPad";
}

// Timeout testen
$(window).on('click', function () {
    // bei der Abmeldung die neue Anmeldung nicht verlangen
    if (logout) {
        logout = false;
        return;
    }
    return; 	// bis jetzt

	/*
    actTime = new Date();
    dif = actTime - startTime;
    difM = (dif / 60000);
    if (difM > timeoutOfSession) {
        $("#TxtLogin").text("Sie müssen sich neu anmelden.");
        $.mobile.changePage($("#login"), {
            transition: 'pop',
            role: 'dialog'
        });
    }
    startTime = new Date();
	*/
});

$(window).on("orientationchange", function (event) {
    if (deviceType == "PC") return;

    orientTyp = event.orientation;

    if (cPage == "#umsatz") {
        //{setTimeout(function () { Diagram(); }, 1000);}
        $('#diagram').empty();
        setTimeout(function () {
            try {
                plot1.replot({ resetAxes: true });
            } catch (err) {
                console.log(err.message);
            }
        }, 200);
    }

    if (cPage == "#review") {
        var c1;
        var c2;
        var c3;
        var c4;
        if (orientTyp == "portrait") {
            //if (n_rapp != 0) {
            c1 = "32%";
            c2 = "37%";
            c3 = "31%";
            c4 = "2%";
            /*} blockiert weil "searchTerm" immer gezeigt ist
            else {
            c1 = "0%";
            c2 = "37%";
            c3 = "62%";
            c4 = "2%";
            }*/
        }
        else {
            //if (n_rapp != 0) {
            c1 = "58%";
            c2 = "22%";
            c3 = "18%";
            c4 = "1.2%";
            /*} blockiert weil "searchTerm" immer gezeigt ist
            else {
            c1 = "0%";
            c2 = "22%";
            c3 = "76%";
            c4 = "1.2%";
            }*/
        }

        $("#review .filter").css({ "float": "left", "width": c1 });
        $("#review .filterdat").css({ "float": "left", "width": c2 });
        $("#review .filtertyp").css({ "float": "left", "width": c3, "padding-top": c4 });
    }

    if (cPage == "#kunden") {
        var c1;
        var c2;
        if (orientTyp == "portrait") {
            c1 = "68%";
            c2 = "15%";
        }
        else {
            c1 = "80%";
            c2 = "15%";
        }
        $("#kunden .filter").css({ "float": "left", "width": c1, "padding-top": "2px" });
        $("#kunden .filterdat").css({ "float": "left", "width": c2 });
    }
});

/* Die Seite "empty" wird geöffnet wenn:
   - CRM gestartet wird (H_ASPX.Value = "")
     Wechsel auf die Seite "Login" -> siehe $(document).ready(function () ...
   - der Button "Zurück" vom Webbrowser gedrückt wird und man wechselt
     bis die Seite "empty" (H_ASPX.Value = "")
   - Script auf Webserver gesendet wird (H_ASPX.Value = "true")
   - wenn es auf die "empty" Seite nach dem Rückkehr aus Webserver gewechselt wird und
     Dialog-Page mit dem Kreuz geschlossen wird (z.B. InfoPage mit der Dateiname) */
$(document).on("pageshow", "#empty", function () {
    /* falls man mit dem Button "Zurück" vom Webbrowser bis die Seite "empty" wechselt,
       dann anstatt die Seite "empty" die ursprüngliche Seite dargestellen */
    if ($("#H_ASPX").val() == "") {
        location.href = cPage;
    }
    $("#H_ASPX").val("");
});

/* Bei der Rückkehr aus dem Server immer auf die erste Seite (#empty) wechseln.
   Das ist nötig beim Start von Script mit URL ohne CRM.ASPX am Ende,
   d.h. mit dem default Dokument */
location.href = "#empty";

$(document).on("pageinit", "#login", function () {
    $('.ui-slider.ui-slider-switch').css({ "width": "220%" });
    $('.ui-slider .ui-slider-label-b').css({ "background": "linear-gradient(rgb(30,30,30),rgb(180,180,180))" });
    $('.ui-slider .ui-btn-inner').css({ "background": "url(icons/lock.png) scroll 50% 55% / 25px 25px" });
    $('.ui-slider .ui-btn-active').css({ "background": "linear-gradient(rgb(180,180,180),rgb(30,30,30))" });
    $("#TermineTyp option[value=0]").attr("selected", "selected");
});
/*
$(document).on("pageinit", "#login", function () {
    if ($("#TxtMessage").text() != "") $('#login').css({ "padding-top": "0px" });
});
*/
$(document).on("pageinit", "#review", function () {
    if (deviceType == "PC") {
        $("#review .filter").css({ "width": "58%" });
        $("#review .filterdat").css({ "width": "22%" });
        $("#review .filtertyp").css({ "width": "18%", "padding-top": "5px" });
    }
    else
        $("#review .filtertyp").css({ "padding-top": "2%" });

    // es muss parent element (<div class="ui-input-search ...>) gesteuert werden
    if ($("#Termine").html() != "") {
        $("#searchTerm").parent().show();
        $("#norapp").hide();
    }
    else {
        //$("#searchTerm").parent().hide();     immer zeigen
        $("#norapp").show();
    }

    $('.PTermine .ui-btn-inner .ui-btn-text').html("Fr&uuml;here");
    $('.PTermine .ui-btn-inner .ui-btn-text').css({ "font-size": "12.5px" });

    $('.Refresh .ui-btn-inner .ui-btn-text').text("Neu laden");
    $('.Refresh .ui-btn-inner .ui-btn-text').css({ "font-size": "12.5px" });

    $('.NTermine .ui-btn-inner .ui-btn-text').html("Sp&auml;tere");
    $('.NTermine .ui-btn-inner .ui-btn-text').css({ "font-size": "12.5px" });

    $("#review .left-round.ui-input-text")
            .parent()
            .removeClass('ui-btn-corner-all')
            .css({ "border-top-left-radius": "0.6em", "border-bottom-left-radius": "0.6em" });

    // Datum
    $("#review .right-round.ui-input-text")
            .removeClass('ui-corner-all')
            .css({ "border-top-right-radius": "0.6em", "border-bottom-right-radius": "0.6em" });
});

// den Inhalt von DropDownList aktualisieren
$(document).on("pageshow", "#edit", function () {
    //$("#edit_TermAktiv").selectmenu("refresh");
    //$("#edit_Kontakt").selectmenu("refresh");
});

// den Inhalt von DropDownList aktualisieren
$(document).on("pageshow", "#fazit", function () {
    //$("#fazit_TermAktiv").selectmenu("refresh");
    //$("#fazit_Kontakt").selectmenu("refresh");
    $("#div_fazit_neu .ui-slider").css({ "margin":"1px 15px"});
    $("#div_fazit_neu .ui-slider .ui-btn-active").removeClass("ui-btn-active");
});


$(document).on("pageinit", "#kunden", function () {
    $("#kunden .left-round.ui-input-text")
                .parent()
                .removeClass('ui-btn-corner-all')
                .css({ "border-top-left-radius": "0.6em", "border-bottom-left-radius": "0.6em" });

    // Button "Suchen"
    $("#kunden .right-round")
                .parent()
                .removeClass('ui-btn-corner-all')
                .css({ "margin": "0.65em 0px", "border-top-right-radius": "0.6em", "border-bottom-right-radius": "0.6em", "margin-left": "0px" })
                .find(".ui-btn-inner")
                .css({ "padding": "0.42em 20px" })
});

$(document).on("pageinit", "#kundendetail", function () {
    // es muss parent element (<div class="ui-input-search ...>) gesteuert werden
    if (n_zust != 0)
        $("#searchZust").parent().show();
    else
        $("#searchZust").parent().hide();

    if (n_kundrappo != 0)
        $("#searchKundRappO").parent().show();
    else
        $("#searchKundRappO").parent().hide();

    if (n_kundrappe != 0)
        $("#searchKundRappE").parent().show();
    else
        $("#searchKundRappE").parent().hide();
});


// Datebox: Format des Datums und der Zeit
jQuery.extend(jQuery.mobile.datebox.prototype.options, {
    'overrideDateFormat': '%d.%m.%Y',
    'overrideHeaderFormat': '%d.%m.%Y',
    'overrideTimeFormat': '%H:%M'
});

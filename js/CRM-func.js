/* CRM-func.js */

function getLoginCookies() {
    if ($("#H_Login").val() != "") return;

    cookies_login = document.cookie.split(';');
    for (var i = 0; i < cookies_login.length; i++) {
        var c = cookies_login[i].split('=');
        c[0] = c[0].trim();
        if (c[0] == "Termid") cookies_termid = c[1];
        if (c[0] == "Email") cookies_email = c[1];
    }
}

// wird in <form> nach onkeydown gestartet
function TestKeyCode(code) {
    var focused = document.activeElement;
    if (focused.id == "edit_TermText" ||
        focused.id == "fazit_RappText" ||
        focused.id == "fazit_TermText" ||
        focused.id == "memosd_TermText" ||
        focused.id == "mailBody") return true;
    // blockiert die Taste Enter
    return (code != 13);
}

function TermTypChange() {
    termTyp = $("#TermineTyp option:selected").val();
    TermRefresh();
}

function message(typ, page, Btn_Label) {
    $("#InfoRef").attr("href", page);
    var rows = $("#H_" + typ).val().split(chr10);
    if (page.substr(0, 1) == "#") {
        $("#InfoRef").removeAttr("target");
        $("#InfoRef").removeAttr("download");
    }
    else {
        $("#InfoRef").attr("target", "_blank");
        $("#InfoRef").attr("download", rows[1]);
    }

    var text = "";
    for (var i1 = 0; i1 < rows.length; i1++) {
        text += rows[i1] + "<br />";
    }
    $("#InfoMessage")[0].innerHTML = text;

    $("#InfoRef").text(Btn_Label);

    //$("#InfoMessage").text($("#H_" + typ).val());
    /* vor der Darstellung von InfoPage die Pause setzen, sonst in Chrome
       wartet nicht auf die Bestätigung mit dem Button */
    setTimeout(function () {
        $.mobile.changePage($("#InfoPage"), {
            transition: 'pop',
            role: 'dialog'
        });
    }, 700);
}

function question(mess, page) {
    $("#QuestionOK").attr("href", page);
    $("#QuestionNo").attr("href", page);
    $("#QuestionMessage").text(mess);
    $.mobile.changePage($("#QuestionPage"), {
        transition: 'pop',
        role: 'dialog'
    });
}

function questionL(val) {
    qL = val;
    if (qL == true) {
        $("#BtnDel_memosd").click();
    }
}

function formUmsatz(mess, page) {
    /* page = "#empty", weil aus der Seite "#empty" wird immer auf die aktuelle Seite
       gewechselt (siehe crm.aspx, crm-init.js) */
    $("#FormUmsatzOK").attr("href", page);
    $("#FormUmsatzNo").attr("href", page);
    $("#FormUmsatzMessage").text(mess);
    $.mobile.changePage($("#FormUmsatz"), {
        transition: 'pop',
        role: 'dialog'
    });
}

function formUmsatzL(val) {
    if (val == true) {
        var btn;
        switch ($("#H_Return").val()) {
            case "TD":
                btn = "#Btn_chart";
                break;
            case "KD":
                btn = "#Btn_chartK";
                break;
            case "TH": case "KH":
                btn = "#Btn_chartHr";
                break;
        }
        qU = true;
        $(btn).click();
    }
}

function formMail(mess, page) {
    /* page = "#empty", weil aus der Seite "#empty" wird immer auf die aktuelle Seite
    gewechselt (siehe crm.aspx, crm-init.js) */
    $("#FormMailOK").attr("href", page);
    $("#FormMailNo").attr("href", page);
    $("#FormMailMessage").text(mess);
    $("#mailAdr").val($("#H_Default").val().split(chr5)[2]);
    var txt;
    txt = "Mitteilung aus faros web:crm // " + $("#Benutzer").val() + chr10 + chr10;
    switch (cPage) {
        case "#detail":
            txt = txt + rapporte[indrapp].Beznr + chr10 +
                  rapporte[indrapp].Name.trim() + chr10 +
                  rapporte[indrapp].Strasse + " " + rapporte[indrapp].Hnr + chr10 +
                  rapporte[indrapp].PLZ + rapporte[indrapp].Ort + chr10 +
                  rapporte[indrapp].Kontakt + chr10;
            break;
        case "#rappdetail":
            txt = txt + rapporteH[0].Beznr + chr10 +
                  rapporteH[0].Name.trim() + chr10 +
                  rapporteH[0].Strasse + " " + rapporteH[0].Hnr + chr10 +
                  rapporteH[0].PLZ + rapporteH[0].Ort + chr10 +
                  rapporteH[0].Kontakt + chr10;
            break;
        case "#kundendetail":
            txt = txt + kunden[indkund].Beznr + chr10 +
                  kunden[indkund].Name.trim() + chr10 +
                  kunden[indkund].Strasse + " " + kunden[indkund].Hnr + chr10 +
                  kunden[indkund].PLZ + kunden[indkund].Ort;
            break;
    }
    $("#mailBody").val(txt);
    $.mobile.changePage($("#FormMail"), {
        transition: 'pop',
        role: 'dialog'
    });
}

function formMailL(val) {
    if (val == true) {
        $("#Btn_Mail").click();
    }
}

function formKundenKarte(page) {
    $("#FormKundenKarteNo").attr("href", page);
    $("#datVon").val("01.01." + lastYear.toString());
    $("#datBis").val("31.12." + dat_heute.substr(0, 4));
    $("#datAbschlVon").val("01.01." + lastYear.toString());
    $("#datAbschlBis").val("31.12." + dat_heute.substr(0, 4));
    $.mobile.changePage($("#FormKundenkarte"), {
        transition: 'pop',
        role: 'dialog'
    });
}


function Anmelden() {
    // vor der neue Anmeldung (nach Timeout) die aktuelle Seite (cPage) speichern
    $("#H_Page").val(cPage);
    // die Meldung in "Login" verbergen
    $("#disp-message").css({ "display": "none" });
}

function Abmelden() {
    logout = true;
}

function FlipChange() {
    if ($("#FlipSign").val() == "On") {
        //$('.ui-slider .ui-btn-inner').css({ "background": "url(icons/unlock.png) scroll 50% 55% / 25px 25px" });
        Anmelden();
        $("#BtnAnmelden").click();
    }
}

function LoadFavicon(url) {
    var linkFavicon = document.createElement('link');
    linkFavicon.setAttribute("rel", "shortcut icon");
    linkFavicon.setAttribute("href", url);
    document.getElementsByTagName("head")[0].appendChild(linkFavicon);
}

// bei "Neu laden" aufgerufen
function TermRefresh() {
    checkDate("review", $('#TermineD').val());
    if (l_date == false) return;

    $("#H_TermineD").val($("#TermineD").val());
    $("#H_TermineP").val((termTyp == "0") ? "0" : "1");
    $("#H_TermineN").val(1);

    $("#ATermineS").click();
}

function TermPrev() {
    checkDate("review", $('#TermineD').val());
    if (l_date == false) return;

    $("#H_TermineD").val($("#TermineD").val());
    var i1 = Number($("#H_TermineP").val());
    $("#H_TermineP").val(i1 + 1);

    $("#PTermineS").click();
}

function TermNext() {
    checkDate("review", $('#TermineD').val());
    if (l_date == false) return;

    $("#H_TermineD").val($("#TermineD").val());
    var i1 = Number($("#H_TermineN").val());
    $("#H_TermineN").val(i1 + 1);

    $("#NTermineS").click();
}


/* die Werte der Felder aus mkrappor (Kontakt entspricht mkrappor.termKontaktPers) */
function getRapport(Rowid, Mitbeznr, Beznr, TermDatum, TermZeit,
                    KontaktBeznr, KontaktR, TermKontaktBeznr, Kontakt, TitelA, EmailA, TelefonA,
                    Name, PLZ, Ort, Strasse, Hnr, EmailK, TelefonK,
                    Objekt, TAktivID, TAktiv, TAktiv_bes, TermText,
                    RappDatum, RappZeit, RAktivID, RAktiv, RAktiv_bes, RappText,
                    Folgerapnr, Benutzer) {
    var item = "";
    var datum = "";

    item = Rowid.split(chr5);
    this.Rowid = item[1];

    item = Mitbeznr.split(chr5);
    item = item[1].split(chr4);
    this.Mitbeznr = item[0];
    this.TermMitName = item[1];

    item = Beznr.split(chr5);
    this.Beznr = item[1];

    item = TermDatum.split(chr5)
    this.TermDatum = item[1];
    datum = item[1];
    datum = datum.substr(6, 4) + "-" + datum.substr(3, 2) + "-" + datum.substr(0, 2);
    this.dat_TermDatum = datum;

    item = TermZeit.split(chr5);
    this.TermZeit = item[1];

    // Beznr der Kontaktperson (mkrappor.KontaktBeznr)
    item = KontaktBeznr.split(chr5);
    this.KontaktBeznr = item[1];

    // Name der Kontaktperson (mkrappor.kontaktpers oder Name von mkrappor.KontaktBeznr)
    item = KontaktR.split(chr5);
    this.KontaktR = item[1];

    // Beznr der TermKontaktperson (mkrappor.termKontaktBeznr)
    item = TermKontaktBeznr.split(chr5);
    this.TermKontaktBeznr = item[1];

    // Name der Kontaktperson beim Kunde
    item = Kontakt.split(chr5);
    this.Kontakt = item[1];

    // Titel der Kontaktperson
    item = TitelA.split(chr5);
    this.TitelA = item[1];

    // Titel der Kontaktperson
    item = EmailA.split(chr5);
    this.EmailA = item[1];

    // Titel der Kontaktperson
    item = TelefonA.split(chr5);
    this.TelefonA = item[1];

    // Name des Kundes
    item = Name.split(chr5);
    this.Name = item[1];

    item = PLZ.split(chr5);
    this.PLZ = item[1];

    item = Ort.split(chr5);
    this.Ort = item[1];

    item = Strasse.split(chr5);
    this.Strasse = item[1];

    item = Hnr.split(chr5);
    this.Hnr = item[1];

    item = EmailK.split(chr5);
    this.EmailK = item[1];

    item = TelefonK.split(chr5);
    this.TelefonK = item[1];

    item = Objekt.split(chr5);
    this.Objekt = item[1];

    item = TAktivID.split(chr5);
    this.TAktivID = item[1];

    item = TAktiv.split(chr5);
    this.TAktiv = item[1];

    item = TAktiv_bes.split(chr5);
    this.TAktiv_bes = item[1];

    item = TermText.split(chr5);
    this.TermText = item[1];

    item = RappDatum.split(chr5);
    this.RappDatum = item[1];
    datum = item[1];
    datum = datum.substr(6, 4) + "-" + datum.substr(3, 2) + "-" + datum.substr(0, 2);
    this.dat_RappDatum = datum;

    item = RappZeit.split(chr5);
    this.RappZeit = item[1];

    item = RAktivID.split(chr5);
    this.RAktivID = item[1];

    item = RAktiv.split(chr5);
    this.RAktiv = item[1];

    item = RAktiv_bes.split(chr5);
    this.RAktiv_bes = item[1];

    item = RappText.split(chr5);
    this.RappText = item[1];

    item = Folgerapnr.split(chr5);
    this.Folgerapnr = item[1];

    item = Benutzer.split(chr5);
    this.Benutzer = item[1];
}

function getRapports(values) {
    itemsRec = values.split(chr7);
    n_rapp = itemsRec.length - 1;   // Anzahl Rapporte
    for (var i1 = 1; i1 <= n_rapp; i1++) {
        items = itemsRec[i1].split(chr6);
        // i2 = 0 (ROWID(mkrappor)), i2 = 1 (Mitbeznr), ...
        rapporte[i1 - 1] = new getRapport(items[0], items[1], items[2], items[3], items[4], items[5], items[6],
                                          items[7], items[8], items[9], items[10], items[11], items[12], items[13],
                                          items[14], items[15], items[16], items[17], items[18], items[19],
                                          items[20], items[21], items[22], items[23], items[24], items[25],
                                          items[26], items[27], items[28], items[29], items[30], items[31]);
    }

    TermReview(n_rapp);
}

function TermReview(n_rapp) {
    /* die Elemente <li> mit class = "el-li" kennzeichnen
      (wird in der Fuktion filter() und Ereignis für den Button Clear benutzt) */
    var datum = "";
    var c1, c2, nicon;
    var c_termine = "";
    var rt_datum;
    var rt_zeit;
    var rt_dat;

    for (var i1 = 0; i1 < n_rapp; i1++) {
        // termTyp = 0 ... offene, 1 ... erledigte
        if (termTyp == "0") {
            rt_datum = rapporte[i1].TermDatum;
            rt_zeit = rapporte[i1].TermZeit;
            rt_dat = rapporte[i1].dat_TermDatum;
        } else {
            rt_datum = rapporte[i1].RappDatum;
            rt_zeit = rapporte[i1].RappZeit;
            rt_dat = rapporte[i1].dat_RappDatum;
        }

        if (datum != rt_datum) {
            datum = rt_datum;

            // Kopf fuer die einzelne Tage
            if (rt_dat >= dat_heute)
                barc = 'b';  // die Farbe im Kopf
            else
                barc = 'e';
            c1 = weekday[new Date(rt_dat).getDay()];
            c2 = "";
            if (termTyp != "0") c2 = "rapp-closed";     // graue Farbe - siehe crm.css

            c_termine += "<li name='lid" + i1 + "' class='el-li " + c2 + " ui-li ui-li-divider ui-bar-" + barc + " ui-li-has-count ui-corner-top' " +
                         "data-role='list-divider' role='heading'>" + c1 +
                         "<span class='ui-li-count ui-btn-up-c ui-btn-corner-all'>";
            c_termine += ((rt_datum != "01.01.0001") ? rt_datum : "ohne Termin") + "</span></li>";
        }

        nicon = getIcon(rapporte[i1].TAktiv);
        c_termine += "<li name='li" + i1 + "' class='el-li'>" +
                     "<a id='" + i1 + "' href='' onclick='markTerm(id)'>";
        if (nicon != "")
            c_termine += "<img class='ui-li-icon' style='width:20px; top: 2.3em;' src=" + nicon + " />";
        else
            c_termine += "<img class='ui-li-icon' style='width:20px; top: 2.3em; max-height:0px' />";

        c_termine += "<h3>" + rapporte[i1].Kontakt + "</h3>" +
                     "<p><strong>" + rapporte[i1].Name + "</strong></p>" +
                     "<p><b>Rapport&nbsp;</b>" + rapporte[i1].RappDatum + ":&nbsp;" + rapporte[i1].RappText + "</p>" +
                     "<p><b>Termin&nbsp;</b>" + rapporte[i1].TermDatum + ":&nbsp;" + rapporte[i1].TermText + "</p>" +
                     "<p class='ui-li-aside ui-li-desc task-time' style='width:26%'><strong>";

        if (rt_zeit != ":" && rt_zeit != "") {
            c_termine += rt_zeit.substr(0, 2) + ":" + rt_zeit.substr(2, 2);
        }

        c_termine += "<br /><br /><br />" + rapporte[i1].Ort + "</strong></p>" +
                     "<span class='ui-icon ui-icon-arrow-r ui-icon-shadow'></span>" +
                     "</a></li>";
    }

    document.getElementById("Termine").innerHTML = "<ul data-role='listview' data-inset='true'>" + c_termine + "</ul>";
}

function getIcon(aktiv) {
    var nicon = "";
    switch (aktiv) {
        case "ANWERB":
            nicon = 'icons/137-presentation.png';
            break;
        case "B":
            nicon = 'icons/112-group.png';
            break;
        case "M":
            nicon = 'icons/18-envelope.png';
            break;
        case "T":
            nicon = 'icons/75-phone.png';
            break;
        default:
            nicon = "";
            break;
    }
    return nicon;
}

// wird aus <a ...> Element in ListView (#review) aufgerufen
function markTerm(id) {
    indrapp = id;

    // aktueller Index in H_Indrapp speichern
    $("#H_Indrapp").val(indrapp);
    // Rowid des Eintrages mkrappor in H_Rowid speichern (wird beim Aufruf getHistory() benutzt)
    $("#H_Rowid").val(rapporte[id].Rowid);

    // die Seite Termine (T) wird verlassen
    $("#H_Return").val("T");

    /* Button #histServer ruft getHistory() in Code-Behind, setzt H_Page.Value = "#detail"
       und wechselt auf die Detail-Seite */
    var bt = $("#histServer");
    bt[0].click();
}

function setDetail() {
    // aktualisiert indrapp nach der Rückkehr aus Edit, Fazit oder Umsatz
    indrapp = undefined;
    // aktualisiert rowid nach Fazit
    var rowid = $("#H_Rowid").val();
    values = $("#H_Rapport").val();
    if (values != "") { getRapports(values); }
    for (var i1 = 0; i1 < n_rapp; i1++) {
        if (rowid == rapporte[i1].Rowid) {
            indrapp = i1;
            break;
        }
    }
    if (indrapp != undefined) {
        termDetail(indrapp);
        // historische Rapporten darstellen
        values = $("#H_History").val();
        rapporteH = getHistory(values);
        document.getElementById("liHistory").innerHTML = dispHistory(1);
    }
    else
        alert("Rapport nicht gefunden.");
}

// wird aus setDetail() aufgerufen, wo id nach Rowid festegestellt wird
function termDetail(id) {
    indrapp = id;
    var tc = "b";
    var text = "";
    var rows = new Array();

    if (termTyp == "0") {
        // offene
        if (rapporte[id].dat_TermDatum < dat_heute) tc = "e";
        $("#Btn_fazit").css({ "display": "block" });
    } else {
        // erledigte
        var tc = "c";
        $("#Btn_fazit").css({ "display": "none" });
    }
    $("#detail_header").attr("data-theme", tc);

    // Kunde
    // H_Kundbeznr wird für Edit, Fazit, Umsatz, Memo und Kundenkarte benutzt
    $("#H_Kundbeznr").val(rapporte[id].Beznr);

    $("#kname").text(rapporte[id].Name);
    $("#PLZ").text(rapporte[id].PLZ);
    $("#ort").text(rapporte[id].Ort);
    $("#strasse").text(rapporte[id].Strasse);
    $("#hnr").text(rapporte[id].Hnr);
    TelMail(rapporte[id].TelefonK, "#telefonK_det", rapporte[id].EmailK, "#emailK_det", "0");

    // Ansprechperson
    $("#name").text(rapporte[id].Kontakt);
    if (rapporte[id].TitelA != "") {
        $("#titelA_det").css({ "display": "block" });
        $("#titelA_det").text(rapporte[id].TitelA);
    }
    else $("#titelA_det").css({ "display": "none" });

    TelMail(rapporte[id].TelefonA, "#telefonA_det", rapporte[id].EmailA, "#emailA_det", "0");

    $("#rappdatum").text(rapporte[id].RappDatum);
    $("#rappzeit").text(rapporte[id].RappZeit.substr(0, 2) + ":" + rapporte[id].RappZeit.substr(2, 2));
    $("#rappaktivIcon").attr("src", getIcon(rapporte[id].RAktiv));
    $("#rappaktiv").text(rapporte[id].RAktiv_bes);
    //$("#rapptext").text(rapporte[id].RappText);
    rows = rapporte[id].RappText.split(chr10);
    text = "";
    for (var i1 = 0; i1 < rows.length; i1++) {
        text += rows[i1] + "<br />";
    }
    $("#rapptext")[0].innerHTML = text;

    $("#termaktivIcon").attr("src", getIcon(rapporte[id].TAktiv));
    $("#termaktiv").text(rapporte[id].TAktiv_bes);
    if (rapporte[id].TermDatum != "01.01.0001") {
        var termDate = new Date(rapporte[id].dat_TermDatum);
        $("#termday").html(weekday[termDate.getDay()] + ",&nbsp;");
        $("#termzeit").text(rapporte[id].TermZeit.substr(0, 2) + ":" + rapporte[id].TermZeit.substr(2, 2));
    }
    $("#termdatum").text((rapporte[id].TermDatum != "01.01.0001") ? rapporte[id].TermDatum : "ohne Termin");

    if (rapporte[id].Objekt != "") {
        $("#objekt").css({ "display": "block" });
        document.getElementById("objekt").innerHTML = "<br/><strong>Objekt</strong><br/>" + rapporte[id].Objekt + "<br/><br/>";
    }
    else $("#objekt").css({ "display": "none" });

    // einzelne Zeile von TermText (können mit Enter geteilt werden) darstellen
    rows = rapporte[id].TermText.split(chr10);
    text = "";
    for (var i1 = 0; i1 < rows.length; i1++) {
        text += rows[i1] + "<br />";
    }
    $("#termtext")[0].innerHTML = text;

    items = rapporte[id].TelefonK.split(chr4);
    Telefon(items);

    items = rapporte[id].EmailK.split(chr4);
    Email(items);
}


// wird aus setDetail() aufgerufen
function getHistory(values) {
    HistNumRec = 5;
    var rappItems = new Array();
    itemsRec = values.split(chr7);
    n_rapph = itemsRec.length - 1;   // Anzahl historische Rapporte
    for (var i1 = 1; i1 <= n_rapph; i1++) {
        items = itemsRec[i1].split(chr6);
        rappItems[i1 - 1] = new getRapport(items[0], items[1], items[2], items[3], items[4], items[5], items[6],
                                          items[7], items[8], items[9], items[10], items[11], items[12], items[13],
                                          items[14], items[15], items[16], items[17], items[18], items[19],
                                          items[20], items[21], items[22], items[23], items[24], items[25],
                                          items[26], items[27], items[28], items[29], items[30], items[31]);
    }
    return rappItems;
}

/* wird auf der Seite "Edit", "Fazit", "Umsatz" und "Memos" gestartet,
   wenn man Button "Zurück" drückt - für den Rückkehr auf die Seite Detail (TD),
   resp. Kundendetail (KD), resp. Rapport-History (TH, KH) */
function toDetail() {
    switch ($("#H_Return").val()) {
        // Rückkehr aus Detail und Kunden 
        case "T":
            $("#H_Return").val("");
            break;
        // Rückkehr aus Edit, Fazit, Umsatz, Memos und History aufgerufene auf der Seite "Detail" 
        case "TD":
            $("#H_Return").val("T");
            // aktualisiert indrapp und ruft detailRapp() und getHistory() 
            setDetail();
            cPage = "#detail";
            break;
        // Rückkehr aus Fazit, Umsatz, Memos und History aufgerufene auf der Seite "Kundendetails"
        case "KD":
            $("#H_Return").val("K");
            // aktualisiert die Kunden Detail-Seite
            setKundDet();   // 
            cPage = "#kundendetail";
            break;
        // Rückkehr aus Edit, Fazit, Umsatz unter History
        case "TH":case "KH":
            // aufgerufene auf der Seite "Detail" 
            if ($("#H_Return").val() == "TH") $("#H_Return").val("TD");
            // aufgerufene auf der Seite "Kundendetails" 
            if ($("#H_Return").val() == "KH") $("#H_Return").val("KD");

            RappDetail();
            cPage = "#rappdetail";
            break;
    }
    location.href = cPage;
    $("#H_Page").val(cPage);
}


/* zeigt die historische Rapporte; wird aus setDetail() und RappDetail() aufgerufen
   (offene, erledigte)
   typ = 1 ... historische Rapporten auf der Detail-Seite des Rapports
         2 ... historische Rapporten auf der Detail-Seite für offene Rapporte
               aus der Seite Kundendetails */
function dispHistory(typ) {
    var c0;
    var c1;
    var c2;
    var c3 = "";
    var c4 = "";
    var c5 = $("#H_Return").val();
    // ersten Eintrag ausschliessen (i1 = 0 entspricht dem aktuellen Rapport)
    for (var i1 = 1; i1 < n_rapph; i1++) {
        c0 = rapporteH[i1].RappDatum;
        c1 = rapporteH[i1].RappZeit.substr(0, 2) + ":" + rapporteH[i1].RappZeit.substr(2, 2);
        c2 = "";

        // die Icon
        nicon = getIcon(rapporteH[i1].TAktiv);

        // nur falls der gewählte (aktuelle) Eintrag offen ist, den Pfeil zeigen
        if (c5 == "T" && (rapporteH[0].Folgerapnr == "0" && rapporteH[0].TermDatum != "01.01.0001")) c4 = " ui-btn-icon-right ui-li-has-arrow ";

        c3 += "<li name='li" + i1 + "' class='el-li " + c2 + " ui-btn ui-btn-up-c ui-btn-corner-all ui-li ui-li-has-icon" + c4 + "'>" +
              "<div class='ui-btn-inner'>" +
              "<div class='ui-btn-text'>" +
              "<a id='" + i1 + "' class='ui-link-inherit' href='#'";

        // nur falls der gewählte (aktuelle) Eintrag offen ist, onclick erlauben
        if (c5 == "T" && (rapporteH[0].Folgerapnr == "0" && rapporteH[0].TermDatum != "01.01.0001"))
            c3 += " onclick='markRappDetail(id)'>";
        else
            c3 += " >";

        if (rapporteH[i1].Mitbeznr != rapporteH[0].Mitbeznr)
            c3 += "<p class='ui-li-aside ui-li-desc'><strong class='ui-btn-up-b'>" + rapporteH[i1].TermMitName + "</strong></p>";
        if (nicon != "")
            c3 += "<img class='ui-li-icon ui-li-thumb' style='width: 20px; top: 2.3em;' src=" + nicon + " />";
        else
            c3 += "<img class='ui-li-icon ui-li-thumb' style='width: 20px; top: 2.3em; max-height:0px' />";

        c3 += "<span class='el-search-value ui-li-heading'>" + c0;
        if (c1 != ":") { c3 += ",&nbsp;" + c1; }
        c3 += ",&nbsp;" + rapporteH[i1].Benutzer;

        c3 += "</span>" + "<p class='el-search-value ui-li-desc'><b>Rapporttext: </b>" + rapporteH[i1].RappText + "</p>";
        c3 += "<p class='el-search-value ui-li-desc'><b>Termintext: </b>" + rapporteH[i1].TermText + "</p></a></div>" +
                  "<span class='ui-icon ui-icon-arrow-r ui-icon-shadow'></span>" +
                  "</div></li>";

        if (i1 > HistNumRec - 1) break;
    }

    if (HistNumRec > n_rapph) {
        if (typ == 1)
            $("#HistNumRec").hide();
        else
            $("#HistNumRecH").hide();
        /*
        $("#HistNumRec .ui-btn-text").text("Alle Rapporten dargestellt");
        $("#HistNumRec .ui-icon").removeClass("ui-icon-arrow-d");
        $("#HistNumRec .ui-icon").addClass("ui-icon-info");
        */
    }

    /* es muss parent element (<div class="collapsible-hist" ...>) gesteuert werden
      (siehe CRM.aspx) */
    if (n_rapph > 1) {
        if (typ == 1)
            $("#detail .collapsible-hist").show();
        else {
            /* nur bei offenem Rapport (aus der Seite Kundendetails)
               die historische Rapporte zeigen */
            if (rapporteH[0].Folgerapnr == "0")
                $("#rappdetail .collapsible-hist").show();
            else
                $("#rappdetail .collapsible-hist").hide();
        }
        // mit der Methode hide() wurde das Attribut "display:none" gesetzt.
        // Anstatt die Methode show() das Attribut "display" entfernen,
        // weil die Methode show() das Atribut "display:inline" setzt, was
        // die schlechte Darstellung des Buttons macht.
        if (n_rapph - 1 > HistNumRec) {
            if (typ == 1) {
                $("#HistNumRec").css({ "display": "" });

                $("#HistNumRec .ui-btn-text").text("Vorherige 5 Rapporten");
                $("#HistNumRec .ui-icon").removeClass("ui-icon-info");
                $("#HistNumRec .ui-icon").addClass("ui-icon-arrow-d");
            } else {
                $("#HistNumRecH").css({ "display": "" });

                $("#HistNumRecH .ui-btn-text").text("Vorherige 5 Rapporten");
                $("#HistNumRecH .ui-icon").removeClass("ui-icon-info");
                $("#HistNumRecH .ui-icon").addClass("ui-icon-arrow-d");
            }
        } else {
            if (typ == 1)
                $("#HistNumRec").hide();
            else
                $("#HistNumRecH").hide();
        }
    } else {
        if (typ == 1) {
            $("#detail .collapsible-hist").hide();
            $("#HistNumRec").hide();
        } else {
            $("#rappdetail .collapsible-hist").hide();
            $("#HistNumRecH").hide();
        }
    }

    HistNumRec += 5;

    return c3;
}

function dispHistoryButton() {
    document.getElementById("liHistory").innerHTML = dispHistory(1);
}

// wenn man den historischen Rapport wählt
function markRappDetail(id) {
    
    var item;

    switch ($("#H_Return").val()) {
        case "T":
            $("#H_Return").val("TD");
            break;
        case "KD":
            $("#H_Return").val("KH");
            break;
    }

    // Rowid des Eintrages mkrappor in H_RowidH speichern (wird beim Aufruf getHistory() benutzt)
    $("#H_RowidH").val(rapporteH[id].Rowid);

    /* Button #histServer ruft getHistory() in Code-Behind, setzt H_Page.Value = "#detail"
    und wechselt auf die Detail-Seite */
    var bt = $("#histServer");
    bt[0].click();
}

/* wird aufgerufen aus
   - $(document).ready()
        - wenn markRappDetail() nach der Auswahl des historischen Rapportes auf der Seite Detail
        - wenn markKundRapp() nach der Auswahl des Rapportes auf der Seite Kundendetails
        aufgerufen wird
   - toDetail(), bei der Rückkehr aus der Seite Edit, Umsatz, Memos des historischen Rapportes */
function RappDetail() {
    values = $("#H_HistoryDet").val();
    rapporteH = getHistory(values);
    var item = rapporteH[0];

    var tc = "b";
    if (item.Folgerapnr == "0" && item.TermDatum != "01.01.0001") {
        // offene
        if (item.dat_TermDatum < dat_heute) tc = "e";
        $("#Btn_fazitHr").css({ "display": "block" });
    } else {
        // erledigte
        var tc = "c";
        $("#Btn_fazitHr").css({ "display": "none" });
    }
    $("#history_header").attr("data-theme", tc);

    // Kunde
    $("#h_kname").text(item.Name);
    document.getElementById("h_PLZ").innerHTML = item.PLZ;
    document.getElementById("h_ort").innerHTML = item.Ort;
    document.getElementById("h_strasse").innerHTML = item.Strasse;
    document.getElementById("h_hnr").innerHTML = item.Hnr;

    document.getElementById("h_name").innerHTML = item.Kontakt;
    TelMail(item.TelefonK, "#h_telefonK", item.EmailK, "#h_emailK", "0");

    // Ansprechperson
    $("#name").text(item.Kontakt);
    if (item.TitelA != "") {
        $("#h_titelA").css({ "display": "block" });
        $("#h_titelA").text(item.TitelA);
    }
    else $("#h_titelA").css({ "display": "none" });

    TelMail(item.TelefonA, "#h_telefonA", item.EmailA, "#h_emailA", "0");

    if (item.Objekt != "") {
        $("#h_objekt").css({ "display": "block" });
        document.getElementById("h_objekt").innerHTML = "<br/><strong>Objekt</strong><br />" + item.Objekt + "<br/><br/>";
    } else $("#h_objekt").css({ "display": "none" });

    document.getElementById("h_rappdatum").innerHTML = item.RappDatum;
    document.getElementById("h_rappzeit").innerHTML = item.RappZeit.substr(0, 2) + ":" + item.RappZeit.substr(2, 2);
    $("#h_rappaktivIcon").attr("src", getIcon(item.RAktiv));
    document.getElementById("h_rappaktiv").innerHTML = item.RAktiv_bes;

    rows = item.RappText.split(chr10);
    text = "";
    for (var i1 = 0; i1 < rows.length; i1++) {
        text += rows[i1] + "<br />";
    }
    $("#h_rapptext")[0].innerHTML = text;
    
    // Detail des historischen Rapporte
    $("#h_termaktivIcon").attr("src", getIcon(item.TAktiv));
    document.getElementById("h_termaktiv").innerHTML = item.TAktiv_bes;
    if (item.TermDatum != "01.01.0001") {
        var termDate = new Date(item.dat_TermDatum);
        document.getElementById("h_termday").innerHTML = weekday[termDate.getDay()] + ",&nbsp;";
        document.getElementById("h_termzeit").innerHTML = item.TermZeit.substr(0, 2) + ":" + item.TermZeit.substr(2, 2);
    }
    document.getElementById("h_termdatum").innerHTML = (item.TermDatum != "01.01.0001") ? item.TermDatum : "ohne Termin";

    var rows = item.TermText.split(chr10);
    var text = "";
    for (var i1 = 0; i1 < rows.length; i1++) {
        text += rows[i1] + "<br />";
    }
    $("#h_termtext")[0].innerHTML = text;

    // für den offenen Rapport auf der Seite Kundendetails
    if (item.Folgerapnr == "0" && item.TermDatum != "01.01.0001") {
        $("#rappdetail .collapsible-hist").show();
        $("#HistNumRecH").show();
        document.getElementById("liHistoryH").innerHTML = dispHistory(2);
    }
    else {
        $("#rappdetail .collapsible-hist").hide();
        $("#HistNumRecH").hide();
    }
}

function beforeUmsatz(typ) {
    switch (typ) {
        case "T":
            $("#H_Return").val("TD");
            $("#H_Kundbeznr").val(rapporte[indrapp].Beznr);
            break;
        case "K":
            $("#H_Return").val("KD");
            // $("#H_Kundbeznr").val(kunden[indkund].Beznr);    wird in KundeDetail gesetzt
            break;
        case "H":
            if ($("#H_Return").val() == "TD") {
                $("#H_Return").val("TH");
                $("#H_Kundbeznr").val(rapporteH[0].Beznr);
            }
            if ($("#H_Return").val() == "KD") $("#H_Return").val("KH");
            break;
    }
    if (qU == false)
        $("#UmsatzJahr [value=" + "1" + "]").attr("selected", "selected");
    else
        qU = false;
}

// aus $(document).ready() aufgerufen
function setUmsatz() {
    switch ($("#H_Return").val()) {
        case "TD":
            indrapp = $("#H_Indrapp").val();
            break;
        case "KD":
            indkund = $("#H_Indkund").val();
            break;
        case "TH": case "KH":
            // index muss nicht gesetzt werden, weil der aktuelle immer = 0 ist
            break;
    }

    values = document.getElementById("H_Umsatz").value;
    itemsRec = values.split(chr7);
    items = itemsRec[1].split(chr6);
    for (var i1 = 0; i1 < 13; i1++) {
        var item = items[i1].split(chr5);
        // item ... itonlsta.fakbetr + itonlsta.unfakbetr; item[0] ... Monat
        jahr1[i1] = Number(item[1]);    // gewähltes Jahr - nach UmsatzJahr
        jahr2[i1] = Number(item[2]);    // Vorjahr
    }

    // vor der Darstellung des Diagrames die Pause setzen, sonst wird nicht dargestellt
    setTimeout(function () { Diagram(); }, 1000);
}

// zeigt den Umsatz in der Tabelle
function Umsatz() {
    document.getElementById("diagram").style.display = "none";
    document.getElementById("ViewUmsatz").style.display = "block";
    var name;
    var ort;
    switch ($("#H_Return").val()) {
        case "TD":
            name = rapporte[indrapp].Name;
            ort = rapporte[indrapp].Ort;
            break;
        case "KD":
            name = kunden[indkund].Name;
            ort = kunden[indkund].Ort;
            break;
        case "TH": case "KH":
            name = rapporteH[0].Name;
            ort = rapporteH[0].Ort;
            break;
    }

    var c_umsatz = "<div>" + name + ",&nbsp;" + ort + "</br></br></div>" +
                   "<table data-role='table' class='ui-responsive table-stroke'>" +
                   "<thead><tr><th text-align='left'>Monat</th>" +
                   "<th>" + $("#UmsatzJahr option:selected").text() + "</th>" +
                   "<th>Vorjahr</th><th>Differenz</th></tr></thead>";

    c_umsatz += "<tbody>";
    for (var i1 = 0; i1 < 13; i1++) {
        c_umsatz = c_umsatz + "<tr>";
        // die Zeile mit den Totalen
        if (i1 == 12) {
            c_umsatz += "<td>" + "Total" + "</td><td class='umsatz'>" +
                        FormInt(jahr1[i1], 5) + "</td><td class='umsatz'>" +
                        FormInt(jahr2[i1], 5) + "</td><td class='umsatz'>" +
                        FormInt(jahr1[i1] - jahr2[i1], 6) + "</td>";
            c_umsatz += "</tr>";
            break;
        }
        else {
            c_umsatz += "<td>" + monat[i1] + "</td><td class='umsatz'>" +
                        FormInt(jahr1[i1], 5) + "</td><td class='umsatz'>" +
                        FormInt(jahr2[i1], 5) + "</td><td class='umsatz'>" +
                        FormInt(jahr1[i1] - jahr2[i1], 6) + "</td>";
        }
        c_umsatz += "</tr>";
    }

    c_umsatz += "</tbody></table>";

    document.getElementById("ViewUmsatz").innerHTML = c_umsatz;

}

// zeigt den Umsatz im Diagram
function Diagram() {
    document.getElementById("ViewUmsatz").style.display = "none";
    document.getElementById("diagram").innerHTML = "";
    document.getElementById("diagram").style.display = "block";

    var title;
    switch ($("#H_Return").val()) {
        case "TD":
            title = rapporte[indrapp].Name + ",&nbsp;" + rapporte[indrapp].Ort;
            break;
        case "KD":
            title = kunden[indkund].Name + ",&nbsp;" + kunden[indkund].Ort;
            break;
        case "TH": case "KH":
            title = rapporteH[0].Name + ",&nbsp;" + rapporteH[0].Ort;
            break;
    }

    plot1 = $.jqplot('diagram', [jahr1, jahr2], {
        title: {
            text: title,   // title for the plot,
            show: true
        },

        series: [
                    { label: $("#UmsatzJahr option:selected").text() },
                    { label: 'Vorjahr' },
                    ],

        seriesDefaults: {
            renderer: $.jqplot.BarRenderer,
            rendererOptions: { fillToZero: true }
        },

        seriesColors: ["#EAA228", "#579575"],

        legend: {
            show: true,
            placement: 'outsideGrid',
            location: 's'
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ["Jan", "Feb", "M&auml;r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: { angle: -60 }
            },
            yaxis: {

            }

        },
        highlighter: {
            show: true,
            sizeAdjust: 7.5,
            tooltipAxes: 'y'
        },
        cursor: {
            show: false
        }

    });
    // Abfangen von Ausrichtungswechseln der Handsets/Tablets und Replot des Charts
    /*
    $(window).on('orientationchange', function () {
    $('#diagram').empty();
    setTimeout(function () {
    plot1.replot({ resetAxes: true });
    }, 200);
    });
    */
}

// Darstellung der Karte
$('#mapkPage').live("pageshow", function () {
    Address(kunden[indkund].Strasse + ',' + kunden[indkund].Ort + ',' + 'CH', "mapk");
});

$('#mapzPage').live("pageshow", function () {
    Address(zust[indzust].Strasse + ',' + zust[indzust].Ort + ',' + 'CH', "mapz");
});

$('#mapkrPage').live("pageshow", function () {
    Address(rapporte[indrapp].Strasse + ',' + rapporte[indrapp].Ort + ',' + 'CH', "mapkr");
});


function Address(adr, elm) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': adr }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            /*  alert(status);*/
            var latlng = new google.maps.LatLng(results[0].geometry.location);
            var myOptions = {
                zoom: 16,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById(elm), myOptions);
            map.setCenter(results[0].geometry.location);

            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

        }

        else {
            alert("Geocode nicht erfolgreich: " + status);
        }

    });
}

/* wird aus crm.aspx vor dem Wechsel auf die Seite "Edit", "Fazit", "Memo" auf der Seite:
   - "Detail"
   - "History"
   - "Kundendetails"
     gestartet
   typ = T, K oder H */

function beforeUpdate(typ) {
    switch (typ) {
        // Seite #detail
        case "T":
            $("#H_Return").val("TD");
            /* falls die Kontaktperson nicht in Zuständigen ist,
               muss in DropDownList addiert werden (H_Kontakt wird in CodeBehind benutzt) */
            $("#H_KontaktR").val(rapporte[indrapp].KontaktR);
            $("#H_Kontakt").val(rapporte[indrapp].Kontakt);
            // H_Kundbeznr wird für Edit, Fazit, Umsatz und Memo benutzt
            $("#H_Kundbeznr").val(rapporte[indrapp].Beznr);
            break;

        // Fazit und Memo auf der Seite Kundendetail 
        case "K":
            $("#H_Return").val("KD");
            /* H_Kundbeznr (für Fazit und Memo) wurde schon in der Funktion KundeDetail gesetzt.
               Für Fazit wird H_Rowid = "RN" in beforeFazitK gesetzt */
            break;

        // Seite #rappdetail
        case "H":
            // der Wechsel auf die Seiten Fazit und Edit des historischen Rapports
            if ($("#H_Return").val() == "TD") {
                $("#H_Return").val("TH");
                /* falls die Kontaktperson nicht in Zuständigen ist,
                   muss in DropDownList addiert werden
                   (H_Kontakt wird in CodeBehind benutzt) */
                $("#H_KontaktR").val(rapporteH[0].KontaktR);
                $("#H_Kontakt").val(rapporteH[0].Kontakt);
                // H_Kundbeznr wird für Edit, Fazit, Umsatz und Memo benutzt
                $("#H_Kundbeznr").val(rapporteH[0].Beznr);
                /* Rowid des Eintrages mkrappor wurde schon in markRappDetail
                   in H_RowidH gespeichert */
            }

            if ($("#H_Return").val() == "KD") {
                $("#H_Return").val("KH");
                IndrappO = $("#H_IndrappO").val();
                IndrappE = $("#H_IndrappE").val();
                /* falls die Kontaktperson nicht in Zuständigen ist,
                   muss in DropDownList addiert werden
                   (H_Kontakt wird in CodeBehind benutzt) */
                if (IndrappE == "") {
                    $("#H_Kontakt").val(KundRappO[IndrappO].Kontakt);
                } else {
                    $("#H_Kontakt").val(KundRappE[IndrappE].Kontakt);
                }
                /* Rowid des Eintrages mkrappor wurde schon in markKundRapp
                in H_RowidH gespeichert */
            }
            break;
    }
}

// wird entweder für Rapport oder zukünftiger Rapport gestartet
function edit(rapp, ind) {
    document.getElementById("edit_kname").innerHTML = rapp[ind].Name;
    document.getElementById("edit_strasse").innerHTML = rapp[ind].Strasse;
    document.getElementById("edit_hnr").innerHTML = rapp[ind].Hnr;
    document.getElementById("edit_plz").innerHTML = rapp[ind].PLZ;
    document.getElementById("edit_ort").innerHTML = rapp[ind].Ort;

    $("#edit_RKontakt [value=" + rapp[ind].KontaktBeznr + "]").attr("selected", "selected");
    KontaktChange("edit_R");

    $("#edit_RappAktiv [value=" + rapp[ind].RAktivID + "]").attr("selected", "selected");
    if (rapp[ind].RappDatum != "01.01.0001")
        document.getElementById("edit_RappDatum").value = rapp[ind].RappDatum;
    else
        document.getElementById("edit_RappDatum").value = "";
    document.getElementById("edit_RappZeit").value = rapp[ind].RappZeit.substr(0, 2) + ":" + rapp[ind].RappZeit.substr(2, 2);
    document.getElementById("edit_RappText").value = rapp[ind].RappText;

    // entfernt alle Leerschläge
    //$("#edit_Kontakt [value=" + rapp[ind].Kontakt.replace(/ /g,"") + "]").attr("selected", "selected");
    $("#edit_AKontakt [value=" + rapp[ind].TermKontaktBeznr + "]").attr("selected", "selected");
    KontaktChange("edit_A");

    $("#edit_TermAktiv [value=" + rapp[ind].TAktivID + "]").attr("selected", "selected");
    if (rapp[ind].TermDatum != "01.01.0001")
        document.getElementById("edit_TermDatum").value = rapp[ind].TermDatum;
    else
        document.getElementById("edit_TermDatum").value = "";
    document.getElementById("edit_TermZeit").value = rapp[ind].TermZeit.substr(0, 2) + ":" + rapp[ind].TermZeit.substr(2, 2);
    document.getElementById("edit_TermText").value = rapp[ind].TermText;
}

function checkKontaktPerson(typ) {
    /*
    if (($("#" + typ + "Kontakt option:selected").text() == "Neue Kontaktperson") &&
    ($("#" + typ + "KontaktNew").val() == "")) {
        $("#InfoRef").attr("href", "#" + typ.substr(0, typ.indexOf("_") - 1));
        $("#InfoMessage").text("Name der Person fehlt");
        $.mobile.changePage($("#InfoPage"), {
            transition: 'pop',
            role: 'dialog'
        });
        return "error";
    }
    */
    return "";
}

function editSave() {
    var ret = checkKontaktPerson("edit_R");
    if (ret == "error") return;
    var ret = checkKontaktPerson("edit_A");
    if (ret == "error") return;

    checkDate("edit", $('#edit_RappDatum').val());
    if (l_date == false) return;
    checkTime("edit", $('#edit_RappZeit').val());
    if (l_time == false) return;

    checkDate("edit", $('#edit_TermDatum').val());
    if (l_date == false) return;
    checkTime("edit", $('#edit_TermZeit').val());
    if (l_time == false) return;

    document.getElementById("H_Fazit").value = "false";
    $("#BtnSave_edit").click();
}

// wird entweder für Rapport, zukünftiger oder neuen Rapport gestartet
function fazit(rapp, ind) {
    document.getElementById("fazit_kname").innerHTML = rapp[ind].Name;
    document.getElementById("fazit_strasse").innerHTML = rapp[ind].Strasse;
    document.getElementById("fazit_hnr").innerHTML = rapp[ind].Hnr;
    document.getElementById("fazit_plz").innerHTML = rapp[ind].PLZ;
    document.getElementById("fazit_ort").innerHTML = rapp[ind].Ort;

    if ($("#H_Return").val() != "KD") {
        // Fazit aus der Seite Detail
        $("#fazit_RKontakt [value=" + rapp[ind].TermKontaktBeznr + "]").attr("selected", "selected");

        // die Angaben für den Termin werden in die Angaben für den Rapport geschoben
        if (rapp[ind].TermDatum != "01.01.0001")
            document.getElementById("fazit_RappDatum").value = rapp[ind].TermDatum;
        else
            document.getElementById("fazit_RappDatum").value = "";

        document.getElementById("fazit_RappZeit").value = rapp[ind].TermZeit.substr(0, 2) + ":" + rapp[ind].TermZeit.substr(2, 2);
        document.getElementById("fazit_RappText").value = rapp[ind].TermText;
        $("#fazit_RappAktiv [value=" + rapp[ind].TAktivID + "]").attr("selected", "selected");

        $("#fazit_neu").attr("checked", "checked");
        $("#fazit_AKontakt [value=" + rapp[ind].TermKontaktBeznr + "]").attr("selected", "selected");
    } else {
        // Fazit aus der Seite Kundendetail (Neues Fazit)
        document.getElementById("fazit_RappDatum").value = d_heute;
        document.getElementById("fazit_RappZeit").value = FormNum(startTime.getHours(), 2) + ":" + FormNum(startTime.getMinutes(), 2);
        $("#fazit_RappText").val($("#H_Default").val().split(chr5)[0]);
    }

    KontaktChange("fazit_R");
    KontaktChange("fazit_A");
    $("#fazit_TermDatum").val(d_morgen);
    $("#fazit_TermZeit").val("00:00");
    $("#fazit_TermText").val($("#H_Default").val().split(chr5)[1]);
}

function fazitNeu() {
    if ($("#fazit_neu").val() == "yes") {
        $("#fazit_TermDatum").val(d_morgen);
        $("#fazit_TermDatum").css({ "display": "block" });
        $("#fazit_TermZeit").css({ "display": "block" });
    } else {
        $("#fazit_TermDatum").val("01.01.0001");
        $("#fazit_TermDatum").css({ "display": "none" });
        $("#fazit_TermZeit").css({ "display": "none" });
    }
}

function fazitSave() {
    var ret = checkKontaktPerson("fazit_R");
    if (ret == "error") return;
    var ret = checkKontaktPerson("fazit_A");
    if (ret == "error") return;
    /*
    checkDate("fazit", $('#fazit_TermDatum').val());
    if (l_date == false) return;
    checkTime("fazit", $('#fazit_TermZeit').val());
    if (l_time == false) return;
    */
    checkDate("fazit", $('#fazit_RappDatum').val());
    if (l_date == false) return;
    checkTime("fazit", $('#fazit_RappZeit').val());
    if (l_time == false) return;

    document.getElementById("H_Fazit").value = "true";
    $("#BtnSave_fazit").click();
}


function getKunde(Beznr, Rowid, Titel, Name, Zusatz1, Zusatz2, PLZ, Ort, Strasse, Hnr,
                  EmailK, TelefonK, Web) {
    var item;
    item = Beznr.split(chr5);
    this.Beznr = item[1];

    item = Rowid.split(chr5);
    this.Rowid = item[1];

    item = Titel.split(chr5);
    this.Titel = item[1];

    item = Name.split(chr5);
    this.Name = item[1];

    item = Zusatz1.split(chr5);
    this.Zusatz1 = item[1];

    item = Zusatz2.split(chr5);
    this.Zusatz2 = item[1];

    item = PLZ.split(chr5);
    this.PLZ = item[1];

    item = Ort.split(chr5);
    this.Ort = item[1];

    item = Strasse.split(chr5);
    this.Strasse = item[1];

    item = Hnr.split(chr5);
    this.Hnr = item[1];

    item = EmailK.split(chr5);
    this.EmailK = item[1];

    item = TelefonK.split(chr5);
    this.TelefonK = item[1];

    item = Web.split(chr5);
    this.Web = item[1];
}

function Kunden() {
    values = document.getElementById("H_Kunden").value;
    itemsRec = values.split(chr7);
    n_kunden = itemsRec.length - 1;    // Anzahl Kunden
    for (var i1 = 1; i1 <= n_kunden; i1++) {
        items = itemsRec[i1].split(chr6);
        kunden[i1 - 1] = new getKunde(items[0], items[1], items[2], items[3], items[4], items[5], items[6],
                                      items[7], items[8], items[9], items[10], items[11], items[12]);
    }
    KundenReview(n_kunden);
}

function KundenReview(n_kunden) {
    var c_kunden = "";
    var c3 = "";
    for (var i1 = 0; i1 < n_kunden; i1++) {

        c_kunden += "<li id='lik" + i1 + "' class='el-li ui-btn ui-btn-up-c ui-btn-icon-right ui-corner-top ui-li-has-arrow ui-li ui-li-has-icon'>" +
                "<div class='ui-btn-inner'>" +
    	        "<div class='ui-btn-text'>" +
                "<a id='lika" + i1 + "' class='ui-link-inherit' href='' onclick='KundeDetail(id)' runat='server' OnServerClick='getZust'>" +
        		"<p class='ui-li-aside ui-li-desc'><strong class='ui-btn-up-b ui-btn-corner-all'>" + kunden[i1].Beznr + "</strong></p>" +
                "<h3 class='el-search-value ui-li-heading'>" + kunden[i1].Name + "</h3>" +
                "<p class='el-search-value ui-li-desc'>" + kunden[i1].Zusatz1 + "</p>" +
                "<p class='el-search-value ui-li-desc'>" + kunden[i1].Zusatz2 + "</p>" +
                "<p class='el-search-value ui-li-desc'>" + kunden[i1].Strasse + "&nbsp;" + kunden[i1].Hnr + "</p>" +
                "<p class='ui-li-desc'><strong class='el-search-value'>" + kunden[i1].PLZ + "&nbsp;" + kunden[i1].Ort + "</strong></p>" +
                "</a></div><span class='ui-icon ui-icon-arrow-r ui-icon-shadow'></span>" +
                "</div></li>";
    }
    document.getElementById("liKund").innerHTML = c_kunden;
}

function KundenPrev() {
    $("#H_Message").val("");
    var i1 = Number($("#H_KundenNav").val());
    if (i1 > 9)
        $("#H_KundenNav").val(i1 - 10);
    else {
        if (i1 > 0)
            $("#H_KundenNav").val(0);
        else {
            $("#H_Message").val("crm04:Anfang der Liste");
        }
    }
}

// sucht die Kunden
function KundenM(mode) {
    // mode = 1 (nach dem Filter gesuchte Kunden), 0 (dargestellte Kunden aktualisieren)
    if (mode == "1") $("#H_KundenNav").val(0);
}

function KundenNext() {
    $("#H_KundenNav").val(Number($("#H_KundenNav").val()) + 10);
}

// wird auf der Seite "Kunden" gestartet, wenn man Button "Termine" drückt
function toReview() {
    $("#H_Return").val("");
    values = $("#H_Rapport").val();
    if (values != "") {
        getRapports(values);
    }
    cPage = "#review"
    location.href = cPage;
}

function KundeDetail(id) {
    $("#H_Return").val("K");

    // id = "lika" + i1
    indkund = Number(id.substr(4));
    $("#H_Indkund").val(indkund);

    /* Kundbeznr des gewählten Kunde in H_Kundbeznr speichern - muss in Code-Behind
       übergeben werden (für Umsatz, Zuständige, Kunden Rapporte und Memo) */
    $("#H_Kundbeznr").val(kunden[indkund].Beznr);

    /* Hidden-Fields für die Evidenz von gewählten zukünftigen oder historischen
       Kunden-Rapporten initialisieren */
    $("#H_IndrappO").val("");
    $("#H_IndrappE").val("");

    /* Button #zustServer ruft getKundDet() in Code-Behind, setzt H_Page.Value = "#kundendetail"
       und wechselt auf die Kunden Detail-Seite */
    var bt = document.getElementById("zustServer");
    bt.click();
}

// aktualisiert die Kunden Detail-Seite
function setKundDet() {
    Kunden();   // setzt Array kunden[] und erstellt die Kunden-Liste
    setZust();

    n_kundrappo = 0;
    n_kundrappe = 0;
    setKundRapp("O");
    dispKundRapp("O");
    setKundRapp("E");
    dispKundRapp("E");
}

function getZust() {
    var values = document.getElementById("H_Zust").value;
    var itemsRec = values.split(chr7);
    n_zust = itemsRec.length - 1;   // Anzahl Zuständige
    for (var i1 = 1; i1 <= n_zust; i1++) {
        items = itemsRec[i1].split(chr6);
        zust[i1 - 1] = new getKunde(items[0], items[1], items[2], items[3], items[4], items[5], items[6],
                                    items[7], items[8], items[9], items[10], items[11], items[12]);
    }
}

function setZust() {
    indkund = Number($("#H_Indkund").val());
    document.getElementById("kunde_name").innerHTML = kunden[indkund].Name;
    if (kunden[indkund].Zusatz1 != "") {
        $("#kunde_zusatz1").text(kunden[indkund].Zusatz1);
        $("#disp-kunde_zusatz1").css({ "display": "block" });
    } else $("#disp-kunde_zusatz1").css({ "display": "none" });
    if (kunden[indkund].Zusatz2 != "") {
        $("#kunde_zusatz2").text(kunden[indkund].Zusatz2);
        $("#disp-kunde_zusatz2").css({ "display": "block" });
    } else $("#disp-kunde_zusatz2").css({ "display": "none" });

    document.getElementById("kunde_plz").innerHTML = kunden[indkund].PLZ;
    document.getElementById("kunde_ort").innerHTML = kunden[indkund].Ort;
    document.getElementById("kunde_strasse").innerHTML = kunden[indkund].Strasse;
    document.getElementById("kunde_hnr").innerHTML = kunden[indkund].Hnr;

    TelMail(kunden[indkund].TelefonK, "#kunde_Telefon", kunden[indkund].EmailK, "#kunde_Email", "1");

    var items = kunden[indkund].TelefonK.split(chr4);
    Telefon(items);
    items = kunden[indkund].EmailK.split(chr4);
    Email(items);

    var web = kunden[indkund].Web;
    if (web != "") {
        if (web.substr(0, 4) != "http") web = "http://" + web;
        $("#kunde_web").attr("href", web);
        var i1 = web.indexOf("//");
        if (i1 != 0) web = web.substr(i1 + 2);
        $("#kunde_web").text(web);
        $("#kunde_web_disp").css({ "display": "block" });
    }
    else
        $("#kunde_web_disp").css({ "display": "none" });

    getZust();
    var c_zust = "";
    var test;
    for (i1 = 0; i1 < n_zust; i1++) {
        text = "";
        rows = zust[i1].TelefonK.split(chr4);
        for (var i2 = 0; i2 < 4; i2++) {
            if (rows[i2] != "" && i2 != 2) {
                if (i2 > 0) text += " ";
                text += TelTyp[i2] + rows[i2];
            }
        }
        c_zust += "<li name='li" + i1 + "' class='el-li ui-btn ui-btn-up-c ui-btn-corner-all ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-icon'>" +
                  "<div style='font-size:1px' class='ui-btn-inner'>" +
                  "<div class='ui-btn-text'>" +
                  "<a id='liza" + i1 + "' class='ui-link-inherit' href='#zustandig' onclick='zustandige(id)'>" +
                  "<h3 class='el-search-value ui-li-heading'>" + zust[i1].Name + "</h3>" +
                  "<span class='ui-li-desc'><strong class='el-search-value'>" + zust[i1].Titel + "</strong></span>" +
                  "<span class='ui-li-desc'>" + text + "</span>" +
                  "<span class='ui-li-desc'>" + zust[i1].EmailK.split(chr4)[0] + "</span>" +
                  "</a></div>" +
                  "<span class='ui-icon ui-icon-arrow-r'></span></div></li>";
    }
    document.getElementById("liZust").innerHTML = c_zust;
    if (n_zust != 0)
        $("#kunddet-anspers").show();
    else
        $("#kunddet-anspers").hide();
}

function setKundRapp(term) {
    var i1 = 0;
    var i2 = 1;
    var item;
    var n;
    HistNumRecKund = 5;

    var values = $("#H_KundRapp" + term).val();
    itemsRec = values.split(chr7);
    if (term == "O") n_kundrappo = itemsRec.length - 1;
    if (term == "E") n_kundrappe = itemsRec.length - 1;
    for (var i1 = 1; i1 < itemsRec.length; i1++) {
        items = itemsRec[i1].split(chr6);
        item = new getRapport(items[0], items[1], items[2], items[3], items[4], items[5], items[6],
                              items[7], items[8], items[9], items[10], items[11], items[12], items[13],
                              items[14], items[15], items[16], items[17], items[18], items[19],
                              items[20], items[21], items[22], items[23], items[24], items[25],
                              items[26], items[27], items[28], items[29], items[30], items[31]);
        if (term == "O") KundRappO[i1 - 1] = item;
        if (term == "E") KundRappE[i1 - 1] = item;
    }
}

// zeigt die offene und erledigte Rapporte
function dispKundRapp(term) {
    var c0;
    var c1;
    var c2;
    var c3 = "";
    var n;

    if (term == "O")
        n = n_kundrappo;
    else {
        n = n_kundrappe;
        /*
        if (n != 0) {
        $("#HistNumRecKund").show();

        if (n_kundrappe > HistNumRecKund) {
        $("#HistNumRecKund.ui-btn-text").text("Vorherige 5 Rapporten");
        $("#HistNumRecKund .ui-icon").removeClass("ui-icon-info");
        $("#HistNumRecKund .ui-icon").addClass("ui-icon-arrow-d");
        }
        else
        $("#HistNumRecKund").hide();
        }
        else {
        $("#HistNumRecKund").hide();
        }
        */
    }

    if (n != 0)
        $("#kunddet-rapp" + term).show();
    else
        $("#kunddet-rapp" + term).hide();

    for (var i1 = 0; i1 < n; i1++) {
        if (term == "O") {
            c0 = KundRappO[i1].TermDatum;
            c1 = KundRappO[i1].TermZeit.substr(0, 2) + ":" + KundRappO[i1].TermZeit.substr(2, 2);
            c2 = KundRappO[i1].Benutzer;
            nicon = getIcon(KundRappO[i1].TAktiv);
        }
        if (term == "E") {
            c0 = KundRappE[i1].RappDatum;
            c1 = KundRappE[i1].RappZeit.substr(0, 2) + ":" + KundRappE[i1].RappZeit.substr(2, 2);
            c2 = KundRappE[i1].Benutzer;
            nicon = getIcon(KundRappE[i1].TAktiv);
        }

        c3 += "<li name='li" + i1 + "' class='el-li ui-btn ui-btn-up-c ui-btn-icon-right ui-btn-corner-all ui-li-has-arrow ui-li ui-li-has-icon'>" +
              "<div class='ui-btn-inner'>" +
		      "<div class='ui-btn-text'>" +
              "<a id='likr" + term + i1 + "' class='ui-link-inherit' href='#' onclick='markKundRapp(id)'>" +
              "<p class='ui-li-aside ui-li-desc'>";

        if (term == "O") {
            if (KundRappO[i1].Mitbeznr != Mitbeznr)
                c3 += "<strong class='ui-btn-up-b'>" + KundRappO[i1].TermMitName + "</strong>";
        }
        else {
            if (KundRappE[i1].Mitbeznr != Mitbeznr)
                c3 += "<strong class='ui-btn-up-b'>" + KundRappE[i1].TermMitName + "</strong>";
        }

        if (nicon != "")
            c3 += "</p><img class='ui-li-icon ui-li-thumb' style='width: 20px; top: 2.3em;' src=" + nicon + " />";
        else
            c3 += "</p><img class='ui-li-icon ui-li-thumb' style='width: 20px; top: 2.3em; max-height:0px' />";

        c3 += "<span class='el-search-value ui-li-heading'>" + c0;

        if (term == "O") {
            if (KundRappO[i1].TermZeit != "0000") { c3 += ",&nbsp;" + c1; }
            c3 += ",&nbsp;" + c2 + "</span>";

            c3 += "<span class='el-search-value ui-li-desc'><b>Rapport</b>&nbsp;" + KundRappO[i1].RappDatum + ":&nbsp;" + KundRappO[i1].RappText + "</span>";
            c3 += "<p class='el-search-value ui-li-desc'><b>Termin</b>&nbsp;" + KundRappO[i1].TermDatum + ":&nbsp;" + KundRappO[i1].TermText + "</p>";
            c3 += "<strong class='el-search-value'>" + KundRappO[i1].Ort + "</strong></a></div>";
        }
        if (term == "E") {
            if (KundRappE[i1].TermZeit != "0000") { c3 += ",&nbsp;" + c1; }
            c3 += ",&nbsp;" + c2 + "</span>";

            c3 += "<span class='el-search-value ui-li-desc'><b>Rapport</b>&nbsp;" + KundRappE[i1].RappDatum + ":&nbsp;" + KundRappE[i1].RappText + "</span>";
            c3 += "<p class='el-search-value ui-li-desc'><b>Termin</b>&nbsp;" + KundRappE[i1].TermDatum + ":&nbsp;" + KundRappE[i1].TermText + "</p>";
            c3 += "<strong class='el-search-value'>" + KundRappE[i1].Ort + "</strong></a></div>";
        }

        c3 += "<span class='ui-icon ui-icon-arrow-r ui-icon-shadow'></span></div></li>";

        if ((term == "E") && (i1 > HistNumRecKund - 2)) break;
    }

    document.getElementById("liKundRapp" + term).innerHTML = c3;

    if (term == "E") {
        if (HistNumRecKund >= n) {
            $("#HistNumRecKund").hide();
            /*
            $("#HistNumRecKund .ui-btn-text").text("Alle Rapporten dargestellt");
            $("#HistNumRecKund .ui-icon").removeClass("ui-icon-arrow-d");
            $("#HistNumRecKund .ui-icon").addClass("ui-icon-info");
            */
        } else
            $("#HistNumRecKund").show();

        HistNumRecKund += 5;
    }
}

// die Seite Ansprechperson
function zustandige(id) {
    // id = "liza" + i1
    var i1 = Number(id.substr(4));
    $("#H_Indzust").val(i1);
    indzust = i1;
    document.getElementById("zust_name").innerHTML = zust[i1].Name;
    document.getElementById("zust_plz").innerHTML = zust[i1].PLZ;
    document.getElementById("zust_ort").innerHTML = zust[i1].Ort;
    document.getElementById("zust_strasse").innerHTML = zust[i1].Strasse;
    document.getElementById("zust_hnr").innerHTML = zust[i1].Hnr;

    document.getElementById("zust_tel").innerHTML = Telefon_Ansprech();
    document.getElementById("zust_email").innerHTML = Email_Ansprech();

    var web = zust[i1].Web;
    if (web != "") {
        if (web.substr(0, 4) != "http") web = "http://" + web;
        $("#zust_web").attr("href", web);
        var i1 = web.indexOf("//");
        if (i1 != 0) web = web.substr(i1 + 2);
        $("#zust_web").text(web);
        $("#zust_web_disp").css({ "display": "block" });
    }
    else
        $("#zust_web_disp").css({ "display": "none" });
}

function Telefon_Ansprech() {
    var id = indzust;
    var items = zust[id].TelefonK.split(chr4);
    var c1 = Telefon(items);
    return c1;
}

function Email_Ansprech() {
    var id = indzust;
    var items = zust[id].EmailK.split(chr4);
    var c1 = Email(items);
    return c1;
}


// wird beim Wechsel aus der Seite Ansprechperson auf die Seite Kundendetail aufgerufen
function toKundeDetail() {
    $("#H_Return").val("K");
}

/* wird nach der Markierung des offenes / erledigtes Rapport
   auf der Seite Kundendetails (aus dispKundRapp) aufgerufen */
function markKundRapp(id) {
    // Detail des zukünftigen / historischen Rapporte gewählt
    // id = "likr" + term + i1
    var c1 = id.substr(4, 1);

    $("#H_Return").val("KD");

    // index des gewählten Rapporte
    $("#H_IndrappO").val("");
    $("#H_IndrappE").val("");
    var item;
    switch (c1) {
        case ("O"):
            IndrappO = Number(id.substr(5));
            $("#H_IndrappO").val(IndrappO);
            item = KundRappO[IndrappO];
            break;

        case ("E"):
            IndrappE = Number(id.substr(5));
            $("#H_IndrappE").val(IndrappE);
            item = KundRappE[IndrappE];
            break;
    }
    $("#H_RowidH").val(item.Rowid);
    /* Button #histServer ruft getHistory() in Code-Behind, setzt
       H_Page.Value = "#rappdetail" und wechselt auf die Detail-Seite für History */
    var bt = $("#histServer");
    bt[0].click();
}


function setMemos(Rowid, Name, Datum, Benutzer, Memo) {
    var item;

    item = Rowid.split(chr5);
    this.Rowid = item[1];

    item = Name.split(chr5);
    this.Name = item[1];
    this.Beznr = item[2];
    this.Typ = item[3];

    item = Datum.split(chr5);
    this.Datum = item[1];

    item = Benutzer.split(chr5);
    this.Benutzer = item[1];

    item = Memo.split(chr5);
    this.Memo = item[1];
}

function Memos() {
    switch ($("#H_Return").val()) {
        case "TD":
            group = rapporte;
            induniv = $("#H_Indrapp").val();
            break;
        case ("KD"):
            group = kunden;
            induniv = $("#H_Indkund").val(); ;
            break;
        case "TH":
            group = rapporteH;
            induniv = 0;
            break;
        case "KH":
            // offene oder erledigte Rapporte
            IndrappO = $("#H_IndrappO").val();
            IndrappE = $("#H_IndrappE").val();
            if (IndrappE == "") {
                setKundRapp("O");
                group = KundRappO;
                induniv = IndrappO;
            } else {
                setKundRapp("E");
                group = KundRappE;
                induniv = IndrappE;
            }
            break;
    }

    document.getElementById("memos_name").innerHTML = group[induniv].Name;
    document.getElementById("memos_plz").innerHTML = group[induniv].PLZ;
    document.getElementById("memos_ort").innerHTML = group[induniv].Ort;
    document.getElementById("memos_strasse").innerHTML = group[induniv].Strasse;
    document.getElementById("memos_hnr").innerHTML = group[induniv].Hnr;

    values = $("#H_Memos").val();
    itemsRec = values.split(chr7);
    n_memos = itemsRec.length - 1;   // Anzahl Memos
    for (i1 = 1; i1 <= n_memos; i1++) {
        items = itemsRec[i1].split(chr6);
        memos[i1 - 1] = new setMemos(items[0], items[1], items[2], items[3], items[4]);
    }

    var c_memos = "";
    for (i1 = 0; i1 < n_memos; i1++) {
        var mem = memos[i1].Memo.split(chr10);
        var text = "";
        for (var i2 = 0; i2 < mem.length; i2++) {
            if (text != "") text += "<br />";
            text += mem[i2];
            if (i2 == 3) break;
        }

        c_memos += "<li name='li" + i1 + "' class='el-li ui-btn ui-btn-up-c ui-btn-corner-all ui-btn-icon-right ui-li-has-arrow ui-li'>" +
                   "<div style='font-size:1px' class='ui-btn-inner'>" +
                   "<div class='ui-btn-text'>" +
                   "<a id='lime" + i1 + "' class='ui-link-inherit' href='#memosd' onclick='memosDet(id,text)'>";
        if (memos[i1].Typ == "Z")	// Zuständige
            c_memos += "<h3 class='el-search-value ui-li-heading'>" + memos[i1].Name + "</h3>";
        else
            c_memos += "<br /><br />";

        c_memos += "<span class='ui-li-desc'><strong class='el-search-value'>" + text + "</strong>" +
                   "</span></a></div>" +
                   "<span class='ui-icon ui-icon-arrow-r'></span></div></li>";
    }
    document.getElementById("liMemos").innerHTML = c_memos;
}

function neuesMemo() {
    memosKunde();
    $("#memosd_datum").val("");
    $("#memosd_benutzer").val("");
    $("#memosd_TermText").val("");
    $("#memosd_del").css({ "display": "none" });
    $("#memosd_drp").css({ "display": "block" });
    $("#H_RowidMemo").val("MN");
}

function memosDet(id, text) {
    memosKunde();
    var i1 = Number(id.substr(4));
    $("#H_RowidMemo").val(memos[i1].Rowid);
    $("#memosd_datum").text(memos[i1].Datum);
    $("#memosd_benutzer").text(memos[i1].Benutzer);
    $("#memosd_TermText").val(memos[i1].Memo);
    $("#memosd_del").css({ "display": "block" });
    $("#memosd_drp").css({ "display": "none" });
}

function memosKunde() {
    document.getElementById("memosd_name").innerHTML = group[induniv].Name;
    document.getElementById("memosd_plz").innerHTML = group[induniv].PLZ;
    document.getElementById("memosd_ort").innerHTML = group[induniv].Ort;
    document.getElementById("memosd_strasse").innerHTML = group[induniv].Strasse;
    document.getElementById("memosd_hnr").innerHTML = group[induniv].Hnr;
}

function delMemo() {
    question("Memo loeschen ?", "#memosd");
}

function setDokumente(PathName) {
    var item;

    this.PathName = PathName;

    item = PathName.split(chr3);
    this.Name = item[1];
}

function DokPage() {
    switch ($("#H_Return").val()) {
        case "TD":
            group = rapporte;
            induniv = $("#H_Indrapp").val();
            break;
        case ("KD"):
            group = kunden;
            induniv = $("#H_Indkund").val(); ;
            break;
    }

    $("#dok_name").text(group[induniv].Name);
    $("#dok_plz").text(group[induniv].PLZ);
    $("#dok_ort").text(group[induniv].Ort);
    $("#dok_strasse").text(group[induniv].Strasse);
    $("#dok_hnr").text(group[induniv].Hnr);
}

// wird in showDokumente (crm.aspx.cs) definiert
function fileDwnlShow(id, PathName) {
    $("#H_DokuDownload").val(id + chr5 + PathName);
    var bt = $("#dokDwnlShow");
    bt[0].click();
}

function DokShow() {
    values = $("#H_DokuDownload").val();
    // siehe getDwnlShow() in crm.aspx.cs
    itemsRec = values.split(chr7);
    var id = itemsRec[0].split(chr5)[0].substr(3, 1);
    $("#doc" + id).css({ "color": "black" });
    $("#docsd").css({ "display": "block" });

    var PathName = itemsRec[0].split(chr5)[1];
    items = PathName.split(chr3);
    var NameExt = items[items.length - 1];
    var Ext = NameExt.split(".")[1].toLowerCase();
    var base64data = itemsRec[2].split(chr5)[1];
    var mt = mimeTyp(Ext);
    var blob = base64dataToBlob(base64data, mt);
    var blobUrl = URL.createObjectURL(blob);
    $("#docs").attr("href", blobUrl);
    $("#docs").css({"color": "black" });
    $("#docd").attr("href", blobUrl);
    $("#docd").attr("download", NameExt);
    $("#docd").css({"color": "black" });
}

function base64dataToBlob(base64data, mimeType) {

    // wandle b64 encodierten string in einen String bestehend aus Byte-Zeichen um
    var byteCharactersString = window.atob(base64data);

    // Erstelle einen Array-Buffer im Umfang des Strings aus Byte-Zeichen
    var arrayBuffer = new ArrayBuffer(byteCharactersString.length);

    // Erstelle einen Byte-Array in der Grösse vom Array-Buffer
    var byteArray = new Uint8Array(arrayBuffer);

    // Schleife über alle Zeichen des Strings aus Byte-Zeichen
    for (i = 0; i < byteCharactersString.length; i++) {

        // an aktueller Position den Unicode-Wert des Byte-Zeichens auslesen und an derselben Position in den Byte-Array eintragen
        byteArray[i] = byteCharactersString.charCodeAt(i);

    }

    var blob = new Blob([arrayBuffer], { type: mimeType });
    return blob;

} 	// Ende Funktion base64dataToBlob

function fileUpld() {
    var file = $('#FileUpload')[0].files[0];

    var reader = new FileReader();
    reader.onload = function () {
        var data = reader.result,
			base64 = data.replace(/^[^,]*,/, '');

        $("#H_DokuUpload").val(file.name + chr5 + base64);
        var bt = $("#dokUpld");
        bt[0].click();

    }; // Ende reader.onload

    reader.readAsDataURL(file);
}

// wird aus edit(), fazit() und onChange in DropDownList aufgerufen
function KontaktChange(typ) {
    $("#" + typ + "KontaktNew").attr("value", "");
    if ($("#" + typ + "Kontakt option:selected").text() == "Neue Kontaktperson") {
        $("#" + typ + "KontaktNew").css({ "display": "block" });
        $("#" + typ + "titel").css({ "display": "none" });
    } else {
        $("#" + typ + "KontaktNew").css({ "display": "none" });
        $("#" + typ + "titel").css({ "display": "inline" });
        $("#" + typ + "titel").text($("#" + typ + "Kontakt option:selected")[0].title);
    }
}

function Telefon(items) {
    var c1 = "";
    var c2 = "";
    for (var i1 = 0; i1 < items.length; i1++) {
        if (items[i1] != "") {
            switch (i1) {
                case 0:
                    c2 = "Gesch&auml;ft";
                    break;
                case 1:
                    c2 = "Gesch&auml;ft dir";
                    break;
                case 2:
                    c2 = "Privat";
                    break;
                case 3:
                    // SMS
                    c2 = "Natel";
                    document.getElementById("SMSnum").innerHTML = "<a class='ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c' href='sms:" + items[3] + "'>" +
                        "<span class='ui-btn-inner ui-btn-corner-all'>" + items[3] + "</span></a>";
                    break;
            }
            c1 = c1 + "<div>" + c2 + "</div><a class='ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c' href='tel:" + items[i1] + "'>" +
                    "<span class='ui-btn-inner ui-btn-corner-all'>" + items[i1] + "</span></a>";
        }
        else {
            if (i1 == 3) document.getElementById("SMSnum").innerHTML = "<span>Es gibt keine Natel Nummer</span>";
        }
    }
    if (c1 == "") c1 = "<div>Es gibt keine Telefonnummer</div>";
    document.getElementById("telnum").innerHTML = c1;
    return c1;
}

function Email(items) {
    var c1 = "";
    var c2 = "";
    for (var i1 = 0; i1 < items.length; i1++) {
        if (items[i1] != "") {
            switch (i1) {
                case 0:
                    c2 = "Email";
                    break;
                case 1:
                    c2 = "Email2";
                    break;
                case 2:
                    c2 = "Email3";
                    break;
            }
            c1 = c1 + "<div>" + c2 + "</div><a class='ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c' href='mailto:" + items[i1] + "'>" +
                "<span class='ui-btn-inner ui-btn-corner-all'>" + items[i1] + "</span></a>";
        }
    }
    if (c1 == "") c1 = "<div>Es gibt keine Email Adresse</div>";
    document.getElementById("emails").innerHTML = c1;
    return c1;
}

function TelMail(Tel, TelID, Mail, MailID, typ) {
    var text;
    if (Tel != "") {
        $(TelID).css({ "display": "block" });
        text = "";
        rows = Tel.split(chr4);
        for (var i1 = 0; i1 < 4; i1++) {
            if (rows[i1] != "" && i1 != 2) {
                if (i1 > 0) text += " ";
                text += TelTyp[i1] + rows[i1];
                if (typ == "1") text += "<br />";
            }
        }
        
        if (typ == "0")
            $(TelID).text(text);
        else
            $(TelID)[0].innerHTML = text;
    }
    else $(TelID).css({ "display": "none" });

    if (Mail != "") {
        $(MailID).css({ "display": "block" });
        $(MailID).text(Mail.split(chr4)[0]);
    } else {
        $(MailID)[0].innerHTML = "<br />";
    }
}

function checkDate(page, d) {
    setScrollen();
    l_date = true;
    var iDay, iMonth, iYear;
    var c1 = d.substr(0, 2);
    var c2 = d.substr(2, 1);
    var c3 = d.substr(3, 2);
    var c4 = d.substr(5, 1);
    var c5 = d.substr(6, 4);
    if (c2 != "." || c4 != ".") {
        $("#InfoRef").attr("href", "#" + page);
        $("#InfoMessage").text("Datumformat ist falsch. Sollte TT.MM.JJJJ sein.");
        $.mobile.changePage($("#InfoPage"), {
            transition: 'pop',
            role: 'dialog'
        });

        //alert("Datumformat ist falsch. Sollte JJJJ-MM-TT sein.");
        l_date = false;
    }
    else {
        if (isNaN(c1) || isNaN(c3) || isNaN(c5)) {
            $("#InfoRef").attr("href", "#" + page);
            $("#InfoMessage").text("Datum muss nur die Nummer erhalten.");
            $.mobile.changePage($("#InfoPage"), {
                transition: 'pop',
                role: 'dialog'
            });
            l_date = false;
        }
        else {
            iDay = Number(c1);
            iMonth = Number(c3);
            iYear = Number(c5);
            var testDate = new Date(iYear, iMonth - 1, iDay);
            if ((testDate.getDate() != iDay) ||
                (testDate.getMonth() != iMonth - 1) ||
                (testDate.getFullYear() != iYear)) {
                $("#InfoRef").attr("href", "#" + page);
                $("#InfoMessage").text("Datum ist falsch.");
                $.mobile.changePage($("#InfoPage"), {
                    transition: 'pop',
                    role: 'dialog'
                });
                l_date = false;
            }
        }
    }
}

function checkTime(page, t) {
    setScrollen();
    l_time = true;
    var c1 = t.substr(0, 2);
    var c2 = t.substr(2, 1);
    var c3 = t.substr(3, 2);
    if (c2 != ":") {
        if (deviceType == "Mobile") {
            $("#InfoRef").attr("href", "#" + page);
            $("#InfoMessage").text("Zeitformat ist falsch. Sollte HH:MM sein.");
            $.mobile.changePage($("#InfoPage"), {
                transition: 'pop',
                role: 'dialog'
            });
        }
        else
            /* 3.8.2018
               Für deviceType == "PC" wird anstatt #InfoPage alert() benutzt.
               Wenn beim Speichern diese Meldung auf der Seite #InfoPage kommt
               (z.B. das Feld für die Zeit ist leer),
               dann wenn man auf das Feld für Zeit anklickt, kommt diese Meldung
               wieder und mit OK kann man sie nicht schliessen */
            alert("Zeitformat ist falsch. Sollte HH:MM sein.");

        l_time = false;
    }
    else
        if (isNaN(c1) || isNaN(c3)) {
            $("#InfoRef").attr("href", "#" + page);
            $("#InfoMessage").text("Zeit muss nur die Nummer erhalten.");
            $.mobile.changePage($("#InfoPage"), {
                transition: 'pop',
                role: 'dialog'
            });
            l_time = false;
        }
        else
            if (c1 == "" || c3 == "" || Number(c1) < 0 || Number(c1) > 23 || Number(c3) < 0 || Number(c3) > 59) {
                $("#InfoRef").attr("href", "#" + page);
                $("#InfoMessage").text("Zeit ist falsch.");
                $.mobile.changePage($("#InfoPage"), {
                    transition: 'pop',
                    role: 'dialog'
                });
                l_time = false;
            }
}

// setzt die Nummer mit führenden Nullen
function FormNum(num, length) {
    var r = "" + num;
    while (r.length < length)
    { r = "0" + r; }
    return r;
}

// setzt die Nummer mit führenden Leerschlägen
function FormInt(num, length) {
    var n = "" + num.toFixed(0);
    var i = n.length;
    while (i < length) {
        n = "&nbsp;" + n;
        i++;
    }
    return n;
}

function setScrollen() {
    /* nach dem Aufruf von Dialog-Box für den Calender oder die Zeit
       konnte man in Chrome nicht scrollen */
    var mw = $(".ui-mobile-viewport");
    for (var i = 0; i < mw.length; i++) {
        $(mw[i]).removeClass("ui-mobile-viewport-transitioning");
    }
}

function mimeTyp(dateityp) {
    switch (dateityp) {
        case 'txt':
            mimetype = 'text/plain';
            break;
        case 'pdf':
            mimetype = 'application/pdf';
            break;
        case 'jpg':
        case 'jpeg':
            mimetype = 'image/jpeg';
            break;
        case 'png':
            mimetype = 'image/png';
            break;
        case 'tif':
        case 'tiff':
            mimetype = 'image/tiff';
            break;
        case 'doc':
        case 'docx':
        case 'dot':
        case 'dotx':
            mimetype = 'application/msword';
            break;
        case 'eps':
        case 'eps':
        case 'epsf':
        case 'epsi':
            mimetype = 'image/x-eps'
            break;
        case 'indd':
            mimetype = 'application/x-indesign';
            break;
        case 'psd':
            mimetype = 'application/photoshop';
            break;
        case 'ai':
            mimetype = 'application/illustrator';
            break;
        default:
            mimetype = 'application/octet-stream';
            break;
    }
    return mimetype;
}
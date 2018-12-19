/* CRM-ready.js */

$(document).ready(function () {
    timeoutOfSession = Number($("#H_TimeoutOfSession").val());

    $("#Benutzer, #Passwort").on('click', function () {
        $("#disp-message").css({ "display": "none" });
    });

    cPage = $("#H_Page").val();

    /*
    - beim Login oder falls CheckTermid() = false (crm.aspx.cs: H_Login.Value = "")
    - nach der Abmeldung (crm.aspx.cs: H_Login.Value = "no") */
    if ($("#H_Login").val() == "" || $("#H_Login").val() == "no") {

        getLoginCookies();

        // Wechsel auf die Seite "Login"
        if ($("#Benutzer").val() != "" || cookies_termid == "" || cookies_email == "") {

            // falls der Benutzer eingegeben wird, bestehende cookies entfernen
            if ($("#Benutzer").val() != "") {
                var expires = "expires=" + startTime.toUTCString();
                document.cookie = "Termid=; " + expires;
                document.cookie = "Email=; " + expires;
            }
            /* vor der Darstellung von Login Maske die Pause setzen, sonst in Chrome
            wird im Zyklus dargestellt */
            setTimeout(function () {
                if ($("#TxtMessage").text() != "")
                    $("#disp-message").css({ "display": "block" });
                $.mobile.changePage($("#login"), {
                    transition: 'pop',
                    role: 'dialog'
                });
            }, 1000);
        }
        else {
            // Check Cookies
            $("#H_Login").val(cookies_termid + chr5 + cookies_email);
            var bt = $("#loginCookies");
            bt[0].click();
            return;
        }
    } else {
        if (cPage == "#review") {
            // Save Cookies
            cookies_login = $("#H_Login").val().split(chr5);
            document.cookie = "Termid=" + cookies_login[0];
            document.cookie = "Email=" + cookies_login[1];
        }
    }

    /* für die Darstellung von EDI Icon war setTimeout() nötig,
    aber die Darstellung ist mit LoadFavicon() gemacht.
    if ($("#H_Login").val() == "") {
    setTimeout(function () { location.href = "#login"; }, 300);
    }
    */

    LoadFavicon($("#H_FaviconPath").val() + 'favicon.ico');

    // Datebox: Darstellung von Kalendar und Uhr
    $("#TermineD, #edit_RappDatum, #edit_TermDatum, #fazit_RappDatum, #fazit_TermDatum, #edit_RappZeit, #edit_TermZeit, #fazit_RappZeit, #fazit_TermZeit").click(function () {
        $(this).datebox('open');
    });

    $('#TermineD, #edit_RappDatum, #edit_TermDatum, #fazit_RappDatum, #fazit_TermDatum, #edit_RappZeit, #edit_TermZeit, #fazit_RappZeit, #fazit_TermZeit').on('datebox', function (e, p) {
        if (p.method === 'close') {
            setScrollen();
        }
    });

    termTyp = $("#TermineTyp option:selected").val();

    // nach dem Rückkehr aus dem WebServer die entsprechende Werte der Elemente
    // auf den gewünschten Seiten darstellen
    Mitbeznr = $("#H_Mitbeznr").val();
    if (cPage != "") {
        cReturn = $("#H_Return").val();
        if ($("#H_Message").val() == "") {

            /* die Rapporten mit ihren Übersicht auf der Seite "review" aktualisieren
            entweder, wenn man auf einer Seite die Funktion aus Code-Behind aufruft oder
            nach Timeout, wenn man nach der Anmeldung auf die aktuelle Seite wechselt */
            if (cPage == "#review" || cReturn == "TD") {

                values = $("#H_Rapport").val();
                if (values != "") { getRapports(values); }
                if (cReturn == "TD") setDetail();   // für die Kundenkarte aus der Seite "#detail"
            }

            /* für die Seite Kundendetails mit neuem Fazit (#fazitK), Umsatz (#umsatzK) und Memo
            (siehe beforeUpdate('K') und beforeUmsatz('K'))
            und die Seite History mit den offenen und erledigten Kundenrapporten
            (siehe beforeUpdate('H') und beforeUmsatz('H')) */
            if (cReturn == "KD") {
                setKundDet();

                dispKundRapp("O");
                dispKundRapp("E");
            }

            /* für die Knöpfe Fazit, Edit und Umsatz auf der Seite "rappdetail",
            d.h. #fazitHR, #editHR und #umsatzHR" */
            if (cReturn == "TH" || cReturn == "KH") {
                values = $("#H_HistoryDet").val();
                rapporteH = getHistory(values);
            }

            switch (cPage) {
                case "#detail":
                    // aktualisiert indrapp und ruft termDetail() und getHistory()
                    setDetail();
                    break;

                case "#rappdetail":
                    RappDetail();
                    break;

                case "#edit":
                    indrapp = $("#H_Indrapp").val();
                    edit(rapporte, indrapp);
                    break;

                case "#fazit":
                    indrapp = $("#H_Indrapp").val();
                    fazit(rapporte, indrapp);
                    break;

                case "#kunden":
                    Kunden();
                    break;

                case "#kundendetail":
                    setKundDet();
                    if ($("#KundKarteFormular option:selected").val() != undefined)
                        $("#KundenKarte").css({ "display": "block" });
                    else
                        $("#KundenKarte").css({ "display": "none" });
                    break;

                case "#fazitK": // cPage = "#fazitK" wird in beforeKFazit() gesetzt
                    indkund = $("#H_Indkund").val();
                    fazit(kunden, indkund);
                    cPage = "#fazit";
                    break;

                case "#umsatzK": // cPage = "#umsatzK" wird in getUmsatz() - CodeBehind gesetzt
                    cPage = "#umsatz";
                    break;

                case "#editHR": // cPage = "#editHR" wird in beforeEditHR() gesetzt
                    edit(rapporteH, 0);
                    cPage = "#edit";
                    break;

                case "#fazitHR": // cPage = "#fazitHR" wird in beforeFazitHR() gesetzt
                    fazit(rapporteH, 0);
                    cPage = "#fazit";
                    break;

                case "#umsatzHR": // cPage = "#umsatzHR" wird in getUmsat() - CodeBehind gesetzt
                    cPage = "#umsatz";
                    break;

                case "#memosr":
                    Memos();
                    cPage = "#memos";
                    break;
            }

            if (cPage.indexOf("kundenblatt") == 0) {
                var fileName = $("#H_Info").val();
                var crm_temp = crm_URL + "Temp/" + fileName;

                if (fileName != "") {
                    $("#H_Info").val("Kundenblatt:" + chr10 + fileName + chr10 + "wurde erstellt");
                    message("Info", crm_temp, "Kundenblatt anzeigen");
                    $("#H_Info").val("");
                }
                cPage = "#" + cPage.split("#")[1];
                $("#H_Page").val(cPage);
                if (cReturn == "TD")
                    $("#H_Return").val("T");
                else
                    $("#H_Return").val("K");
                return;
            }

            if (cPage.indexOf("dokumente") == 0) {
                switch (cPage) {
                    case "dokumente":
                        DokPage();
                        break;
                    case "dokumenteSD":
                        DokPage();
                        DokShow();
                        break;
                }
                cPage = "#dokumente";
            }

            if ($("#H_Info").val() == "")
                setTimeout(function () { location.href = cPage; }, 300);

            if (cPage == "#umsatz") { setUmsatz(); }

        }
        // error
        else {
            values = $("#H_Rapport").val();
            switch (cPage) {
                case "#login":
                    $("#disp-message").css({ "display": "block" });
                    $.mobile.changePage($("#login"), {
                        transition: 'pop',
                        role: 'dialog'
                    });
                    break;

                case "#review":
                    message("Message", cPage, "OK");
                    break;

                case "#detail":
                    message("Message", "#review", "OK");
                    break;

                case "#edit":
                    if (values != "") {
                        getRapports(values);
                        indrapp = $("#H_Indrapp").val();
                        edit(rapporte, indrapp);
                    }

                    message("Message", cPage, "OK");
                    break;

                case "#fazit":
                    if (values != "") {
                        getRapports(values);
                        indrapp = $("#H_Indrapp").val();
                        fazit(rapporte, indrapp);
                    }

                    message("Message", cPage, "OK");
                    break;

                case "#umsatz":
                    if (values != "") {
                        getRapports(values);
                        indrapp = $("#H_Indrapp").val();
                        // detail Seite darstellen
                        termDetail(indrapp);
                        // historische Rapporten darstellen
                        values = $("#H_History").val();
                        rapporteH = getHistory(values);
                        document.getElementById("liHistory").innerHTML = dispHistory(1);

                    }
                    message("Message", "#detail", "OK");
                    break;

                case "#kunden":
                    if (values != "") { getRapports(values); }

                    message("Message", cPage, "OK");
                    if ($("#H_Message").val().substr(0, 2) >= "03") Kunden();
                    break;

                case "#kundendetail": case "#kundenblatt":
                    setKundDet();
                    cPage = "#kundendetail";
                    if ($("#KundKarteFormular option:selected").val() != undefined)
                        $("#KundenKarte").css({ "display": "block" });
                    else
                        $("#KundenKarte").css({ "display": "none" });
                    message("Message", cPage, "OK");
                    break;

                case "#memosr":
                    if (values != "") {
                        getRapports(values);
                        // aktualisiert indrapp und ruft termDetail() und getHistory()
                        setDetail();
                    }
                    message("Message", "#detail", "OK");
                    break;

                case "#fazitK": case "#umsatzK":
                    setKundDet();
                    // weil nur bei den offenen Rapporten Fazit, Edit und Umsatz erlaubt ist
                    /* blockiert 6.8.2015
                    indrappO = $("#H_IndrappO").val();
                    if (indrappO != "") KundRappDet("O", indrappO); ???
                    */
                    message("Message", "#kundendetail", "OK");
                    break;

                case "#umsatzHR":
                    if (values != "") {
                        getRapports(values);
                        // aktualisiert indrapp und ruft termDetail() und getHistory()
                        setDetail();
                    }
                    message("Message", "#detail", "OK");
                    break;

                default:
                    break;
            }
        }

        $("#H_Message").val("");
        //$("#H_Page").val(""); blockiert 28.8.2015
    }

    // die Meldung: "Ihre Angaben wurden gespeichert" usw. zeigen
    if ($("#H_Info").val() != "") {
        message("Info", cPage, "OK");
        $("#H_Info").val("");
    }
});

using System;
//using System.Collections.Generic;
//using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Text;
using System.IO;
using System.Configuration;
using System.Data;
using Newtonsoft.Json;

public partial class message : System.Web.UI.Page
{
    private string ReturnMessage = string.Empty;
    private string TxtRequest = string.Empty;
    private string TxtReturn = string.Empty;
    private string Temp = string.Empty;
    private string[] items;
    private string[] error;
    string cRowid = string.Empty;
    char[] dlmtRec = { (char)5, (char)6 };
    char[] dlmtError = { (char)5, (char)8 };
    private string responseFromServer = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        H_ASPX.Value = "true";
        if (!Page.IsPostBack)
        {
            Session["Temp"] = Server.MapPath("~/Temp");
            H_TermineD.Value = GenHtml.today.ToString("dd.MM.yyyy");
            TermineD.Text = H_TermineD.Value;
            getMandant();
        }
    }

    protected void initLogin()
    {
        H_Page.Value = "#login";

        Session["Firma"] = ConfigurationManager.AppSettings["Firma"];
        Session["RappNumMax"] = ConfigurationManager.AppSettings["RappNumMax"];
        H_TimeoutOfSession.Value = ConfigurationManager.AppSettings["timeoutOfSession"];
        Session.Timeout = Convert.ToInt32(H_TimeoutOfSession.Value);
        // für Kundenkarte
        Session["Temp"] = Server.MapPath("~/Temp");
        // benutzt in CRM-ready.js
        H_FaviconPath.Value = ConfigurationManager.AppSettings["Favicon_Path"];
    }

    protected bool CheckTermid()
    {
        if (Session["Termid"].ToString() == "")
        {
            TxtMessage.Text = "Sie müssen sich neu anmelden (Timeout von Session)";
            H_Page.Value = "#login";
            H_Login.Value = "";
            return false;
        }
        else
            return true;
    }

    protected void initDateBox(object sender, EventArgs e)
    {
    }
    

    protected string getMandant()
    {
        TxtRequest = "fisDVcrmMandant" + (char)4 + "Firma" + (char)5 + Session["Firma"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                items = items[1].Split(dlmtRec);
                if (items[3] != "")
                    Mandant.Text = items[3];
                else
                    Mandant.Text = items[1];
                break;
            case "crm02":
                TxtMessage.Text = "Mandant nicht gefunden";
                return "error";
            default:
                TxtMessage.Text = error[1];
                return "error";
        }
        return "OK";
    }

    // wird aus CRM-ready.js mit gesetzem Wert des Feldes H_Login aufgerufen
    protected void LoginCookies(object sender, EventArgs e)
    {
        initLogin();

        TxtRequest = "fisExtAnmeld" + (char)4 +
                     "Termid" + (char)5 + H_Login.Value.Split((char)5)[0] + (char)6 +
                     "Email" + (char)5 + H_Login.Value.Split((char)5)[1];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        if (error[1] == "00")
            start();
        else
            H_Login.Value = "";

        return;
    }

    protected void Anmelden(object sender, EventArgs e)
    {
        initLogin();

        // bei der Anmeldung nach Timeout ist H_Login.Value == "yes"
        H_Login.Value = "";

        Benutzer.Text = "Kurt";
        Passwort.Text = "123";
        TxtRequest = "fisExtAnmeld" + (char)4 +
                     "Userid" + (char)5 + Benutzer.Text + (char)6 +
					 "Passwort" + (char)5 + Passwort.Text + (char)6 +
                     "Firma" + (char)5 + Session["Firma"] + (char)6 + "User-sprache" + (char)5 + "D";

        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "00":
                TxtMessage.Text = "";
                H_Message.Value = "";
                break;
            case "02":
                TxtMessage.Text = "Benutzername oder Passwort ist falsch" + "<br/><br/>" + error[2];
                H_Message.Value = "error";
                return;
            default:
                if (error[1].Substring(0, 2) == "-1")
                {
                    TxtMessage.Text = "Problem der Kommunikation mit Web/App Server" + "<br/><br/>" + error[1].Substring(2);
                    H_Message.Value = "error";
                }
                else
                {
                    TxtMessage.Text = error[1];
                    H_Message.Value = "error";
                }
                return;
        }

        start();
        return;
    }

    private void start()
    {
        TxtMessage.Text = "";

        items = items[1].Split(dlmtRec);
        Session["Termid"] = items[1];
        Session["Email"] = items[3];
        Session["Mitbeznr"] = items[15];	// wird in getMitarbeiter() benutzt
		Session["UserIdent"] = items[17];
        Benutzer.Text = items[17];          // wird z.B. für die Mitteilung benutzt

        TxtReturn = getMitarbeiter();
        if (TxtReturn == "error") return;

        TxtReturn = getAktiv();
        if (TxtReturn == "error") return;

        setDropDownLists(TxtReturn);

        TxtReturn = getDefault();
        if (TxtReturn == "error") return;

        items = TxtReturn.Split((char)7);
        items = items[1].Split(dlmtRec);
        Session["Default"] = items[1] + (char)5 + items[3] + (char)5 + items[5];
        //fazit_TermText.Text = items[3];

        // falls kein Fehler, wird die Seite "review" geöffnet
        TxtReturn = getRapports();
        if (TxtReturn == "error") return;

        H_Login.Value = Session["Termid"].ToString() + (char)5 + Session["Email"];
    }

    private void setDropDownLists(string aktivList)
    {
        // setzt DropDownList für die Aktivitäten
        edit_RappAktiv.Items.Clear();
        edit_TermAktiv.Items.Clear();
        fazit_RappAktiv.Items.Clear();
        fazit_TermAktiv.Items.Clear();

        string[] itemsA;
        string[] item1;
        itemsA = aktivList.Split((char)7);
        int n_aktiv = itemsA.Length;
        for (var i1 = 1; i1 < n_aktiv; i1++)
        {
            item1 = itemsA[i1].Split(dlmtRec);
            // Beschreibung, AktivitID
            edit_RappAktiv.Items.Add(new ListItem(item1[1], item1[0]));
            edit_TermAktiv.Items.Add(new ListItem(item1[1], item1[0]));
            fazit_RappAktiv.Items.Add(new ListItem(item1[1], item1[0]));
            fazit_TermAktiv.Items.Add(new ListItem(item1[1], item1[0]));
        }
    }

    protected string getMitarbeiter()
    {
        if (!CheckTermid()) return "error";

        TxtRequest = "fisDVcrmMitarbeiter" + (char)4 + "Mitbeznr" + (char)5 + Session["Mitbeznr"] + (char)6 +
					 "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError); 
        switch (error[1])
        {
            case "crm00":
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                return "error";
            case "crm02":
                TxtMessage.Text = "Mitarbeiter nicht gefunden";
                H_Message.Value = "error";
                return "error";
            default:
                TxtMessage.Text = error[1];
                H_Message.Value = "error";
                return "error";
        }
        items = items[1].Split(dlmtRec);
        Session["Mitart"] = items[3];
        Session["TermidName"] = items[5];

        return TxtReturn;
    }

    protected string getAktiv()
    {
        if (!CheckTermid()) return "error";

        TxtRequest = "fisDVcrmAktiv" + (char)4 + "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError); 
        switch (error[1])
        {
            case "crm00":
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                return "error";
            case "crm02":
                TxtMessage.Text = "Keine Aktivitäten gefunden";
                return "error";
            default:
                TxtMessage.Text = error[1];
                return "error";
        }
        return TxtReturn;
    }

    protected string getDefault()
    {
        if (!CheckTermid()) return "error";

        TxtRequest = "fisDVcrmDefault" + (char)4 + "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                return "error";
            case "crm02":
                TxtMessage.Text = "Keine Defaulten gefunden";
                return "error";
            default:
                TxtMessage.Text = error[1];
                return "error";
        }
        return TxtReturn;
    }

    protected void TermPrev(object sender, EventArgs e)
    {
        H_Page.Value = "#review";
        getRapports();
    }

    protected void TermNext(object sender, EventArgs e)
    {
        H_Page.Value = "#review";
        getRapports();
    }

    protected void Refresh(object sender, EventArgs e)
    {
        H_Page.Value = "#review";
        getRapports();
    }

    protected string getRapports()
    {
        if (!CheckTermid()) return "error";

        // Rapporten für den Mitarbeiter feststellen
        TxtRequest = "fisDVcrmRapport" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Mitbeznr" + (char)5 + Session["Mitbeznr"] + (char)6 +
                     "TermineTyp" + (char)5 + TermineTyp.Text + (char)6 +
                     "Datum" + (char)5 + H_TermineD.Value + (char)6 + "Prev" + (char)5 + H_TermineP.Value + (char)6 +
                     "Next" + (char)5 + H_TermineN.Value + (char)6 + "RappNumMax" + (char)5 + Session["RappNumMax"];

        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                GenHtml.setRapporte(TxtReturn, "rapporte.xml");
                LV_Term.Text = GenHtml.LVRapporte(TermineTyp.SelectedItem.Value);
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                return "error";
            case "crm02":
                H_Info.Value = "Keine Rapporte gefunden";
                break;
            case "crm09":
                TxtMessage.Text = "Fehler in Query";
                return "error";
            default:
                TxtMessage.Text = error[1];
                return "error";
        }
        if (H_Login.Value == "" || H_Page.Value == "#login") H_Page.Value = "#review";
        return TxtReturn;
    }

    // wird gestartet, wenn man auf der Seite "review" (Termine) einen Rapport wählt
    protected void ReviewDet(object sender, EventArgs e)
    {
        H_Part.Value = "T";      // Termine (aktuelle Rapporte)

        DataRow row = GenHtml.getReviewDet(H_IndexT.Value, "rapporte.xml");
        Session["RowidTerm"] = row.Field<string>("Rowid");

        showRapport(row, Session["RowidTerm"].ToString());

        H_Page.Value = "#detail";   // wohin
        H_Return.Value = "#review"; // woher
    }

    protected void RapportDet(object sender, EventArgs e)
    {
        // wird gestartet, wenn man einen historischen Rapport wählt
        H_Part.Value = "H";      // historische Rapporte

        DataRow row = GenHtml.getReviewDet(H_IndexR.Value, "historyT.xml");
        Session["RowidRapp"] = row.Field<string>("Rowid");

        showRapport(row, Session["RowidRapp"].ToString());

        H_Page.Value = "#detail";   // wohin
        H_Return.Value = "#detail"; // woher
    }

    // wird gestartet, wenn man auf der Seite Memos ein Memo wählt
    protected void MemoDet(object sender, EventArgs e)
    {
        DataRow row = GenHtml.getMemoDet(H_IndexM.Value, "memos.xml");
        Session["RowidMem"] = row.Field<string>("Rowid");

        // Detail Seite
        showMemo(row);

        // für die Seite "memoDet" bleibt H_Return = "#detail",
        // weil aus der Seite memoDet kommt man auf die Seite memos mit href="#memos"
        H_Page.Value = "#memosDet";   // wohin
    }

    // wird gestartet, wenn man auf der Seite "kunde" einen Kunde wählt
    protected void KundeDet(object sender, EventArgs e)
    {
        H_Part.Value = "K";      // Kunde

        DataRow row = GenHtml.getKundeDet(H_IndexT.Value, "kunde.xml");
        Session["RowidTerm"] = row.Field<string>("Rowid");

        showKunde(row, "K", Session["RowidTerm"].ToString());

        H_Page.Value = "#kundendetail";   // wohin
        H_Return.Value = "#kunden"; // woher
    }

    private void showRapport(DataRow row, string rowid)
    {
        // Detail Seite
        showTermDetail(row);

        if (H_Part.Value == "T")
        {
            // historische ListView Items
            Session["HistoryRecT"] = 0;
            getHistory(rowid);
        }

        // Edit und Fazit Seite
        beforeEdit_Fazit(row);

        // Edit Seite
        showEdit(row);

        // Fazit Seite
        showFazit(row);

        // Umsatz Seite
        getUmsatz();

        // Memo Seite
        readMemos();
    }

    protected void showTermDetail(DataRow row)
    {
        H_Page.Value = "#detail";
        string dt = "b";
        string bd = "block";
        if ((H_Part.Value == "T") && (TermineTyp.SelectedItem.Value == "0") ||
            (H_Part.Value == "H") && (row.Field<string>("Folgerapnr") == "0" && row.Field<string>("TermDatum") != "01.01.0001"))
        {
            // offene
            if (String.Compare(row.Field<string>("dat_TermDatum"), GenHtml.dat_heute, false) < 0) dt = "e";   // gelbe Farbe
        }
        else
        {
            // erledigte
            dt = "c";
            bd = "none";
        }

        Btn_fazit.Style.Add("display", bd);

        // wegen die Setzung der Farbe wird der Kopf nicht in crm.aspx definiert
        string c_detail = "<div data-role='header' id='detail_header' data-theme='" + dt + "' data-position='fixed'>" +
                          "<a href='#' onclick='getBack()' data-icon='arrow-l' data-theme='c'>Termine</a>" +
                          "<h1 class='header'>Detail</h1></div>";
        l_detail_header.Text = c_detail;
        
        TkundBeznr.Text = row.Field<string>("Beznr");
        kname.Text = row.Field<string>("Name");
        PLZ.Text = row.Field<string>("PLZ");
        ort.Text = row.Field<string>("Ort");
        strasse.Text = row.Field<string>("Strasse");
        hnr.Text = row.Field<string>("Hnr");
        TelMail(row.Field<string>("TelefonK"), telefonK_det, row.Field<string>("EmailK"), emailK_det, "0");

        name.Text = row.Field<string>("Kontakt");
        titelA_det.Text = row.Field<string>("TitelA");
        telefonA_det.Text = row.Field<string>("TelefonA");
        emailA_det.Text = row.Field<string>("EmailA");

        if (row.Field<string>("Objekt") != "")
        {
            objekt.Style.Add("display", "block");
            objekt.Text = "<br/><strong>Objekt</strong><br/>" + row.Field<string>("Objekt") + "<br/><br/>";
        }
        else
            objekt.Style.Add("display", "none");

        rappdatum.Text = row.Field<string>("RappDatum");
        string c1 = row.Field<string>("RappZeit");
        if (c1 != "") rappzeit.Text = (c1.Substring(0, 2) + ":" + c1.Substring(2, 2));
        rappaktivIcon.Attributes["src"] = GenHtml.getIcon(row.Field<string>("RAktiv"));
        rappaktiv.Text = row.Field<string>("RAktiv_bes");
        rapptext.Text = row.Field<string>("RappText");
        items = row.Field<string>("RappText").Split((char)10);
        string text = "";
        for (var i1 = 0; i1 < items.Length; i1++)
        {
            text += items[i1] + "<br />";
        }
        rapptext.Text = text;

        termaktivIcon.Attributes["src"] = GenHtml.getIcon(row.Field<string>("TAktiv"));
        termaktiv.Text = row.Field<string>("TAktiv_bes");
        if (String.Compare(row.Field<string>("TermDatum"), "01.01.0001", false) != 0)
        {
            termdatum.Text = row.Field<string>("TermDatum");
            c1 = row.Field<string>("dat_TermDatum");
            DateTime datim = new DateTime(Convert.ToInt32(c1.Substring(0, 4)), Convert.ToInt32(c1.Substring(5, 2)), Convert.ToInt32(c1.Substring(8, 2)));
            termday.Text = GenHtml.weekday[(int)datim.DayOfWeek] + ",&nbsp;";
            c1 = row.Field<string>("TermZeit");
            if (c1 != "") termzeit.Text = (c1.Substring(0, 2) + ":" + c1.Substring(2, 2));
        }
        else
        {
            termdatum.Text = "ohne Termin";
            termzeit.Text = "";
        }

        // einzelne Zeile von TermText (können mit Enter geteilt werden) darstellen
        items = row.Field<string>("TermText").Split((char)10);
        text = "";
        for (var i1 = 0; i1 < items.Length; i1++)
        {
            text += items[i1] + "<br />";
        }
        termtext.Text = text;
        TelMail(row.Field<string>("TelefonA"), telefonA_det, row.Field<string>("EmailA"), emailA_det, "0");

        // Seite umsatz
        umsatz_name.Text = row.Field<string>("Name");
        umsatz_ort.Text = row.Field<string>("Ort");

        // Seite memos
        memos_name.Text = row.Field<string>("Name");
        memos_strasse.Text = row.Field<string>("Strasse");
        memos_hnr.Text = row.Field<string>("Hnr");
        memos_plz.Text = row.Field<string>("PLZ");
        memos_ort.Text = row.Field<string>("Ort");

        // Seite memosd
        memosd_name.Text = row.Field<string>("Name");
        memosd_strasse.Text = row.Field<string>("Strasse");
        memosd_hnr.Text = row.Field<string>("Hnr");
        memosd_plz.Text = row.Field<string>("PLZ");
        memosd_ort.Text = row.Field<string>("Ort");

        mailAdr.Text = (Session["Default"].ToString()).Split((char)5)[2];
    }

    // wird gestartet wenn man auf der Seite Termine oder Kundendetails einen Rapport wählt
    protected void getHistory(string Rowid)
    {
        if (!CheckTermid()) return;

        /*
        if (typ == "T")
            H_Page.Value = "#detail";
        else // H_Return.Value == "TD" || H_Return.Value == "KD"
            H_Page.Value = "#rappdetail";
        */

        TxtRequest = "fisDVcrmRappHist" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Mitbeznr" + (char)5 + Session["Mitbeznr"] + (char)6 +
                     "Rowid" + (char)5 + Rowid + (char)6;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                if (H_Page.Value == "#detail")
                {
                    GenHtml.setRapporte(TxtReturn, "historyT.xml");
                    object sender = null;
                    EventArgs e = null;
                    showHistoryT(sender, e);
                }
                break;
            case "02":
                H_Message.Value = "Keine gültige Berechtigung gefunden";
                return;
            case "crm02":
                H_Message.Value = "Eintrag in mkrappor nicht gefunden";
                return;
            case "crm03":
                //TxtMessage.Text = "Keine historische Rapporten gefunden";
                break;
            case "crm09":
                H_Message.Value = "Fehler in Query";
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected void showHistoryT(object sender, EventArgs e)
    {
        // wird aus dem Knopf "HistNumRec" (crm.aspx) gestartet;

        // die Anzahl dargestellte historische Rapporte feststellen
        int i1 = Convert.ToInt32("" + Session["HistoryRecT"]) + 5;
        Session["HistoryRecT"] = i1.ToString();

        LV_Hist.Text = GenHtml.readHistory("historyT.xml", i1);
        if (GenHtml.l_HistNumRecT == true)
            HistNumRec.Style.Add("display", "block");
        else
            HistNumRec.Style.Add("display", "none");
    }

    protected void beforeEdit_Fazit(DataRow row)
    {
        // für die Darstellung auf der EDIT-Seite müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust", row.Field<string>("Beznr"));
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, edit_RKontakt, row.Field<string>("KontaktR"));
        setDropDownListZust(TxtReturn, edit_AKontakt, row.Field<string>("Kontakt"));
        setDropDownListZust(TxtReturn, fazit_RKontakt, row.Field<string>("KontaktR"));
        setDropDownListZust(TxtReturn, fazit_AKontakt, row.Field<string>("Kontakt"));
    }

    protected void showEdit(DataRow row)
    {
        edit_kname.Text = row.Field<string>("Name");
        edit_strasse.Text = row.Field<string>("Strasse");
        edit_hnr.Text = row.Field<string>("Hnr");
        edit_plz.Text = row.Field<string>("PLZ");
        edit_ort.Text = row.Field<string>("Ort");

        string c1 = row.Field<string>("KontaktBeznr");
        string c2 = row.Field<string>("KontaktR");
        if (c1 != "0" || c2 != "") edit_RKontakt.SelectedValue = c1;
        c1 = row.Field<string>("RAktivID");
        if (c1 != "") edit_RappAktiv.SelectedValue = c1;
        edit_Rtitel.Text = "" + edit_RKontakt.Items[edit_RKontakt.SelectedIndex].Attributes["title"];

        if (row.Field<string>("RappDatum") != "01.01.0001")
            edit_RappDatum.Text = row.Field<string>("RappDatum");
        else
            edit_RappDatum.Text = "";

        c1 = row.Field<string>("RappZeit");
        if (c1 != "")
            edit_RappZeit.Text = c1.Substring(0, 2) + ":" + c1.Substring(2, 2);
        edit_RappText.Text = row.Field<string>("RappText");

        c1 = row.Field<string>("TermKontaktBeznr");
        c2 = row.Field<string>("Kontakt");
        if (c1 != "0" || c2 != "") edit_AKontakt.SelectedValue = c1;
        c1 = row.Field<string>("TAktivID");
        if (c1 != "") edit_TermAktiv.SelectedValue = c1;
        edit_Atitel.Text = "" + edit_AKontakt.Items[edit_AKontakt.SelectedIndex].Attributes["title"];

        if (row.Field<string>("TermDatum") != "01.01.0001")
        {
            edit_TermDatum.Text = row.Field<string>("TermDatum");
        }
        else
            edit_TermDatum.Text = "";
        c1 = row.Field<string>("TermZeit");
        if (c1 != "")
            edit_TermZeit.Text = c1.Substring(0, 2) + ":" + c1.Substring(2, 2);
        edit_TermText.Text = row.Field<string>("TermText");
        //KontaktChange("edit");
    }

    protected void showFazit(DataRow row)
    {
        fazit_kname.Text = row.Field<string>("Name");
        fazit_strasse.Text = row.Field<string>("Strasse");
        fazit_hnr.Text = row.Field<string>("Hnr");
        fazit_plz.Text = row.Field<string>("PLZ");
        fazit_ort.Text = row.Field<string>("Ort");

        string c1 = row.Field<string>("TermKontaktBeznr");
        if (c1 != "0") fazit_RKontakt.SelectedValue = c1;
        c1 = row.Field<string>("TAktivID");
        if (c1 != "") fazit_RappAktiv.SelectedValue = c1;
        fazit_Rtitel.Text = "" + fazit_RKontakt.Items[fazit_RKontakt.SelectedIndex].Attributes["title"];

        if (row.Field<string>("TermDatum") != "01.01.0001")
        {
            fazit_RappDatum.Text = row.Field<string>("TermDatum");
            c1 = row.Field<string>("TermZeit");
            if (c1 != "")
                fazit_RappZeit.Text = c1.Substring(0, 2) + ":" + c1.Substring(2, 2);
        } else
            fazit_RappDatum.Text = "ohne Termin";
        fazit_RappText.Text = row.Field<string>("TermText");

        fazit_AKontakt.SelectedValue = row.Field<string>("TermKontaktBeznr");
        //fazit_TermAktiv.SelectedValue = row.Field<string>("TAktivID");
        fazit_Atitel.Text = "" + fazit_AKontakt.Items[fazit_AKontakt.SelectedIndex].Attributes["title"];

        fazit_TermDatum.Text = GenHtml.tomorrow.ToString("dd.MM.yyyy"); ;
        fazit_TermZeit.Text = "00:00";
        fazit_TermText.Text = (Session["Default"].ToString()).Split((char)5)[1];
        //KontaktChange("edit");
    }

    // wird aus dem Dialog-Box "FormUmsatz" aufgerufen
    protected void getUmsatzJahr(object sender, EventArgs e)
    {
        H_Page.Value = "#umsatz";
        getUmsatz();
    }

    protected void getUmsatz()
    {
        if (!CheckTermid()) return;
        TxtRequest = "fisDVcrmUmsatz" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Beznr" + (char)5 + TkundBeznr.Text + (char)6 +
                     "Jahr" + (char)5 + UmsatzJahr.SelectedItem.Text;
        TxtReturn = MessageRest.SendMessage(TxtRequest);

        if (H_Return.Value == "KD") H_Page.Value = "#umsatzK";
        if (H_Return.Value == "TH" || H_Return.Value == "KH") H_Page.Value = "#umsatzHR";

        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                DT_Umsatz.Text = GenHtml.DTUmsatz(TxtReturn, UmsatzJahr.SelectedItem.Text);
                // zuerst wird das Diagram dargestellt
                DT_Umsatz.Style.Add("display", "none");
                break;
            case "02":
                H_Message.Value = "Keine gültige Berechtigung gefunden";
                return;
            case "crm02":
                H_Message.Value = "Eintrag in mkrappor für ROWID nicht gefunden";
                return;
            case "crm03":
                //H_Message.Value = "Kein Umsatz gefunden";
                DT_Umsatz.Text = "Kein Umsatz gefunden";
                return;
            case "crm09":
                H_Message.Value = "Fehler in Query";
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected void saveRapport(object sender, EventArgs e)
    {
        string kpR = string.Empty;
        string kp = string.Empty;
        string rappZeit = "";
        string termZeit = string.Empty;

        if (!CheckTermid()) return;

        switch (H_Part.Value)
        {
            case "T":   // aktuelle Rapporte
                cRowid = Session["RowidTerm"].ToString();
                break;
            case "H":   // historische Rapporte
                cRowid = Session["RowidRapp"].ToString();
                break;
        }

        if (H_Fazit.Value == "true")
        {
            // Fazit
            if (fazit_RKontaktNew.Text != "")
                kpR = "KontaktR" + (char)5 + fazit_RKontaktNew.Text;
            else
            {
                if (fazit_RKontakt.SelectedItem.Value != "0" && fazit_RKontakt.SelectedItem.Value != "N")
                    kpR = "KontaktBeznrR" + (char)5 + fazit_RKontakt.SelectedItem.Value + (char)6 +
                          "KontaktR" + (char)5 + fazit_RKontakt.SelectedItem.Text;
                else
                    kpR = "KontaktR" + (char)5 + fazit_RKontakt.SelectedItem.Text;
            }

            if (fazit_AKontaktNew.Text != "")
                kp = "Kontakt" + (char)5 + fazit_AKontaktNew.Text;
            else
            {
                if (fazit_AKontakt.SelectedItem.Value != "0" && fazit_AKontakt.SelectedItem.Value != "N")
                    kp = "KontaktBeznr" + (char)5 + fazit_AKontakt.SelectedItem.Value + (char)6 +
                         "Kontakt" + (char)5 + fazit_AKontakt.SelectedItem.Text;
                else
                    kp = "Kontakt" + (char)5 + fazit_AKontakt.SelectedItem.Text;
            }

            if (fazit_RappZeit.Text != "")
                rappZeit = fazit_RappZeit.Text.Substring(0, 2) + fazit_RappZeit.Text.Substring(3, 2);
            else
                rappZeit = "";

            if (fazit_TermZeit.Text != "")
                termZeit = fazit_TermZeit.Text.Substring(0, 2) + fazit_TermZeit.Text.Substring(3, 2);
            else
                termZeit = "";

            TxtRequest = "fisDVcrmFazit" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                         "Name" + (char)5 + Session["UserIdent"] + (char)6 +
                         "Mitbeznr" + (char)5 + Session["Mitbeznr"] + (char)6 + "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 +
                         "RappDatum" + (char)5 + fazit_RappDatum.Text + (char)6 + "RappZeit" + (char)5 + rappZeit + (char)6 +
                         "RappAktivid" + (char)5 + fazit_RappAktiv.Text + (char)6 + "RappText" + (char)5 + fazit_RappText.Text + (char)6 +
                         kpR + (char)6 + kp + (char)6 + "TermDatum" + (char)5 + fazit_TermDatum.Text + (char)6 +
                         "TermZeit" + (char)5 + termZeit + (char)6 +
                         "TermAktivid" + (char)5 + fazit_TermAktiv.Text + (char)6 + "TermText" + (char)5 + fazit_TermText.Text + (char)6 +
                         "Rowid" + (char)5 + cRowid + (char)6;
            H_Page.Value = "#fazit";
        }
        else
        {
            // Edit
            if (edit_RKontaktNew.Text != "")
                kpR = "KontaktR" + (char)5 + edit_RKontaktNew.Text;
            else
            {
                if (edit_RKontakt.SelectedItem.Value != "0" && edit_RKontakt.SelectedItem.Value != "N")
                    kpR = "KontaktBeznrR" + (char)5 + edit_RKontakt.SelectedItem.Value + (char)6 +
                          "KontaktR" + (char)5 + edit_RKontakt.SelectedItem.Text;
                else
                    kpR = "KontaktR" + (char)5 + edit_RKontakt.SelectedItem.Text;
            }

            if (edit_AKontaktNew.Text != "")
                kp = "Kontakt" + (char)5 + edit_AKontaktNew.Text;
            else
            {
                if (edit_AKontakt.SelectedItem.Value != "0" && edit_AKontakt.SelectedItem.Value != "N")
                    kp = "KontaktBeznr" + (char)5 + edit_AKontakt.SelectedItem.Value + (char)6 +
                         "Kontakt" + (char)5 + edit_AKontakt.SelectedItem.Text;
                else
                    kp = "Kontakt" + (char)5 + edit_AKontakt.SelectedItem.Text;
            }

            if (edit_RappZeit.Text != "")
                rappZeit = edit_RappZeit.Text.Substring(0, 2) + edit_RappZeit.Text.Substring(3, 2);
            else
                rappZeit = "";

            if (edit_TermZeit.Text != "")
                termZeit = edit_TermZeit.Text.Substring(0, 2) + edit_TermZeit.Text.Substring(3, 2);
            else
                termZeit = "";

            TxtRequest = "fisDVcrmEdit" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                         "Name" + (char)5 + Session["UserIdent"] + (char)6 +
                         "RappDatum" + (char)5 + edit_RappDatum.Text + (char)6 + "RappZeit" + (char)5 + rappZeit + (char)6 +
                         "RappAktivid" + (char)5 + edit_RappAktiv.Text + (char)6 + "RappText" + (char)5 + edit_RappText.Text + (char)6 +
                         kpR + (char)6 + kp + (char)6 + "TermDatum" + (char)5 + edit_TermDatum.Text + (char)6 +
                         "TermZeit" + (char)5 + termZeit + (char)6 +
                         "TermAktivid" + (char)5 + edit_TermAktiv.Text + (char)6 + "TermText" + (char)5 + edit_TermText.Text + (char)6 +
                         "Rowid" + (char)5 + cRowid + (char)6;
            H_Page.Value = "#edit";
        }
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                H_Info.Value = "Ihre Angaben wurden gespeichert";
                break;
            case "02":
                H_Message.Value = "Keine gültige Berechtigung gefunden";
                return;
            case "crm01":
                H_Message.Value = "Fehler beim Speichern";
                break;
            case "crm02":
                H_Message.Value = "Eintrag in mkrappor nicht gefunden";
                break;
            /*
            case "crm03":
                H_Message.Value = "Datum ist falsch";
                return;
            */
            case "crm04":
                H_Message.Value = "Eintrag in mkrappor nicht vorhanden";
                return;
            case "crm05":
                if (H_Fazit.Value == "yes")
                {
                    H_Message.Value = "Alle Rapport-Nummer vergeben";
                }
                return;
            default:
                H_Message.Value = error[1];
                return;
        }

        if (error[1] == "crm00") {
            if (H_Fazit.Value == "true") {
                // H_Rowid.Value nach dem Rowid des neuen Eintrages aktualisieren
                string[] rowid = items[1].Split((char)5);
                H_Rowid.Value = rowid[1];
            }
            getRapports();
            
            /*
            DataRow row = GenHtml.getReviewDet(H_IndexT.Value, "rapporte.xml");

            row["KontaktBeznr"] = edit_RKontakt.SelectedItem.Value;
            row["RappDatum"] = edit_RappDatum.Text;
            row["dat_RappDatum"] = edit_RappDatum.Text.Substring(6, 4) + "-" +
                                   edit_RappDatum.Text.Substring(3, 2) + "-" +
                                   edit_RappDatum.Text.Substring(0, 2);
            row["RappZeit"] = edit_RappZeit.Text;
            row["RAktivid"] = edit_RappAktiv.Text;
            row["RappText"] = edit_RappText.Text;

            row["TermKontaktBeznr"] = edit_AKontakt.SelectedItem.Value;
            row["TermDatum"] = edit_TermDatum.Text;
            row["dat_TermDatum"] = edit_TermDatum.Text.Substring(6, 4) + "-" +
                                   edit_TermDatum.Text.Substring(3, 2) + "-" +
                                   edit_TermDatum.Text.Substring(0, 2);
            row["TermZeit"] = edit_TermZeit.Text;
            row["TAktivid"] = edit_TermAktiv.Text;
            row["TermText"] = edit_TermText.Text;

            GenHtml.crm.WriteXml(HttpContext.Current.Server.MapPath("rapporte.xml"), XmlWriteMode.DiffGram);
            LV_Term.Text = GenHtml.LVRapporte(TermineTyp.SelectedItem.Value);
            ReviewDet(sender, e);
            */
        }
        H_Page.Value = "#review";
        H_Return.Value = "";
        return;
    }


    // wird in readMemos() aufgerufen
    protected void beforeMemo()
    {
        // vor dem Wechsel auf die MEMO-Seite müssen die Zuständige festgestellt werden
        TxtReturn = getZust("all", TkundBeznr.Text);
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, memo_Kontakt, "");
    }

    protected void readMemos()
    {
        if (!CheckTermid()) return;

        TxtRequest = "fisDVcrmGetMemos" + (char)4 + "Beznr" + (char)5 + TkundBeznr.Text + (char)6 + "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Memos.Value = TxtReturn;
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                GenHtml.setMemos(TxtReturn, "memos.xml");
                LV_Memos.Text = GenHtml.LVMemos();
                beforeMemo();
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm02":
                //H_Message.Value = "Memos nicht gefunden";
                beforeMemo();
                H_Page.Value = "#memosr";
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected void getMemos(object sender, EventArgs e)
    {
        readMemos();
        return;
    }

    protected void saveMemo(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        H_Page.Value = "#memosDet";   // wohin
        // H_Return.Value = "#memosDet";  siehe memoDet()

        String beznr = "";
        if (H_RowidMemo.Value == "MN")
        {
            beznr = memo_Kontakt.SelectedItem.Value;
            Session["RowidMem"] = "MN";
        }

        TxtRequest = "fisDVcrmSaveMemo" + (char)4 + "Beznr" + (char)5 + beznr + (char)6 +
                     "Name" + (char)5 + Session["TermidName"] + (char)6 +
                     "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Rowid" + (char)5 + Session["RowidMem"] + (char)6 +
                     "Text" + (char)5 + memosd_TermText.Text + (char)6;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Memos.Value = TxtReturn;
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                H_Info.Value = "Ihre Angaben wurden gespeichert";
                readMemos();
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm01":
                H_Message.Value = "Fehler beim Speichern";
                break;
            case "crm02":
                H_Message.Value = "Memo nicht gefunden";
                return;
            case "crm03":
                H_Message.Value = "Alle Memos vergeben";
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected void delMemo(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        H_Page.Value = "#memos";   // wohin
        // H_Return.Value = "#memosDet";  siehe memoDet()

        TxtRequest = "fisDVcrmDelMemo" + (char)4 +
                     "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Rowid" + (char)5 + Session["RowidMem"] + (char)6;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Memos.Value = TxtReturn;
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                H_Info.Value = "Memo wurde gelöscht";
                readMemos();
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm01":
                H_Message.Value = "Fehler beim Löschen";
                break;
            case "crm02":
                H_Message.Value = "Memo nicht gefunden";
                return;
            case "crm03":
                H_Message.Value = "Alle Memos vergeben";
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected void showMemo(DataRow row)
    {
        memosd_name.Text = row.Field<string>("Name");
        memosd_strasse.Text = memos_strasse.Text;
        memosd_hnr.Text = memos_hnr.Text;
        memosd_plz.Text = memos_plz.Text;
        memosd_ort.Text = memos_ort.Text;
        memosd_datum.Text = row.Field<string>("Datum");
        memosd_benutzer.Text = row.Field<string>("Benutzer");
        memosd_TermText.Text = row.Field<string>("Memo");
        memosd_del.Style.Add("display", "block");
        memosd_drp.Style.Add("display", "none");
    }


    protected void sendMail(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        TxtRequest = "fisDVcrmMitteilung" + (char)4 + "Email" + (char)5 + mailAdr.Text + (char)6 +
                     "Mitteilung" + (char)5 + mailBody.Text + (char)6 +
                     "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Memos.Value = TxtReturn;
        //H_Page.Value = "#detail";  blockiert 28.8.2015
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                H_Info.Value = "Die Mitteilung wurde per Email gesendet";
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm01":
                H_Message.Value = items[1];
                break;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected void getKundenSuchen(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        H_Part.Value = "K";  // Kunden

        H_KundenM.Value = "0";  // nach Mitart (als default) nicht suchen
        TxtRequest = "fisDVcrmKunden" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Mitart" + (char)5 + Session["Mitart"] + (char)6 + "Suchen" + (char)5 + searchKund.Text + ":" + H_KundenNav.Value + (char)6 +
                     "Mode" + (char)5 + H_KundenM.Value;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Page.Value = "#kunden";
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "02":
                H_Message.Value = "Keine gültige Berechtigung gefunden";
                return;
            case "crm02":
                H_Message.Value = "Kein Kunde gefunden";
                break;
            case "crm03":
                if (H_Return.Value == "T") {
                    H_Message.Value = "Ende der Liste";
                    int i1 = Convert.ToInt32(H_KundenNav.Value) - 10;
                    if (i1 < 0) i1 = 0;
                    H_KundenNav.Value = i1.ToString();
                }
                break;
            case "crm09":
                H_Message.Value = "Fehler in Query";
                return;
            default:
                if (error[1].Substring(0, 2) == "-1") {
                    H_Message.Value = error[1];
                    return;
                }

                // crm04 ... Anfang der Liste (siehe KundenPrev() in MessageRest.js)
                if (H_Message.Value != string.Empty &&
                    H_Message.Value.Substring(0, 5) != "crm04") H_Message.Value = "";
                else
                    if (H_Message.Value != string.Empty &&
                        H_Message.Value.Substring(0, 5) == "crm04") H_Message.Value = "Anfang der Liste";
                GenHtml.setKunden(TxtReturn, "kunden.xml");
                LV_Kund.Text = GenHtml.LVKunden();
                //H_Kunden.Value = TxtReturn;
                break;
        }
        H_Return.Value = "#review";  // woher
        return;
    }

    protected void showKunde(DataRow row, string typ, string rowid)
    {
        // Detail Seite
        showKundeDetail(row);
    }

    protected void showKundeDetail(DataRow row)
    {
        KkundBeznr.Text = row.Field<string>("Beznr");
        kunde_name.Text = row.Field<string>("Name");
        kunde_zusatz1.Text = row.Field<string>("Zusatz1");
        kunde_zusatz2.Text = row.Field<string>("Zusatz2");
        kunde_strasse.Text = row.Field<string>("Strasse");
        kunde_hnr.Text = row.Field<string>("Hnr");
        kunde_ort.Text = row.Field<string>("Ort");
        kunde_plz.Text = row.Field<string>("PLZ");
        kunde_telefon.Text = row.Field<string>("Telefon");
        kunde_email.Text = row.Field<string>("Email");
    }


    protected void getKundenKarteForm()
    {
        if (!CheckTermid()) return;

        KundKarteFormular.Items.Clear();
        TxtRequest = "fisDVcrmKundenkarteForm" + (char)4 + "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Page.Value = "#kundendetail";
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                string[] itemsK;
                string[] item1;
                itemsK = TxtReturn.Split((char)7);
                int n_aktiv = itemsK.Length;
                for (var i1 = 1; i1 < n_aktiv; i1++)
                {
                    item1 = itemsK[i1].Split(dlmtRec);
                    // Formular, ROWID
                    KundKarteFormular.Items.Add(new ListItem(item1[1], item1[0]));
                }
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm01":
                H_Message.Value = items[1];
                break;
            default:
                H_Message.Value = error[1];
                break;
        }
        H_Return.Value = "KD";
        return;
    }

    protected void kundenKarte (object sender, EventArgs e)
    {
        if (!CheckTermid()) return;
        string DatumVonBis = datVon.Text.Substring(0, 6) + datVon.Text.Substring(8, 2) + "-" +
                             datBis.Text.Substring(0, 6) + datBis.Text.Substring(8, 2);
        string AbschlDatumVonBis = datAbschlVon.Text.Substring(0, 6) + datAbschlVon.Text.Substring(8, 2) + "-" +
                                   datAbschlBis.Text.Substring(0, 6) + datAbschlBis.Text.Substring(8, 2);
        TxtRequest = "fisDVcrmKundenkarte" + (char)4 + "Name" + (char)5 + Session["TermidName"] + (char)6 +
                     "Beznr" + (char)5 + KkundBeznr.Text + (char)6 +
                     "DatumVonBis" + (char)5 + DatumVonBis + (char)6 +
                     "AbschlDatumVonBis" + (char)5 + AbschlDatumVonBis + (char)6 +
                     "Rowid" + (char)5 + KundKarteFormular.SelectedItem.Value + (char)6 +
                     "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Memos.Value = TxtReturn;
        H_Page.Value = "#kundenblatt";
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                items = items[1].Split(dlmtRec);
                H_Info.Value = items[1];
                createPDF(items[1],items[2]);
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm01":
                H_Message.Value = items[1];
                break;
            default:
                H_Message.Value = error[1];
                break;
        }
        H_Return.Value = "KD";
        return;
    }

    protected void createPDF(string fileName, string data)
    {
        FileStream lStream = null;
        try
        {
            lStream = new FileStream(Session["Temp"] + "\\" + fileName, FileMode.Create);
            BinaryWriter lWriter = new BinaryWriter(lStream);
            lWriter.Write(Convert.FromBase64String(data));
            lWriter.Flush();
            lWriter.Close();
        }
        finally
        {
            lStream.Close();
        }
    }

    /*
    protected void KundeDet(object sender, EventArgs e)
    {
        H_Zust.Value = "";
        H_KundRappO.Value = "";
        H_KundRappE.Value = "";
        
        TxtReturn = getZust("zust", "");
        if (TxtReturn == "error") return;
        H_Zust.Value = TxtReturn;
        
        TxtReturn = getKundRapp("O");	// offene
        if (TxtReturn == "error") return;
        TxtReturn = getKundRapp("E");	// erledigte
        if (TxtReturn == "error") return;

        getKundenKarteForm();
    }
    */

    protected string getZust(string mode, string KundBeznr)
    {
        if (!CheckTermid()) return "error";

        TxtRequest = "fisDVcrmZust" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Beznr" + (char)5 + KundBeznr + (char)6 + "Mode" + (char)5 + mode;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                break;
            case "02":
                H_Message.Value = "Keine gültige Berechtigung gefunden";
                return "error";
            case "crm02":
                //TxtMessage.Text = "Keine Zustände gefunden";
                break;
            case "crm09":
                H_Message.Value = "Fehler in Query";
                return "error";
            default:
                H_Message.Value = error[1];
                return "error";
        }
        return TxtReturn;
    }

    private void setDropDownListZust(string TxtReturn, DropDownList ddl, string Kontakt)
    {
        string cid = ddl.ID;
        ddl.Items.Clear();
        string[] itemsK;
        itemsK = TxtReturn.Split((char)7);
        int n_zust = itemsK.Length;
        bool l1 = false;
        for (var i1 = 1; i1 < n_zust; i1++)
        {
            string[] item1 = itemsK[i1].Split(dlmtRec);
            ddl.Items.Add(new ListItem(item1[7], item1[1]));
            ddl.Items[i1 - 1].Attributes.Add("title", item1[5]);

            if (Kontakt.StartsWith(item1[7])) l1 = true;
        }
        // falls die Kontaktperson nicht in den Zuständigen ist, in DropDownList addieren
        if ((!l1) && (Kontakt != ""))
            ddl.Items.Add(new ListItem(Kontakt, "0"));
        
        if (ddl.ID != "memo_Kontakt")
            ddl.Items.Add(new ListItem("Neue Kontaktperson", "NeueKontaktperson"));
    }

    protected string getKundRapp(string termin)
    {
        if (!CheckTermid()) return "error";

        TxtRequest = "fisDVcrmKundRapp" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 + "Termin" + (char)5 + termin + (char)6;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        if (termin == "O") H_KundRappO.Value = TxtReturn;
        if (termin == "E") H_KundRappE.Value = TxtReturn;
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                return "error";
            case "crm02":
                //TxtMessage.Text = "Keine historische Rapporten gefunden";
                break;
            case "crm09":
                H_Message.Value = "Fehler in Query";
                return "error";
            default:
                H_Message.Value = error[1];
                return "error";
        }
        return TxtReturn;
    }

    protected void beforeFazitK(object sender, EventArgs e)
    {
        // keine externe Kontaktperson im bestehenden mkrappor, weil der neue Eintrag erstellt wird
        //H_Kontakt.Value = "";

        // vor dem Wechsel auf die FAZIT-Seite (Kundendetails) müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust", "");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, fazit_RKontakt, "");
        H_Page.Value = "#fazitK";
        H_RowidH.Value = "RN";   // wird in der Procedure fisDVcrmFazit (fiobject-DV.p) getestet
    }

    protected void beforeEditHR(object sender, EventArgs e) 
    {
        // vor dem Wechsel auf die EDIT-Seite (Rapport-History für Kunden) müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust", "");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, edit_AKontakt, "");
        H_Page.Value = "#editHR";
    }

    protected void beforeFazitHR(object sender, EventArgs e) 
    {
        // vor dem Wechsel auf die FAZIT-Seite (Rapport-History für Kunden) müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust", "");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, fazit_RKontakt, "");
        H_Page.Value = "#fazitHR";
    }


    protected void Abmelden(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        TxtRequest = "fisExtAbmeld" + (char)4 + "Name" + (char)5 + Session["TermidName"] + (char)6 +
                     "Termid" + (char)5 + Session["Termid"] + (char)6 + "User-sprache" + (char)5 + "D";
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split(dlmtRec);
        switch (items[1])
        {
            case "00":
                break;
            case "01":
                TxtMessage.Text = "Abmeldung fehlerhaft";
                return;
            default:
                TxtMessage.Text = error[1];
                H_Message.Value = error[1];
                return;
        }

        H_Login.Value = "no";
        Benutzer.Text = "";
        H_Page.Value = "";
        H_TermineP.Value = "0";
        H_TermineN.Value = "1";
        Session.Abandon();
    }

    protected void TelMail(string Tel, Label TelID, string Mail, Label MailID, string typ)
    {
        string text;
        string[] rows;
        string[] TelTyp = new string[4];
        TelTyp[0] = "G:";
        TelTyp[1] = "D:";
        TelTyp[2] = "P:";
        TelTyp[3] = "M:";

        if (Tel != "")
        {
            TelID.Style.Add("display", "block");
            text = "";
            rows = Tel.Split((char)4);
            for (var i1 = 0; i1 < 4; i1++) {
                if (rows[i1] != "" && i1 != 2) {
                    if (i1 > 0) text += " ";
                    text += TelTyp[i1] + rows[i1];
                    if (typ == "1") text += "<br />";
                }
            }
        
            TelID.Text = text;
        }
        else TelID.Style.Add("display", "none");

        if (Mail != "") {
            MailID.Style.Add("display", "block");
            MailID.Text = Mail.Split((char)4)[0];
        } else {
            MailID.Text = "<br />";
        }
    }

}

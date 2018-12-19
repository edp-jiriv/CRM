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
	DateTime today;

    protected void Page_Load(object sender, EventArgs e)
    {
        H_ASPX.Value = "true";
		today = DateTime.Today;
        if (!Page.IsPostBack)
        {
            Session["Firma"] = ConfigurationManager.AppSettings["Firma"];
            H_TermineD.Value = today.ToString("dd.MM.yyyy");
            TermineD.Text = H_TermineD.Value;
            getMandant();
        }
    }

    protected void initLogin()
    {
        H_Page.Value = "#login";

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
        if ("" + Session["Termid"] == "")
        {
            TxtMessage.Text = "Sie müssen sich neu anmelden (Timeout von Session)";
            H_Page.Value = "#login";
            H_Login.Value = "";
            return false;
        }
        else
            return true;
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
    protected void validTermid(object sender, EventArgs e)
    {
        initLogin();

        TxtRequest = "fisExtAnmeld" + (char)4 +
                     "Termid" + (char)5 + H_Login.Value.Split((char)5)[0] + (char)6 +
                     "Email" + (char)5 + H_Login.Value.Split((char)5)[1];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        if (error[1] == "00")
        {
            start();
        }
        else
            H_Login.Value = "";

        return;
    }

    protected void Anmelden(object sender, EventArgs e)
    {
        initLogin();

        // bei der Anmeldung nach Timeout ist H_Login.Value == "yes"
        H_Login.Value = "";

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
		Benutzer.Text = items[17];

        TxtReturn = getMitarbeiter();
        if (TxtReturn == "error") return;

        TxtReturn = getAktiv();
        if (TxtReturn == "error") return;

        setDropDownLists();

        TxtReturn = getDefault();
        if (TxtReturn == "error") return;

        setFormUmsatz();

        items = TxtReturn.Split((char)7);
        items = items[1].Split(dlmtRec);
        H_Default.Value = items[1] + (char)5 + items[3] + (char)5 + items[5];
        //fazit_TermText.Text = items[3];

        // falls kein Fehler, wird die Seite "review" geöffnet
        TxtReturn = getRapports();
        if (TxtReturn == "error") return;

        H_Login.Value = "" + Session["Termid"] + (char)5 + Session["Email"];
    }

    private void setDropDownLists()
    {
        // setzt DropDownList für die Aktivitäten
        edit_RappAktiv.Items.Clear();
        edit_TermAktiv.Items.Clear();
        fazit_RappAktiv.Items.Clear();
        fazit_TermAktiv.Items.Clear();

        string[] itemsA;
        string[] item1;
        itemsA = TxtReturn.Split((char)7);
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
        Session["User-id"] = items[5];
        H_Mitbeznr.Value = (string)Session["Mitbeznr"];

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

    protected void setFormUmsatz()
    {
        UmsatzJahr.Items.Clear();
        string c_year = today.ToString("yyyy");
        int i_year = Convert.ToInt32(c_year);
        UmsatzJahr.Items.Add(new ListItem((i_year - 1).ToString(), "0"));
        UmsatzJahr.Items.Add(new ListItem(c_year, "1"));
        UmsatzJahr.Items.Add(new ListItem((i_year + 1).ToString(), "2"));
        UmsatzJahr.SelectedValue = "1";
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
                H_Rapport.Value = TxtReturn;
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                return "error";
            case "crm02":
                H_Info.Value = "Keine Rapporte gefunden";
                H_Rapport.Value = "";
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

    // wird gestartet wenn man auf der Seite Termine oder Kundendetails einen Rapport wählt
    protected void getHistory(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        if (H_Return.Value == "T")
        {
            H_Page.Value = "#detail";
            cRowid = H_Rowid.Value;
        }
        else // H_Return.Value == "TD" || H_Return.Value == "KD"
        {
            H_Page.Value = "#rappdetail";
            cRowid = H_RowidH.Value;
        }


        TxtRequest = "fisDVcrmRappHist" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Mitbeznr" + (char)5 + Session["Mitbeznr"] + (char)6 +
                     "Rowid" + (char)5 + cRowid + (char)6;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                if (H_Return.Value == "T")
                    H_History.Value = TxtReturn;
                else
                    H_HistoryDet.Value = TxtReturn;
                break;
            case "02":
                H_Message.Value = "Keine gültige Berechtigung gefunden";
                return;
            case "crm02":
                H_Message.Value = "Eintrag in mkrappor nicht gefunden";
                return;
            case "crm03":
                //TxtMessage.Text = "Keine historische Rapporten gefunden";
                H_History.Value = TxtReturn;
                break;
            case "crm09":
                H_Message.Value = "Fehler in Query";
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        getKundenKarteForm();
        return;
    }

    protected void Refresh(object sender, EventArgs e)
    {
        H_Page.Value = "#review";
        getRapports();
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


    protected void beforeEdit(object sender, EventArgs e)
    {
        // vor dem Wechsel auf die EDIT-Seite müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, edit_RKontakt);
        setDropDownListZust(TxtReturn, edit_AKontakt);
        H_Zust.Value = TxtReturn;
        H_Page.Value = "#edit";
    }

    protected void beforeFazit(object sender, EventArgs e)
    {
        // vor dem Wechsel auf die FAZIT-Seite müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, fazit_RKontakt);
        setDropDownListZust(TxtReturn, fazit_AKontakt);
        H_Page.Value = "#fazit";
    }

    protected void saveRapport(object sender, EventArgs e)
    {
        string kpR = string.Empty;
        string kp = string.Empty;
        string termZeit = string.Empty;

        if (!CheckTermid()) return;

        if (H_Return.Value == "TD")
        {
            cRowid = H_Rowid.Value;
        }
        else // H_Return.Value == "TH" || H_Return.Value == "KH" || H_Return.Value == "KD"
        {
            // für H_Return.Value == "KD" hat cRowid den Wert = "RN" (neues Fazit)
            // siehe die Methode beforeFazitK
            cRowid = H_RowidH.Value;
        }

        if (H_Fazit.Value == "true")
        {
            // Fazit
            if (fazit_RKontaktNew.Text != "")
                kpR = "KontaktR" + (char)5 + (fazit_RKontaktNew.Text.Length <= 60 ? fazit_RKontaktNew.Text : fazit_RKontaktNew.Text.Substring(0, 60));
            else
            {
                if (fazit_RKontakt.SelectedItem.Value != "0" && fazit_RKontakt.SelectedItem.Value != "N")
                    kpR = "KontaktBeznrR" + (char)5 + fazit_RKontakt.SelectedItem.Value + (char)6 +
                          "KontaktR" + (char)5 + fazit_RKontakt.SelectedItem.Text;
                else
                    kpR = "KontaktR" + (char)5 + fazit_RKontakt.SelectedItem.Text;
            }

            if (fazit_AKontaktNew.Text != "")
                kp = "Kontakt" + (char)5 + (fazit_AKontaktNew.Text.Length <= 60 ? fazit_AKontaktNew.Text : fazit_AKontaktNew.Text.Substring(0, 60));
            else
            {
                if (fazit_AKontakt.SelectedItem.Value != "0" && fazit_AKontakt.SelectedItem.Value != "N")
                    kp = "KontaktBeznr" + (char)5 + fazit_AKontakt.SelectedItem.Value + (char)6 +
                         "Kontakt" + (char)5 + fazit_AKontakt.SelectedItem.Text;
                else
                    kp = "Kontakt" + (char)5 + fazit_AKontakt.SelectedItem.Text;
            }

            if (fazit_TermZeit.Text != "")
                termZeit = fazit_TermZeit.Text.Substring(0, 2) + fazit_TermZeit.Text.Substring(3, 2);
            else
                termZeit = "";

            TxtRequest = "fisDVcrmFazit" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                         "Name" + (char)5 + Session["UserIdent"] + (char)6 +
                         "Mitbeznr" + (char)5 + Session["Mitbeznr"] + (char)6 + "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 +
                         "RappDatum" + (char)5 + fazit_RappDatum.Text + (char)6 + "RappZeit" + (char)5 + fazit_RappZeit.Text.Substring(0, 2) + fazit_RappZeit.Text.Substring(3, 2) + (char)6 +
                         "RappAktivid" + (char)5 + fazit_RappAktiv.Text + (char)6 +
                         "RappText" + (char)5 + (fazit_RappText.Text.Length <= 20000 ? fazit_RappText.Text : fazit_RappText.Text.Substring(0, 20000)) + (char)6 +
                         kpR + (char)6 + kp + (char)6 + "TermDatum" + (char)5 + fazit_TermDatum.Text + (char)6 +
                         "TermZeit" + (char)5 + termZeit + (char)6 +
                         "TermAktivid" + (char)5 + fazit_TermAktiv.Text + (char)6 +
                         "TermText" + (char)5 + (fazit_TermText.Text.Length <= 5000 ? fazit_TermText.Text : fazit_TermText.Text.Substring(0, 5000)) + (char)6 +
                         "Rowid" + (char)5 + cRowid + (char)6;
            H_Page.Value = "#fazit";
        }
        else
        {
            // Edit
            if (edit_RKontaktNew.Text != "")
                kpR = "KontaktR" + (char)5 + (edit_RKontaktNew.Text.Length <= 60 ? edit_RKontaktNew.Text : edit_RKontaktNew.Text.Substring(0, 60));
            else
            {
                if (edit_RKontakt.SelectedItem.Value != "0" && edit_RKontakt.SelectedItem.Value != "N")
                    kpR = "KontaktBeznrR" + (char)5 + edit_RKontakt.SelectedItem.Value + (char)6 +
                          "KontaktR" + (char)5 + edit_RKontakt.SelectedItem.Text;
                else
                    kpR = "KontaktR" + (char)5 + edit_RKontakt.SelectedItem.Text;
            }

            if (edit_AKontaktNew.Text != "")
                kp = "Kontakt" + (char)5 + (edit_AKontaktNew.Text.Length <= 60 ? edit_AKontaktNew.Text : edit_AKontaktNew.Text.Substring(0, 60));
            else
            {
                if (edit_AKontakt.SelectedItem.Value != "0" && edit_AKontakt.SelectedItem.Value != "N")
                    kp = "KontaktBeznr" + (char)5 + edit_AKontakt.SelectedItem.Value + (char)6 +
                         "Kontakt" + (char)5 + edit_AKontakt.SelectedItem.Text;
                else
                    kp = "Kontakt" + (char)5 + edit_AKontakt.SelectedItem.Text;
            }

            TxtRequest = "fisDVcrmEdit" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                         "Name" + (char)5 + Session["UserIdent"] + (char)6 +
                         "RappDatum" + (char)5 + edit_RappDatum.Text + (char)6 + "RappZeit" + (char)5 + edit_RappZeit.Text.Substring(0, 2) + edit_RappZeit.Text.Substring(3, 2) + (char)6 +
                         "RappAktivid" + (char)5 + edit_RappAktiv.Text + (char)6 +
                         "RappText" + (char)5 + (edit_RappText.Text.Length <= 20000 ? edit_RappText.Text : edit_RappText.Text.Substring(0, 20000)) + (char)6 +
                         kpR + (char)6 + kp + (char)6 + "TermDatum" + (char)5 + edit_TermDatum.Text + (char)6 +
                         "TermZeit" + (char)5 + edit_TermZeit.Text.Substring(0, 2) + edit_TermZeit.Text.Substring(3, 2) + (char)6 +
                         "TermAktivid" + (char)5 + edit_TermAktiv.Text + (char)6 +
                         "TermText" + (char)5 + (edit_TermText.Text.Length <= 5000 ? edit_TermText.Text : edit_TermText.Text.Substring(0, 5000)) + (char)6 +
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
        }

        if (H_Return.Value == "TD" || H_Return.Value == "TH")
        {
            H_Page.Value = "#review";
            H_Return.Value = "";
            getRapports();
        }
        else
        {   // H_Return.Value == "KH" || H_Return.Value == "KD"
            H_Page.Value = "#kundendetail";
            H_Return.Value = "K";
            getRapports();
            getKundDet(sender, e);
        }
        return;
    }


    protected void getUmsatz(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;
        TxtRequest = "fisDVcrmUmsatz" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 +
                     "Jahr" + (char)5 + UmsatzJahr.SelectedItem.Text;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        
        H_Page.Value = "#umsatz";
        if (H_Return.Value == "KD") H_Page.Value = "#umsatzK";
        if (H_Return.Value == "TH" || H_Return.Value == "KH") H_Page.Value = "#umsatzHR";

        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Message.Value = "";
                H_Umsatz.Value = TxtReturn;
                break;
            case "02":
                H_Message.Value = "Keine gültige Berechtigung gefunden";
                return;
            case "crm02":
                H_Message.Value = "Eintrag in mkrappor für ROWID nicht gefunden";
                return;
            case "crm03":
                H_Message.Value = "Kein Umsatz gefunden";
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


    protected void getKundenSuchen(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

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
                H_Kunden.Value = TxtReturn;
                break;
        }
        H_Return.Value = "T";
        return;
    }

    protected void getKundenKarteForm()
    {
        // Stellt die registrierte Formulare fest
        if (!CheckTermid()) return;

        KundKarteFormular.Items.Clear();
        TxtRequest = "fisDVcrmKundenkarteForm" + (char)4 + "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        //H_Page.Value = "#kundendetail";
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
        return;
    }

    protected void kundenKarte (object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        if (H_Return.Value == "T")
            H_Return.Value = "TD";
        else
            H_Return.Value = "KD";

        string DatumVonBis = datVon.Text.Substring(0, 6) + datVon.Text.Substring(8, 2) + "-" +
                             datBis.Text.Substring(0, 6) + datBis.Text.Substring(8, 2);
        string AbschlDatumVonBis = datAbschlVon.Text.Substring(0, 6) + datAbschlVon.Text.Substring(8, 2) + "-" +
                                   datAbschlBis.Text.Substring(0, 6) + datAbschlBis.Text.Substring(8, 2);
        TxtRequest = "fisDVcrmKundenkarte" + (char)4 + "Name" + (char)5 + Session["UserIdent"] + (char)6 +
                     "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 +
                     "DatumVonBis" + (char)5 + DatumVonBis + (char)6 +
                     "AbschlDatumVonBis" + (char)5 + AbschlDatumVonBis + (char)6 +
                     "Rowid" + (char)5 + KundKarteFormular.SelectedItem.Value + (char)6 +
                     "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        // H_Memos.Value = TxtReturn;
        // H_Page.Value = "#detail" oder "#kundendetail"
        H_Page.Value = "kundenblatt" + H_Page.Value;
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
        return;
    }

    protected void createPDF(string fileName, string data)
    {
        FileStream lStream = null;
        try
        {
            string c1 = Session["Temp"] + "\\" + fileName;
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


    protected void getKundDet(object sender, EventArgs e)
    {
        H_Zust.Value = "";
        H_KundRappO.Value = "";
        H_KundRappE.Value = "";
        
        TxtReturn = getZust("zust");
        if (TxtReturn == "error") return;
        H_Zust.Value = TxtReturn;
        
        TxtReturn = getKundRapp("O");	// offene
        if (TxtReturn == "error") return;
        TxtReturn = getKundRapp("E");	// erledigte
        if (TxtReturn == "error") return;

        getKundenKarteForm();
    }

    protected string getZust(String mode)
    {
        if (!CheckTermid()) return "error";

        TxtRequest = "fisDVcrmZust" + (char)4 + "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 + "Mode" + (char)5 + mode;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Page.Value = "#kundendetail";
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

    private void setDropDownListZust(string TxtReturn, DropDownList ddl)
    {
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

            if (H_Kontakt.Value.StartsWith(item1[7])) l1 = true;
        }
        // falls die Kontaktperson nicht in den Zuständigen ist, in DropDownList addieren
        if ((!l1) && (H_Kontakt.Value != ""))
            ddl.Items.Add(new ListItem(H_Kontakt.Value, "0"));
        
        if (ddl.ID != "memo_Kontakt")
            ddl.Items.Add(new ListItem("Neue Kontaktperson", "N"));
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
        H_Kontakt.Value = "";

        // vor dem Wechsel auf die FAZIT-Seite (Kundendetails) müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, fazit_RKontakt);
        setDropDownListZust(TxtReturn, fazit_AKontakt);
        H_Page.Value = "#fazitK";
        H_RowidH.Value = "RN";   // wird in der Procedure fisDVcrmFazit (fiobject-DV.p) getestet
    }

    protected void beforeEditHR(object sender, EventArgs e) 
    {
        // vor dem Wechsel auf die EDIT-Seite (Rapport-History für Kunden) müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, edit_RKontakt);
        setDropDownListZust(TxtReturn, edit_AKontakt);
        H_Page.Value = "#editHR";
    }

    protected void beforeFazitHR(object sender, EventArgs e) 
    {
        // vor dem Wechsel auf die FAZIT-Seite (Rapport-History für Kunden) müssen die Zuständige festgestellt werden
        TxtReturn = getZust("zust");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, fazit_RKontakt);
        setDropDownListZust(TxtReturn, fazit_AKontakt);
        H_Page.Value = "#fazitHR";
    }

    // wird in readMemos() aufgerufen
    protected void beforeMemo()
    {
        // vor dem Wechsel auf die MEMO-Seite müssen die Zuständige festgestellt werden
        TxtReturn = getZust("all");
        if (TxtReturn == "error") return;

        setDropDownListZust(TxtReturn, memo_Kontakt);
    }

    protected void readMemos() {
        if (!CheckTermid()) return;

        TxtRequest = "fisDVcrmGetMemos" + (char)4 + "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 + "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Memos.Value = TxtReturn;
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                beforeMemo();
                H_Page.Value = "#memosr";
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

        String beznr = "";
        if (H_RowidMemo.Value == "MN") beznr = memo_Kontakt.SelectedItem.Value;

        TxtRequest = "fisDVcrmSaveMemo" + (char)4 + "Beznr" + (char)5 + beznr + (char)6 +
                     "Name" + (char)5 + Session["UserIdent"] + (char)6 + 
                     "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Rowid" + (char)5 + H_RowidMemo.Value + (char)6 +
                     "Text" + (char)5 + memosd_TermText.Text + (char)6;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Memos.Value = TxtReturn;
        H_Page.Value = "#memosr";
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

        TxtRequest = "fisDVcrmDelMemo" + (char)4 + 
                     "Termid" + (char)5 + Session["Termid"] + (char)6 +
                     "Rowid" + (char)5 + H_RowidMemo.Value + (char)6;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_Memos.Value = TxtReturn;
        H_Page.Value = "#memosr";
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

    protected void getDokumente(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        TxtRequest = "fisDVcrmListDateien" + (char)4 + "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 + "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        //H_Dokumente.Value = TxtReturn;
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Page.Value = "dokumente";
                string PathName = showDokumente(TxtReturn);
                if (PathName != "") {
                    H_DokuDownload.Value = "doc1" + (char)5 + PathName;
                    getDwnlShow(sender, e);
                }
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm02":
                H_Message.Value = "Pfad für die Dokumente nicht gefunden" + (char)10 +
                                  "siehe Protokoll";
                showDokumente(TxtReturn);
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected string showDokumente(string values) {
        string[] itemsRec;
        string c_dok;
        string PathName = string.Empty;
        itemsRec = values.Split((char)7);
        int n_dok = itemsRec.Length - 1;
        int n_items = 0;

        if (n_dok != 0)
        {
            //c_dok = "<table data-role='table' border='1' style='margin-left:auto;margin-right:auto;border-collapse:collapse'>";
            c_dok = "<table data-role='table' border='1' style='border-collapse:collapse'>";
            for (int i1 = 1; i1 <= n_dok; i1++)
            {
                items = itemsRec[i1].Split((char)3);
                n_items = items.Length - 1;
                c_dok += "<tr style='color:black;background-color:#dddddd'>";
                c_dok += "<td style='padding: 8px;'><a id='doc" + i1 +
                         "' href=\"javascript:fileDwnlShow('doc" + i1 + "','" + itemsRec[i1] + "')\"; style='color:grey;text-decoration:none;font-weight:100'>" +
                         items[n_items] + "</a></td>";
                c_dok += "</tr>";
            }
            c_dok += "</table>";
            c_dok += "<a id='docs' target='_blank' data-role='button' style='color:black;text-decoration:none;font-weight:100'>Darstellen</a>";
            c_dok += "<a id='docd' data-role='button' style='color:black;text-decoration:none;font-weight:100'>Download</a>";
            PathName = itemsRec[1];
        }
        else
            c_dok = "Es gibt keine Dokumente";

        dokumente_files.Text = c_dok;
        return PathName;
    }

    protected void getDwnlShow(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;
        
        string dokument = H_DokuDownload.Value.Split((char)5)[1];
        
        // H_Dokument.Value wird in der Funktion fileDwnlShow (CRM-func.js) gesetzt
        TxtRequest = "fisDVcrmGetDatei" + (char)4 + "Dokument" + (char)5 + dokument + (char)6 + "Termid" + (char)5 + Session["Termid"];
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        H_DokuDownload.Value = H_DokuDownload.Value + (char)7 + TxtReturn;
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Page.Value = "dokumenteSD";
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm02":
                H_Message.Value = "Dokument nicht gefunden";
                H_Page.Value = "#detail";
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected void fileUpld(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        string dokument = H_DokuUpload.Value.Split((char)5)[0];
        string dokubin = H_DokuUpload.Value.Split((char)5)[1];

        TxtRequest = "fisDVcrmPutDatei" + (char)4 + "Beznr" + (char)5 + H_Kundbeznr.Value + (char)6 +
                     "Termid" + (char)5 + Session["Termid"] + (char)6 + "DokuBin" + (char)5 + dokubin + (char)6 +
                     "Dokument" + (char)5 + dokument;
        TxtReturn = MessageRest.SendMessage(TxtRequest);
        //H_Dokumente.Value = TxtReturn;
        items = TxtReturn.Split((char)7);
        error = items[0].Split(dlmtError);
        switch (error[1])
        {
            case "crm00":
                H_Page.Value = "dokumente";
                getDokumente(sender, e);
                break;
            case "02":
                TxtMessage.Text = "Keine gültige Berechtigung gefunden";
                H_Message.Value = "error";
                H_Page.Value = "#login";
                return;
            case "crm02":
                H_Message.Value = "Pfad für die Dokumente nicht gefunden" + (char)10 +
                                  "siehe Protokoll";
                return;
            default:
                H_Message.Value = error[1];
                return;
        }
        return;
    }

    protected void Abmelden(object sender, EventArgs e)
    {
        if (!CheckTermid()) return;

        TxtRequest = "fisExtAbmeld" + (char)4 + "Name" + (char)5 + Session["UserIdent"] + (char)6 +
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
        //Session.Abandon();
    }
}

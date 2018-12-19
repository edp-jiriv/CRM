/* CRM-filters.js */

$('#searchTerm').live('keyup', function () {
    filterTerm("#searchTerm", ".LW_Term");
});

$('#searchHist').live('keyup', function () {
    filterLi("#searchHist", ".LW_Hist");
});

$('#searchKund').live('keyup', function () {
    filterLi("#searchKund", ".LW_Kund");
});

$('#searchZust').live('keyup', function () {
    filterLi("#searchZust", ".LW_Zust");
});

$('#searchKundRappO').live('keyup', function () {
    filterLi("#searchKundRappO", ".LW_RappO");
});

$('#searchKundRappE').live('keyup', function () {
    filterLi("#searchKundRappE", ".LW_RappE");
});

// Clear von Filter mit dem Button
$('.ui-input-clear').live('click', function () {
    // parent vom <a> element mit clear Button
    var parent = $(this).parent();
    // children sind: <input> element für das Suchen und <a> element
    var children = parent.children();

    children.each(function (index) {
        //alert("children" + $(this).attr("class"));
        if ($(this).attr("id") == "searchTerm") {
            $('.LW_Term .el-li').each(function (index) {
                $(this).show();
            });
        }
        if ($(this).attr("id") == "searchHist") {
            $('.LW_Hist .el-li').each(function (index) {
                $(this).show();
            });
        }
        if ($(this).attr("id") == "searchKund") {
            $('.LW_Kund .el-li').each(function (index) {
                $(this).show();
            });
        }
        if ($(this).attr("id") == "searchZust") {
            $('.LW_Zust .el-li').each(function (index) {
                $(this).show();
            });
        }
        if ($(this).attr("id") == "searchKundRappO") {
            $('.LW_RappO .el-li').each(function (index) {
                $(this).show();
            });
        }
        if ($(this).attr("id") == "searchKundRappE") {
            $('.LW_RappE .el-li').each(function (index) {
                $(this).show();
            });
        }
    });
});

function filterTerm(search, u_list) {
    var i2;
    var c1;
    var l1;
    var l2 = false;
    searchValue = $(search).val().toUpperCase();
    if (searchValue == ' ') {
        $(u_list).each(function (index) {
            $(this).show();
        });

        return '';
    }

    for (var i1 = 0; i1 < n_rapp; i1++) {
        l1 = true;
        c1 = rapporte[i1].Kontakt;
        c1 = c1.toUpperCase();
        i2 = c1.search(searchValue);
        if (i2 == -1) {
            c1 = rapporte[i1].Name;
            c1 = c1.toUpperCase();
            i2 = c1.search(searchValue);
            if (i2 == -1) {
                c1 = rapporte[i1].Ort;
                c1 = c1.toUpperCase();
                i2 = c1.search(searchValue);
                if (i2 == -1) {
                    c1 = rapporte[i1].TermText.substr(0, 40);
                    c1 = c1.toUpperCase();
                    i2 = c1.search(searchValue);
                    if (i2 == -1) l1 = false;
                }
            }
        }
        // entsprechende Items in ListView darstellen oder verbergen und
        // den Wert des Attributes je nach dem setzen
        if (l1 == true) {
            $(u_list + " [name=li" + i1 + "]").show();
            $(u_list + " [name=li" + i1 + "]").attr('show', '1');
        }
        else {
            $(u_list + " [name=li" + i1 + "]").hide();
            $(u_list + " [name=li" + i1 + "]").attr('show', '0');
        }
    }

    // Alle Elemente mit class = "el-li" durchnehmen und die List-Dividers
    // mit keinen Elementen entfernen 
    c1 = '';
    $(u_list + ' .el-li').each(function (index) {
        // List-Divider
        if ($(this).attr("name").search('lid') == 0) {
            if (c1 != '') {
                if (l2 == true)
                    $(u_list + ' [name=' + c1 + ']').show();
                else
                    $(u_list + ' [name=' + c1 + ']').hide();
            }

            c1 = $(this).attr("name");  // id vom Divider speichern
            l2 = false;
        }
        // List-Item
        else {
            // l2 = true ... sichtbares List-Item
            if ($(this).attr("show") == '1') l2 = true;
        }
    });

    if (c1 != '') {
        if (l2 == true)
            $(u_list + ' [name=' + c1 + ']').show();
        else
            $(u_list + ' [name=' + c1 + ']').hide();
    }

};

function filterLi(search, u_list) {
    searchValue = $(search).val().toUpperCase();
    if (searchValue == ' ') {
        $(u_list).each(function (index) {
            $(this).show();
        });

        return '';
    }

    switch (search) {
        case "#searchHist":
            filterKundRapp(searchValue, "#liHistory");
            break;

        case "#searchKund":
            filterKundRapp(searchValue, "#liKund");
            break;

        case "#searchZust":
            filterKundRapp(searchValue, "#liZust");
            break;

        case "#searchKundRappO":
            filterKundRapp(searchValue, "#liKundRappO");
            break;

        case "#searchKundRappE":
            filterKundRapp(searchValue, "#liKundRappE");
            break;
    }
};

function filterKundRapp(searchValue, u_list) {
    var children = $(u_list).children();
    children.each(function (index) {
        var child = $(this);
        var values = $(this).find(".el-search-value");
        var l1 = false;
        values.each(function (index) {
            var i1 = $(this).html().toUpperCase().search(searchValue);
            if (i1 != -1) {
                l1 = true;
                return;
            }
        });
        if (l1 == true) {
            child.show();
        }
        else {
            child.hide();
        }
    });
}

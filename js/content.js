chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (!sender) {
        return;
    }

    if (request.command === "indir") {

        //region Excel >> Variable

        var basliklar = {};
        var baslikAdet = 0;
        var okul = "";
        var sinif = "";
        var ders = "";
        var ogretmen = "";
        var sinifListesi = [];

        if (request.url.includes("IlkOgretim")) {
            okul = $("#IOMPageHeader1_lblKurumIlIlce").text().trim();
            sinif = $("#ddlSinifiSubesi option:selected").text();
            ders = $("#ddlDersler option:selected").text();
            ogretmen = $("#IOMPageHeader1_lblKisi").text().trim();
        } else if (request.url.includes("OrtaOgretim")) {
            okul = $("#OOMPageHeader1_lblKurumIlIlce").text().trim();
            sinif = $("#Us_SinifSube1_ddlSinifSube option:selected").text()
                .replace("(- )", "")
                .replace(/\s\s\s/g, " ")
                .replace(/\s\s/g, " ");
            ders = $("#ddlDersler option:selected").text();
            ogretmen = $("#OOMPageHeader1_lblKisi").text().trim();
        }

        //endregion

        //region Excel >> Create Object

        $("#dgListem tbody tr")
            .each(function (satir) {

                var ogrenci = {};

                if (satir === 0) {

                    baslikAdet = 0;

                    $(this)
                        .find("td")
                        .each(function (kolon) {

                            var text = $(this).text().trim();

                            if (text && text.length > 0 && !basliklar.hasOwnProperty(kolon.toString())) {
                                basliklar[kolon.toString()] = {
                                    key: text.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, ''),
                                    value: text
                                };
                                baslikAdet++;
                            }

                        })

                } else {

                    $(this)
                        .find("td")
                        .each(function (kolon) {

                            var text = $(this).text().trim();
                            var textBox = $(this).find("input[type=text]");
                            var checkBox = $(this).find("input[type=checkbox]");
                            var value = "";

                            if (text.length > 0) value = text;
                            else if (textBox.length > 0) value = textBox.val().toString();
                            else if (checkBox.length > 0) value = checkBox.is(":checked") ? "Evet" : "Hayır";
                            else value = "";

                            if (basliklar[kolon.toString()]) {
                                ogrenci[basliklar[kolon.toString()].key] = value;
                            }

                        });

                    sinifListesi.push(ogrenci);

                }

            });

        //endregion

        //region Excel >> Create

        var excel = $JExcel.new("Calibri");

        excel.set({sheet: 0, value: "SD"});

        //endregion

        //region Excel >> Header

        for (var i = 0; i < baslikAdet + 1; i++) {
            excel.set(0, i, 0, "", excel.addStyle({font: "14 #ffffff B", fill: "#d70001", align: "C B"}));
            excel.set(0, i, 1, "", excel.addStyle({font: "18 #ffffff B", fill: "#d70001", align: "C C"}));
            excel.set(0, i, 2, "", excel.addStyle({font: "14 #ffffff B", fill: "#d70001", align: "C T"}));
        }

        excel.set({row: 0, value: 30});
        excel.set({row: 1, value: 20});
        excel.set({row: 2, value: 30});

        excel.set(0, 0, 0, okul, undefined, baslikAdet + 1);
        excel.set(0, 0, 1, ders, undefined, baslikAdet + 1);
        excel.set(0, 0, 2, sinif, undefined, baslikAdet + 1);

        //endregion

        //region Excel >> Column Caption

        var columnIndex = 1;
        excel.set(0, 0, 3, "SIRA");
        for (var baslik in basliklar) {
            excel.set(0, columnIndex++, 3, basliklar[baslik].value.toUpperCase());
        }

        for (var i = 0; i < baslikAdet + 1; i++) {

            var dataCellStyle = null;
            var dataCellAlign = "C C";

            if (i === 2) {
                dataCellAlign = "L C";
            }

            dataCellStyle = excel.addStyle({font: "12 #d70001 B", fill: "#ebebeb", align: dataCellAlign});

            excel.set(0, i, 3, undefined, dataCellStyle);
        }

        excel.set({row: 3, value: 30});

        columnIndex = 1;
        excel.set(0, 0, undefined, 7);
        for (var baslik in basliklar) {

            var columnWidth = 10;

            if (basliklar[baslik].value.includes("Okul")) {
                columnWidth = 11;
            } else if (basliklar[baslik].value.includes("Adı")) {
                columnWidth = 35;
            } else if (basliklar[baslik].value.includes("Et.Kat")) {
                columnWidth = 16;
            } else if (basliklar[baslik].value.includes("Proje-Ders")) {
                columnWidth = 23;
            }

            excel.set(0, columnIndex++, undefined, columnWidth);
        }

        //endregion

        //region Excel >> Column Value

        for (var i = 0; i < sinifListesi.length; i++) {

            var ogrenci = sinifListesi[i];

            excel.set(0, 0, i + 4, i + 1);

            columnIndex = 1;
            for (var baslik in basliklar) {
                excel.set(0, columnIndex++, i + 4, ogrenci[basliklar[baslik].key]);
            }

        }

        for (var r = 0; r < sinifListesi.length; r++) {
            for (var c = 0; c < baslikAdet + 1; c++) {

                var dataCellStyle = null;
                var dataCellFont = "11 #000000";
                var dataCellAlign = "C C";

                if (c === 2) {
                    dataCellAlign = "L C";
                } else if (c > 2) {
                    dataCellFont = "11 #000000 B";
                }

                dataCellStyle = r % 2 === 0 ? excel.addStyle({
                    fill: "#d7d7d7",
                    align: dataCellAlign,
                    font: dataCellFont
                }) : excel.addStyle({
                    fill: "#ebebeb",
                    align: dataCellAlign,
                    font: dataCellFont
                });

                excel.set(0, c, r + 4, undefined, dataCellStyle);
            }
        }

        //endregion

        //region Excel >> Download

        var fileName = "";

        fileName = sinif.substring(0, sinif.indexOf('-'));
        fileName += " - ";
        fileName += sinif.substring(sinif.indexOf('-') + 1, sinif.indexOf('/'));
        fileName += " - ";
        fileName += sinif.substring(sinif.indexOf('/') + 1);
        fileName += " - ";
        fileName += ders;
        fileName = fileName.replace(/\s\s\s/g, " ").replace(/\s\s/g, " ");
        fileName += ".xlsx";

        excel.generate(fileName);

        //endregion

        //region Excel >> Response

        sendResponse({message: "Sınıf listesi indirildi."});

        //endregion

    } else if (request.command === "oku") {
        $('#gradeFile').trigger('click');
    }

    return true;

});
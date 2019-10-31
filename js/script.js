//region Script >> Definition

String.prototype.trToLowerCase = function () {

    var string = this;
    var letters = {"İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç"};

    string = string.replace(/(([İIŞĞÜÇÖ]))/g, function (letter) {
        return letters[letter];
    });

    return string.toLowerCase();

};

//endregion

//region Script >> Add

function addCss() {

    $("#dgListem tbody tr")
        .each(function (satir) {
            $(this)
                .find("td")
                .each(function (kolon) {

                    var input = $(this).find("input");

                    input.css("border-radius", "0");
                    input.css("margin", "0");
                    input.css("padding", "0");
                    input.css("font-size", "14px");
                    input.css("line-height", "20px");
                    input.css("text-align", "center");

                    input.addClass("oku-input-grade");

                })
        })

}

function addBlankCss(input) {

    input.css("background", "rgba(206, 0, 0, 0.1)");
    input.css("border-color", "rgb(206, 0, 0)");

    if (!input.hasClass("input-grade-blank"))
        input.addClass("input-grade-blank");

}

function addFilledCss(input) {

    input.css("background", "rgba(28, 150, 0, 0.1)");
    input.css("border-color", "rgb(28, 150, 0)");

    if (!input.hasClass("input-grade-filled"))
        input.addClass("input-grade-filled");

}

function clearCss() {
    $("#dgListem tbody tr input").removeClass("input-grade-blank input-grade-filled");
}

//endregion

//region Script >> Create

function createInput() {

    var input = document.createElement("input");

    input.setAttribute('id', "gradeFile");
    input.setAttribute('type', "file");
    input.setAttribute('style', "opacity: 0; pointer-events: none; z-index: -9999;");
    input.addEventListener("change", readFile, false);

    document.body.appendChild(input);

}

//endregion

//region Script >> Read

function readFile(event) {

    var files = event.target.files;

    for (var i = 0, f; (f = files[i]); i++) {

        var reader = new FileReader();

        reader.onloadend = function () {

            var mark = ";base64,";
            var base64Index = reader.result.indexOf(mark) + mark.length;
            var raw = reader.result.substring(base64Index);
            var workbook = XLSX.read(raw, {type: "base64"});
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
            var range = XLSX.utils.decode_range(worksheet["!ref"]);

            var sinif = {};

            var eBasliklar = {"0": "sıra", "1": "okulno"};
            for (var c = 2; c < range.e.c; c++) {

                var eBaslik = worksheet[XLSX.utils.encode_cell({r: 3, c: c})];
                eBaslik = eBaslik && eBaslik.v && eBaslik.v.toString().trim().length > 0 ? eBaslik.v.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').trToLowerCase() : null;

                if (eBaslik) {
                    eBasliklar[c.toString()] = eBaslik;
                }
            }

            for (var r = 4; r <= range.e.r; r++) {

                var okulNo = worksheet[XLSX.utils.encode_cell({r: r, c: 1})];
                okulNo = okulNo && okulNo.v && okulNo.v.toString().trim().length > 0 ? okulNo.v : null;

                if (okulNo) {

                    var ogrenci = {};

                    $.each(eBasliklar, function (baslikSira) {

                        if (parseInt(baslikSira) > 1) {

                            var kolon = worksheet[XLSX.utils.encode_cell({r: r, c: parseInt(baslikSira)})];

                            ogrenci[eBasliklar[baslikSira]] = kolon ? kolon.v : "";

                        }

                    });

                    sinif[okulNo] = ogrenci;

                }
            }

            writeTable(sinif);

        };

        reader.readAsDataURL(f);
    }
}

//endregion

//region Script >> Write

function writeTable(sinif) {

    if ($("#Table24 input:checked").length > 0 && $("#dgListem input").length > 0) {

        clearCss();

        setTimeout(function () {

            var tBasliklar = {"0": "okulno", "1": "adısoyadı"};
            $("#dgListem tbody tr:first-child td")
                .each(function (baslikKolon) {

                    if (baslikKolon >= 2) {

                        var tBaslik = $(this).text().replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').trToLowerCase();

                        if (tBaslik && tBaslik.length > 0) {
                            tBasliklar[baslikKolon.toString()] = tBaslik;
                        }

                    }

                });

            $("#dgListem tbody tr")
                .each(function (satir) {

                    if (satir === 0) return;

                    var okulNo = $(this).find("td").first().text().trim();

                    if (!okulNo || (okulNo && okulNo.length <= 0)) return;

                    $(this)
                        .find("td")
                        .each(function (kolon) {

                            if (kolon === 0 || kolon === 1) return;

                            var input = $(this).find("input");

                            if (!input) return;

                            var inputType = input.attr('type');
                            var inputDisable = input.attr('disabled') && input.attr('disabled') === "disabled";

                            if (input && !sinif[okulNo]) {
                                input.addClass("input-grade-blank");
                            }

                            var not = tBasliklar[kolon.toString()];
                            var ogrenci = sinif[okulNo];

                            if (inputType === "text" && !inputDisable) {

                                if (not && not.length > 0 && ogrenci[not] && parseFloat(ogrenci[not]) >= 0 && parseFloat(ogrenci[not]) <= 100) {
                                    input.val(ogrenci[not]);
                                    addFilledCss(input);
                                } else {
                                    input.val("");
                                    addBlankCss(input);
                                }

                            } else if (inputType === "checkbox" && !inputDisable) {

                                if (not && not.length > 0 && ogrenci[not] && ogrenci[not].length > 0 && (ogrenci[not].trToLowerCase() === "evet" || ogrenci[not].trToLowerCase() === "hayır")) {
                                    input.prop("checked", ogrenci[not].trToLowerCase() === "evet");
                                    addFilledCss(input);
                                } else {
                                    input.prop("checked", false);
                                    addBlankCss(input);
                                }

                            }

                        });
                });

        }, 250)

    } else {
        // TODO : lütfen giriş yapmak istediğiniz alanı seçiniz. Alert ekle.
    }

    $('#gradeFile').val('');

}

//endregion

//region Script >> Call Function

addCss();
createInput();

//endregion


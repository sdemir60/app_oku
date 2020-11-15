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

function createShareButton() {

    var table = document.getElementById("Table5");
    var container = document.createElement("div");

    if (table && !table.classList.contains("added-share-buttons")) {

        var btnFacebook = document.createElement("a");
        var btnFacebookI = document.createElement("i");
        var btnFacebookSpan = document.createElement("span");
        var btnTwitter = document.createElement("a");
        var btnTwitterI = document.createElement("i");
        var btnTwitterSpan = document.createElement("span");
        var btnYoutube = document.createElement("a");
        var btnYoutubeI = document.createElement("i");
        var btnYoutubeSpan = document.createElement("span");
        var btnLinkedin = document.createElement("a");
        var btnLinkedinI = document.createElement("i");
        var btnLinkedinSpan = document.createElement("span");
        var btnGoogle = document.createElement("a");
        var btnGoogleI = document.createElement("i");
        var btnGoogleSpan = document.createElement("span");

        table.parentElement.setAttribute('style', "text-align:center");
        container.setAttribute('class', "social-share-container");
        table.parentElement.insertBefore(container, table.nextSibling);

        btnFacebook.setAttribute('id', "SocialShareBtnFacebook");
        btnFacebook.setAttribute('href', "https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sindem60/posts/10221160274499930");
        btnFacebook.setAttribute('target', "_blank");
        btnFacebook.setAttribute('class', "social-share-btn social-share-btn-f");
        btnFacebookI.setAttribute('class', "fab fa-facebook");
        btnFacebookSpan.innerHTML = "Facebook";
        btnFacebook.appendChild(btnFacebookI);
        btnFacebook.appendChild(btnFacebookSpan);

        btnTwitter.setAttribute('id', "SocialShareBtnTwitter");
        btnTwitter.setAttribute('href', "https://twitter.com/intent/retweet?tweet_id=1214257573081341953");
        btnTwitter.setAttribute('target', "_blank");
        btnTwitter.setAttribute('class', "social-share-btn social-share-btn-t");
        btnTwitterI.setAttribute('class', "fab fa-twitter");
        btnTwitterSpan.innerHTML = "Twitter";
        btnTwitter.appendChild(btnTwitterI);
        btnTwitter.appendChild(btnTwitterSpan);

        btnYoutube.setAttribute('id', "SocialShareBtnYoutube");
        btnYoutube.setAttribute('href', "https://www.youtube.com/watch?v=r_Ex-PKJ-P4&feature=emb_title");
        btnYoutube.setAttribute('target', "_blank");
        btnYoutube.setAttribute('class', "social-share-btn social-share-btn-y");
        btnYoutubeI.setAttribute('class', "fab fa-youtube");
        btnYoutubeSpan.innerHTML = "Youtube";
        btnYoutube.appendChild(btnYoutubeI);
        btnYoutube.appendChild(btnYoutubeSpan);

        btnLinkedin.setAttribute('id', "SocialShareBtnLinkedin");
        btnLinkedin.setAttribute('href', "https://www.linkedin.com/shareArticle?url=https://www.linkedin.com/posts/sdemir60_oku-activity-6620024154508808192-LKGj");
        btnLinkedin.setAttribute('target', "_blank");
        btnLinkedin.setAttribute('class', "social-share-btn social-share-btn-l");
        btnLinkedinI.setAttribute('class', "fab fa-linkedin");
        btnLinkedinSpan.innerHTML = "Linkedin";
        btnLinkedin.appendChild(btnLinkedinI);
        btnLinkedin.appendChild(btnLinkedinSpan);

        btnGoogle.setAttribute('id', "SocialShareBtnGoogle");
        btnGoogle.setAttribute('href', "https://chrome.google.com/webstore/detail/oku/dkbhkkfomkgjdhfoockmplhmlhkckhoh?hl=tr");
        btnGoogle.setAttribute('target', "_blank");
        btnGoogle.setAttribute('class', "social-share-btn social-share-btn-g");
        btnGoogleI.setAttribute('class', "fab fa-google");
        btnGoogleSpan.innerHTML = "Market";
        btnGoogle.appendChild(btnGoogleI);
        btnGoogle.appendChild(btnGoogleSpan);

        container.appendChild(btnGoogle);
        container.appendChild(btnYoutube);
        container.appendChild(btnTwitter);
        container.appendChild(btnFacebook);
        container.appendChild(btnLinkedin);

        table.classList.add("added-share-buttons");
    }
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

        clearInputCss();

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
createShareButton();

//endregion
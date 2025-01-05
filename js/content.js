//region Content >> Listener

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    try {

        if (request && sender) {

            if (request.command === "analytics") {

                gtag('event', request.category, {'event': request.transaction});

            } else if (request.command === "oku") {

                read(request);

            } else if (request.command === "indir") {

                download(request, sendResponse);

            } else if (request.command === "yukle") {

                upload();

            } else if (request.command === "kontrol") {

                check(request);

            }

        }

    } catch (err) {


    }

});

//endregion

//region Content >> Function

function read(request) {

    var guvenlikKodu = {el: null};
    var notGirisAlani = {el: null, cbx: [], idx: -1};
    var notAlani = {el: null, dic: {}};
    var notGirisAlaniKontrol = {el: null, cbx: [], idx: -1};
    var notAlaniKontrol = {el: null, txt: [], inp: []};

    var lastFoundStudentNo = null;

    if (request.url.includes("IlkOgretim")) {

        guvenlikKodu.el = $("#Gv_kod1_txtGuvenlikKod");
        notGirisAlani.el = $("#tblKonservatuar");
        notAlani.el = $("#dgListem");
        notGirisAlaniKontrol.el = $("#tblKonservatuar");
        notAlaniKontrol.el = $("#dgListem");

    } else if (request.url.includes("OrtaOgretim")) {

        guvenlikKodu.el = $("#Gv_kod1_txtGuvenlikKod");
        notGirisAlani.el = $("#pnlKonservatuar");
        notAlani.el = $("#dgListem");
        notGirisAlaniKontrol.el = $("#pnlKonservatuar");
        notAlaniKontrol.el = $("#dgListem");

    }

    (function init() {

        clearInputCss();

        notGirisAlani.el
            .find("input")
            .each(function (index, checkbox) {

                notGirisAlani.cbx.push(
                    {
                        el: checkbox,
                        idx: index
                    }
                );

                notGirisAlani.idx = notGirisAlani.idx < 0 && $(checkbox).is(':checked') ? index + 3 : notGirisAlani.idx;

            });

        if (notGirisAlani.cbx.length > 0) {

            if (notGirisAlani.idx > 0) {

                notAlani.el
                    .find("> tbody > tr > td:first-child")
                    .each(function (index, td) {

                        var inputEl = notAlani.el.find("> tbody > tr:nth-child(" + (index + 1) + ") > td:nth-child(" + notGirisAlani.idx + ") input");
                        var isDisabled = inputEl.prop('disabled');

                        if (isDisabled) {
                            inputEl.prop('disabled', false);
                            inputEl.prop('readonly', true);
                        }

                        if (index > 0) {
                            notAlani.dic[td.innerText] = {
                                isDis: isDisabled,
                                el: notAlani.el.find("> tbody > tr:nth-child(" + (index + 1) + ") > td:nth-child(" + notGirisAlani.idx + ") input")
                            }
                        }

                    });

            }
        }

        notGirisAlaniKontrol.cbx = notGirisAlani.cbx;
        notGirisAlaniKontrol.idx = notGirisAlani.idx;

    })();

    function inform() {

        var resolve, reject;

        if (notGirisAlani.idx <= 0 || notAlani.el.length <= 0) {

            textToSpeech(
                "Not giriş alanı açık değil.",
                {
                    call: doNotUnderstandPlay
                })
                .then(function () {
                    textToSpeech("Lütfen giriş yapmak istediğiniz alanı seçerek sınıfı listeleyiniz.")
                        .then(function () {
                            reject();
                        });
                });

        } else {

            textToSpeech("Selâmun aleyküm.")
                .then(function () {
                    textToSpeech("İlk sesi duyduğunda öğrencinin okul numarasını, ikinci sesi duyduğunda notunu okumalısın.")
                        .then(function () {
                            textToSpeech("Örneğin.")
                                .then(function () {
                                    startSpeechPlay({event: "onended", timeout: 250})
                                        .then(function () {
                                            textToSpeech("No: 42")
                                                .then(function () {
                                                    startSpeechPlay({event: "onended", timeout: 250})
                                                        .then(function () {
                                                            textToSpeech("Not: 100", {endCallbackTimeout: 250})
                                                                .then(function () {
                                                                    textToSpeech("Not girişi tamamlandığında bana 'tamam' diye seslenerek işlemi bitirebilir, 'oku' diye seslenerek giriş yaptığım notları kontrol edebilirsin.")
                                                                        .then(function () {
                                                                            textToSpeech("Ben hazırım.")
                                                                                .then(function () {
                                                                                    textToSpeech("OKU.")
                                                                                        .then(function () {
                                                                                            resolve();
                                                                                        });
                                                                                });
                                                                        });
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                });

        }

        return new Promise(function (resolveFunc, rejectFunc) {
            resolve = resolveFunc;
            reject = rejectFunc;
        });
    }

    function enterNotes() {

        var operationType;

        speechToText({
            startSpeechSoundFunc: startSpeechPlay
        }).then(
            function (speechText) {

                operationType = speechText.getOperationType();

                switch (operationType) {

                    case OperationType.Unknown:
                        unknown();
                        break;

                    case OperationType.FindStudentEnterNote:
                        findStudentEnterNote(speechText);
                        break;

                    case OperationType.FindStudent:
                        findStudent(speechText);
                        break;

                    case OperationType.EnterNote:
                        enterNote(speechText);
                        break;

                    case OperationType.CheckNotes:
                        checkNotes();
                        break;

                    case OperationType.Complete:
                        complete();
                        break;

                }

            }
        );
    }

    function unknown() {

        blur();

        textToSpeech(
            "Anlamadım. Tekrar söylermisin?",
            {
                call: doNotUnderstandPlay
            })
            .then(function () {
                enterNotes();
            });

    }

    function findStudentEnterNote(speechText = '') {

        var noteInfo = speechText.getNoteInfo();

        if (notAlani.dic.hasOwnProperty(noteInfo.no)) {

            blinkerAnimate(1)
                .then(function () {

                    focus(notAlani.dic[noteInfo.no].el);

                    blinkerAnimate(notGirisAlani.idx)
                        .then(function () {

                            if ((0 <= noteInfo.note && noteInfo.note <= 100) || noteInfo.note === "G") {

                                notAlani.dic[noteInfo.no].el[0].value = noteInfo.note;

                                addFilledCss(notAlani.dic[noteInfo.no].el);

                                if (!notAlaniKontrol.txt.includes(noteInfo.no.toString())) {
                                    notAlaniKontrol.txt.push(noteInfo.no.toString());
                                    notAlaniKontrol.inp.push(notAlani.dic[noteInfo.no].el);
                                }

                                writeTextPlay()
                                    .then(function () {
                                        enterNotes();
                                    });

                            } else {

                                sendAbnormalNumber("AbnormalStudentScore", speechText, noteInfo.note);

                                blur();

                                textToSpeech(
                                    "Yanlışmı anladım acaba. Öğrencinin notunu tekrar söylermisin?",
                                    {
                                        call: doNotUnderstandPlay
                                    })
                                    .then(function () {
                                        enterNotes();
                                    });

                            }

                        });
                });

        } else {

            blur();

            numberToSpeech(speakNumberNormalize(noteInfo.no.toString()), {call: doNotUnderstandPlay})
                .then(function () {
                    textToSpeech(" numaralı öğrenciyi bulamadım. Kontrol edebilir misin?")
                        .then(function () {
                            textToSpeech("Seni dinliyorum?")
                                .then(function () {
                                    enterNotes();
                                });
                        });
                });

        }
    }

    function findStudent(speechText = '') {

        var noteInfo = speechText.getNoteInfo();

        if (notAlani.dic.hasOwnProperty(noteInfo.no)) {

            blinkerAnimate(1)
                .then(function () {

                    lastFoundStudentNo = noteInfo.no;

                    focus(notAlani.dic[noteInfo.no].el);

                    enterNotes();

                })

        } else {

            blur();

            numberToSpeech(speakNumberNormalize(noteInfo.no.toString()), {call: doNotUnderstandPlay})
                .then(function () {
                    textToSpeech(" numaralı öğrenciyi bulamadım. Kontrol edebilir misin?")
                        .then(function () {
                            textToSpeech("Seni dinliyorum?")
                                .then(function () {
                                    enterNotes();
                                });
                        });
                });

        }

    }

    function enterNote(speechText = '') {

        var noteInfo = {};

        noteInfo.no = lastFoundStudentNo;
        noteInfo.note = speechText.getNoteInfo().note;

        if (noteInfo.no && (0 <= noteInfo.note && noteInfo.note <= 100) || noteInfo.note === "G") {

            blinkerAnimate(notGirisAlani.idx)
                .then(function () {

                    notAlani.dic[noteInfo.no].el[0].value = noteInfo.note;

                    addFilledCss(notAlani.dic[noteInfo.no].el);

                    if (!notAlaniKontrol.txt.includes(noteInfo.no.toString())) {
                        notAlaniKontrol.txt.push(noteInfo.no.toString());
                        notAlaniKontrol.inp.push(notAlani.dic[noteInfo.no].el);
                    }

                    writeTextPlay()
                        .then(function () {
                            enterNotes();
                        });

                })

        } else if (!noteInfo.no) {

            blur();

            textToSpeech(
                "Önce öğrencinin numarasını söylemelisin.",
                {
                    call: doNotUnderstandPlay
                })
                .then(function () {
                    textToSpeech("Seni dinliyorum?")
                        .then(function () {
                            enterNotes();
                        });
                });

        } else {

            sendAbnormalNumber("AbnormalStudentScore", speechText, noteInfo.note);

            blur();

            textToSpeech(
                "Yanlışmı anladım acaba. Öğrencinin notunu tekrar söylermisin?",
                {
                    call: doNotUnderstandPlay
                })
                .then(function () {
                    enterNotes();
                });

        }

    }

    function checkNotes() {

        gtag('event', "ReadEnd", {'event': "read end"});
        gtag('event', "CheckStart", {'event': "check start"});

        request.notGirisAlaniKontrol = notGirisAlaniKontrol;
        request.notAlaniKontrol = notAlaniKontrol;

        check(request);

    }

    function complete() {

        gtag('event', "ReadEnd", {'event': "read end"});

        focus(guvenlikKodu.el);

        noteEntryCompletePlay();
        textToSpeech("Teşekkür ederim.")
            .then(function () {
                textToSpeech("Listeyi kaydedebilirsin.")
                    .then(function () {
                        textToSpeech("Benimle çalışmanktan memnunsan, daha fazla öğretmenimize yardım edebilmem için destek olabilir misin?")
                            .then(function () {
                                textToSpeech("Yorum ve paylaşımlarınla öneride bulunabilirsin.")
                            })
                    })
            })
    }

    inform()
        .then(function () {
            enterNotes();
        });
}

function download(request, sendResponse) {

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

    $("#dgListem > tbody > tr")
        .each(function (satir) {

            var ogrenci = {};

            if (satir === 0) {

                baslikAdet = 0;

                $(this)
                    .find("> td")
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
                    .find("> td")
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

}

function upload() {

    $('#gradeFile').trigger('click');

}

function check(request) {

    var fromRead = false;
    var guvenlikKodu = {el: null};
    var notGirisAlani = {el: null, cbx: [], idx: -1};
    var notAlani = {el: null, txt: [], inp: []};

    (function init() {

        clearInputCss();
        guvenlikKodu.el = $("#Gv_kod1_txtGuvenlikKod");

        if (request.notGirisAlaniKontrol) {

            fromRead = true;
            notGirisAlani = request.notGirisAlaniKontrol;
            notAlani = request.notAlaniKontrol;

        } else {

            fromRead = false;

            if (request.url.includes("IlkOgretim")) {

                notGirisAlani.el = $("#tblKonservatuar");
                notAlani.el = $("#dgListem");

            } else if (request.url.includes("OrtaOgretim")) {

                notGirisAlani.el = $("#pnlKonservatuar");
                notAlani.el = $("#dgListem");

            }

            notGirisAlani.el
                .find("input")
                .each(function (index, checkbox) {

                    notGirisAlani.cbx.push(
                        {
                            el: checkbox,
                            idx: index
                        }
                    );

                    notGirisAlani.idx = notGirisAlani.idx < 0 && $(checkbox).is(':checked') ? index + 3 : notGirisAlani.idx;

                });

            if (notGirisAlani.cbx.length > 0) {

                if (notGirisAlani.idx > 0) {

                    notAlani.el
                        .find("> tbody > tr > td:first-child")
                        .each(function (index, td) {
                            if (index > 0)
                                notAlani.txt.push(td.innerText);
                        });

                    notAlani.el
                        .find("> tbody > tr > td:nth-child(" + (notGirisAlani.idx) + ") input")
                        .each(function (index, input) {

                            var isDisabled = $(input).prop('disabled');

                            if (isDisabled) {

                                $(input).prop('disabled', false);
                                $(input).prop('readonly', true);

                            }

                            notAlani.inp.push(input);

                        });

                }
            }

        }

    })();

    function inform() {

        var resolve, reject;

        if (notGirisAlani.idx <= 0 || notAlani.el.length <= 0) {

            textToSpeech(
                "Not giriş alanı açık değil.",
                {
                    call: doNotUnderstandPlay
                })
                .then(function () {
                    textToSpeech("Lütfen kontrol etmek istediğiniz alanı seçerek sınıfı listeleyiniz.")
                        .then(function () {
                            reject();
                        });
                });

        } else if (fromRead) {

            textToSpeech("Notları girdiğim sıraya göre önce öğrencinin okul numarasını sonra notunu okuyacağım.")
                .then(function () {
                    textToSpeech("Beni takip et.")
                        .then(function () {
                            resolve();
                        });
                });

        } else {

            textToSpeech("Selâmun aleyküm.")
                .then(function () {
                    textToSpeech("Önce öğrencinin okul numarasını sonra notunu okuyacağım.")
                        .then(function () {
                            textToSpeech("Beni takip et.")
                                .then(function () {
                                    resolve();
                                });
                        });
                });

        }

        return new Promise(function (resolveFunc, rejectFunc) {
            resolve = resolveFunc;
            reject = rejectFunc;
        });
    }

    function readNote(index) {

        if (index === notAlani.inp.length) {

            gtag('event', "CheckEnd", {'event': "check end"});

            focus(guvenlikKodu.el);

            noteEntryCompletePlay();
            textToSpeech("Bitti. Bu kadar.")
                .then(function () {
                    textToSpeech("Benimle çalışmanktan memnunsan, daha fazla öğretmenimize yardım edebilmem için destek olabilir misin?")
                        .then(function () {
                            textToSpeech("Yorum ve paylaşımlarınla öneride bulunabilirsin.")
                        })
                })

        } else {

            focus(notAlani.inp[index]);

            writeTextPlay()
                .then(function () {

                    numberToSpeech(speakNumberNormalize(notAlani.txt[index]), {rate: 1})
                        .then(function () {

                            var not = $(notAlani.inp[index]).val().toString();

                            not = not === "" ? "BOS" : not;

                            numberToSpeech(speakNumberNormalize(not), {rate: 1})
                                .then(function () {

                                    setTimeout(function () {

                                        readNote(++index);

                                        not === "Boş." ? addBlankCss($(notAlani.inp[index - 1])) : addFilledCss($(notAlani.inp[index - 1]));

                                    }, 500);

                                });

                        });

                });

        }

    }

    inform()
        .then(function () {
            readNote(0);
        });

}

//endregion

//region Content >> On Events

(function onEvents(retries) {

    setTimeout(function () {

        var SocialShareBtnFacebook = document.getElementById("SocialShareBtnFacebook");
        var SocialShareBtnTwitter = document.getElementById("SocialShareBtnTwitter");
        var SocialShareBtnYoutube = document.getElementById("SocialShareBtnYoutube");
        var SocialShareBtnLinkedin = document.getElementById("SocialShareBtnLinkedin");
        var SocialShareBtnGoogle = document.getElementById("SocialShareBtnGoogle");

        if (SocialShareBtnFacebook && SocialShareBtnTwitter && SocialShareBtnYoutube && SocialShareBtnLinkedin && SocialShareBtnGoogle) {

            SocialShareBtnFacebook.addEventListener("click", function () {

                gtag('event', "ShareOnFacebook", {'event': "share on facebook"});

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Senin de desteğin ile daha fazla öğretmenimize yardım edebileceğim.");
                    });

            });

            SocialShareBtnTwitter.addEventListener("click", function () {

                gtag('event', "ShareOnTwitter", {'event': "share on twitter"});

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Senin de desteğin ile daha fazla öğretmenimize yardım edebileceğim.");
                    });

            });

            SocialShareBtnYoutube.addEventListener("click", function () {

                gtag('event', "ShareOnYoutube", {'event': "share on youtube"});

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Video yorumuna düşüncelerini yazabilirsin.");
                    });

            });

            SocialShareBtnLinkedin.addEventListener("click", function () {

                gtag('event', "ShareOnLinkedin", {'event': "share on linkedin"});

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Senin de desteğin ile daha fazla öğretmenimize yardım edebileceğim.");
                    });

            });

            SocialShareBtnGoogle.addEventListener("click", function () {

                gtag('event', "ShareOnGoogleStore", {'event': "share on google store"});

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Yorum sekmesinden düşüncelerini paylaşabilirsin.");
                    });

            });

        } else {
            if (retries > 0)
                onEvents(--retries);
        }

    }, 250);

})(10);

//endregion


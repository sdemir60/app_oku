//region Content >> Google Analytics

var _AnalyticsCode = 'UA-78480732-2';
var _gaq = _gaq || [];

_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

//endregion

//region Content >> Listener

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (!sender) {
        return;
    }

    if (request.command === "oku") {

        _gaq.push(['_trackEvent', "ReadStart", 'read start']);

        read(request);

    } else if (request.command === "indir") {

        download(request, sendResponse);

    } else if (request.command === "yukle") {

        upload();

    } else if (request.command === "kontrol") {

        _gaq.push(['_trackEvent', "CheckStart", 'check start']);

        check(request);

    }

    return true;

});

//endregion

//region Content >> Function

function read(request) {

    var guvenlikKodu = {el: null};
    var notGirisAlani = {el: null, cbx: [], idx: -1};
    var notAlani = {el: null, dic: {}};
    var notGirisAlaniKontrol = {el: null, cbx: [], idx: -1};
    var notAlaniKontrol = {el: null, txt: [], inp: []};

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
                    .find("tbody tr td:first-child")
                    .each(function (index, td) {

                        var inputEl = notAlani.el.find("tbody tr:nth-child(" + (index + 1) + ") td:nth-child(" + notGirisAlani.idx + ") input");
                        var isDisabled = inputEl.prop('disabled');

                        if (isDisabled) {

                            inputEl.prop('disabled', false);
                            inputEl.prop('readonly', true);

                        }

                        if (index > 0) {
                            notAlani.dic[td.innerText] = {
                                isDis: isDisabled,
                                el: notAlani.el.find("tbody tr:nth-child(" + (index + 1) + ") td:nth-child(" + notGirisAlani.idx + ") input")
                            }
                        }

                    });

            }
        }

        notGirisAlaniKontrol.cbx = notGirisAlani.cbx;
        notGirisAlaniKontrol.idx = notGirisAlani.idx;

    })();

    function bilgilendir() {

        var resolve, reject;

        if (notGirisAlani.idx <= 0 || notAlani.el.length <= 0) {

            textToSpeech(
                "Not giriş alanı açık değil.",
                {
                    call: doNotUnderstand,
                    rate: 1.1
                })
                .then(function () {
                    textToSpeech("Lütfen giriş yapmak istediğiniz alanı seçerek sınıfı listeleyiniz.", {rate: 1.1})
                        .then(function () {
                            reject();
                        });
                });

        } else {

            textToSpeech("Selâmun aleyküm.")
                .then(function () {
                    textToSpeech("İlk sesi duyduğunda öğrencinin okul numarasını, ikinci sesi duyduğunda notunu okumalısın. Not girişi tamamlandığında bana 'tamam' diye seslenerek işlemi bitirebilir, 'oku' diye seslenerek giriş yaptığım notları kontrol edebilirsin.", {rate: 1.1})
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

        }

        return new Promise(function (resolveFunc, rejectFunc) {
            resolve = resolveFunc;
            reject = rejectFunc;
        });
    }

    function notlariGir() {

        speechToText()
            .then(
                function (ogrenci) {

                    if (ogrenci && ogrenci.includes("oku")) {
                        ogrenci = "oku";
                    } else if (ogrenci && ogrenci.includes("tamam")) {
                        ogrenci = "tamam";
                    } else {
                        ogrenci = speechNumberNormalize(ogrenci, null);
                    }

                    if (ogrenci === "oku") {

                        _gaq.push(['_trackEvent', "ReadEnd", 'read end']);
                        _gaq.push(['_trackEvent', "CheckStart", 'check start']);

                        request.notGirisAlaniKontrol = notGirisAlaniKontrol;
                        request.notAlaniKontrol = notAlaniKontrol;

                        check(request);

                    } else if (ogrenci === "tamam") {

                        _gaq.push(['_trackEvent', "ReadEnd", 'read end']);

                        focus(guvenlikKodu.el);

                        noteEntryComplete();
                        textToSpeech("Teşekkür ederim.", {rate: 1.1})
                            .then(function () {
                                textToSpeech("Listeyi kaydedebilirsin.", {rate: 1.1})
                                    .then(function () {
                                        textToSpeech("Benimle çalışmanktan memnunsan, daha fazla öğretmenimize yardım edebilmem için destek olabilir misin?", {rate: 1.1})
                                            .then(function () {
                                                textToSpeech("Yorum ve paylaşımlarınla öneride bulunabilirsin.", {rate: 1.1})
                                            })
                                    })
                            })

                    } else if (ogrenci && !notAlani.dic.hasOwnProperty(ogrenci)) {

                        blur();

                        textToSpeech(
                            speakNumberNormalize(ogrenci.toString()) + " numaralı öğrenciyi bulamadım. Kontrol edebilir misin?",
                            {
                                call: doNotUnderstand,
                                rate: 1.1
                            })
                            .then(function () {
                                textToSpeech("Seni dinliyorum?")
                                    .then(function () {
                                        notlariGir();
                                    });
                            });

                    } else if (ogrenci && notAlani.dic.hasOwnProperty(ogrenci) && notAlani.dic[ogrenci].isDis) {

                        blur();

                        textToSpeech(
                            speakNumberNormalize(ogrenci.toString()) + " numaralı öğrenci için not alanı kapalı. Kontrol edebilir misin?",
                            {
                                call: doNotUnderstand,
                                rate: 1.1
                            })
                            .then(function () {
                                textToSpeech("Seni dinliyorum?")
                                    .then(function () {
                                        notlariGir();
                                    });
                            });

                    } else if (ogrenci && notAlani.dic.hasOwnProperty(ogrenci)) {

                        speechToText(
                            {
                                startFocusElement: notAlani.dic[ogrenci].el,
                                startSpeechSound: focusInput
                            })
                            .then(
                                function (text) {

                                    var not = speechNumberNormalize(text, -1);

                                    if (0 <= not && not <= 100) {

                                        notAlani.dic[ogrenci].el[0].value = not;
                                        notlariGir();
                                        addFilledCss(notAlani.dic[ogrenci].el);

                                        notAlaniKontrol.txt.push(ogrenci.toString());
                                        notAlaniKontrol.inp.push(notAlani.dic[ogrenci].el);

                                    } else {

                                        blur();

                                        textToSpeech(
                                            "Yanlışmı anladım acaba. Öğrencinin numarasını ve notunu tekrar söylermisin?",
                                            {
                                                call: doNotUnderstand,
                                                rate: 1.1
                                            })
                                            .then(function () {
                                                notlariGir();
                                            });

                                    }

                                },
                                function () {

                                    blur();

                                    textToSpeech(
                                        "Anlamadım. Öğrencinin numarasını ve notunu tekrar söylermisin?",
                                        {
                                            call: doNotUnderstand,
                                            rate: 1.1
                                        })
                                        .then(function () {
                                            notlariGir();
                                        });

                                }
                            );

                    } else {

                        blur();

                        textToSpeech(
                            "Yanlışmı anladım acaba. Tekrar söylermisin?",
                            {
                                call: doNotUnderstand,
                                rate: 1.1
                            })
                            .then(function () {
                                notlariGir();
                            });

                    }


                },
                function () {

                    blur();

                    textToSpeech(
                        "Anlamadım. Tekrar söylermisin?",
                        {
                            call: doNotUnderstand,
                            rate: 1.1
                        })
                        .then(function () {
                            notlariGir();
                        });

                }
            );

    }

    bilgilendir()
        .then(function () {
            notlariGir();
        });

    function focus(input) {

        if (input) {
            input.focus();
        }

    }

    function blur() {

        document.activeElement.blur();

    }

    //region read >> sırasi ile oku

    // function bilgilendir() {
    //
    //     var resolve, reject;
    //
    //     if (notGirisAlani.idx <= 0 || notAlani.el.length <= 0) {
    //
    //         textToSpeech(
    //             "Not giriş alanı açık değil.",
    //             {
    //                 call: doNotUnderstand,
    //                 rate: 1.1
    //             })
    //             .then(function () {
    //                 textToSpeech("Lütfen giriş yapmak istediğiniz alanı seçerek sınıfı listeleyiniz.", {rate: 1.1})
    //                     .then(function () {
    //                         reject();
    //                     });
    //             });
    //
    //     } else {
    //
    //         textToSpeech("Ben öğrencinin okul numarasını okuyacağım sen notunu. Giriş yapmayacağın öğrenci için bana 'geç' diye seslenebilirsin.", {rate: 1.1})
    //             .then(function () {
    //                 resolve();
    //             });
    //
    //     }
    //
    //     return new Promise(function (resolveFunc, rejectFunc) {
    //         resolve = resolveFunc;
    //         reject = rejectFunc;
    //     });
    // }
    //
    // function notlariGir(index) {
    //
    //     if (index === notAlani.inp.length) {
    //
    //         $(notAlani.inp[index]).blur();
    //
    //         noteEntryComplete();
    //         textToSpeech("Not girişi tamamlandı. Listeyi kontrol edebilir veya kaydedebilirsiniz.", {rate: 1});
    //
    //     } else if (!$(notAlani.inp[index]).is(':disabled')) {
    //
    //         textToSpeech(notAlani.txt[index], {rate: 1})
    //             .then(function () {
    //
    //                 speechToText({el: $(notAlani.inp[index]), call: "focus"})
    //                     .then(
    //                         function (text) {
    //
    //                             var not;
    //
    //                             if (text.includes("geç")) {
    //                                 not = "geç";
    //                             } else if (text && text.length > 0 && text.includes(' ')) {
    //                                 text = text.split(' ')[1].trim();
    //                             }
    //
    //                             if (text && 0 < text.length && text.length < 4 && !not) {
    //
    //                                 switch (text) {
    //                                     case "sıfır":
    //                                         text = "0";
    //                                         break;
    //                                     case "bir":
    //                                         text = "1";
    //                                         break;
    //                                     case "yüz":
    //                                         text = "100";
    //                                         break;
    //                                 }
    //
    //                                 not = !isNaN(parseInt(text)) ? parseInt(text) : -1;
    //                             }
    //
    //
    //                             if (not === "geç") {
    //
    //                                 notlariGir(++index);
    //                                 addBlankCss($(notAlani.inp[index - 1]));
    //
    //                             } else if (0 <= not && not <= 100) {
    //
    //                                 notAlani.inp[index].value = not;
    //                                 notlariGir(++index);
    //                                 addFilledCss($(notAlani.inp[index - 1]));
    //
    //                             } else {
    //
    //                                 $(notAlani.inp[index]).blur();
    //
    //                                 textToSpeech(
    //                                     "Yanlışmı anladım acaba. Tekrar söylermisin?",
    //                                     {
    //                                         call: doNotUnderstand,
    //                                         rate: 1
    //                                     })
    //                                     .then(function () {
    //                                         notlariGir(index);
    //                                     });
    //
    //                             }
    //
    //                         },
    //                         function () {
    //
    //                             $(notAlani.inp[index]).blur();
    //
    //                             textToSpeech(
    //                                 "Anlamadım. Tekrar söylermisin?",
    //                                 {
    //                                     call: doNotUnderstand,
    //                                     rate: 1
    //                                 })
    //                                 .then(function () {
    //                                     notlariGir(index);
    //                                 });
    //
    //                         }
    //                     );
    //
    //             });
    //
    //     } else {
    //
    //         $(notAlani.inp[index]).blur();
    //
    //         textToSpeech(
    //             "Alan kapalı. " + notAlani.txt[index] + " numaralı öğrenciyi geçiyorum.",
    //             {
    //                 call: doNotUnderstand,
    //                 rate: 1
    //             })
    //             .then(function () {
    //                 notlariGir(++index);
    //             });
    //
    //     }
    // }
    //
    // bilgilendir()
    //     .then(function () {
    //         notlariGir(0);
    //     });

    //endregion

    //region read >> ilk çalışma

    // TODO: Üzerinde çalışılırsa aktif edilebilir.
    // TODO: Sınıf, şube ve ders seç, listele işlemlerini içerir.

    // En tepede tanımlıydı.
    // var stepEnum = {
    //     bilgilendir: 1,
    //     sinifSubeSec: 2,
    //     dersSec: 3,
    //     notGirisAlaniSec: 4,
    //     sinifiListele: 5,
    //     notlariGir: 6,
    // };

    // En altta tanımlıydı. Sayfa postback olduğunda kaldığı yerden devam etmesi için
    // (function checkContinue() {
    //
    //     storageGet("OKU")
    //         .then(function (oku) {
    //
    //             if (oku && oku.isContinue) {
    //                 read(oku.request);
    //             }
    //
    //         });
    //
    // })();

    // onMessage da tanımlıydı
    // storageClear()
    //     .then(function () {
    //         storageSet("OKU", {isContinue: true, request: request})
    //             .then(function () {
    //                 read(request);
    //             })
    //     });

    // var guvenlikKodu = {el: null};
    // var sinifSube = {el: null, opt: []};
    // var ders = {el: null, opt: []};
    // var notGirisAlani = {el: null, cbx: [], idx: -1};
    // var listele = {el: null};
    // var notAlani = {el: null, txt: [], inp: []};
    // var kaydet = {el: null};
    // var cikis = {el: null};
    //
    // if (request.url.includes("IlkOgretim")) {
    //
    //     guvenlikKodu.el = $("#Gv_kod1_txtGuvenlikKod");
    //     sinifSube.el = $("#ddlSinifiSubesi");
    //     ders.el = $("#ddlDersler");
    //     notGirisAlani.el = $("#tblKonservatuar");
    //     listele.el = $("#btnListele");
    //     notAlani.el = $("#dgListem");
    //     kaydet.el = $("#IOMToolbarActive1_kaydet_b img");
    //     cikis.el = $("#IOMToolbarActive1_exit_b a");
    //
    //     sinifSube.el
    //         .find("option")
    //         .each(function (index, option) {
    //
    //             var optionText = $(option).text().split('/');
    //             var optionVal = $(option).val();
    //             var sinifNumara = optionText[0].substring(0, optionText[0].indexOf('.')).trim();
    //             var sinifHarf = optionText[1].trim().substring(0, 1).trim();
    //
    //             sinifSube.opt.push(
    //                 {
    //                     optText: (sinifNumara + sinifHarf).turkishToUpper(),
    //                     optValue: optionVal
    //                 }
    //             );
    //
    //         });
    //
    //     ders.el
    //         .find("option")
    //         .each(function (index, option) {
    //             ders.opt.push(
    //                 {
    //                     optText: $(option).text().trim().turkishToUpper(),
    //                     optValue: $(option).val()
    //                 }
    //             );
    //         });
    //
    //     notGirisAlani.el
    //         .find("input")
    //         .each(function (index, checkbox) {
    //
    //             var cbxId = checkbox.id;
    //             var cbxText = "";
    //
    //             if (cbxId.includes("chkS")) {
    //                 cbxText = cbxId.replace("chkS", "") + ". Sınav"
    //             } else if (cbxId.includes("chkPRJ")) {
    //                 cbxText = cbxId.replace("chkPRJ", "") + ". Proje"
    //             } else if (cbxId.includes("chkPRF")) {
    //                 cbxText = cbxId.replace("chkPRF", "") + ". Etkinlik"
    //             }
    //
    //             notGirisAlani.cbx.push(
    //                 {
    //                     el: checkbox,
    //                     txt: cbxText.turkishToUpper(),
    //                     idx: index
    //                 }
    //             );
    //
    //         });
    //
    //     storageGet("noteInputField")
    //         .then(function (noteInputField) {
    //
    //             if (noteInputField >= 0) {
    //
    //                 notAlani.el
    //                     .find("tbody tr td:first-child")
    //                     .each(function (index, td) {
    //                         if (index > 0)
    //                             notAlani.txt.push(td.innerText);
    //                     });
    //
    //                 notAlani.el
    //                     .find("tbody tr td:nth-child(" + (noteInputField + 3) + ") input")
    //                     .each(function (index, input) {
    //                         notAlani.inp.push(input);
    //                     });
    //
    //             }
    //
    //         });
    //
    // } else if (request.url.includes("OrtaOgretim")) {
    // }
    //
    // bilgilendir()
    //     .then(function () {
    //
    //         sinifSubeSec("Sınıf ve şube.")
    //             .then(function () {
    //
    //                 dersSec("Ders.")
    //                     .then(function () {
    //
    //                         notGirisAlaniSec("Not giriş alanı.")
    //                             .then(function () {
    //
    //                                 sinifiListele()
    //                                     .then(function () {
    //
    //                                         notlariGir(0)
    //                                             .then(function () {
    //
    //                                             });
    //
    //                                     });
    //
    //                             });
    //
    //                     });
    //
    //             });
    //
    //     });
    //
    // function bilgilendir() {
    //
    //     var resolve, reject;
    //
    //     storageGet("step")
    //         .then(function (step) {
    //
    //             if (!step) {
    //                 textToSpeech("Öncelikle sınıf, şube, ders ve not giriş alanı bilgilerini isteyeceğim. Daha sonra ben öğrencinin okul numarasını okuyacağım sen notunu. Eğer okuduğumu anlamazsan 'tekrar' diye bana seslenebilirsin.", {rate: 1.1})
    //                     .then(function () {
    //                         storageSet("step", stepEnum.bilgilendir)
    //                             .then(function () {
    //                                 resolve();
    //                             });
    //                     });
    //             } else {
    //                 setTimeout(resolve);
    //             }
    //
    //         });
    //
    //     return new Promise(function (resolveFunc, rejectFunc) {
    //         resolve = resolveFunc;
    //         reject = rejectFunc;
    //     });
    // }
    //
    // function sinifSubeSec(text) {
    //
    //     var resolve, reject;
    //
    //     // TODO: resolve leri kontrol et. Postback olduğu için gerek kalmadı gibi local storage dan kaldığımız yeri yöneteceğiz.
    //     // TODO: her işlemde anahtar kelime kontrolü. sınıf seçemedi ise devam et derse atlasın veya geç desin. sınıf kombosu heryerde farklı olabilir.
    //
    //     //TODO: ortak kontrol metodu yaz. adımları kontrol etsin. liste varsa ilk adımları atlasın notları okumaya başlasın.
    //
    //     storageGet("step")
    //         .then(function (step) {
    //             if (step < stepEnum.sinifSubeSec) {
    //
    //                 textToSpeech(text, {rate: 1})
    //                     .then(function () {
    //
    //                         speechToText()
    //                             .then(
    //                                 function (text) {
    //
    //                                     var sinifNumara, sinifHarf, sinifHarfNumara;
    //
    //                                     if (text && text.length >= 2) {
    //                                         sinifHarf = text.substring(text.length - 1);
    //                                         sinifNumara = text.replace(sinifHarf, '');
    //                                     } else if (text && text.length === 1) {
    //                                         sinifHarf = "";
    //                                         sinifNumara = text;
    //                                     }
    //
    //                                     sinifHarfNumara = (sinifNumara + sinifHarf).trim().turkishToUpper();
    //
    //                                     if (sinifHarfNumara) {
    //
    //                                         sinifSube.opt.forEach(function (option, index) {
    //
    //                                             if (sinifHarfNumara === option.optText) {
    //                                                 sinifSube.el.val(option.optValue);
    //                                                 storageSet("step", stepEnum.sinifSubeSec)
    //                                                     .then(function () {
    //                                                         __doPostBack('ddlSinifiSubesi', '');
    //                                                         resolve();
    //                                                     });
    //                                             }
    //
    //                                         })
    //
    //                                     }
    //
    //                                     sinifSubeSec("Bulamadım. Yanlışmı anladım acaba. Örneğin 5A, 7B şeklinde tekrar söylermisin?")
    //
    //                                 },
    //                                 function () {
    //
    //                                     sinifSubeSec("Anlamadım. Tekrar söylermisin?")
    //
    //                                 }
    //                             )
    //
    //                     });
    //
    //             } else {
    //                 setTimeout(resolve);
    //             }
    //         });
    //
    //     return new Promise(function (resolveFunc, rejectFunc) {
    //         resolve = resolveFunc;
    //         reject = rejectFunc;
    //     });
    // }
    //
    // function dersSec(text) {
    //
    //     var resolve, reject;
    //
    //     // TODO: resolve leri kontrol et. Postback olduğu için gerek kalmadı gibi local storage dan kaldığımız yeri yöneteceğiz.
    //     // TODO: her işlemde anahtar kelime kontrolü. sınıf seçemedi ise devam et derse atlasın veya geç desin. sınıf kombosu heryerde farklı olabilir.
    //
    //     storageGet("step")
    //         .then(function (step) {
    //             if (step < stepEnum.dersSec) {
    //
    //                 textToSpeech(text, {rate: 1})
    //                     .then(function () {
    //
    //                         speechToText()
    //                             .then(
    //                                 function (text) {
    //
    //                                     if (text && text.length > 0) {
    //
    //                                         ders.opt.forEach(function (option, index) {
    //
    //                                             if (option.optText.includes(text.turkishToUpper())) {
    //                                                 ders.el.val(option.optValue);
    //                                                 storageSet("step", stepEnum.dersSec)
    //                                                     .then(function () {
    //                                                         resolve();
    //                                                     });
    //                                             }
    //
    //                                         })
    //
    //                                     }
    //
    //                                     dersSec("Bulamadım. Yanlışmı anladım acaba. Örneğin Kur'ân-ı Kerim, Arapça şeklinde tekrar söylermisin?")
    //
    //                                 },
    //                                 function () {
    //
    //                                     dersSec("Anlamadım. Tekrar söylermisin?")
    //
    //                                 }
    //                             )
    //
    //                     });
    //
    //             } else {
    //                 setTimeout(resolve);
    //             }
    //         });
    //
    //     return new Promise(function (resolveFunc, rejectFunc) {
    //         resolve = resolveFunc;
    //         reject = rejectFunc;
    //     });
    // }
    //
    // function notGirisAlaniSec(text) {
    //
    //     var resolve, reject;
    //
    //     // TODO: resolve leri kontrol et. Postback olduğu için gerek kalmadı gibi local storage dan kaldığımız yeri yöneteceğiz.
    //     // TODO: her işlemde anahtar kelime kontrolü. sınıf seçemedi ise devam et derse atlasın veya geç desin. sınıf kombosu heryerde farklı olabilir.
    //
    //     storageGet("step")
    //         .then(function (step) {
    //             if (step < stepEnum.notGirisAlaniSec) {
    //
    //                 textToSpeech(text, {rate: 1})
    //                     .then(function () {
    //
    //                         speechToText()
    //                             .then(
    //                                 function (text) {
    //
    //                                     if (text && text.length > 0) {
    //
    //                                         notGirisAlani.cbx.forEach(function (checkbox, index) {
    //
    //                                             if (checkbox.txt.includes(text.turkishToUpper())) {
    //
    //                                                 checkbox.el.checked = true;
    //                                                 notGirisAlani.idx = checkbox.idx;
    //
    //                                                 storageSet("noteInputField", checkbox.idx)
    //                                                     .then(function () {
    //
    //                                                         storageSet("step", stepEnum.notGirisAlaniSec)
    //                                                             .then(function () {
    //                                                                 resolve();
    //                                                             });
    //
    //                                                     });
    //
    //                                             }
    //
    //                                         })
    //
    //                                     }
    //
    //                                     notGirisAlaniSec("Bulamadım. Yanlışmı anladım acaba. Örneğin 1. sınav, 2. proje, 3.etkinlik şeklinde tekrar söylermisin?")
    //
    //                                 },
    //                                 function () {
    //
    //                                     notGirisAlaniSec("Anlamadım. Tekrar söylermisin?")
    //
    //                                 }
    //                             )
    //
    //                     });
    //
    //             } else {
    //                 setTimeout(resolve);
    //             }
    //         });
    //
    //     return new Promise(function (resolveFunc, rejectFunc) {
    //         resolve = resolveFunc;
    //         reject = rejectFunc;
    //     });
    // }
    //
    // function sinifiListele() {
    //
    //     var resolve, reject;
    //
    //     storageGet("step")
    //         .then(function (step) {
    //
    //             if (step < stepEnum.sinifiListele) {
    //
    //                 storageSet("step", stepEnum.sinifiListele)
    //                     .then(function () {
    //                         listele.el.click();
    //                     });
    //
    //             } else {
    //                 resolve();
    //             }
    //
    //         });
    //
    //     return new Promise(function (resolveFunc, rejectFunc) {
    //         resolve = resolveFunc;
    //         reject = rejectFunc;
    //     });
    // }
    //
    // function notlariGir(index) {
    //
    //     var resolve, reject;
    //
    //     storageGet("step")
    //         .then(function (step) {
    //             if (step < stepEnum.notlariGir && index < notAlani.txt.length) {
    //
    //                 textToSpeech(notAlani.txt[index], {rate: 1})
    //                     .then(function () {
    //
    //                         speechToText()
    //                             .then(
    //                                 function (text) {
    //
    //                                     var not = text && 0 < text.length && text.length < 4 && !isNaN(parseInt(text)) ? parseInt(text) : -1;
    //
    //                                     if (0 <= not && not <= 100) {
    //
    //                                         notAlani.inp[index].value = text;
    //
    //                                         if (index + 1 === notAlani.inp.length) {
    //                                             storageSet("step", stepEnum.notlariGir)
    //                                                 .then(function () {
    //                                                     resolve();
    //                                                 });
    //                                         } else {
    //                                             notlariGir(++index)
    //                                         }
    //
    //                                     }
    //
    //                                     textToSpeech("Yanlışmı anladım acaba. Tekrar söylermisin?", {rate: 1})
    //                                         .then(function () {
    //                                             notlariGir(index);
    //                                         });
    //
    //                                 },
    //                                 function () {
    //
    //                                     textToSpeech("Anlamadım. Tekrar söylermisin?", {rate: 1})
    //                                         .then(function () {
    //                                             notlariGir(index);
    //                                         });
    //
    //                                 }
    //                             )
    //
    //                     });
    //
    //             }
    //         });
    //
    //     return new Promise(function (resolveFunc, rejectFunc) {
    //         resolve = resolveFunc;
    //         reject = rejectFunc;
    //     });
    // }

    //endregion
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
                        .find("tbody tr td:first-child")
                        .each(function (index, td) {
                            if (index > 0)
                                notAlani.txt.push(td.innerText);
                        });

                    notAlani.el
                        .find("tbody tr td:nth-child(" + (notGirisAlani.idx) + ") input")
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

    function bilgilendir() {

        var resolve, reject;

        if (notGirisAlani.idx <= 0 || notAlani.el.length <= 0) {

            textToSpeech(
                "Not giriş alanı açık değil.",
                {
                    call: doNotUnderstand,
                    rate: 1.1
                })
                .then(function () {
                    textToSpeech("Lütfen kontrol etmek istediğiniz alanı seçerek sınıfı listeleyiniz.", {rate: 1.1})
                        .then(function () {
                            reject();
                        });
                });

        } else if (fromRead) {

            textToSpeech("Notları girdiğim sıraya göre önce öğrencinin okul numarasını sonra notunu okuyacağım.", {rate: 1.1})
                .then(function () {
                    textToSpeech("Beni takip et.")
                        .then(function () {
                            resolve();
                        });
                });

        } else {

            textToSpeech("Selâmun aleyküm.")
                .then(function () {
                    textToSpeech("Önce öğrencinin okul numarasını sonra notunu okuyacağım.", {rate: 1.1})
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

    function notlariOku(index) {

        if (index === notAlani.inp.length) {

            _gaq.push(['_trackEvent', "CheckEnd", 'check end']);

            focus(guvenlikKodu.el);

            noteEntryComplete();
            textToSpeech("Bitti. Bu kadar.", {rate: 1})
                .then(function () {
                    textToSpeech("Benimle çalışmanktan memnunsan, daha fazla öğretmenimize yardım edebilmem için destek olabilir misin?", {rate: 1.1})
                        .then(function () {
                            textToSpeech("Yorum ve paylaşımlarınla öneride bulunabilirsin.", {rate: 1.1})
                        })
                })

        } else {

            focus(notAlani.inp[index]);

            focusInput()
                .then(function () {

                    textToSpeech(speakNumberNormalize(notAlani.txt[index]), {rate: 1})
                        .then(function () {

                            var not = $(notAlani.inp[index]).val().toString();

                            not = not === "" ? "Boş." : not;

                            textToSpeech(speakNumberNormalize(not), {rate: 1})
                                .then(function () {

                                    notlariOku(++index);

                                    not === "Boş." ? addBlankCss($(notAlani.inp[index - 1])) : addFilledCss($(notAlani.inp[index - 1]));

                                });

                        });

                });

        }

    }

    bilgilendir()
        .then(function () {
            notlariOku(0);
        });

    function focus(input) {

        if (input) {
            input.focus();
        }

    }

    function blur() {

        document.activeElement.blur();

    }

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

                _gaq.push(['_trackEvent', "ShareOnFacebook", 'share on facebook']);

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Senin de desteğin ile daha fazla öğretmenimize yardım edebileceğim.");
                    });

            });

            SocialShareBtnTwitter.addEventListener("click", function () {

                _gaq.push(['_trackEvent', "ShareOnTwitter", 'share on twitter']);

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Senin de desteğin ile daha fazla öğretmenimize yardım edebileceğim.");
                    });

            });

            SocialShareBtnYoutube.addEventListener("click", function () {

                _gaq.push(['_trackEvent', "ShareOnYoutube", 'share on youtube']);

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Video yorumuna düşüncelerini yazabilirsin.");
                    });

            });

            SocialShareBtnLinkedin.addEventListener("click", function () {

                _gaq.push(['_trackEvent', "ShareOnLinkedin", 'share on linkedin']);

                textToSpeech("Teşekkür ederim.")
                    .then(function () {
                        textToSpeech("Senin de desteğin ile daha fazla öğretmenimize yardım edebileceğim.");
                    });

            });

            SocialShareBtnGoogle.addEventListener("click", function () {

                _gaq.push(['_trackEvent', "ShareOnGoogleStore", 'share on google store']);

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


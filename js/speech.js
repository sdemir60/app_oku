//region Variable >> textToSpeech

//endregion

//region Variable >> speechToText

// lang             : Dil
// maxAlternatives  : Sonuç için üretilen maksimum alternatif.
//                    Sonuçlar içerisinde kelime ve doğruluk tahmin oranı var.
//                    Varsayılan 1 dir ve tahmin oranı en yüksek olanı döner.
//                    Biz 10 yaptığımızda 10 tahmin dönecektir.
// interimResults   : Kesin olmayan ara sonuçlarda da dön.
// continuous       : True yaptığımızda her tanıma işlemi için sonuç döner. Bizim devam etmemizi bekler.
//                    False yaptığımızda ilk tanımlamayı yapar ve tek bir sonuç döner. Dinleme olayını bitirir.
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

var recognition = new window.SpeechRecognition();

recognition.lang = 'tr-TR';
recognition.maxAlternatives = 1;
recognition.interimResults = false;
recognition.continuous = false;

//endregion

function textToSpeech(text, options) {

    text = text || "";
    options = options || "";

    //region textToSpeech >> note

    // TODO: 20 dil var. Türkçe aralarında yok. O yüzden kullanılamadı. responsivevoice.js kullanıldı.
    // synthesis = window.webkitSpeechSynthesis || window.speechSynthesis;
    // console.log(synthesis.getVoices());
    // synthesis.speak(utterThis);

    // TODO: responsiveVoice.js yoğun sitelerde kısıtlama yapabilir, ticari kullanımı da yasaktır.

    //endregion

    var resolve, reject;

    if (responsiveVoice.isPlaying()) {
        setTimeout(function () {
            reject();
        })
    }

    function startCallback() {
    }

    function endCallback() {
        resolve();
    }

    function speak() {

        // pitch  : Ses tonu.
        // rate   : Ses hızı.
        // volume : Ses seviyesi.
        responsiveVoice.speak(
            text,
            "Turkish Male",
            {
                pitch: options.pitch || 1,
                rate: options.rate || 1.2,
                volume: options.volume || 1,
                onstart: startCallback,
                onend: endCallback
            }
        );

    }

    if (options.call) {

        options.call()
            .then(function () {
                speak();
            })

    } else {
        speak();
    }


    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function speechToText(options) {

    options = options || {};

    var resolve, reject;
    var finalTranscript;

    var startFocusElement = options.startFocusElement || null;
    var startBlurElement = options.startBlurElement || null;
    var startSpeechSound = options.startSpeechSound || startSpeech;

    //region speechToText >> note

    // İhtiyaç olursa kullanılabilir.

    // recognition.onstart = function (event) {
    //     console.log("onstart")
    // };
    //
    // recognition.onaudiostart = function (event) {
    //     console.log("onaudiostart")
    // };
    //
    // recognition.onsoundstart = function (event) {
    //     console.log("onsoundstart")
    // };
    //
    // recognition.onspeechstart = function (event) {
    //     console.log("onspeechstart")
    // };
    //
    // recognition.onspeechend = function (event) {
    //     console.log("onspeechend")
    // };
    //
    // recognition.onsoundend = function (event) {
    //     console.log("onsoundend")
    // };
    //
    // recognition.onaudioend = function (event) {
    //     console.log("onaudioend")
    // };
    //
    // recognition.onnomatch = function (event) {
    //     console.log("onnomatch")
    // };
    //
    // recognition.onresult = function (event) {
    //     console.log("onresult")
    // };
    //
    // recognition.onend = function (event) {
    //     console.log("onend")
    // };

    //endregion

    recognition.onstart = function (event) {

        startSpeechSound();

        if (startBlurElement)
            startBlurElement.blur();

        if (startFocusElement)
            startFocusElement.focus();

    };

    recognition.onresult = function (event) {

        if (event && event.results && event.results.length > 0 && event.results[0].length > 0)
            finalTranscript = event.results[0][0].transcript;

    };

    recognition.onend = function (event) {

        if (finalTranscript) {
            resolve(finalTranscript);
        } else {
            reject();
        }

    };

    recognition.start();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}
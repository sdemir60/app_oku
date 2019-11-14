function textToSpeech(text, options) {

    //region textToSpeech >> note

    // TODO: 20 dil var. Türkçe aralarında yok. O yüzden kullanılamadı. responsivevoice.js kullanıldı.
    // synthesis = window.webkitSpeechSynthesis || window.speechSynthesis;
    // console.log(synthesis.getVoices());
    // synthesis.speak(utterThis);

    // TODO: responsiveVoice.js yoğun sitelerde kısıtlama yapabilir, ticari kullanımı da yasaktır.

    //endregion

    var resolve, reject;

    function startCallback() {
    }

    function endCallback() {
        setTimeout(function () {
            resolve();
        }, options.timeout || 0)
    }

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

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function speechToText() {

    // lang             : Dil
    // maxAlternatives  : Sonuç için üretilen maksimum alternatif.
    //                    Sonuçlar içerisinde kelime ve doğruluk tahmin oranı var.
    //                    Varsayılan 1 dir ve tahmin oranı en yüksek olanı döner.
    //                    Biz 10 yaptığımızda 10 tahmin dönecektir.
    // interimResults   : Kesin olmayan ara sonuçlarda da dön.
    // continuous       : True yaptığımızda her tanıma işlemi için sonuç döner. Bizim devam etmemizi bekler.
    //                    False yaptığımızda ilk tanımlamayı yapar ve tek bir sonuç döner. Dinleme olayını bitirir.
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

    var resolve, reject;
    var finalTranscript;
    var recognition = new window.SpeechRecognition();

    recognition.lang = 'tr-TR';
    recognition.maxAlternatives = 1;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = function (event) {
    };

    recognition.onaudiostart = function (event) {
    };

    recognition.onsoundstart = function (event) {
    };

    recognition.onspeechstart = function (event) {
    };

    recognition.onspeechend = function (event) {
    };

    recognition.onsoundend = function (event) {
    };

    recognition.onaudioend = function (event) {
    };

    recognition.onresult = function (event) {

        if (event && event.results && event.results.length > 0 && event.results[0].length > 0)
            finalTranscript = event.results[0][0].transcript;

        if (finalTranscript) {
            resolve(finalTranscript);
        } else {
            reject()
        }

    };

    recognition.onend = function (event) {
        if (!finalTranscript)
            reject()
    };

    recognition.onnomatch = function (event) {
        reject()
    };

    recognition.start();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}
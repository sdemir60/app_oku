//region Variable >> textToSpeech

var audio;
var audioList = [
    {
        value: "T001",
        key: "Not giriş alanı açık değil."
    },
    {
        value: "T002",
        key: "Lütfen giriş yapmak istediğiniz alanı seçerek sınıfı listeleyiniz."
    },
    {
        value: "T003",
        key: "Selâmun aleyküm."
    },
    {
        value: "T004;T005;T006",
        key: "İlk sesi duyduğunda öğrencinin okul numarasını, ikinci sesi duyduğunda notunu okumalısın. Not girişi tamamlandığında bana 'tamam' diye seslenerek işlemi bitirebilir, 'oku' diye seslenerek giriş yaptığım notları kontrol edebilirsin."
    },
    {
        value: "T007",
        key: "Ben hazırım."
    },
    {
        value: "T008",
        key: "OKU."
    },
    {
        value: "T009",
        key: "Teşekkür ederim."
    },
    {
        value: "T010",
        key: "Listeyi kaydedebilirsin."
    },
    {
        value: "T011;T012",
        key: "Benimle çalışmanktan memnunsan, daha fazla öğretmenimize yardım edebilmem için destek olabilir misin?"
    },
    {
        value: "T013",
        key: "Yorum ve paylaşımlarınla öneride bulunabilirsin."
    },
    {
        value: "T014",
        key: "numaralı öğrenciyi bulamadım. Kontrol edebilir misin?"
    },
    {
        value: "T015",
        key: "Seni dinliyorum?"
    },
    {
        value: "T016",
        key: "numaralı öğrenci için not alanı kapalı. Kontrol edebilir misin?"
    },
    {
        value: "T017",
        key: "Yanlışmı anladım acaba. Öğrencinin numarasını ve notunu tekrar söylermisin?"
    },
    {
        value: "T018",
        key: "Anlamadım. Öğrencinin numarasını ve notunu tekrar söylermisin?"
    },
    {
        value: "T019",
        key: "Yanlışmı anladım acaba. Tekrar söylermisin?"
    },
    {
        value: "T020",
        key: "Anlamadım. Tekrar söylermisin?"
    },
    {
        value: "T021",
        key: "Lütfen kontrol etmek istediğiniz alanı seçerek sınıfı listeleyiniz."
    },
    {
        value: "T022",
        key: "Notları girdiğim sıraya göre önce öğrencinin okul numarasını sonra notunu okuyacağım."
    },
    {
        value: "T023",
        key: "Beni takip et."
    },
    {
        value: "T024",
        key: "Önce öğrencinin okul numarasını sonra notunu okuyacağım."
    },
    {
        value: "T025",
        key: "Bitti. Bu kadar."
    },
    {
        value: "T026",
        key: "Senin de desteğin ile daha fazla öğretmenimize yardım edebileceğim."
    },
    {
        value: "T027",
        key: "Video yorumuna düşüncelerini yazabilirsin."
    },
    {
        value: "T028",
        key: "Yorum sekmesinden düşüncelerini paylaşabilirsin."
    },
    {
        value: "T029",
        key: "İlk sesi duyduğunda öğrencinin okul numarasını, ikinci sesi duyduğunda notunu okumalısın."
    },
    {
        value: "T030",
        key: "Örneğin."
    },
    {
        value: "T031",
        key: "No: 42"
    },
    {
        value: "T032",
        key: "Not: 100"
    },
    {
        value: "T033",
        key: "Not girişi tamamlandığında bana 'tamam' diye seslenerek işlemi bitirebilir, 'oku' diye seslenerek giriş yaptığım notları kontrol edebilirsin."
    },
    {
        value: "T034",
        key: "Yanlışmı anladım acaba. Öğrencinin notunu tekrar söylermisin?"
    },
    {
        value: "T035",
        key: "Önce öğrencinin numarasını söylemelisin."
    }
];

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
recognition.maxAlternatives = 2;
recognition.interimResults = true;
recognition.continuous = false;

//endregion

//region Function >> textToSpeech

function speech(audioList, options) {

    var resolve, reject;

    options = options || {};

    options.endCallbackTimeout = options.endCallbackTimeout || 0;

    // FIXME: Daha sağlıklı kontrol olursa ekleyebiliriz.
    // if (audio && audio.currentTime > 0 && !audio.ended) {
    //     setTimeout(function () {
    //         reject();
    //     })
    // }

    function endCallback() {

        if (audioList <= 0) {

            setTimeout(function () {
                resolve();
            }, options.endCallbackTimeout);

        } else {
            speak();
        }

    }

    function errorCallback() {

        sendAbnormalSpeech("SpeechError", audio.src);

        audioList.unshift(getErrorAudioPath());

        speak();

    }

    function speak() {

        try {

            audio = new Audio();

            audio.volume = 1;
            audio.src = audioList.shift();
            audio.onended = endCallback;
            audio.onerror = errorCallback;

            audio.play();

        } catch (err) {

            sendAbnormalSpeech("SpeechError", audio.src);

            errorCallback();

        }

    }

    if (audioList.length <= 0) {

        setTimeout(function () {
            reject();
        })

    } else if (options.call) {

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

function textToSpeech(text, options) {
    return speech(getTextAudioPath(text), options);
}

function numberToSpeech(number, options) {
    return speech(getNumberAudioPath(number), options);
}

function getTextAudioPath(text) {

    var valueList = [];

    audioList.some(function (audio, index) {
        if (text.trim() === audio.key.trim()) {
            valueList = audio.value.split(";");
            return true;
        }
    });

    valueList.forEach(function (value, index) {
        valueList[index] = chrome.runtime.getURL("aud/text/" + value + ".mp3");
    });

    if (valueList.length <= 0) {

        sendAbnormalSpeech("SpeechError", text);

        valueList.push(chrome.runtime.getURL("aud/error.mp3"));
    }


    return valueList;
}

function getNumberAudioPath(number) {
    return [chrome.runtime.getURL("aud/number/" + number + ".mp3")];
}

function getErrorAudioPath() {
    return [chrome.runtime.getURL("aud/text/NotFound.mp3")];
}

//endregion

//region Function >> speechToText

/*

İhtiyaç olursa kullanılabilir.

recognition.onstart = function (event) {
    console.log("onstart")
};

recognition.onaudiostart = function (event) {
    console.log("onaudiostart")
};

recognition.onsoundstart = function (event) {
    console.log("onsoundstart")
};

recognition.onspeechstart = function (event) {
    console.log("onspeechstart")
};

recognition.onspeechend = function (event) {
    console.log("onspeechend")
};

recognition.onsoundend = function (event) {
    console.log("onsoundend")
};

recognition.onaudioend = function (event) {
    console.log("onaudioend")
};

recognition.onnomatch = function (event) {
    console.log("onnomatch")
};

recognition.onresult = function (event) {
    console.log("onresult")
};

recognition.onend = function (event) {
    console.log("onend")
};

recognition.onerror = function(event) {
    console.log("onerror")
}

*/
function speechToText(options) {

    options = options || {};

    var resolve, reject;
    var finalTranscript, interimTranscript;

    var startFocusElement = options.startFocusElement || null;
    var startBlurElement = options.startBlurElement || null;
    var startSpeechSoundPlay = options.startSpeechSoundFunc || startSpeechPlay;

    recognition.onstart = function (event) {

        finalTranscript = '';
        interimTranscript = '';

        if (startSpeechSoundPlay)
            startSpeechSoundPlay();

        if (startBlurElement)
            startBlurElement.blur();

        if (startFocusElement)
            startFocusElement.focus();

    };

    recognition.onresult = function (event) {

        var isFinal;
        var recognitionResult;
        var recognitionResults, recognitionResultIndex;

        if (event && event.results) {

            recognitionResultIndex = event.resultIndex;
            recognitionResults = event.results || [];

            for (var index = recognitionResultIndex; index < recognitionResults.length; ++index) {

                isFinal = recognitionResults[index].isFinal;
                recognitionResult = getRecognitionResultFromAlternatives(recognitionResults[index]);

                if (isFinal) {
                    finalTranscript += recognitionResult.transcript;
                    // console.log("%c  finalTranscript >" + " confidence : " + recognitionResult.confidence.toString().padEnd(20, ' ') + "  transcript : " + recognitionResult.transcript.trim() + "  number : " + recognitionResult.number.trim(), 'color: #000000; font-size:15px');
                } else {
                    interimTranscript += recognitionResult.transcript;
                    // console.log("%cinterimTranscript >" + " confidence : " + recognitionResult.confidence.toString().padEnd(20, ' ') + "  transcript : " + recognitionResult.transcript.trim() + "  number : " + recognitionResult.number.trim(), 'color: #ababab; font-size:15px');
                }
            }

            finalTranscript = finalTranscript.trim();
        }
    };

    recognition.onend = function (event) {

        if (finalTranscript) {

            resolve(finalTranscript);

        } else {

            startSpeechSoundPlay = null;

            recognition.start();

        }

    };

    recognition.start();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function getRecognitionResultFromAlternatives(recognitionResultAlternatives) {

    var recognitionResult;
    var firstAlternative, secondAlternative

    recognitionResult = {
        confidence: "",
        transcript: "",
        number: ""
    }

    if (recognitionResultAlternatives.length > 1) {

        firstAlternative = {
            confidence: recognitionResultAlternatives[0].confidence,
            transcript: recognitionResultAlternatives[0].transcript,
            number: recognitionResultAlternatives[0].transcript.getNumber()
        }
        secondAlternative = {
            confidence: recognitionResultAlternatives[1].confidence,
            transcript: recognitionResultAlternatives[1].transcript,
            number: recognitionResultAlternatives[1].transcript.getNumber()
        }

        recognitionResult = secondAlternative.number.startsWith(firstAlternative.number) ? secondAlternative : null;

        if (!recognitionResult)
            recognitionResult = firstAlternative.number.startsWith(secondAlternative.number) ? firstAlternative : null;

        if (!recognitionResult)
            recognitionResult = secondAlternative.confidence > firstAlternative.confidence ? secondAlternative : firstAlternative;

    } else if (recognitionResultAlternatives.length === 1) {

        firstAlternative = {
            confidence: recognitionResultAlternatives[0].confidence,
            transcript: recognitionResultAlternatives[0].transcript,
            number: recognitionResultAlternatives[0].transcript.getNumber()
        }

        recognitionResult = firstAlternative;

    }

    return recognitionResult;
}

//endregion

//region Function >> sendAbnormalSpeech

function sendAbnormalSpeech(category, text) {

    // gtag('event', category, {'text': text});

}

//endregion
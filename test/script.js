/*

Web Speech API;
https://wicg.github.io/speech-api/

Web Speech Grammar;
https://wicg.github.io/speech-api/#speechreco-speechgrammar
https://www.w3.org/TR/jsgf/

Chrome hataları;
https://bugs.chromium.org/p/chromium/issues/list

Chrome örnek uygulaması;
https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api/
https://github.com/googlearchive/webplatform-samples
https://www.google.com/intl/en/chrome/demos/speech.html

Chrome Extension Migrate to Manifest V3;
https://developer.chrome.com/docs/extensions/migrating/
https://developer.chrome.com/docs/extensions/mv3/manifest/sandbox/

*/


var recognition, isContinuous;

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

recognition = new window.SpeechRecognition();

recognition.lang = 'tr-TR';
recognition.maxAlternatives = 2;
recognition.interimResults = true;
recognition.continuous = false;


recognition.onstart = function (event) {

    isContinuous = true;

    $('input#event').val('onstart')

};

recognition.onresult = function (event) {

    var recognitionResult;
    var recognitionResults, recognitionResultIndex;
    var interimTranscript = '';
    var finalTranscript = '';
    var isFinal, foundNumber;

    // console.log(event)

    $('input#event').val('onresult')

    if (event && event.results) {

        recognitionResultIndex = event.resultIndex;
        recognitionResults = event.results || [];

        for (var index = recognitionResultIndex; index < recognitionResults.length; ++index) {

            isFinal = recognitionResults[index].isFinal;
            recognitionResult = getRecognitionResultFromAlternatives(recognitionResults[index]);

            if (isFinal) {
                finalTranscript += recognitionResult.transcript;
                console.log("%c  finalTranscript >" + " confidence : " + recognitionResult.confidence.toString().padEnd(20, ' ') + "  transcript : " + recognitionResult.transcript.trim() + "  number : " + recognitionResult.number.trim(), 'color: #000000; font-size:15px');
            } else {
                interimTranscript += recognitionResult.transcript;
                console.log("%cinterimTranscript >" + " confidence : " + recognitionResult.confidence.toString().padEnd(20, ' ') + "  transcript : " + recognitionResult.transcript.trim() + "  number : " + recognitionResult.number.trim(), 'color: #ababab; font-size:15px');
            }
        }

        foundNumber = getNumber(finalTranscript);

        $('textarea#text').val(finalTranscript.trim());

        checkNumber(foundNumber);

    }
};

recognition.onnomatch = function (event) {

    $('input#event').val('onnomatch')

}

recognition.onerror = function (event) {

    isContinuous = false;

    $('input#event').val('onerror')

    // console.error('Speech recognition error detected: ' + event.error);
    // console.error('Additional information: ' + event.message);

};

recognition.onend = function (event) {

    isContinuous = false;

    $('input#event').val('onend')

    recognition.start();

};


function startOnlick(event) {

    if (!isContinuous)
        recognition.start();

}

function stopOnlick(event) {

    recognition.stop();

    $('textarea#text').val('');

}

function debugviewOnlick(event) {

    gtag('event', 'fonksiyonAdı1');
    gtag('event', 'fonksiyonAdı2', {'etiketAdı': 'etiketDeğeri'});

}

function getNumber(text) {

    var number = "";

    if (text) {
        number = text.match(/\d+/g);
        number = number ? number.at(-1) : "";
    }

    return number;
}

function checkNumber(number) {

    var isFound = false;
    var testNumbers = $('#test').val();

    number = number.trim();
    testNumbers = testNumbers.replace(/\[|\]/g, '')
    testNumbers = testNumbers.split(' ');

    testNumbers.forEach(function (testNumber, index) {

        testNumber = testNumber.trim();

        if (number === testNumber) {
            isFound = true;
            testNumber = '[' + testNumber + ']';
        }

        testNumbers[index] = testNumber;

    })

    testNumbers = testNumbers.join(' ');

    $('#test').val(testNumbers);

    if (isFound) {
        $('input#test').css({"border-color": "#028707", "color": "#028707"});
    } else {
        $('input#test').css({"border-color": "#e10000", "color": "#e10000"});
    }

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
            number: getNumber(recognitionResultAlternatives[0].transcript)
        }
        secondAlternative = {
            confidence: recognitionResultAlternatives[1].confidence,
            transcript: recognitionResultAlternatives[1].transcript,
            number: getNumber(recognitionResultAlternatives[1].transcript)
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
            number: getNumber(recognitionResultAlternatives[0].transcript)
        }

        recognitionResult = firstAlternative;

    }

    return recognitionResult;
}










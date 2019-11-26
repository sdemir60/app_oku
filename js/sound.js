//region variable >> startSpeech

startSpeechAudioSrc = chrome.runtime.getURL("aud/startSpeech.mp3");

//endregion

//region variable >> focusInput

focusInputAudioSrc = chrome.runtime.getURL("aud/focusInput.mp3");

//endregion

//region variable >> doNotUnderstand

doNotUnderstandAudioSrc = chrome.runtime.getURL("aud/doNotUnderstand.mp3");

//endregion

// region variable >> noteEntryComplete

noteEntryCompleteAudioSrc = chrome.runtime.getURL("aud/noteEntryComplete.mp3");

//endregion

function startSpeech() {

    var resolve, reject;
    var audio = new Audio();

    audio.volume = 1;
    audio.src = startSpeechAudioSrc;
    audio.oncanplay = function () {
        setTimeout(function () {
            resolve();
        })
    };

    audio.play();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function focusInput() {

    var resolve, reject;
    var audio = new Audio();

    audio.volume = 1;
    audio.src = focusInputAudioSrc;
    audio.oncanplay = function () {
        setTimeout(function () {
            resolve();
        })
    };

    audio.play();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function doNotUnderstand() {

    var resolve, reject;
    var audio = new Audio();

    audio.volume = 0.3;
    audio.src = doNotUnderstandAudioSrc;
    audio.oncanplay = function () {
        setTimeout(function () {
            resolve();
        }, 750)
    };

    audio.play();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function noteEntryComplete() {

    var resolve, reject;
    var audio = new Audio();

    audio.volume = 0.5;
    audio.src = noteEntryCompleteAudioSrc;
    audio.oncanplay = function () {
        setTimeout(function () {
            resolve();
        }, 750)
    };

    audio.play();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}
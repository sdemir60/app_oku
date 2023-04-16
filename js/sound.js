//region variable >> startSpeech

startSpeechAudioSrc = chrome.runtime.getURL("aud/startSpeech.mp3");

//endregion

//region variable >> writeText

writeTextAudioSrc = chrome.runtime.getURL("aud/writeText.mp3");

//endregion

//region variable >> doNotUnderstand

doNotUnderstandAudioSrc = chrome.runtime.getURL("aud/doNotUnderstand.mp3");

//endregion

// region variable >> noteEntryComplete

noteEntryCompleteAudioSrc = chrome.runtime.getURL("aud/noteEntryComplete.mp3");

//endregion

// region variable >> error

errorAudioSrc = chrome.runtime.getURL("aud/error.mp3");

//endregion

function startSpeechPlay(option) {

    var resolve, reject;
    var audio = new Audio();

    option = option || {};
    option.event = option.event || "oncanplay";
    option.timeout = option.timeout || 0;

    audio.volume = 1;
    audio.src = startSpeechAudioSrc;
    audio[option.event] = function () {
        setTimeout(function () {
            resolve();
        }, option.timeout)
    };

    audio.play();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function writeTextPlay() {

    var resolve, reject;
    var audio = new Audio();

    audio.volume = 1;
    audio.src = writeTextAudioSrc;
    audio.onended = function () {
        setTimeout(function () {
            resolve();
        }, 250);
    };

    audio.play();

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function doNotUnderstandPlay() {

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

function noteEntryCompletePlay() {

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

function errorPlay() {

    var resolve, reject;
    var audio = new Audio();

    audio.volume = 0.5;
    audio.src = errorAudioSrc;
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
function storageSet(key, value) {

    var resolve, reject;
    var storageObject = {};

    storageObject[key] = value;

    chrome.storage.local.set(storageObject, function () {
        resolve();
    });

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function storageGet(key) {

    var resolve, reject;

    chrome.storage.local.get(key, function (value) {

        if (!value || $.isEmptyObject(value)) {
            resolve();
        } else {
            resolve(value[key]);
        }

    });

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function storageRemove(keys) {

    var resolve, reject;

    chrome.storage.local.remove(keys, function () {
        resolve();
    });

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

function storageClear( ) {

    var resolve, reject;

    chrome.storage.local.clear(function () {
        resolve();
    });

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}
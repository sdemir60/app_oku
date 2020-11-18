//region Background >> Google Analytics

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

//region Background >> Function

Date.prototype.getShortDate = function () {
    return this.getDate() + "." + (this.getMonth() + 1) + "." + this.getFullYear();
};

function checkURL(url) {
    return url.includes("https://eokul.meb.gov.tr/IlkOgretim/OKL") ||
        url.includes("https://e-okul.meb.gov.tr/IlkOgretim/OKL") ||
        url.includes("https://eokulyd.meb.gov.tr/IlkOgretim/OKL") ||
        url.includes("https://eokul.meb.gov.tr/OrtaOgretim/OKL") ||
        url.includes("https://e-okul.meb.gov.tr/OrtaOgretim/OKL") ||
        url.includes("https://eokulyd.meb.gov.tr/OrtaOgretim/OKL");
}

function createNotification() {

    var dateTimeNow = (new Date()).getShortDate();

    if (localStorage.initializedDate !== dateTimeNow) {

        localStorage.initializedDate = dateTimeNow;

        var notification = new Notification("OKU", {
            icon: 'img/OKU128.png',
            body: 'e-Okul sesli ders notu girişi. Öğretmenlerimiz "hızlı not girişi" ekranından, hızlı not girebilsin diye...'
        });

        notification.onclick = function(){
            chrome.tabs.create({url: 'https://www.youtube.com/watch?v=r_Ex-PKJ-P4&feature=emb_title'});
            _gaq.push(['_trackEvent', "Notification", 'notification clicked']);
        };

    }

}

//endregion

//region Background >> Tabs >> onUpdated

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status === "complete" && checkURL(tab.url)) {

        createNotification();

        chrome.tabs.executeScript(tabId, {file: "js/xlsx.full.min.js"}, function () {
            chrome.tabs.executeScript(tabId, {file: "js/script.js"})
        })

    }

});

//endregion

//region Background >> Commands >> onCommand

chrome.commands.onCommand.addListener(function (command) {

    var extensionURL = chrome.runtime.id;

    switch (command) {
        case "tanitim":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "TutorialCommand", 'tutorial command']);
                chrome.tabs.create({url: "https://youtu.be/Er3Ha68K8nQ"});
            });
            break;
        case "yardim":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "HelpCommand", 'help command']);
                chrome.tabs.create({url: "doc/help.pdf"});
            });
            break;
        case "oku":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "ReadCommand", 'read command']);
                chrome.tabs.sendMessage(tabs[0].id, {command: "oku", url: tabs[0].url});
            });
            break;
        case "indir":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "DownloadCommand", 'download command']);
                chrome.tabs.sendMessage(tabs[0].id, {command: "indir", url: tabs[0].url});
            });
            break;
        case "yukle":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "UploadCommand", 'upload command']);
                chrome.tabs.sendMessage(tabs[0].id, {command: "yukle", url: tabs[0].url});
            });
            break;
        case "kontrol":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "CheckCommand", 'check command']);
                chrome.tabs.sendMessage(tabs[0].id, {command: "kontrol", url: tabs[0].url});
            });
            break;
    }

});

//endregion

//region Background >> Runtime >> onMessage

chrome.runtime.onMessage.addListener(function (message) {

    if (message.type === "analytics") {
        _gaq.push(['_trackEvent', message.category, message.transaction]);
    }

});

//endregion

// chrome.runtime.onMessage.addListener(function (message) {
// TODO: 20 dil var. Türkçe aralarında yok. O yüzden kullanılamadı.
// content.js den mesaj ge?iyoruz: chrome.runtime.sendMessage({toSay: "hello sinan"}, function() {});
// background.js de kullan?yoruz: chrome.tts.speak(message.toSay, { rate: 0.8, onEvent: function(event) {}}, function() {});
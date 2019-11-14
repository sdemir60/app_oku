//region Popup >> Google Analytics

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

//region Popup >> Events

$(document).ready(function () {

    $("#help")
        .click(function (e) {
            _gaq.push(['_trackEvent', "HelpButton", 'help clicked']);
            PageTransitions.nextPage({nextPage: 1, animation: 21});
        });

    $("#tutorial-link")
        .click(function (e) {
            _gaq.push(['_trackEvent', "HelpTutorialLink", 'tutorial link clicked']);
            chrome.tabs.create({url: "https://youtu.be/4IS2iUA3eAM"});
        });

    $("#help-link")
        .click(function (e) {
            _gaq.push(['_trackEvent', "HelpHelpLink", 'help link clicked']);
            chrome.tabs.create({url: "doc/help.pdf"});
        });

    $("#info")
        .click(function (e) {
            _gaq.push(['_trackEvent', "InfoButton", 'info clicked']);
            PageTransitions.nextPage({nextPage: 2, animation: 21});
        });

    $("#transaction")
        .click(function (e) {
            _gaq.push(['_trackEvent', "TransactionButton", 'transaction clicked']);
            PageTransitions.nextPage({nextPage: 0, animation: 22});
        });

    $("#read")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "ReadButton", 'read clicked']);
                chrome.tabs.sendMessage(tabs[0].id, {command: "oku", url: tabs[0].url});
            });
        });

    $("#download")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "DownloadButton", 'download clicked']);
                chrome.tabs.sendMessage(tabs[0].id, {command: "indir", url: tabs[0].url});
            });
        });

    $("#upload")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "UploadButton", 'upload clicked']);
                chrome.tabs.sendMessage(tabs[0].id, {command: "yukle", url: tabs[0].url});
            });
        });

    $("#check")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                _gaq.push(['_trackEvent', "CheckButton", 'check clicked']);
                chrome.tabs.sendMessage(tabs[0].id, {command: "kontrol", url: tabs[0].url});
            });
        });

});

//endregion

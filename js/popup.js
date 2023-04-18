//region Popup >> Events

$(document).ready(function () {

    $("#help")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "HelpButton",
                    transaction: "help clicked"
                });
                PageTransitions.nextPage({nextPage: 1, animation: 21});
            });
        });

    $("#tutorial-link")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "HelpTutorialLink",
                    transaction: "tutorial link clicked"
                });
                chrome.tabs.create({url: "https://www.youtube.com/watch?v=AJRS5Yk6MyI&t=1s"});
            });
        });

    $("#help-link")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "HelpHelpLink",
                    transaction: "help link clicked"
                });
                chrome.tabs.create({url: "doc/help.pdf"});
            });
        });

    $("#info")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "InfoButton",
                    transaction: "info clicked"
                });
                PageTransitions.nextPage({nextPage: 2, animation: 21});
            });
        });

    $("#transaction")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "TransactionButton",
                    transaction: "transaction clicked"
                });
                PageTransitions.nextPage({nextPage: 0, animation: 22});
            });
        });

    $("#read")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "ReadButton",
                    transaction: "read clicked"
                });
                chrome.tabs.sendMessage(tabs[0].id, {command: "oku", url: tabs[0].url});
            });
        });

    $("#download")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "DownloadButton",
                    transaction: "download clicked"
                });
                chrome.tabs.sendMessage(tabs[0].id, {command: "indir", url: tabs[0].url});
            });
        });

    $("#upload")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "UploadButton",
                    transaction: "upload clicked"
                });
                chrome.tabs.sendMessage(tabs[0].id, {command: "yukle", url: tabs[0].url});
            });
        });

    $("#check")
        .click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "CheckButton",
                    transaction: "check clicked"
                });
                chrome.tabs.sendMessage(tabs[0].id, {command: "kontrol", url: tabs[0].url});
            });
        });

});

//endregion

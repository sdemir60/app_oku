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

    chrome.storage.local.get("initializedDate")
        .then(function (data) {

            if (data && data.initializedDate !== dateTimeNow) {

                chrome.storage.local.set({initializedDate: dateTimeNow});

                chrome.notifications.create('', {
                    type: 'basic',
                    requireInteraction: true,
                    iconUrl: '/img/OKU128.png',
                    title: 'OKU',
                    message: 'Öğretmenlerimiz "hızlı not girişi" ekranından, hızlı not girebilsin diye...',
                });

                chrome.notifications.create('', {
                    type: 'basic',
                    requireInteraction: true,
                    iconUrl: '/img/OKU128.png',
                    title: 'OKU',
                    message: 'Seni daha iyi anlamak için her gün yeni şeyler öğreniyorum.',
                });

                chrome.notifications.onClicked.addListener(
                    function () {
                        chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                command: "analytics",
                                category: "Notification",
                                transaction: "notification clicked"
                            });
                        });
                        chrome.tabs.create({url: 'https://www.youtube.com/watch?v=AJRS5Yk6MyI&t=1s'});
                    }
                )

            }

        });
}

//endregion

//region Background >> Tabs >> onUpdated

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status === "complete" && checkURL(tab.url)) {

        createNotification();

        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["js/xlsx.full.min.js", "js/script.js"]
        });

    }

});

//endregion

//region Background >> Commands >> onCommand

chrome.commands.onCommand.addListener(function (command) {

    var extensionURL = chrome.runtime.id;

    switch (command) {
        case "tanitim":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "TutorialCommand",
                    transaction: "tutorial command"
                });
                chrome.tabs.create({url: "https://www.youtube.com/watch?v=AJRS5Yk6MyI&t=1s"});
            });
            break;
        case "yardim":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "HelpCommand",
                    transaction: "help command"
                });
                chrome.tabs.create({url: "doc/help.pdf"});
            });
            break;
        case "oku":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "ReadCommand",
                    transaction: "read command"
                });
                chrome.tabs.sendMessage(tabs[0].id, {command: "oku", url: tabs[0].url});
            });
            break;
        case "indir":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "DownloadCommand",
                    transaction: "download command"
                });
                chrome.tabs.sendMessage(tabs[0].id, {command: "indir", url: tabs[0].url});
            });
            break;
        case "yukle":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "UploadCommand",
                    transaction: "upload command"
                });
                chrome.tabs.sendMessage(tabs[0].id, {command: "yukle", url: tabs[0].url});
            });
            break;
        case "kontrol":
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    command: "analytics",
                    category: "CheckCommand",
                    transaction: "check command"
                });
                chrome.tabs.sendMessage(tabs[0].id, {command: "kontrol", url: tabs[0].url});
            });
            break;
    }

});

//endregion

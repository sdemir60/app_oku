function speechNumberNormalize(abnormalNum, defaultNum) {

    var normalNum = "";

    if (abnormalNum || abnormalNum === 0 | abnormalNum === "0")
        normalNum = abnormalNum.toString();

    if (normalNum && normalNum.length > 0 && normalNum.includes(' '))
        normalNum = normalNum.split(' ')[1].trim();

    normalNum = normalNum.replace(/\./g, '').trim();

    switch (normalNum) {
        case "sıfır":
            normalNum = "0";
            break;
        case "bir":
            normalNum = "1";
            break;
        case "yüz":
            normalNum = "100";
            break;
        case "g":
            normalNum = "G";
            break;
        case "y":
            normalNum = "G";
            break;
        case "gelmedi":
            normalNum = "G";
            break;
        case "gelmedin":
            normalNum = "G";
            break;
        case "girmedi":
            normalNum = "G";
            break;
    }

    if (normalNum !== "G")
        normalNum = !isNaN(parseInt(normalNum)) ? parseInt(normalNum) : defaultNum;

    return normalNum;
}

function speakNumberNormalize(abnormalNum, defaultNum) {

    var normalNum = "";

    if (abnormalNum || abnormalNum === 0 | abnormalNum === "0")
        normalNum = abnormalNum.toString();

    // TODO: ResponsivevoiceJS kaldırıldı. İhtiyaç kalmadı.
    // switch (normalNum) {
    //     case "0":
    //         normalNum = "sıfır";
    //         break;
    // }

    return normalNum;
}

function sendAbnormal(chrome, caption, category, abnormalText, abnormalNum) {

    abnormalText = abnormalText || abnormalText === 0 || abnormalText === "" ? abnormalText.toString().trim() : null;
    abnormalNum = abnormalNum || abnormalNum === 0 || abnormalNum === "" ? abnormalNum.toString().trim() : null;

    if (abnormalText || abnormalNum) {

        var transaction = "abnormal " + caption + " text:" + abnormalText + ", number:" + abnormalNum;

        chrome.runtime.sendMessage({type: "analytics", category: category, transaction: transaction});

    }

}
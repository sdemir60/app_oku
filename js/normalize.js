function noNormalize(abnormalNo, defaultNo) {

    var normalNo = "", cleanedNormalNo = "";

    if (abnormalNo || abnormalNo === 0) {

        normalNo = abnormalNo.toString().turkishToLower().replace(/\./g, '').trim();
        cleanedNormalNo = normalNo.replace(/\D/g, '');

        if (cleanedNormalNo.length > 0) {

            normalNo = cleanedNormalNo;

        } else {

            switch (normalNo) {
                case "sıfır":
                    normalNo = "0";
                    break;
                case "bir":
                    normalNo = "1";
                    break;
                case "kırk":
                    normalNo = "40";
                case "atmış":
                    normalNo = "60";
                    break;
                case "altmış":
                    normalNo = "60";
                    break;
                case "seksen":
                    normalNo = "80";
                    break;
                case "teksen":
                    normalNo = "80";
                    break;
                case "eksen":
                    normalNo = "80";
                    break;
                case "seksendört":
                    normalNo = "84";
                    break;
                case "yüz":
                    normalNo = "100";
                    break;
            }

        }

        normalNo = !isNaN(parseInt(normalNo)) ? parseInt(normalNo) : defaultNo;

    } else {

        normalNo = defaultNo;

    }

    return normalNo;
}

function noteNormalize(abnormalNote, defaultNote) {

    var normalNote = "", cleanedNormalNote = "";

    if (abnormalNote || abnormalNote === 0) {

        normalNote = abnormalNote.toString().turkishToLower().replace(/\./g, '').trim();
        cleanedNormalNote = normalNote.replace(/\D/g, '');

        if (cleanedNormalNote.length > 0) {

            normalNote = cleanedNormalNote;

        } else {

            switch (normalNote) {
                case "sıfır":
                    normalNote = "0";
                    break;
                case "bir":
                    normalNote = "1";
                    break;
                case "kırk":
                    normalNote = "40";
                case "atmış":
                    normalNote = "60";
                    break;
                case "altmış":
                    normalNote = "60";
                    break;
                case "seksen":
                    normalNote = "80";
                    break;
                case "teksen":
                    normalNote = "80";
                    break;
                case "eksen":
                    normalNote = "80";
                    break;
                case "seksendört":
                    normalNote = "84";
                    break;
                case "yüz":
                    normalNote = "100";
                    break;
                case "g":
                    normalNote = "G";
                    break;
                case "y":
                    normalNote = "G";
                    break;
                case "gelmedi":
                    normalNote = "G";
                    break;
                case "gelmedin":
                    normalNote = "G";
                    break;
                case "girmedi":
                    normalNote = "G";
                    break;
            }

        }

        if (normalNote !== "G")
            normalNote = !isNaN(parseInt(normalNote)) ? parseInt(normalNote) : defaultNote;

    } else {

        normalNote = defaultNote;

    }

    return normalNote;
}

function speakNumberNormalize(abnormalNum, defaultNum) {

    var normalNum = "";

    if (abnormalNum || abnormalNum === 0 | abnormalNum === "0")
        normalNum = abnormalNum.toString();

    return normalNum;
}

function sendAbnormalNumber(category, abnormalText, abnormalNum) {

    abnormalText = abnormalText || abnormalText === 0 || abnormalText === "" ? abnormalText.toString().trim() : null;
    abnormalNum = abnormalNum || abnormalNum === 0 || abnormalNum === "" ? abnormalNum.toString().trim() : null;

    if (abnormalText || abnormalNum) {

        // gtag('event', category, {'text': abnormalText, 'number': abnormalNum});

    }

}
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
    }

    normalNum = !isNaN(parseInt(normalNum)) ? parseInt(normalNum) : defaultNum;

    return normalNum;
}

function speakNumberNormalize(abnormalNum, defaultNum) {

    var normalNum = "";

    if (abnormalNum || abnormalNum === 0 | abnormalNum === "0")
        normalNum = abnormalNum.toString();

    switch (normalNum) {
        case "0":
            normalNum = "sıfır";
            break;
    }

    return normalNum;
}
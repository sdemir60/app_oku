String.prototype.turkishToUpper = function () {
    var string = this;
    var letters = {"i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I"};
    string = string.replace(/(([iışğüçö]))+/g, function (letter) {
        return letters[letter];
    });
    return string.toUpperCase();
};

String.prototype.turkishToLower = function () {
    var string = this;
    var letters = {"İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç"};
    string = string.replace(/(([İIŞĞÜÇÖ]))+/g, function (letter) {
        return letters[letter];
    });
    return string.toLowerCase();
};

String.prototype.getOperationType = function () {

    var text = this;
    var operationType = OperationType.Unknown;

    if (text) {

        text = text.speechTextNormalize();

        if (text.includes("not") && text.replaceAll('not', '').includes("no")) {

            operationType = OperationType.FindStudentEnterNote;

        } else if (text.includes("not")) {

            operationType = OperationType.EnterNote;

        } else if (text.includes("no")) {

            operationType = OperationType.FindStudent;

        } else if (text.includes("oku")) {

            operationType = OperationType.CheckNotes;

        } else if (text.includes("tamam")) {

            operationType = OperationType.Complete;

        }

    }

    return operationType;
};

String.prototype.getNumber = function () {

    var text = this.turkishToLower();
    var number = "";

    if (text) {
        number = text.match(/\d+/g);
        number = number ? number.at(-1) : "";
    }

    if(!number){
        number = text === "g" || text==="y" || text.includes("gelmedi") ||  text.includes("gelmedin") || text.includes("gelmedim") || text.includes("girmedi") ? "G" : "";
    }

    return number;
};

String.prototype.getNoteInfo = function () {

    var text = this;
    var texts;
    var noteInfo = {};

    noteInfo.no = '';
    noteInfo.note = '';

    if (text) {

        text = text.speechTextNormalize();

        texts = text.split('not');
        noteInfo.note = texts.length > 1 ? texts[1].trim().getNumber() : '';

        texts = texts[0] ? texts[0].split('no') : null;
        noteInfo.no = texts && texts.length > 1 ? texts[1].trim().getNumber() : '';

        noteInfo.no = noNormalize(noteInfo.no);
        noteInfo.note = noteNormalize(noteInfo.note);
    }

    return noteInfo;
};

/*

"no x not y" olacak şekilde metni düzenler.
Farklı tespitler olursa eklemeler yapılmalıdır.

*/
String.prototype.speechTextNormalize = function () {
    return this.turkishToLower().replaceAll('note', 'not').trim();
}

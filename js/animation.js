function addBlankCss(input) {

    input.css("background", "rgba(206, 0, 0, 0.1)");
    input.css("border-color", "rgb(206, 0, 0)");

    removeInputCss(input);

    if (!input.hasClass("input-grade-blank"))
        input.addClass("input-grade-blank");

}

function addFilledCss(input) {

    input.css("background", "rgba(28, 150, 0, 0.1)");
    input.css("border-color", "rgb(28, 150, 0)");

    removeInputCss(input);

    if (!input.hasClass("input-grade-filled"))
        input.addClass("input-grade-filled");

}

function removeInputCss(input) {
    input.removeClass("input-grade-blank input-grade-filled");
}

function clearInputCss() {

    var inputs = $("#dgListem tbody tr input");

    inputs.css("background", "");
    inputs.css("border-color", "");
    inputs.removeClass("input-grade-blank input-grade-filled");

}

function blinkerAnimate(tdIndex) {

    var columns;
    var resolve, reject;

    columns = $("#dgListem tbody tr td:nth-child(" + tdIndex + ")");

    columns.addClass("blinker");

    setTimeout(function () {
        resolve();
        columns.removeClass("blinker")
    }, 150);

    return new Promise(function (resolveFunc, rejectFunc) {
        resolve = resolveFunc;
        reject = rejectFunc;
    });
}

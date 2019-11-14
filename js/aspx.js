function __doPostBack(eventTarget, eventArgument) {

    var theForm = document.forms['Form1'];

    if (!theForm) {
        theForm = document.Form1;
    }

    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
        theForm.__EVENTTARGET.value = eventTarget;
        theForm.__EVENTARGUMENT.value = eventArgument;
        theForm.submit();
    }

}
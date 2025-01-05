function focus(event) {

    let $input;

    if (event && event.target) {

        $input = $(event.target);

        $input.closest('table').find('.tr-focused').removeClass('tr-focused');
        $input.closest('tr').addClass('tr-focused');

    } else if (event) {

        $input = $(event);

        $input.closest('table').find('.tr-focused').removeClass('tr-focused');
        $input.closest('tr').addClass('tr-focused');

        $input.focus();
    }

}

function blur() {

    let focusedElements;

    focusedElements = document.querySelectorAll('.tr-focused');

    focusedElements.forEach(element => {
        element.classList.remove('tr-focused');
    });

    document.activeElement.blur();

}
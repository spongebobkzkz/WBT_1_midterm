function readSaved(key, emptyValue) {
    let text = null;
    try {
        text = localStorage.getItem(key);
    } catch (error) {
        return emptyValue;
    }
    if (text === null) {
        return emptyValue;
    }
    try {
        const value = JSON.parse(text);
        if (value === null) {
            return emptyValue;
        }
        if (Array.isArray(emptyValue) && !Array.isArray(value)) {
            return emptyValue;
        }
        return value;
    } catch (error) {
        return emptyValue;
    }
}

function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        return false;
    }
}

$(function () {
    const $toTop = $("#toTop");

    $(window).on("scroll", function () {
        if ($(window).scrollTop() > 400) {
            $toTop.stop(true, true).fadeIn(200);
        } else {
            $toTop.stop(true, true).fadeOut(200);
        }
    });

    $toTop.on("click", function () {
        $("html, body").stop().animate({ scrollTop: 0 }, 500);
    });

    $(".js-scroll").on("click", function (event) {
        const target = $(this).attr("href");

        if ($(target).length > 0) {
            event.preventDefault();
            const top = $(target).offset().top - 80;
            $("html, body").stop().animate({ scrollTop: top }, 600);
        }
    });
});

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

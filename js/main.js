// Shared code for every page: the "back to top" button.
// It uses jQuery, so jQuery must be loaded before this file.

$(function () {
    const $toTop = $("#toTop");

    // Show the button only after the visitor scrolls down a bit.
    $(window).on("scroll", function () {
        if ($(window).scrollTop() > 400) {
            $toTop.stop(true, true).fadeIn(200);
        } else {
            $toTop.stop(true, true).fadeOut(200);
        }
    });

    // Smooth scroll back to the top.
    // stop() cancels the old animation, so many fast clicks do not pile up.
    $toTop.on("click", function () {
        $("html, body").stop().animate({ scrollTop: 0 }, 500);
    });

    // Links with the class "js-scroll" (for example href="#faq")
    // slide smoothly to their section instead of jumping.
    $(".js-scroll").on("click", function (event) {
        const target = $(this).attr("href");

        if ($(target).length > 0) {
            event.preventDefault();
            const top = $(target).offset().top - 80;
            $("html, body").stop().animate({ scrollTop: top }, 600);
        }
    });
});

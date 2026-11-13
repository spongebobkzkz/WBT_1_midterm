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

function updateCartBadge() {
    const savedCart = readSaved("cargoPulseCart", []);
    let count = 0;

    for (let i = 0; i < savedCart.length; i++) {
        const quantity = Number(savedCart[i].quantity);
        if (quantity > 0) {
            count = count + quantity;
        }
    }

    const $badge = $("#navCartCount");
    $badge.text(count);
    if (count > 0) {
        $badge.show();
    } else {
        $badge.hide();
    }
}

function applyTheme(theme) {
    $("html").attr("data-theme", theme).attr("data-bs-theme", theme);
    if (theme === "dark") {
        $("#themeToggle").attr("aria-pressed", "true").attr("aria-label", "Light mode");
    } else {
        $("#themeToggle").attr("aria-pressed", "false").attr("aria-label", "Dark mode");
    }
}

$(function () {
    if ($("html").attr("data-theme") === "dark") {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

    updateCartBadge();

    $("#themeToggle").on("click", function () {
        let next = "dark";
        if ($("html").attr("data-theme") === "dark") {
            next = "light";
        }
        try {
            localStorage.setItem("cargoPulseTheme", next);
        } catch (error) {
            console.warn("The theme could not be saved in this browser.");
        }
        applyTheme(next);
    });

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

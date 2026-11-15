const signupIds = ["signupName", "signupEmail", "signupPassword", "signupRepeat"];
const loginIds = ["loginEmail", "loginPassword"];

function showError($field, message) {
    $field.addClass("is-invalid").removeClass("is-valid");
    $field.closest("div").find(".invalid-feedback").text(message);
}

function clearError($field) {
    $field.removeClass("is-invalid").addClass("is-valid");
    $field.closest("div").find(".invalid-feedback").text("");
}

function checkField(id) {
    const $field = $("#" + id);
    const value = $.trim($field.val());

    if (id === "signupName") {
        const letters = value.replace(/[^\p{L}]/gu, "");
        if (value === "") {
            showError($field, "Please write your full name.");
            return false;
        }
        if (letters.length < 2 || !/^[\p{L}\s'-]+$/u.test(value)) {
            showError($field, "The name must have at least 2 letters and no numbers or signs.");
            return false;
        }
    }

    if (id === "signupEmail" || id === "loginEmail") {
        if (value === "") {
            showError($field, "Please write your email.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) {
            showError($field, "This email looks wrong. Example: name@company.kz");
            return false;
        }
    }

    if (id === "signupPassword") {
        if (value === "") {
            showError($field, "Please make a password.");
            return false;
        }
        if (value.length < 6 || !/\d/.test(value)) {
            showError($field, "The password needs at least 6 characters and at least one number.");
            return false;
        }
    }

    if (id === "signupRepeat") {
        if (value === "") {
            showError($field, "Please write the password again.");
            return false;
        }
        if (value !== $.trim($("#signupPassword").val())) {
            showError($field, "The two passwords are not the same.");
            return false;
        }
    }

    if (id === "loginPassword" && value === "") {
        showError($field, "Please write your password.");
        return false;
    }

    clearError($field);
    return true;
}

function checkAll(ids) {
    let allCorrect = true;
    for (let i = 0; i < ids.length; i++) {
        if (!checkField(ids[i])) {
            allCorrect = false;
        }
    }
    return allCorrect;
}

function showSuccess(boxId, html) {
    $("#" + boxId)
        .stop(true, true)
        .hide()
        .html(html)
        .slideDown(300)
        .trigger("focus");
}

$(function () {
    $("#signupForm, #loginForm").on("input", "input", function () {
        if ($(this).hasClass("is-invalid")) {
            checkField(this.id);
        }

        if (this.id === "signupPassword" && $("#signupRepeat").hasClass("is-invalid")) {
            checkField("signupRepeat");
        }
    });

    $("#signupForm").on("submit", function (event) {
        event.preventDefault();

        if (!checkAll(signupIds)) {
            $("#signupForm .is-invalid").first().trigger("focus");
            return;
        }

        showSuccess("signupSuccess", '<h3 class="h5 mb-0">All fields are correct.</h3>');
    });

    $("#loginForm").on("submit", function (event) {
        event.preventDefault();

        if (!checkAll(loginIds)) {
            $("#loginForm .is-invalid").first().trigger("focus");
            return;
        }

        showSuccess("loginSuccess", '<h3 class="h5 mb-0">All fields are correct.</h3>');
    });
});

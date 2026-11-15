const signupIds = ["signupName", "signupEmail", "signupPassword", "signupRepeat"];
const loginIds = ["loginEmail", "loginPassword"];

function todayText() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return today.getFullYear() + "-" + month + "-" + day;
}

function findUser(email) {
    const users = readSaved("cargoPulseUsers", []);
    for (let i = 0; i < users.length; i++) {
        if (users[i] && users[i].email === email) {
            return users[i];
        }
    }
    return null;
}

function openPage(address) {
    window.location.href = address;
}

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
        if (id === "signupEmail" && findUser(value.toLowerCase()) !== null) {
            showError($field, "This email already has an account. Please log in.");
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

function showLoggedIn() {
    const user = findUser(readSaved("cargoPulseCurrentUser", ""));
    if (user === null) {
        return;
    }
    $("#loggedInName").text(user.name);
    $("#loggedInBox").show();
}

function signUp() {
    const name = $.trim($("#signupName").val());
    const email = $.trim($("#signupEmail").val()).toLowerCase();
    const users = readSaved("cargoPulseUsers", []);

    users.push({
        name: name,
        email: email,
        password: $.trim($("#signupPassword").val()),
        joined: todayText()
    });

    if (!saveData("cargoPulseUsers", users)) {
        showError($("#signupEmail"), "This browser does not let us save data. Please allow site data.");
        return;
    }
    saveData("cargoPulseCurrentUser", email);

    const safeName = $("<span>").text(name).html();
    showSuccess("signupSuccess",
        '<h3 class="h5">Welcome, ' + safeName + "!</h3>" +
        '<p class="mb-0">Your account is ready. We are opening your profile...</p>'
    );

    setTimeout(function () {
        openPage("profile.html");
    }, 1200);
}

function logIn() {
    const email = $.trim($("#loginEmail").val()).toLowerCase();
    const password = $.trim($("#loginPassword").val());
    const user = findUser(email);

    if (user === null || user.password !== password) {
        showError($("#loginPassword"), "Wrong email or password.");
        $("#loginPassword").trigger("focus");
        return;
    }

    saveData("cargoPulseCurrentUser", user.email);
    openPage("profile.html");
}

$(function () {
    showLoggedIn();

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

        signUp();
    });

    $("#loginForm").on("submit", function (event) {
        event.preventDefault();

        if (!checkAll(loginIds)) {
            $("#loginForm .is-invalid").first().trigger("focus");
            return;
        }

        logIn();
    });
});

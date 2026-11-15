function findCurrentUser() {
    const email = readSaved("cargoPulseCurrentUser", "");
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

function safeText(text) {
    return $("<span>").text(text).html();
}

function renderQuotes() {
    const quotes = readSaved("cargoPulseQuotes", []);
    const $list = $("#quoteList");
    let count = 0;

    $list.empty();

    for (let i = 0; i < quotes.length; i++) {
        const q = quotes[i];
        if (!q || typeof q !== "object") {
            continue;
        }

        const item = document.createElement("div");
        item.className = "col-md-6 col-lg-4 quote-item";
        item.innerHTML =
            '<article class="cardx no-lift saved-quote">' +
            '<h3 class="h5">' + safeText(q.from) + " → " + safeText(q.to) + "</h3>" +
            '<p class="muted mb-2">' + safeText(q.mode) + " · " + Number(q.weight) + " kg</p>" +
            '<div class="price">' + Number(q.price).toLocaleString("en-US") + " ₸</div>" +
            '<p class="muted">About ' + Number(q.days) + " days · saved on " + safeText(q.date) + "</p>" +
            '<button class="btn btn-soft remove-quote" type="button" data-id="' + Number(q.id) + '">Remove</button>' +
            "</article>";
        $list.append(item);
        count = count + 1;
    }

    $("#quoteCount").text(count);

    if (count === 0) {
        $("#quotesEmpty").show();
        $("#clearQuotes").hide();
    } else {
        $("#quotesEmpty").hide();
        $("#clearQuotes").show();
    }
}

function removeQuote(id) {
    const quotes = readSaved("cargoPulseQuotes", []);
    const kept = [];
    for (let i = 0; i < quotes.length; i++) {
        if (quotes[i] && quotes[i].id !== id) {
            kept.push(quotes[i]);
        }
    }
    saveData("cargoPulseQuotes", kept);
}

function showProfile(user) {
    $("#profileName").text(user.name);
    $("#profileEmail").text(user.email);
    $("#profileJoined").text(user.joined);
    $("#profileArea").show();
}

function logOut() {
    localStorage.removeItem("cargoPulseCurrentUser");
    openPage("account.html");
}

$(function () {
    const user = findCurrentUser();

    if (user === null) {
        $("#profileEmpty").show();
        return;
    }

    showProfile(user);
    renderQuotes();

    $("#logoutButton").on("click", logOut);

    $("#quoteList").on("click", ".remove-quote", function () {
        removeQuote(Number($(this).attr("data-id")));

        $(this).closest(".quote-item").stop(true, true).fadeOut(300, function () {
            renderQuotes();
            $("#savedTitle").trigger("focus");
        });
    });

    $("#clearQuotes").on("click", function () {
        saveData("cargoPulseQuotes", []);
        renderQuotes();
        $("#savedTitle").trigger("focus");
    });
});

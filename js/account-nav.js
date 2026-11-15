function showAccountLink() {
    const $link = $("#accountLink");
    if ($link.length === 0) {
        return;
    }

    const email = readSaved("cargoPulseCurrentUser", "");
    const users = readSaved("cargoPulseUsers", []);

    for (let i = 0; i < users.length; i++) {
        if (users[i] && users[i].email === email && typeof users[i].name === "string") {
            const firstName = users[i].name.split(" ")[0];
            $link.text(firstName).attr("href", "profile.html");
            return;
        }
    }
}

$(showAccountLink);

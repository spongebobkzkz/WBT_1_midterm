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

    $("#logoutButton").on("click", logOut);
});

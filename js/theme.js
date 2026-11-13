let savedTheme = "light";

try {
    if (localStorage.getItem("cargoPulseTheme") === "dark") {
        savedTheme = "dark";
    }
} catch (error) {
    savedTheme = "light";
}

document.documentElement.setAttribute("data-theme", savedTheme);
document.documentElement.setAttribute("data-bs-theme", savedTheme);

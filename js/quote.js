// Get a quote page (Estai Beisenbai)
// 1. The city lists are made from the "cities" array.
// 2. Price calculator: the price and days for air, rail and road update while you type.
// 3. Form check with clear messages under every field.

const cities = [
    { name: "Guangzhou", country: "China", zone: 3, airport: true },
    { name: "Yiwu", country: "China", zone: 3, airport: false },
    { name: "Urumqi", country: "China", zone: 2, airport: true },
    { name: "Istanbul", country: "Turkey", zone: 3, airport: true },
    { name: "Tashkent", country: "Uzbekistan", zone: 1, airport: true },
    { name: "Bishkek", country: "Kyrgyzstan", zone: 1, airport: true },
    { name: "Almaty", country: "Kazakhstan", zone: 0, airport: true },
    { name: "Astana", country: "Kazakhstan", zone: 0, airport: true },
    { name: "Shymkent", country: "Kazakhstan", zone: 0, airport: true },
    { name: "Karaganda", country: "Kazakhstan", zone: 0, airport: false }
];

// Prices per kg are the same as on the Services page.
const modes = [
    { id: "air", name: "Air cargo", pricePerKg: 2900, baseDays: 2, daysPerZone: 1, minPrice: 15000 },
    { id: "rail", name: "Rail cargo", pricePerKg: 1200, baseDays: 6, daysPerZone: 4, minPrice: 25000 },
    { id: "road", name: "Road cargo", pricePerKg: 850, baseDays: 4, daysPerZone: 5, minPrice: 20000 }
];

const typeExtra = { commercial: 1, personal: 1, electronics: 1.15, fragile: 1.25 };

let chosenMode = "";

// ---------- Helpers ----------

function findCity(name) {
    for (let i = 0; i < cities.length; i++) {
        if (cities[i].name === name) {
            return cities[i];
        }
    }
    return null;
}

function formatPrice(number) {
    return number.toLocaleString("en-US") + " ₸";
}

function fillCityLists() {
    for (let i = 0; i < cities.length; i++) {
        const text = cities[i].name + ", " + cities[i].country;
        $("#from").append(new Option(text, cities[i].name));
        $("#to").append(new Option(text, cities[i].name));
    }
}

// ---------- Price calculator ----------

// Returns { price, days, available } for one transport.
function estimate(mode) {
    const from = findCity($("#from").val());
    const to = findCity($("#to").val());
    const weight = Number($("#weight").val());
    const type = $("#cargoType").val();

    if (from === null || to === null || from === to || !(weight > 0)) {
        return null;
    }

    // Planes need an airport in both cities.
    if (mode.id === "air" && (!from.airport || !to.airport)) {
        return { available: false };
    }

    // The farther zone of the two cities sets the distance.
    let zone = from.zone;
    if (to.zone > zone) {
        zone = to.zone;
    }

    const zoneExtra = 1 + zone * 0.2;
    let price = Math.round(weight * mode.pricePerKg * zoneExtra * typeExtra[type]);
    if (price < mode.minPrice) {
        price = mode.minPrice;
    }

    const days = mode.baseDays + zone * mode.daysPerZone;

    return { available: true, price: price, days: days };
}

function renderModes() {
    const $box = $("#modeOptions");
    $box.empty();

    // Find the cheapest available price to mark it.
    let cheapest = 0;
    for (let i = 0; i < modes.length; i++) {
        const result = estimate(modes[i]);
        if (result !== null && result.available && (cheapest === 0 || result.price < cheapest)) {
            cheapest = result.price;
        }
    }

    for (let i = 0; i < modes.length; i++) {
        const mode = modes[i];
        const result = estimate(mode);

        let priceText = "Fill in the route and weight";
        let daysText = "";
        let disabled = false;
        let badge = "";

        if (result !== null && !result.available) {
            priceText = "No airport in one of the cities";
            disabled = true;
        } else if (result !== null) {
            priceText = formatPrice(result.price);
            daysText = "about " + result.days + " days";
            if (result.price === cheapest) {
                badge = '<span class="tag">Cheapest</span>';
            }
        }

        if (disabled && chosenMode === mode.id) {
            chosenMode = "";
        }

        const label = document.createElement("label");
        label.className = "mode-card";
        if (disabled) {
            label.classList.add("off");
        }
        label.innerHTML =
            '<input type="radio" name="mode" value="' + mode.id + '"' +
            (chosenMode === mode.id ? " checked" : "") +
            (disabled ? " disabled" : "") + ">" +
            '<span class="mode-name">' + mode.name + " " + badge + "</span>" +
            '<span class="mode-price">' + priceText + "</span>" +
            '<span class="mode-days">' + daysText + "</span>";
        $box.append(label);
    }
}

// ---------- Form check ----------

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

    if (id === "customerName") {
        if (value === "") {
            showError($field, "Please write your name.");
            return false;
        }
        if (value.length < 2 || /\d/.test(value)) {
            showError($field, "The name must have at least 2 letters and no numbers.");
            return false;
        }
    }

    if (id === "customerEmail") {
        if (value === "") {
            showError($field, "Please write your email, we send the estimate there.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) {
            showError($field, "This email looks wrong. Example: name@company.kz");
            return false;
        }
    }

    if (id === "customerPhone") {
        const digits = value.replace(/[\s()-]/g, "");
        if (value === "") {
            showError($field, "Please write your phone number.");
            return false;
        }
        if (!/^(\+7|8)7\d{9}$/.test(digits)) {
            showError($field, "Use a Kazakhstan number: +7 and 10 digits, e.g. +7 777 123 45 67.");
            return false;
        }
    }

    if (id === "from" && value === "") {
        showError($field, "Where does the cargo start?");
        return false;
    }

    if (id === "to") {
        if (value === "") {
            showError($field, "Where should the cargo go?");
            return false;
        }
        if (value === $("#from").val()) {
            showError($field, "The destination must be different from the start city.");
            return false;
        }
    }

    if (id === "weight") {
        const weight = Number(value);
        if (value === "") {
            showError($field, "Please write the weight.");
            return false;
        }
        if (!(weight >= 1 && weight <= 20000)) {
            showError($field, "The weight must be from 1 to 20,000 kg.");
            return false;
        }
    }

    if (id === "shipDate") {
        if (value === "") {
            showError($field, "When is the cargo ready?");
            return false;
        }
        const chosen = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = Math.round((chosen - today) / (24 * 60 * 60 * 1000));
        if (days < 0) {
            showError($field, "This date is in the past.");
            return false;
        }
        if (days > 60) {
            showError($field, "We plan up to 60 days ahead. Please choose an earlier date.");
            return false;
        }
    }

    clearError($field);
    return true;
}

function checkMode() {
    if (chosenMode === "") {
        $("#modeError").text("Please choose air, rail or road.");
        return false;
    }
    $("#modeError").text("");
    return true;
}

const fieldIds = ["customerName", "customerEmail", "customerPhone", "from", "to", "weight", "shipDate"];

// ---------- Events ----------

$(function () {
    fillCityLists();
    renderModes();

    // The calendar does not show past days.
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    $("#shipDate").attr("min", today.getFullYear() + "-" + month + "-" + day);

    // Prices change while the visitor types or chooses.
    $("#from, #to, #cargoType").on("change", renderModes);
    $("#weight").on("input", renderModes);

    $("#modeOptions").on("change", "input", function () {
        chosenMode = $(this).val();
        checkMode();
    });

    // Fix an error -> the message disappears.
    $("#quoteForm").on("input change", "input, select", function () {
        if ($(this).hasClass("is-invalid")) {
            checkField(this.id);
        }
        // The "to" city depends on "from", so check it again too.
        if (this.id === "from" && $("#to").hasClass("is-invalid")) {
            checkField("to");
        }
    });

    $("#quoteForm").on("blur", "input:not([type=radio]), select", function () {
        if ($.trim($(this).val()) !== "") {
            checkField(this.id);
        }
    });

    // Letters counter for the details
    $("#details").on("input", function () {
        $("#detailsCount").text($(this).val().length + " / 500");
    });

    $("#quoteForm").on("submit", function (event) {
        event.preventDefault();

        let allCorrect = true;
        for (let i = 0; i < fieldIds.length; i++) {
            if (!checkField(fieldIds[i])) {
                allCorrect = false;
            }
        }
        if (!checkMode()) {
            allCorrect = false;
        }

        if (!allCorrect) {
            $("#quoteForm .is-invalid").first().trigger("focus");
            return;
        }

        let mode = null;
        for (let i = 0; i < modes.length; i++) {
            if (modes[i].id === chosenMode) {
                mode = modes[i];
            }
        }
        const result = estimate(mode);
        const name = $("<span>").text($.trim($("#customerName").val())).html();
        const email = $("<span>").text($.trim($("#customerEmail").val())).html();

        $("#quoteSuccess")
            .stop(true, true)
            .hide()
            .html(
                '<h2 class="h4">Thank you, ' + name + "! Your request is sent.</h2>" +
                '<p class="mb-1">' + mode.name + ": " + $("#from").val() + " → " + $("#to").val() +
                ", " + $("#weight").val() + " kg.</p>" +
                '<p class="mb-0">Estimated price <strong>' + formatPrice(result.price) +
                "</strong>, about " + result.days + " days. The final offer comes to " + email + " within one working day.</p>"
            )
            .slideDown(400)
            .trigger("focus");

        // Clear everything
        this.reset();
        $("#quoteForm .is-valid, #quoteForm .is-invalid").removeClass("is-valid is-invalid");
        $("#detailsCount").text("0 / 500");
        chosenMode = "";
        renderModes();
    });
});

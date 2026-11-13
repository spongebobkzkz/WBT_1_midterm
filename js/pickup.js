const slots = [
    { id: "w1", time: "09:00 – 10:30", period: "morning", driver: "Arman", vehicle: "Van", maxKg: 800, spotsLeft: 3, fee: 0 },
    { id: "w2", time: "10:30 – 12:00", period: "morning", driver: "Dana", vehicle: "Van", maxKg: 800, spotsLeft: 0, fee: 0 },
    { id: "w3", time: "10:00 – 12:00", period: "morning", driver: "Serik", vehicle: "Truck", maxKg: 1500, spotsLeft: 1, fee: 2500 },
    { id: "w4", time: "12:00 – 13:30", period: "afternoon", driver: "Arman", vehicle: "Van", maxKg: 800, spotsLeft: 2, fee: 0 },
    { id: "w5", time: "13:30 – 15:00", period: "afternoon", driver: "Dana", vehicle: "Van", maxKg: 800, spotsLeft: 4, fee: 0 },
    { id: "w6", time: "14:00 – 16:00", period: "afternoon", driver: "Serik", vehicle: "Truck", maxKg: 1500, spotsLeft: 0, fee: 2500 },
    { id: "w7", time: "16:00 – 17:30", period: "afternoon", driver: "Aibek", vehicle: "Van", maxKg: 800, spotsLeft: 1, fee: 0 },
    { id: "w8", time: "17:30 – 19:00", period: "evening", driver: "Aibek", vehicle: "Van", maxKg: 800, spotsLeft: 2, fee: 1000 },
    { id: "w9", time: "18:00 – 20:00", period: "evening", driver: "Serik", vehicle: "Truck", maxKg: 1500, spotsLeft: 2, fee: 3500 },
    { id: "w10", time: "19:00 – 20:30", period: "evening", driver: "Dana", vehicle: "Van", maxKg: 800, spotsLeft: 0, fee: 1000 }
];

const BASE_PRICE = 2000;
const PRICE_PER_PARCEL = 300;
const FREE_KG = 50;
const PRICE_PER_KG = 40;

let selectedSlotId = "";
let currentPeriod = "all";

let supplies = null;

function loadSupplies() {
    const saved = localStorage.getItem("cargoPulseSupplies");
    if (saved !== null) {
        supplies = JSON.parse(saved);
    }
}

function formatPrice(number) {
    return number.toLocaleString("en-US") + " ₸";
}

function findSlot(id) {
    for (let i = 0; i < slots.length; i++) {
        if (slots[i].id === id) {
            return slots[i];
        }
    }
    return null;
}

function getWeight() {
    const weight = Number($("#pickupWeight").val());
    if (weight > 0) {
        return weight;
    }
    return 0;
}

function renderSlots() {
    const $list = $("#slotList");
    const onlyFree = $("#onlyFree").is(":checked");
    const weight = getWeight();

    let shown = 0;
    let freePlaces = 0;

    $list.empty();

    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];

        if (currentPeriod !== "all" && slot.period !== currentPeriod) {
            continue;
        }
        if (onlyFree && slot.spotsLeft === 0) {
            continue;
        }

        const isFull = slot.spotsLeft === 0;
        const isTooHeavy = weight > slot.maxKg;

        let note = slot.spotsLeft + " places left";
        if (slot.spotsLeft === 1) {
            note = "1 place left";
        }
        if (isFull) {
            note = "Full";
        } else if (isTooHeavy) {
            note = "Too heavy for this " + slot.vehicle.toLowerCase();
        }

        let feeText = "no extra fee";
        if (slot.fee > 0) {
            feeText = "+" + formatPrice(slot.fee);
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "slot";
        button.setAttribute("data-id", slot.id);
        button.disabled = isFull || isTooHeavy;

        if (slot.id === selectedSlotId) {
            button.classList.add("chosen");
            button.setAttribute("aria-pressed", "true");
        } else {
            button.setAttribute("aria-pressed", "false");
        }

        button.innerHTML =
            '<span class="slot-time">' + slot.time + "</span>" +
            '<span class="slot-meta">' + slot.vehicle + " · " + feeText + "</span>" +
            '<span class="slot-note">' + note + "</span>";

        $list.append(button);

        shown = shown + 1;
        freePlaces = freePlaces + slot.spotsLeft;
    }

    const chosen = findSlot(selectedSlotId);
    if (chosen !== null && (chosen.spotsLeft === 0 || weight > chosen.maxKg)) {
        selectedSlotId = "";
        $("#slotDetails").stop(true, true).slideUp(200);
    }

    if (shown === 0) {
        $list.html(
            '<div class="empty-state">' +
            "<strong>No time windows here</strong>" +
            "All windows in this part of the day are full. " +
            '<button class="btn-soft mt-3" type="button" id="showAllSlots">Show the whole day</button>' +
            "</div>"
        );
    }

    $("#slotCount").text("Showing " + shown + " of " + slots.length + " windows · " + freePlaces + " free places");
}

function showSlotDetails(slot) {
    const html =
        "<strong>" + slot.time + " with " + slot.driver + "</strong><br>" +
        slot.vehicle + " up to " + slot.maxKg + " kg. " +
        slot.driver + " calls you 30 minutes before arrival.";

    $("#slotDetails").stop(true, true).slideUp(150, function () {
        $(this).html(html).slideDown(250);
    });
}

function calculatePrice() {
    const parcels = Number($("#pickupParcels").val());
    const weight = getWeight();
    const slot = findSlot(selectedSlotId);

    const rows = [];
    let total = BASE_PRICE;
    rows.push(["Driver comes to you", BASE_PRICE]);

    if (parcels > 1) {
        const parcelsPrice = (parcels - 1) * PRICE_PER_PARCEL;
        total = total + parcelsPrice;
        let parcelsText = (parcels - 1) + " extra parcels";
        if (parcels === 2) {
            parcelsText = "1 extra parcel";
        }
        rows.push([parcelsText, parcelsPrice]);
    }

    if (weight > FREE_KG) {
        const weightPrice = Math.round((weight - FREE_KG) * PRICE_PER_KG);
        total = total + weightPrice;
        rows.push(["Weight over " + FREE_KG + " kg", weightPrice]);
    }

    if (slot !== null && slot.fee > 0) {
        total = total + slot.fee;
        rows.push([slot.vehicle + ", " + slot.time, slot.fee]);
    }

    if (supplies !== null) {
        total = total + supplies.total;
        rows.push(["Packing supplies (" + supplies.count + " items)", supplies.total]);
    }

    return { rows: rows, total: total };
}

function updateSummary() {
    const price = calculatePrice();
    const $summary = $("#summaryList");

    $summary.empty();

    for (let i = 0; i < price.rows.length; i++) {
        $summary.append("<dt>" + price.rows[i][0] + "</dt><dd>" + formatPrice(price.rows[i][1]) + "</dd>");
    }

    $("#summaryTotal").text(formatPrice(price.total));

    if (supplies !== null) {
        $("#suppliesNote").html(
            "The driver brings your packing supplies. " +
            '<button class="link-button" type="button" id="removeSupplies">Remove them</button>'
        );
    } else {
        $("#suppliesNote").html('Need boxes? <a href="shop.html">Order packing supplies</a>.');
    }
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

    if (id === "pickupName") {
        if (value === "") {
            showError($field, "Please write your name.");
            return false;
        }
        const letters = value.replace(/[^\p{L}]/gu, "");
        if (letters.length < 2 || !/^[\p{L}\s'-]+$/u.test(value)) {
            showError($field, "The name must have at least 2 letters and no numbers or signs.");
            return false;
        }
    }

    if (id === "pickupPhone") {
        const digits = value.replace(/[\s()-]/g, "");
        if (value === "") {
            showError($field, "Please write your phone number.");
            return false;
        }
        if (!/^(\+7|8)7\d{9}$/.test(digits)) {
            showError($field, "Write a Kazakhstan mobile number, for example +7 701 234 56 78.");
            return false;
        }
    }

    if (id === "pickupEmail") {
        if (value === "") {
            showError($field, "Please write your email.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) {
            showError($field, "This email looks wrong. Example: you@company.kz");
            return false;
        }
    }

    if (id === "pickupDistrict" && value === "") {
        showError($field, "Please choose your district.");
        return false;
    }

    if (id === "pickupAddress") {
        if (value === "") {
            showError($field, "Please write the street and building.");
            return false;
        }
        if (value.length < 8 || !/\d/.test(value)) {
            showError($field, "Add the building number, for example: Abay Ave 52.");
            return false;
        }
    }

    if (id === "pickupDate") {
        if (value === "") {
            showError($field, "Please choose a date.");
            return false;
        }

        const chosen = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysAhead = Math.round((chosen - today) / (24 * 60 * 60 * 1000));

        if (daysAhead < 1) {
            showError($field, "The earliest pickup is tomorrow.");
            return false;
        }
        if (daysAhead > 14) {
            showError($field, "You can book up to 14 days ahead.");
            return false;
        }
        if (chosen.getDay() === 0) {
            showError($field, "We do not pick up on Sundays. Please choose another day.");
            return false;
        }
    }

    if (id === "pickupParcels") {
        const parcels = Number(value);
        if (value === "") {
            showError($field, "How many parcels?");
            return false;
        }
        if (!Number.isInteger(parcels) || parcels < 1 || parcels > 30) {
            showError($field, "Write a whole number from 1 to 30.");
            return false;
        }
    }

    if (id === "pickupWeight") {
        const weight = Number(value);
        const slot = findSlot(selectedSlotId);
        if (value === "") {
            showError($field, "Write the total weight.");
            return false;
        }
        if (weight < 1 || weight > 1500) {
            showError($field, "The weight must be from 1 to 1500 kg.");
            return false;
        }
        if (slot !== null && weight > slot.maxKg) {
            showError($field, "Too heavy for the " + slot.vehicle.toLowerCase() + " (max " + slot.maxKg + " kg).");
            return false;
        }
    }

    if (id === "pickupPacked" && !$field.is(":checked")) {
        showError($field, "Please pack the parcels before the driver comes.");
        return false;
    }

    clearError($field);
    return true;
}

function checkSlot() {
    if (selectedSlotId === "") {
        $("#slotError").text("Please choose a time window above.");
        return false;
    }
    $("#slotError").text("");
    return true;
}

const fieldIds = [
    "pickupName", "pickupPhone", "pickupEmail", "pickupDistrict",
    "pickupAddress", "pickupDate", "pickupParcels", "pickupWeight", "pickupPacked"
];

function toInputDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}

$(function () {
    loadSupplies();
    renderSlots();
    updateSummary();

    $("#suppliesNote").on("click", "#removeSupplies", function () {
        localStorage.removeItem("cargoPulseSupplies");
        supplies = null;
        updateSummary();
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $("#pickupDate").attr("min", toInputDate(tomorrow));

    $("#periodFilter").on("click", "button", function () {
        currentPeriod = $(this).attr("data-period");
        $("#periodFilter button").removeClass("selected");
        $(this).addClass("selected");
        renderSlots();
    });

    $("#onlyFree").on("change", renderSlots);

    $("#slotList").on("click", "#showAllSlots", function () {
        currentPeriod = "all";
        $("#onlyFree").prop("checked", false);
        $("#periodFilter button").removeClass("selected");
        $("#periodFilter button[data-period='all']").addClass("selected");
        renderSlots();
    });

    $("#slotList").on("click", ".slot", function () {
        selectedSlotId = $(this).attr("data-id");
        checkSlot();
        renderSlots();
        updateSummary();
        showSlotDetails(findSlot(selectedSlotId));

        if ($("#pickupWeight").hasClass("is-invalid")) {
            checkField("pickupWeight");
        }
    });

    $("#pickupParcels, #pickupWeight").on("input", function () {
        renderSlots();
        updateSummary();
    });

    $("#pickupForm").on("input change", "input, select", function () {
        if ($(this).hasClass("is-invalid")) {
            checkField(this.id);
        }
    });

    $("#pickupForm").on("blur", "input, select", function () {
        if ($.trim($(this).val()) !== "" && this.type !== "checkbox") {
            checkField(this.id);
        }
    });

    $("#pickupForm").on("submit", function (event) {
        event.preventDefault();

        let allCorrect = true;
        for (let i = 0; i < fieldIds.length; i++) {
            if (!checkField(fieldIds[i])) {
                allCorrect = false;
            }
        }
        if (!checkSlot()) {
            allCorrect = false;
        }

        if (!allCorrect) {

            $("#pickupForm .is-invalid").first().trigger("focus");
            if (selectedSlotId === "") {
                $("html, body").stop().animate({ scrollTop: $("#slotList").offset().top - 120 }, 400);
            }
            return;
        }

        const slot = findSlot(selectedSlotId);
        const price = calculatePrice();
        const bookingNumber = "PU-" + Math.floor(1000 + Math.random() * 9000);
        const name = $.trim($("#pickupName").val());
        const date = new Date($("#pickupDate").val() + "T00:00:00");
        const dateText = date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

        slot.spotsLeft = slot.spotsLeft - 1;

        $("#pickupSuccess")
            .stop(true, true)
            .hide()
            .html(
                '<h2 class="h4">Thank you, ' + $("<span>").text(name).html() + "! Your pickup is booked.</h2>" +
                '<p class="mb-1">Booking number: <strong>' + bookingNumber + "</strong></p>" +
                '<p class="mb-1">' + dateText + ", " + slot.time + " · driver " + slot.driver + "</p>" +
                '<p class="mb-0">Price to pay at pickup: <strong>' + formatPrice(price.total) + "</strong></p>"
            )
            .fadeIn(500)
            .trigger("focus");

        this.reset();
        $("#pickupForm .is-valid, #pickupForm .is-invalid").removeClass("is-valid is-invalid");
        selectedSlotId = "";
        $("#slotDetails").stop(true, true).slideUp(200);
        localStorage.removeItem("cargoPulseSupplies");
        supplies = null;
        renderSlots();
        updateSummary();
    });
});

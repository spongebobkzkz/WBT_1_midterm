// Services page (Estai Beisenbai)
// 1. Cards from the "services" array, with a filter (transport / extra).
// 2. "More" button opens the details of a card (jQuery slideToggle).
// 3. Compare up to 3 services in a table.

const services = [
    { id: "air", name: "Air cargo", type: "transport", tag: "Fastest", price: 2900, unit: "per kg", days: "2–5 days", maxKg: 500, tracking: "Live", text: "For urgent, compact shipments that need to arrive quickly.", details: "Flights from Guangzhou, Shenzhen, Urumqi and Istanbul to Almaty and Astana. Good for electronics, documents and samples." },
    { id: "rail", name: "Rail cargo", type: "transport", tag: "Balanced", price: 1200, unit: "per kg", days: "10–18 days", maxKg: 20000, tracking: "Every station", text: "A reliable solution for medium-sized commercial shipments.", details: "Containers through Khorgos and Dostyk. A good price for big orders that are not very urgent." },
    { id: "road", name: "Road cargo", type: "transport", tag: "Economy", price: 850, unit: "per kg", days: "7–20 days", maxKg: 20000, tracking: "GPS", text: "Flexible delivery for large or non-urgent goods.", details: "Trucks from China, Turkey and Central Asia. Door-to-door: we load at the factory and unload at your warehouse." },
    { id: "express", name: "City express", type: "transport", tag: "Same day", price: 3500, unit: "per parcel", days: "same day", maxKg: 30, tracking: "Live", text: "Parcels inside Almaty or Astana in a few hours.", details: "A courier picks up and delivers within the city on the same day. Orders until 15:00." },
    { id: "customs", name: "Customs clearance", type: "extra", tag: "Paperwork", price: 25000, unit: "per shipment", days: "1–3 days", maxKg: 0, tracking: "Status by SMS", text: "We prepare the declaration and talk to customs for you.", details: "Our broker checks the invoice and the codes of your goods, so the cargo does not wait at the border." },
    { id: "storage", name: "Warehouse storage", type: "extra", tag: "Almaty", price: 150, unit: "per kg a week", days: "any time", maxKg: 50000, tracking: "Photo report", text: "Keep your goods in our warm warehouse in Almaty.", details: "A dry, heated warehouse with cameras. We send photos of your goods and ship them when you say." },
    { id: "insurance", name: "Cargo insurance", type: "extra", tag: "Safe", price: 1, unit: "% of the value", days: "with any delivery", maxKg: 0, tracking: "—", text: "Get the money back if the cargo is lost or broken.", details: "1% of the declared value. We pay back the full value in 10 working days after the report." },
    { id: "packing", name: "Packing and labels", type: "extra", tag: "Careful", price: 500, unit: "per box", days: "1 day", maxKg: 0, tracking: "—", text: "We pack fragile goods and put labels in Russian and English.", details: "Bubble wrap, strong boxes, wooden frames for big items. Boxes are also in our packing shop." }
];

const MAX_COMPARE = 3;
let compareIds = [];
let currentType = "all";

function formatPrice(service) {
    if (service.unit === "% of the value") {
        return service.price + "%";
    }
    return "From " + service.price.toLocaleString("en-US") + " ₸";
}

function findService(id) {
    for (let i = 0; i < services.length; i++) {
        if (services[i].id === id) {
            return services[i];
        }
    }
    return null;
}

// ---------- 1. Cards ----------

function renderServices() {
    const $list = $("#serviceList");
    $list.empty();

    for (let i = 0; i < services.length; i++) {
        const s = services[i];

        if (currentType !== "all" && s.type !== currentType) {
            continue;
        }

        let checked = "";
        if (compareIds.indexOf(s.id) !== -1) {
            checked = " checked";
        }

        const column = document.createElement("div");
        column.className = "col-md-6 col-lg-3";
        column.innerHTML =
            '<article class="cardx service-card">' +
            '<span class="tag">' + s.tag + "</span>" +
            '<h2 class="h4 mt-3">' + s.name + "</h2>" +
            '<p class="text-secondary">' + s.text + "</p>" +
            '<div class="price">' + formatPrice(s) + "</div>" +
            '<small class="text-secondary">' + s.unit + "</small>" +
            '<div class="service-details" id="details-' + s.id + '">' + s.details + "</div>" +
            '<div class="service-actions">' +
            '<button class="btn-soft more-button" type="button" data-id="' + s.id + '" aria-expanded="false" aria-controls="details-' + s.id + '">More</button>' +
            '<label class="compare-check"><input type="checkbox" value="' + s.id + '"' + checked + "> Compare</label>" +
            "</div>" +
            "</article>";

        $list.append(column);
    }
}

// ---------- 3. Compare ----------

function updateCompareBar() {
    const count = compareIds.length;

    if (count === 0) {
        $("#compareBar").stop(true, true).slideUp(200);
        return;
    }

    let names = [];
    for (let i = 0; i < compareIds.length; i++) {
        names.push(findService(compareIds[i]).name);
    }

    $("#compareText").html("<strong>" + count + " of " + MAX_COMPARE + "</strong> chosen: " + names.join(", "));
    $("#showCompare").prop("disabled", count < 2);
    $("#compareBar").stop(true, true).slideDown(200);
}

function showCompareTable() {
    const rows = [
        ["Price", "price"],
        ["Unit", "unit"],
        ["Time", "days"],
        ["Max weight", "maxKg"],
        ["Tracking", "tracking"]
    ];

    let html = '<h2 class="h3 mb-3">Side by side</h2><div class="table-responsive"><table class="table compare-table"><caption class="visually-hidden">Comparison of the chosen services</caption><thead><tr><th scope="col">Service</th>';

    for (let i = 0; i < compareIds.length; i++) {
        html = html + '<th scope="col">' + findService(compareIds[i]).name + "</th>";
    }
    html = html + "</tr></thead><tbody>";

    for (let r = 0; r < rows.length; r++) {
        html = html + '<tr><th scope="row">' + rows[r][0] + "</th>";
        for (let i = 0; i < compareIds.length; i++) {
            const s = findService(compareIds[i]);
            let value = s[rows[r][1]];
            if (rows[r][1] === "price") {
                value = formatPrice(s);
            }
            if (rows[r][1] === "maxKg") {
                value = s.maxKg > 0 ? s.maxKg.toLocaleString("en-US") + " kg" : "—";
            }
            html = html + "<td>" + value + "</td>";
        }
        html = html + "</tr>";
    }

    html = html + '</tbody></table></div><a class="btn btn-orange mt-2" href="quote.html">Get an exact quote →</a>';

    $("#compareBox").stop(true, true).hide().html(html).slideDown(400);
    $("html, body").stop().animate({ scrollTop: $("#compareBox").offset().top - 90 }, 600);
}

// ---------- Events ----------

$(function () {
    renderServices();

    $("#typeFilter").on("click", "button", function () {
        currentType = $(this).attr("data-type");
        $("#typeFilter button").removeClass("selected");
        $(this).addClass("selected");
        renderServices();
    });

    // 2. More / Less: open the details of one card.
    $("#serviceList").on("click", ".more-button", function () {
        const $button = $(this);
        const $details = $("#details-" + $button.attr("data-id"));
        const isOpen = $details.is(":visible");

        // stop() so fast clicks do not repeat the animation many times.
        $details.stop(true, true).slideToggle(250);
        $button.text(isOpen ? "More" : "Less").attr("aria-expanded", String(!isOpen));
    });

    $("#serviceList").on("change", ".compare-check input", function () {
        const id = $(this).val();
        $("#compareError").text("");

        if ($(this).is(":checked")) {
            if (compareIds.length >= MAX_COMPARE) {
                $(this).prop("checked", false);
                $("#compareError").text("You can compare up to 3 services. Untick one first.");
                return;
            }
            compareIds.push(id);
        } else {
            compareIds.splice(compareIds.indexOf(id), 1);
        }
        updateCompareBar();
    });

    $("#showCompare").on("click", showCompareTable);

    $("#clearCompare").on("click", function () {
        compareIds = [];
        $("#compareError").text("");
        $("#compareBox").stop(true, true).slideUp(200);
        renderServices();
        updateCompareBar();
    });
});

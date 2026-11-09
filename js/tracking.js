const shipments = [
    { code: "CP-2048-KZ", from: "Guangzhou", to: "Astana", mode: "Rail", weight: 320, status: "In transit", step: 2, lastUpdate: "Warehouse 3, Almaty", eta: "12 November" },
    { code: "CP-1932-KZ", from: "Yiwu", to: "Karaganda", mode: "Road", weight: 540, status: "Customs", step: 3, lastUpdate: "Customs clearance, Khorgos", eta: "14 November" },
    { code: "CP-1870-KZ", from: "Urumqi", to: "Shymkent", mode: "Road", weight: 210, status: "Delivered", step: 4, lastUpdate: "Delivered today", eta: "Delivered" },
    { code: "CP-2101-KZ", from: "Shenzhen", to: "Almaty", mode: "Air", weight: 18, status: "In transit", step: 2, lastUpdate: "Flight to Almaty", eta: "9 November" },
    { code: "CP-2115-KZ", from: "Istanbul", to: "Atyrau", mode: "Road", weight: 760, status: "Processing", step: 0, lastUpdate: "Order received", eta: "21 November" },
    { code: "CP-1999-KZ", from: "Tashkent", to: "Almaty", mode: "Road", weight: 95, status: "Delivered", step: 4, lastUpdate: "Delivered yesterday", eta: "Delivered" },
    { code: "CP-2077-KZ", from: "Bishkek", to: "Astana", mode: "Rail", weight: 410, status: "In transit", step: 1, lastUpdate: "Picked up in Bishkek", eta: "13 November" },
    { code: "CP-2130-KZ", from: "Beijing", to: "Aktobe", mode: "Air", weight: 42, status: "Processing", step: 0, lastUpdate: "Waiting for pickup", eta: "15 November" }
];

const steps = ["Order received", "Picked up", "On the way", "Customs", "Delivered"];

function findShipment(code) {
    for (let i = 0; i < shipments.length; i++) {
        if (shipments[i].code === code) {
            return shipments[i];
        }
    }
    return null;
}

function showShipment(shipment) {
    let stepsHtml = "";
    for (let i = 0; i < steps.length; i++) {
        let state = "";
        if (i < shipment.step) {
            state = "done";
        } else if (i === shipment.step) {
            state = "now";
        }
        stepsHtml = stepsHtml + '<li class="' + state + '">' + steps[i] + "</li>";
    }

    const percent = Math.round(shipment.step / (steps.length - 1) * 100);

    const html =
        '<article class="result-card">' +
        '<div class="result-top">' +
        "<div>" +
        '<p class="eyebrow mb-1">' + shipment.code + " · " + shipment.mode + " · " + shipment.weight + " kg</p>" +
        '<h2 class="h3 mb-0">' + shipment.from + " → " + shipment.to + "</h2>" +
        "</div>" +
        '<span class="status-tag">' + shipment.status + "</span>" +
        "</div>" +
        '<div class="road" aria-hidden="true"><div class="road-done"><span class="road-truck"></span></div></div>' +
        '<ol class="result-steps">' + stepsHtml + "</ol>" +
        '<p class="mb-0"><strong>Last update:</strong> ' + shipment.lastUpdate +
        " · <strong>Arrives:</strong> " + shipment.eta + "</p>" +
        "</article>";

    $("#trackResult").stop(true, true).hide().html(html).fadeIn(250);

    $("#trackResult .road-done").css("width", "0%").animate({ width: percent + "%" }, 1200);
}

function showNotFound(code) {
    const safeCode = $("<span>").text(code).html();
    $("#trackResult").stop(true, true).hide().html(
        '<div class="empty-state">' +
        "<strong>Nothing found for " + safeCode + "</strong>" +
        "Check the code in your SMS or email. Sample codes are in the table below." +
        "</div>"
    ).fadeIn(250);
}

function track() {
    const code = $.trim($("#trackCode").val()).toUpperCase();

    if (code === "") {
        $("#trackError").text("Please write a tracking code.");
        $("#trackCode").addClass("is-invalid");
        return;
    }

    if (!/^CP-\d{4}-KZ$/.test(code)) {
        $("#trackError").text("A tracking code looks like CP-2048-KZ: the letters CP, 4 numbers and KZ.");
        $("#trackCode").addClass("is-invalid");
        return;
    }

    $("#trackError").text("");
    $("#trackCode").removeClass("is-invalid").val(code);

    const shipment = findShipment(code);
    if (shipment === null) {
        showNotFound(code);
    } else {
        showShipment(shipment);
    }
}

function renderTable() {
    const filter = $("#statusFilter").val();
    const $rows = $("#shipmentRows");

    let shown = 0;
    let inTransit = 0;
    let totalWeight = 0;

    $rows.empty();

    for (let i = 0; i < shipments.length; i++) {
        const s = shipments[i];

        totalWeight = totalWeight + s.weight;
        if (s.status === "In transit") {
            inTransit = inTransit + 1;
        }

        if (filter !== "all" && s.status !== filter) {
            continue;
        }

        const row = document.createElement("tr");
        row.innerHTML =
            '<td data-label="Code"><button class="code-button" type="button" data-code="' + s.code + '">' + s.code + "</button></td>" +
            '<td data-label="Route">' + s.from + " → " + s.to + "</td>" +
            '<td data-label="Last update">' + s.lastUpdate + "</td>" +
            '<td data-label="Status"><span class="tag">' + s.status + "</span></td>";
        $rows.append(row);
        shown = shown + 1;
    }

    if (shown === 0) {
        $rows.html('<tr><td colspan="4" class="text-center text-secondary">No shipments with this status this week.</td></tr>');
    }

    $("#shipmentStats").text(
        shipments.length + " shipments · " + inTransit + " in transit · " +
        totalWeight.toLocaleString("en-US") + " kg in total"
    );
}

$(function () {
    renderTable();

    $("#trackForm").on("submit", function (event) {
        event.preventDefault();
        track();
    });

    $("#trackCode").on("input", function () {
        $("#trackError").text("");
        $(this).removeClass("is-invalid");
    });

    $("#trackCode").on("keydown", function (event) {
        if (event.key === "Escape") {
            $(this).val("");
            $("#trackResult").stop(true, true).fadeOut(200);
        }
    });

    $("#statusFilter").on("change", renderTable);

    $("#shipmentRows").on("click", ".code-button", function () {
        $("#trackCode").val($(this).attr("data-code"));
        track();
        $("html, body").stop().animate({ scrollTop: $("#trackForm").offset().top - 100 }, 500);
    });
});

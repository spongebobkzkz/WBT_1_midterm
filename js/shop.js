// Packing shop page (Byerdikhajy Yesyentai)
// 1. Catalogue: made from the "supplies" array, with search, category filter and sort.
// 2. Cart: add, +, -, remove; the total and the free delivery bar are calculated.
// 3. Box finder: finds the smallest box that fits the visitor's item.

// ---------- Data ----------

// length, width and height are the inside size of a box in cm (0 for things that are not boxes).
const supplies = [
    { id: "box-s", name: "Small box", category: "boxes", size: "30 × 20 × 15 cm", length: 30, width: 20, height: 15, maxKg: 5, price: 450, image: "images/box.svg", info: "Shoes, books, small electronics." },
    { id: "box-m", name: "Medium box", category: "boxes", size: "40 × 30 × 25 cm", length: 40, width: 30, height: 25, maxKg: 10, price: 650, image: "images/box.svg", info: "The most popular size for online shops." },
    { id: "box-l", name: "Large box", category: "boxes", size: "60 × 40 × 40 cm", length: 60, width: 40, height: 40, maxKg: 20, price: 950, image: "images/box.svg", info: "Clothes, kitchen goods, a full order." },
    { id: "box-xl", name: "Extra large box", category: "boxes", size: "80 × 60 × 50 cm", length: 80, width: 60, height: 50, maxKg: 30, price: 1400, image: "images/box.svg", info: "Double walls for heavy or bulky goods." },
    { id: "box-tube", name: "Long tube box", category: "boxes", size: "100 × 12 × 12 cm", length: 100, width: 12, height: 12, maxKg: 4, price: 800, image: "images/box.svg", info: "Posters, drawings, fishing rods." },
    { id: "bubble", name: "Bubble wrap, 10 m", category: "protection", size: "Roll 50 cm wide", length: 0, width: 0, height: 0, maxKg: 0, price: 1200, image: "images/bubble.svg", info: "Wrap glass and screens two times." },
    { id: "corners", name: "Foam corners, 8 pcs", category: "protection", size: "For 3 cm edges", length: 0, width: 0, height: 0, maxKg: 0, price: 500, image: "images/bubble.svg", info: "Protect the corners of furniture and frames." },
    { id: "paper", name: "Paper filler, 2 kg", category: "protection", size: "Fills a large box", length: 0, width: 0, height: 0, maxKg: 0, price: 700, image: "images/bubble.svg", info: "Fills empty space so nothing moves." },
    { id: "tape", name: "Packing tape, 66 m", category: "tape", size: "48 mm wide", length: 0, width: 0, height: 0, maxKg: 0, price: 350, image: "images/tape.svg", info: "Strong tape that closes about 15 boxes." },
    { id: "labels", name: "Fragile labels, 20 pcs", category: "tape", size: "10 × 6 cm", length: 0, width: 0, height: 0, maxKg: 0, price: 300, image: "images/tape.svg", info: "Bright labels that tell the team to be careful." }
];

const FREE_DELIVERY_FROM = 5000;   // the driver brings the supplies for free from this total
const DELIVERY_PRICE = 700;

// The cart is a list of { id, quantity }.
let cart = [];
let currentCategory = "all";

// ---------- Small helpers ----------

function formatPrice(number) {
    return number.toLocaleString("en-US") + " ₸";
}

function findSupply(id) {
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].id === id) {
            return supplies[i];
        }
    }
    return null;
}

// ---------- 1. Catalogue ----------

function getVisibleSupplies() {
    const search = $.trim($("#shopSearch").val()).toLowerCase();
    const result = [];

    for (let i = 0; i < supplies.length; i++) {
        const item = supplies[i];
        const text = (item.name + " " + item.info + " " + item.category).toLowerCase();

        if (currentCategory !== "all" && item.category !== currentCategory) {
            continue;
        }
        if (search !== "" && text.indexOf(search) === -1) {
            continue;
        }
        result.push(item);
    }

    // Sort a copy, so the original order stays for "Recommended".
    const sort = $("#shopSort").val();
    if (sort === "cheap") {
        result.sort(function (a, b) { return a.price - b.price; });
    } else if (sort === "expensive") {
        result.sort(function (a, b) { return b.price - a.price; });
    } else if (sort === "name") {
        result.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    return result;
}

function renderProducts() {
    const items = getVisibleSupplies();
    const $list = $("#productList");

    $list.empty();

    if (items.length === 0) {
        const search = $("<span>").text($.trim($("#shopSearch").val())).html();
        $list.html(
            '<div class="col-12"><div class="empty-state">' +
            "<strong>Nothing found for “" + search + "”</strong>" +
            "Try another word, for example “box” or “tape”." +
            '<br><button class="btn-soft mt-3" type="button" id="resetShop">Show all supplies</button>' +
            "</div></div>"
        );
        $("#shopCount").text("0 of " + supplies.length + " supplies");
        return;
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        let limit = "";
        if (item.maxKg > 0) {
            limit = '<span class="tag">up to ' + item.maxKg + " kg</span>";
        }

        const column = document.createElement("div");
        column.className = "col";
        column.innerHTML =
            '<article class="product">' +
            '<img src="' + item.image + '" alt="Drawing: ' + item.name + '" width="120" height="100">' +
            '<h3 class="h5">' + item.name + "</h3>" +
            '<p class="product-size">' + item.size + " " + limit + "</p>" +
            '<p class="product-info">' + item.info + "</p>" +
            '<div class="product-bottom">' +
            '<span class="product-price">' + formatPrice(item.price) + "</span>" +
            '<button class="btn-soft add-button" type="button" data-id="' + item.id + '" aria-label="Add ' + item.name + ' to cart">+ Add</button>' +
            "</div>" +
            "</article>";

        $list.append(column);
    }

    // Cards appear softly.
    $list.children().hide().fadeIn(250);

    $("#shopCount").text(items.length + " of " + supplies.length + " supplies");
}

// ---------- 2. Cart ----------

function addToCart(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + 1;
            renderCart();
            return;
        }
    }
    cart.push({ id: id, quantity: 1 });
    renderCart();
}

function changeQuantity(id, change) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + change;
            if (cart[i].quantity < 1) {
                cart.splice(i, 1);
            } else if (cart[i].quantity > 50) {
                cart[i].quantity = 50;
            }
            break;
        }
    }
    renderCart();
}

function removeFromCart(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart.splice(i, 1);
            break;
        }
    }
    renderCart();
}

// Returns the numbers the cart needs: count, sum of goods, delivery and total.
function calculateCart() {
    let count = 0;
    let goods = 0;

    for (let i = 0; i < cart.length; i++) {
        const item = findSupply(cart[i].id);
        count = count + cart[i].quantity;
        goods = goods + item.price * cart[i].quantity;
    }

    let delivery = DELIVERY_PRICE;
    if (goods >= FREE_DELIVERY_FROM || goods === 0) {
        delivery = 0;
    }

    return { count: count, goods: goods, delivery: delivery, total: goods + delivery };
}

function renderCart() {
    const $list = $("#cartList");
    const sums = calculateCart();

    $list.empty();

    if (cart.length === 0) {
        $list.html('<li class="cart-empty">Your cart is empty. Add a box or tape from the list.</li>');
    }

    for (let i = 0; i < cart.length; i++) {
        const item = findSupply(cart[i].id);
        const line = document.createElement("li");
        line.className = "cart-line";
        line.setAttribute("data-id", item.id);
        line.innerHTML =
            '<div class="cart-name">' + item.name +
            "<small>" + formatPrice(item.price) + " × " + cart[i].quantity + " = " + formatPrice(item.price * cart[i].quantity) + "</small></div>" +
            '<div class="cart-buttons">' +
            '<button class="qty-button" type="button" data-change="-1" aria-label="One less ' + item.name + '">−</button>' +
            '<span class="qty">' + cart[i].quantity + "</span>" +
            '<button class="qty-button" type="button" data-change="1" aria-label="One more ' + item.name + '">+</button>' +
            '<button class="remove-button" type="button" aria-label="Remove ' + item.name + '">×</button>' +
            "</div>";
        $list.append(line);
    }

    // Free delivery bar
    let percent = Math.round(sums.goods / FREE_DELIVERY_FROM * 100);
    if (percent > 100) {
        percent = 100;
    }
    $("#freeBarFill").stop(true).animate({ width: percent + "%" }, 300);

    if (sums.goods === 0) {
        $("#freeText").text("Free delivery with your pickup from " + formatPrice(FREE_DELIVERY_FROM) + ".");
    } else if (sums.delivery > 0) {
        $("#freeText").text("Add " + formatPrice(FREE_DELIVERY_FROM - sums.goods) + " more for free delivery (now " + formatPrice(sums.delivery) + ").");
    } else {
        $("#freeText").text("Free delivery: the driver brings it with your pickup.");
    }

    $("#cartCount").text(sums.count);
    $("#cartTotal").text(formatPrice(sums.total));
    $("#cartError").text("");

    // A short blink so the visitor sees that the total changed.
    $("#cartTotal").stop(true, true).css("opacity", 0.2).animate({ opacity: 1 }, 300);
}

// ---------- 3. Box finder ----------

function showFinderError(message) {
    $("#finderError").text(message);
    $("#finderResult").stop(true, true).slideUp(200);
}

function findBox() {
    const length = Number($("#itemLength").val());
    const width = Number($("#itemWidth").val());
    const height = Number($("#itemHeight").val());
    const weight = Number($("#itemWeight").val());

    $("#finderForm .form-control").removeClass("is-invalid");

    // Wrong input
    const fields = ["#itemLength", "#itemWidth", "#itemHeight", "#itemWeight"];
    let hasEmpty = false;
    for (let i = 0; i < fields.length; i++) {
        if ($(fields[i]).val() === "" || Number($(fields[i]).val()) <= 0) {
            $(fields[i]).addClass("is-invalid");
            hasEmpty = true;
        }
    }
    if (hasEmpty) {
        showFinderError("Please write all four numbers. Each must be bigger than 0.");
        return;
    }
    if (length > 300 || width > 300 || height > 300) {
        showFinderError("A side longer than 3 metres is cargo, not a parcel. Please ask for a quote.");
        return;
    }

    $("#finderError").text("");

    // Sort the item's sides from long to short, so it can be turned in the box.
    const itemSides = [length, width, height].sort(function (a, b) { return b - a; });

    // Volume weight: carriers charge for space too. Formula: L × W × H / 5000.
    const volumeWeight = Math.round(length * width * height / 5000 * 10) / 10;
    let chargedWeight = weight;
    if (volumeWeight > weight) {
        chargedWeight = volumeWeight;
    }

    // Find the box with the smallest volume that fits.
    let bestBox = null;
    for (let i = 0; i < supplies.length; i++) {
        const box = supplies[i];
        if (box.category !== "boxes") {
            continue;
        }

        const boxSides = [box.length, box.width, box.height].sort(function (a, b) { return b - a; });
        const fits = itemSides[0] <= boxSides[0] && itemSides[1] <= boxSides[1] && itemSides[2] <= boxSides[2];
        const strongEnough = weight <= box.maxKg;

        if (fits && strongEnough) {
            const volume = box.length * box.width * box.height;
            if (bestBox === null || volume < bestBox.length * bestBox.width * bestBox.height) {
                bestBox = box;
            }
        }
    }

    let html =
        '<p class="mb-2">We charge for <strong>' + chargedWeight + " kg</strong> " +
        "(real weight " + weight + " kg, volume weight " + volumeWeight + " kg).</p>";

    if (bestBox === null) {
        html = html +
            "<strong>No box from our shop fits this item.</strong> " +
            'Book a <a href="pickup.html">pickup</a> and the driver measures it on the spot.';
    } else {
        html = html +
            '<div class="finder-match"><img src="images/box.svg" alt="" width="60" height="50">' +
            "<div><strong>" + bestBox.name + "</strong> · " + bestBox.size + " · " + formatPrice(bestBox.price) + "</div>" +
            '<button class="btn-soft add-button" type="button" data-id="' + bestBox.id + '">+ Add to cart</button></div>';
    }

    $("#finderResult").stop(true, true).hide().html(html).slideDown(300);
}

// ---------- Events ----------

$(function () {
    renderProducts();
    renderCart();

    $("#shopSearch").on("input", renderProducts);
    $("#shopSort").on("change", renderProducts);

    $("#categoryFilter").on("click", "button", function () {
        currentCategory = $(this).attr("data-category");
        $("#categoryFilter button").removeClass("selected");
        $(this).addClass("selected");
        renderProducts();
    });

    // "Show all supplies" inside the empty message
    $("#productList").on("click", "#resetShop", function () {
        $("#shopSearch").val("");
        currentCategory = "all";
        $("#categoryFilter button").removeClass("selected");
        $("#categoryFilter button[data-category='all']").addClass("selected");
        renderProducts();
    });

    // "+ Add" buttons in the catalogue and in the box finder
    $(document).on("click", ".add-button", function () {
        addToCart($(this).attr("data-id"));
    });

    $("#cartList").on("click", ".qty-button", function () {
        const id = $(this).closest(".cart-line").attr("data-id");
        changeQuantity(id, Number($(this).attr("data-change")));
    });

    // Remove: the line fades out first, then the cart is drawn again.
    $("#cartList").on("click", ".remove-button", function () {
        const $line = $(this).closest(".cart-line");
        const id = $line.attr("data-id");
        $line.find("button").prop("disabled", true);   // no double clicks while it fades
        $line.fadeOut(250, function () {
            removeFromCart(id);
        });
    });

    $("#finderForm").on("submit", function (event) {
        event.preventDefault();
        findBox();
    });

    // A red field becomes normal again when the visitor types a correct number.
    $("#finderForm").on("input", ".form-control", function () {
        if (Number($(this).val()) > 0) {
            $(this).removeClass("is-invalid");
        }
    });

    // Save the cart for the pickup page and go there.
    $("#checkoutButton").on("click", function () {
        if (cart.length === 0) {
            $("#cartError").text("Your cart is empty. Add at least one item first.");
            return;
        }
        // Save only what the pickup page needs: how many items and the total.
        const sums = calculateCart();
        const order = { count: sums.count, total: sums.total };
        localStorage.setItem("cargoPulseSupplies", JSON.stringify(order));
        window.location.href = "pickup.html";
    });
});

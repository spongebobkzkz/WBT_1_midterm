const questions = [
    { id: "q1", topic: "Price", question: "How do you count the price?", answer: "We multiply the weight by the price per kg of the transport. Routes from China and Turkey cost a bit more. The Get a quote page shows the price at once." },
    { id: "q2", topic: "Time", question: "How long does delivery from China take?", answer: "Air takes 2–5 days, road 7–20 days and rail 10–18 days. The manager confirms the exact date before dispatch." },
    { id: "q3", topic: "Tracking", question: "How can I see where my cargo is?", answer: "We send you a code like CP-2048-KZ. Write it on the Tracking page and you see every step of the way." },
    { id: "q4", topic: "Customs", question: "Do you help with customs?", answer: "Yes. Our broker prepares the declaration and checks the codes of your goods, so the cargo does not wait at the border." },
    { id: "q5", topic: "Pickup", question: "Can a driver take parcels from my office?", answer: "Yes, in Almaty. Choose a time window on the Pickup page. The driver calls 30 minutes before arrival." },
    { id: "q6", topic: "Packing", question: "What if I have no boxes?", answer: "Order boxes, bubble wrap and tape in our Packing shop. The driver brings them with your pickup." },
    { id: "q7", topic: "Safety", question: "What happens if something breaks?", answer: "With cargo insurance (1% of the value) we pay back the full value in 10 working days." },
    { id: "q8", topic: "Payment", question: "How can I pay?", answer: "By card, Kaspi transfer or bank transfer for companies. Small pickups can be paid to the driver." }
];

function renderQuestions() {
    const $list = $("#faqList");

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const item = document.createElement("div");
        item.className = "faq-item";
        item.innerHTML =
            "<h3>" +
            '<button class="faq-question" type="button" aria-expanded="false" aria-controls="' + q.id + '">' +
            '<span class="faq-topic">' + q.topic + "</span>" + q.question +
            '<span class="faq-sign" aria-hidden="true">+</span>' +
            "</button>" +
            "</h3>" +
            '<div class="faq-answer" id="' + q.id + '"><p>' + q.answer + "</p></div>";
        $list.append(item);
    }
}

let numbersDone = false;

function countNumbers() {
    if (numbersDone) {
        return;
    }

    const statsTop = $(".stats").offset().top;
    const screenBottom = $(window).scrollTop() + $(window).height();

    if (screenBottom < statsTop + 50) {
        return;
    }

    numbersDone = true;

    $(".stat-number").each(function () {
        const $number = $(this);
        const target = Number($number.attr("data-target"));

        $({ count: 0 }).animate({ count: target }, {
            duration: 1500,
            step: function () {
                $number.text(Math.round(this.count).toLocaleString("en-US"));
            },
            complete: function () {
                $number.text(target.toLocaleString("en-US"));
            }
        });
    });
}

$(function () {
    renderQuestions();

    $("#faqList").on("click", ".faq-question", function () {
        const $button = $(this);
        const $answer = $("#" + $button.attr("aria-controls"));
        const isOpen = $button.attr("aria-expanded") === "true";

        $(".faq-question").not($button).attr("aria-expanded", "false");
        $(".faq-answer").not($answer).stop(true, true).slideUp(250);

        if (isOpen) {
            $answer.stop(true, true).slideUp(250);
            $button.attr("aria-expanded", "false");
        } else {
            $answer.stop(true, true).slideDown(250);
            $button.attr("aria-expanded", "true");
        }
    });

    countNumbers();
    $(window).on("scroll", countNumbers);
});

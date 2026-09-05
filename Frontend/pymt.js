const paymentMethod = document.getElementById("payment-method");

const cardDetails = document.getElementById("card-details");
const upiDetails = document.getElementById("upi-details");

paymentMethod.addEventListener("change", function () {

    // Hide everything first
    cardDetails.style.display = "none";
    upiDetails.style.display = "none";

    // Show according to selection
    if (this.value === "credit-card" || this.value === "debit-card") {
        cardDetails.style.display = "block";
    }

    else if (this.value === "UPI") {
        upiDetails.style.display = "block";
    }
});

const proceedBtn = document.getElementById("proceed-btn");
const emailInput = document.getElementById("email");

proceedBtn.addEventListener("click", function () {

    const email = emailInput.value.trim();

    if (email === "") {
        alert("Please enter your email.");
        return;
    }

    if (!emailInput.checkValidity()) {
        alert("Please enter a valid email.");
        return;
    }

    document.body.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light">
            <div class="container">
                <i class="fa-brands fa-opencart"></i>
                <a class="navbar-brand" href="#">Payment Page</a>
            </div>
        </nav>

        <div class="success-message">
            <div class="success-icon">✓</div>

            <h2>Thank You! 🎉</h2>

            <p>Your order has been placed successfully.</p>

            <p class="email-text">
                Order confirmation will be sent to <strong>${email}</strong>
            </p>

            <button onclick="window.location.href='index.html'">
                Continue Shopping
            </button>
        </div>
    `;
});
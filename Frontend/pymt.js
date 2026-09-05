const paymentMethod = document.getElementById("payment-method");

const cardDetails = document.getElementById("card-details");
const upiDetails = document.getElementById("upi-details");

paymentMethod.addEventListener("change", function () {
    cardDetails.style.display = "none";
    upiDetails.style.display = "none";

    if (this.value === "credit-card" || this.value === "debit-card") {
        cardDetails.style.display = "block";
    } else if (this.value === "UPI") {
        upiDetails.style.display = "block";
    }
});

const proceedBtn = document.getElementById("proceed-btn");
const emailInput = document.getElementById("email");

proceedBtn.addEventListener("click", async function () {

    const email = emailInput.value.trim();

    if (email === "") {
        alert("Please enter your email.");
        return;
    }

    if (!emailInput.checkValidity()) {
        alert("Please enter a valid email.");
        return;
    }

    // button disable karo taaki double click na ho
    proceedBtn.disabled = true;
    proceedBtn.textContent = "Processing...";

    // cart/order data uthao
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
        email: email,
        paymentMethod: paymentMethod.value,
        items: cartItems,
        totalAmount: totalAmount,
    };

    try {
        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (!data.success) {
            alert("Order failed: " + data.message);
            proceedBtn.disabled = false;
            proceedBtn.textContent = "Proceed to Payment";
            return;
        }

        // cart clear karo
        localStorage.removeItem("cart");

        // ab thank you page dikhao
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

    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
        proceedBtn.disabled = false;
        proceedBtn.textContent = "Proceed to Payment";
    }
});
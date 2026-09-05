function goToPayment(btn) {
    const productCard =btn.closest('.product');

    const name = productCard.querySelector('h4').innerText.trim();
    const priceText = productCard.querySelector('h5').innerText.trim();

    const price = Number(priceText.replace(/[^0-9.]/g, ''));

    const orderItem ={
        name: name,
        price: price,
        quantity:1
    };
    localStorage.setItem("cart", JSON.stringify([orderItem]));

    window.location.href = "pymt.html";
}
let user = "";

$(document).ready(function () {
    loginUser();
    loadProducts();
    loadCartRecords();

    //card
    $(".input-customer-name").val(user.userName);
    $(".input-card-name").val(user.userName);

    // Event Listeners
    $(document).on("click", ".add-to-cart", addToCart);
    $(document).on("click", ".remove-item", removeFromCart);

    let timeout;
    $(document).on("input change", ".qty-update", function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            updateQty.call(this); // Call update function after user stops typing
        }, 500); // Delay of 500ms (adjust as needed)
    });

    $(document).on("click", ".btn-place-order", function (e) {
        e.preventDefault();
        placeOrder();
    });
});

function loginUser() {
    user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        window.location.href = "/home"; // Redirect
    }
}

// 🔹 Load Products
async function loadProducts() {
    try {
        const fetchProdcuts = await axios.get(`/api/products/GetAllProducts`);

        renderProducts(fetchProdcuts.data)
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

async function loadCartRecords() {
    try {
        const fetchCart = await axios.get(`/api/cartrecords/GetCartRecordViewByCondition?userId=${user.id}&status=pending`);
        renderCarts(fetchCart.data);
    } catch (error) {
        console.error("Error fetching cart:", error);
        renderCarts();
    }
   
}

// 🔹 Render Product List
function renderProducts(products) {
    let productList = $("#product-list");
    productList.empty(); // Clear previous content

    products.forEach(product => {
        let productData = JSON.stringify(product).replace(/"/g, "&quot;");
        productList.append(`
            <tr>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>
                    <input type="number" min="1" value="1" class="form-control form-control-sm qty-input" data-id="${product.id}" style="width: 60px;">
                </td>
                <td>$${product.price}</td>
                <td>
                    <button class="btn btn-primary btn-sm add-to-cart" data-item="${productData}">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </td>
            </tr>
        `);
    });
}

function renderCarts(cartRecords) {
    let cartList = $("#cart-items");
    cartList.empty(); // Clear previous content

    if (!Array.isArray(cartRecords) || cartRecords.length === 0) {
        cartList.append(`<tr><td colspan="4" class="text-center">No items in the cart</td></tr>`);
        return;
    }
    let itemsCount = 0;
    let subtotal = 0;
    cartRecords.forEach(item => {
        itemsCount += item.qty;
        subtotal += item.total;
        let cartData = JSON.stringify(item).replace(/"/g, "&quot;");
        cartList.append(`
             <tr>
                <td>${item.productName}</td>
                <td>
                    <input type="number" value="${item.qty}" min="1" class="form-control form-control-sm qty-update"
                    style="width: 60px;"  data-item="${cartData}">
                </td>
                <td>$${item.total}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    }

    );

    //update summary
    $("#item-count").html(itemsCount);
    $("#subtotal").html(subtotal.toLocaleString("en-CA", { style: "currency", currency: "CAD" }));
}

async function addToCart() {
    try {
        const product = JSON.parse($(this).attr("data-item")); // Get product data
        const qty = parseInt($(this).closest("tr").find(".qty-input").val(), 10); // Get quantity
        const total = (product.price || 0) * qty;
        // Ensure user is logged in (assuming `user` is defined globally)
        if (!user || !user.id) {
            console.error("User is not logged in.");
            return;
        }

        // Fetch existing cart record for this product
        let cartRecords = [];
        try {
            const response = await axios.get(`/api/CartRecords/GetCartRecordByCondition?userId=${user.id}&productId=${product.id}&status=pending`);
            cartRecords = response.data;
        } catch (error) {
            console.error("No Data.");
        }

        if (!Array.isArray(cartRecords) || cartRecords.length === 0) {
            // Create new cart record
            await axios.post("/api/CartRecords/CreateCartRecord", {
                qty: qty,
                total: total,
                productId: product.id,
                userId: user.id,
                status: "pending",
                transactionCode: ""
            });
        } else {
            // Update existing cart record (example: increase quantity)
            const existingCart = cartRecords[0]; // Assuming one record per product per user

            await axios.put(`/api/CartRecords/UpdateCartRecord`, {
                id: existingCart.id,
                qty: existingCart.qty + qty, // Add new quantity to existing one
                total: product.price * (existingCart.qty + qty),
                productId: product.id,
                userId: user.id,
                status: "pending",
                transactionCode: existingCart.transactionCode
            });
        }

        Swal.fire({
            icon: "success",
            title: "Add Successful",
            text: "Cart updated successfully.",
            timer: 1500,
            showConfirmButton: false
        })

        loadCartRecords();

        console.log("Cart updated successfully.");
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}
async function removeFromCart() {
    try {
        const id = $(this).data("id");

        const result = await Swal.fire({
            title: "Remove Item?",
            text: `Are you sure you want to remove?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, remove",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            await axios.delete(`/api/CartRecords/DeleteCartRecord/${id}`);
            Swal.fire({
                icon: "success",
                title: "Remove Successful",
                text: "Cart updated successfully.",
                timer: 1500,
                showConfirmButton: false
            })
        }

        loadCartRecords();
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}

async function updateQty() {
    try {
        const item = JSON.parse($(this).attr("data-item")); // Get product data
        const qty = parseInt($(this).closest("tr").find(".qty-update").val(), 10); // Get quantity

        item.qty = qty;
        item.total = qty * item.price;

        await axios.put(`/api/CartRecords/UpdateCartRecord`, item);

        await loadCartRecords();
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}

async function placeOrder() {
    try {
        const tcode = generateSecureRandomString(6);
        const subtotal = parseFloat($("#subtotal").html().replace("$", "")) || 0; // Ensure valid number

        const cardNumber = $(".input-card-num").val().trim();
        const cvCode = $(".input-cv-code").val().trim();

        // ✅ Validate Card Number
        //4111111111111111
        if (!isValidCardNumber(cardNumber)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Card Number",
                text: "Please enter a valid credit card number.",
            });
            return;
        }

        // ✅ Validate CVV Code
        if (!isValidCVV(cvCode)) {
            Swal.fire({
                icon: "error",
                title: "Invalid CVV",
                text: "CVV must be 3 or 4 digits.",
            });
            return;
        }

        await axios.post("/api/Orders/CreateOrder", {
            transactionCode: tcode,
            subtotal: subtotal,
            date: new Date().toISOString(), // Format date correctly
            userId: user.id,
            status: "completed"
        });

        const cartRecordResponse = await axios.get(`/api/cartrecords/GetCartRecordViewByCondition?userId=${user.id}&status=pending`);
        const cartRecords = cartRecordResponse.data;

        if (Array.isArray(cartRecords)) {
            for (const item of cartRecords) {
                item.transactionCode = tcode;
                item.status = "paid";
                await axios.put("/api/cartrecords/UpdateCartRecord", item);
            }
        }

        // ✅ Show Success Alert & Redirect
        await Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: `Paid successfully. Transaction Code: ${tcode}`,
            timer: 1500,
            showConfirmButton: false
        });

        window.location.href = "/menu/paymentsuccess"; // Redirect after success
    } catch (error) {
        console.error("Error placing order:", error);
        Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "Something went wrong. Please try again.",
        });
    }
}

function generateSecureRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
    }

    return result;
}

function isValidCardNumber(cardNumber) {
    cardNumber = cardNumber.replace(/\D/g, ""); // Remove non-numeric chars

    if (cardNumber.length < 13 || cardNumber.length > 19) return false; // Length check

    // Luhn Algorithm Implementation
    let sum = 0;
    let alternate = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let n = parseInt(cardNumber[i], 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }

    return sum % 10 === 0; // Card is valid if divisible by 10
}

function isValidCVV(cvCode) {
    return /^\d{3,4}$/.test(cvCode); // 3-4 digits only
}
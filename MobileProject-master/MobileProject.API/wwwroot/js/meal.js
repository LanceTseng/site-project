$(document).ready(function () {
    loadProducts();

    // Event Listeners
    $(document).on("click", ".add-to-cart", addToCart);
    $(document).on("click", ".remove-item", removeFromCart);
    $(document).on("change", ".qty-update", updateQty);
});

// ✅ API Base URL
const apiBaseUrl = "/api/products";
let cartItems = [];

// 🔹 Load Products
function loadProducts() {
    axios.get(`${apiBaseUrl}/GetAllProducts`)
        .then(response => renderProducts(response.data))
        .catch(error => console.error("Error fetching products:", error));
}

// 🔹 Render Product List
function renderProducts(products) {
    let productList = $("#product-list");
    productList.empty(); // Clear previous content

    products.forEach(product => {
        productList.append(`
            <tr>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" value="1" class="form-control form-control-sm qty-input" data-id="${product.id}" style="width: 60px;">
                </td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </td>
            </tr>
        `);
    });
}

// 🔹 Add to Cart
function addToCart() {
    let productId = $(this).data("id");
    let product = cartItems.find(item => item.id === productId);

    if (product) {
        product.qty += 1;
        product.total = product.qty * product.price;
    } else {
        let newProduct = {
            id: productId,
            name: $(this).closest("tr").find("td:first").text(),
            price: parseFloat($(this).closest("tr").find("td:nth-child(2)").text().replace("$", "")),
            qty: 1,
            total: parseFloat($(this).closest("tr").find("td:nth-child(2)").text().replace("$", ""))
        };
        cartItems.push(newProduct);
    }

    updateCart();
}

// 🔹 Update Cart UI
function updateCart() {
    let cartTable = $("#cart-items");
    let totalItems = 0, totalPrice = 0;

    cartTable.empty();

    cartItems.forEach((item, index) => {
        totalItems += item.qty;
        totalPrice += item.total;

        cartTable.append(`
            <tr>
                <td>${item.name}</td>
                <td>
                    <input type="number" value="${item.qty}" min="1" class="form-control form-control-sm qty-update"
                    style="width: 60px;" data-index="${index}">
                </td>
                <td>$${item.total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });

    $("#item-count").text(totalItems);
    $("#subtotal").text(`$${totalPrice.toFixed(2)}`);
}

// 🔹 Remove from Cart
function removeFromCart() {
    let index = $(this).data("index");
    cartItems.splice(index, 1);
    updateCart();
}

// 🔹 Update Quantity
function updateQty() {
    let index = $(this).data("index");
    let qty = parseInt($(this).val()) || 1;

    if (qty < 1) qty = 1;
    cartItems[index].qty = qty;
    cartItems[index].total = cartItems[index].qty * cartItems[index].price;

    updateCart();
}

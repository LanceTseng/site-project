let user = "";

$(document).ready(function () {
    loginUser();
    loadProducts();
    loadCartRecords();

    // Event Listeners
    $(document).on("click", ".add-to-cart", addToCart);
    $(document).on("click", ".remove-item", removeFromCart);
    $(document).on("change", ".qty-update", updateQty);
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

    cartRecords.forEach(item => {
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
    });
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
        let cartRecords=[];
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
        const proudct = $(this).data("id");

        //await axios.delete(`/api/CartRecords/DeleteCartRecord/${id}`);
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}

async function updateQty() {
    try {
        const item = JSON.parse($(this).attr("data-item")); // Get product data
       
        console.log(item);
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}
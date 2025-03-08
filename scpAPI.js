document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("order-form");
    const ordersBody = document.getElementById("orders-body");
    const apiUrl = "http://localhost:3000/api/orders";
    let editingOrderId = null;

    const fetchOrders = async () => {
        const res = await fetch(apiUrl);
        const orders = await res.json();
        ordersBody.innerHTML = "";
        orders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.user}</td>
                <td>${order.address}</td>
                <td>${order.phone}</td>
                <td>${order.flower}</td>
                <td>${order.cost}</td>
                <td>${order.quantity}</td>
                <td>${order.total}</td>
                <td>${order.status}</td>
                <td>
                    <button onclick="editOrder('${order.id}')">Edit</button>
                    <button onclick="deleteOrder('${order.id}')">Delete</button>
                </td>
            `;
            ordersBody.appendChild(row);
        });
    };

    window.editOrder = async (id) => {
        const res = await fetch(`${apiUrl}/${id}`);
        const order = await res.json();

        orderForm.user.value = order.user;
        orderForm.address.value = order.address;
        orderForm.phone.value = order.phone;
        orderForm.flower.value = order.flower;
        orderForm.cost.value = order.cost;
        orderForm.quantity.value = order.quantity;
        orderForm.status.value = order.status;

        editingOrderId = order.id;
    };

    orderForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(orderForm);
        const data = Object.fromEntries(formData);
        data.cost = Number(data.cost);
        data.quantity = Number(data.quantity);

        if (isNaN(data.cost) || isNaN(data.quantity) || data.cost <= 0 || data.quantity <= 0) {
            alert("Please enter valid numbers for cost and quantity.");
            return;
        }

        if (editingOrderId) {
            await fetch(`${apiUrl}/${editingOrderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            editingOrderId = null;
        } else {
            await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        }

        orderForm.reset();
        fetchOrders();
    });

    window.deleteOrder = async (id) => {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        fetchOrders();
    };

    fetchOrders();
});

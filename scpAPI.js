document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("order-form");
    const ordersBody = document.getElementById("orders-body");
    const apiUrl = "http://localhost:5000/api/orders";

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
                <td>${order.cost * order.quantity}</td>
                <td>${order.status}</td>
                <td>
                    <button onclick="deleteOrder('${order.id}')">Delete</button>
                </td>
            `;
            ordersBody.appendChild(row);
        });
    };

    orderForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(orderForm);
        const data = Object.fromEntries(formData);
        data.cost = Number(data.cost);
        data.quantity = Number(data.quantity);
        
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        orderForm.reset();
        fetchOrders();
    });

    window.deleteOrder = async (id) => {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        fetchOrders();
    };

    fetchOrders();
});

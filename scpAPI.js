const API_URL = "http://localhost:3000/books"; // Backend ที่รันอยู่บนพอร์ต 3000

// โหลดรายการหนังสือ
async function fetchBooks() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("โหลดหนังสือไม่สำเร็จ");

        const books = await res.json();
        const bookList = document.getElementById("book-list");
        bookList.innerHTML = "";

        books.forEach((book, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>
                    <button class="edit" onclick="editBook(${book.id})"> แก้ไข</button>
                    <button class="delete" onclick="deleteBook(${book.id})"> ลบ</button>
                </td>
            `;
            bookList.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

// เพิ่มหนังสือใหม่
document.getElementById("book-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;

    if (!title || !author) return alert("กรุณากรอกข้อมูลให้ครบ");

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
    });

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    fetchBooks();
});

// ลบหนังสือ
async function deleteBook(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBooks();
}

// แก้ไขหนังสือ
async function editBook(id) {
    const newTitle = prompt("ป้อนชื่อหนังสือใหม่:");
    const newAuthor = prompt("ป้อนชื่อผู้แต่งใหม่:");

    if (!newTitle || !newAuthor) return alert("กรุณากรอกข้อมูลให้ครบ");

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, author: newAuthor })
    });

    fetchBooks();
}

// โหลดหนังสือเมื่อเปิดหน้าเว็บ
fetchBooks();
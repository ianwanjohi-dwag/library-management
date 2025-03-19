document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 index.js loaded"); // ✅ Debugging step
    setupNavigation();
    
    
    
    setupDropdown(); // Initialize dropdown functionality
    fetchBooks(); // Fetch books from the database and display them
});

// 📚 Fetch Books from Server
function fetchBooks() {
    fetch("http://localhost:3000/books")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Fetched Books:", data); // ✅ Debugging step
            displayBooks(data);
        })
        .catch(error => console.error("❌ Error fetching books:", error));
}

// 📖 Display Books on the Page
function displayBooks(books) {
    const booksList = document.getElementById("booksList");
    if (!booksList) {
        console.error("❌ Error: booksList element not found in the HTML!");
        return;
    }

    booksList.innerHTML = ""; // Clear previous content

    if (books.length === 0) {
        booksList.innerHTML = "<p class='text-center'>No books available.</p>";
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("col-md-4", "mb-4");

        bookCard.innerHTML = `
            <div class="card">
                <img src="${book.cover_image || 'default.jpg'}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">Author: ${book.author}</p>
                    <p class="card-text">${book.genre ? `Genre: ${book.genre}` : ""}</p>
                    <p class="card-text">${book.isbn ? `ISBN: ${book.isbn}` : ""}</p>
                    <span class="badge ${book.available ? 'bg-success' : 'bg-danger'}">
                        ${book.available ? "Available" : "Not Available"}
                    </span>
                </div>
            </div>
        `;

        booksList.appendChild(bookCard);
    });

    console.log("✅ Books displayed successfully");
}

// 🔄 Navigation Setup
function setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            showPage(page);
        });
    });
}

// 🔽 Dropdown Menu Setup
function setupDropdown() {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-content");

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle("show");
            dropdownBtn.classList.toggle("open");
        });

        document.addEventListener("click", (event) => {
            if (!dropdownMenu.contains(event.target) && !drospdownBtn.contains(event.target)) {
                dropdownMenu.classList.remove("show");
                dropdownBtn.classList.remove("open");
            }
        });
    }
}

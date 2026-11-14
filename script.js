"use strict";


/* =========================================================
   BOOK DATA
========================================================= */

const BOOKS = [

    {
        id: "silent-patient",
        title: "The Silent Patient",
        category: "Mystery",
        author: "Alex Michaelides",
        price: 45,
        image: "images/silent-patient.png",
        description:
            "A psychological mystery about a woman who stops speaking after a shocking crime."
    },

    {
        id: "and-then-there-were-none",
        title: "And Then There Were None",
        category: "Mystery",
        author: "Agatha Christie",
        price: 42,
        image: "images/and-none.png",
        description:
            "A classic mystery where ten strangers are brought together on an isolated island."
    },

    {
        id: "atomic-habits",
        title: "Atomic Habits",
        category: "Self-Development",
        author: "James Clear",
        price: 58,
        image: "images/atomic-habits.png",
        description:
            "A practical guide to building good habits and breaking bad ones through small changes."
    },

    {
        id: "hobbit",
        title: "The Hobbit",
        category: "Fantasy",
        author: "J.R.R. Tolkien",
        price: 52,
        image: "images/hobbit.png",
        description:
            "An unforgettable fantasy adventure following Bilbo Baggins on an extraordinary journey."
    },

    {
        id: "pride",
        title: "Pride and Prejudice",
        category: "Romance",
        author: "Jane Austen",
        price: 38,
        image: "images/pride-prejudice.png",
        description:
            "A classic novel exploring relationships, family, society, and misunderstandings."
    },

    {
        id: "educated",
        title: "Educated",
        category: "Education",
        author: "Tara Westover",
        price: 49,
        image: "images/educated.png",
        description:
            "A memoir about education, personal growth, and the power of learning."
    },

    {
        id: "dune",
        title: "Dune",
        category: "Science Fiction",
        author: "Frank Herbert",
        price: 55,
        image: "images/dune.png",
        description:
            "An epic science-fiction story set on a desert planet filled with politics and adventure."
    },

    {
        id: "story-collector",
        title: "The Story Collector",
        category: "Romance",
        author: "Book Haven Collection",
        price: 45,
        image: "images/story-collector.png",
        description:
            "A heartfelt story about memories, relationships, and the stories people carry with them."
    }

];



/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function money(amount) {
    return `${amount.toFixed(2)} SAR`;
}


function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("bookHavenCart")
        ) || [];

    } catch (error) {

        return [];

    }
}


function saveCart(cart) {

    localStorage.setItem(
        "bookHavenCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


function updateCartCount() {

    const countElement =
        document.getElementById("cart-count");

    if (!countElement) {
        return;
    }

    const cart = getCart();

    let totalQuantity = 0;

    for (let i = 0; i < cart.length; i++) {

        totalQuantity += cart[i].quantity;

    }

    countElement.textContent = totalQuantity;

}


/* =========================================================
   BOOK CARD
========================================================= */

function bookCard(book) {

    return `
        <article class="book-card">

            <a
                href="product-details.html?id=${encodeURIComponent(book.id)}"
                class="book-image-link">

                <img
                    src="${book.image}"
                    alt="${book.title}"
                    class="book-image"
                >

            </a>


            <div class="book-info">

                <span class="book-category">
                    ${book.category}
                </span>


                <h3>
                    ${book.title}
                </h3>


                <p class="author">
                    By ${book.author}
                </p>


                <p class="book-description">
                    ${book.description}
                </p>


                <div class="book-bottom">

                    <strong class="price">
                        ${money(book.price)}
                    </strong>

                    <a
                        href="product-details.html?id=${encodeURIComponent(book.id)}"
                        class="small-btn">
                        View Details
                    </a>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(bookId, quantity = 1) {

    const book = BOOKS.find(
        item => item.id === bookId
    );

    if (!book) {
        return;
    }

    const cart = getCart();

    const existingItem =
        cart.find(item => item.id === bookId);


    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({
            id: book.id,
            quantity: quantity
        });

    }

    saveCart(cart);

}


/* =========================================================
   RENDER BOOKS
========================================================= */

function renderBooks(list, container) {

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">📚</div>

                <h3>No Books Found</h3>

                <p>
                    Try another search term or category.
                </p>

            </div>
        `;

        return;
    }


    list.forEach(function (book) {

        container.insertAdjacentHTML(
            "beforeend",
            bookCard(book)
        );

    });

}


/* =========================================================
   SEARCH + FILTER
========================================================= */

function setupBooksPage() {

    const booksContainer =
        document.getElementById("all-books");

    if (!booksContainer) {
        return;
    }

    const searchInput =
        document.getElementById("product-search");

    const categoryFilter =
        document.getElementById("category-filter");


    const urlParams =
        new URLSearchParams(window.location.search);

    const urlCategory =
        urlParams.get("category");


    if (urlCategory && categoryFilter) {

        categoryFilter.value =
            urlCategory;

    }


    function filterBooks() {

        const searchTerm =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";

        const selectedCategory =
            categoryFilter
                ? categoryFilter.value
                : "all";


        const filteredBooks =
            BOOKS.filter(function (book) {

                const matchesSearch =
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm);


                const matchesCategory =
                    selectedCategory === "all" ||
                    book.category === selectedCategory;


                return matchesSearch && matchesCategory;

            });


        renderBooks(
            filteredBooks,
            booksContainer
        );


        const noProducts =
            document.getElementById("no-products");

        if (noProducts) {

            if (filteredBooks.length === 0) {

                noProducts.classList.remove("hidden");

            } else {

                noProducts.classList.add("hidden");

            }

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterBooks
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterBooks
        );

    }


    filterBooks();

}


/* =========================================================
   FEATURED BOOKS
========================================================= */

function renderFeaturedBooks() {

    const container =
        document.getElementById("featured-books");

    if (!container) {
        return;
    }

    const featured =
        BOOKS.slice(0, 4);

    renderBooks(
        featured,
        container
    );

}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

function setupProductDetails() {

    const image =
        document.getElementById("detail-image");

    if (!image) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const bookId =
        params.get("id");


    const book =
        BOOKS.find(
            item => item.id === bookId
        );


    if (!book) {

        document.getElementById(
            "product-details"
        ).innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">❌</div>

                <h2>Book Not Found</h2>

                <p>
                    The requested book does not exist.
                </p>

                <a
                    href="books.html"
                    class="btn primary-btn">
                    Back to Books
                </a>

            </div>
        `;

        return;

    }


    /* DYNAMIC PICTURE */

    image.src =
        book.image;

    image.alt =
        book.title;


    /* DYNAMIC TEXT */

    document.getElementById(
        "detail-title"
    ).textContent =
        book.title;


    document.getElementById(
        "detail-category"
    ).textContent =
        book.category;


    document.getElementById(
        "detail-author"
    ).textContent =
        book.author;


    document.getElementById(
        "detail-description"
    ).textContent =
        book.description;


    document.getElementById(
        "detail-price"
    ).textContent =
        money(book.price);


    document.title =
        `Book Haven | ${book.title}`;


    const addButton =
        document.getElementById(
            "detail-add-cart"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                const quantityInput =
                    document.getElementById(
                        "detail-quantity"
                    );

                const quantity =
                    Math.max(
                        1,
                        parseInt(
                            quantityInput.value
                        ) || 1
                    );


                addToCart(
                    book.id,
                    quantity
                );


                const message =
                    document.getElementById(
                        "detail-message"
                    );


                if (message) {

                    message.textContent =
                        `${book.title} was added to your cart.`;

                    /* CHANGE CSS USING JAVASCRIPT */

                    message.style.color =
                        "green";

                    message.style.fontWeight =
                        "bold";

                    message.style.marginTop =
                        "15px";

                }

            }
        );

    }

}


/* =========================================================
   SIGN UP VALIDATION
========================================================= */

function setupSignupForm() {

    const signupForm =
        document.getElementById(
            "signupForm"
        );

    if (!signupForm) {
        return;
    }


    signupForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fullName =
                document.getElementById(
                    "fullName"
                ).value.trim();


            const email =
                document.getElementById(
                    "signupEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "signupPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            const message =
                document.getElementById(
                    "signupMessage"
                );


            /* CONTROL STATEMENTS */

            if (fullName.length < 3) {

                showMessage(
                    message,
                    "Name must contain at least 3 characters.",
                    "error"
                );

                return;

            } else if (
                !email.includes("@") ||
                !email.includes(".")
            ) {

                showMessage(
                    message,
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            } else if (
                password.length < 6
            ) {

                showMessage(
                    message,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;

            } else if (
                password !== confirmPassword
            ) {

                showMessage(
                    message,
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            /* SAVE USER */

            const user = {

                name: fullName,

                email: email,

                password: password

            };


            localStorage.setItem(
                "bookHavenUser",
                JSON.stringify(user)
            );


            showMessage(
                message,
                "Account created successfully!",
                "success"
            );


            signupForm.reset();

        }
    );

}


/* =========================================================
   MESSAGE FUNCTION
========================================================= */

function showMessage(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        text;


    if (type === "success") {

        element.style.color =
            "green";

        element.style.fontWeight =
            "bold";

    } else {

        element.style.color =
            "red";

        element.style.fontWeight =
            "bold";

    }

}


/* =========================================================
   LOGIN VALIDATION
========================================================= */

function setupLoginForm() {

    const loginForm =
        document.getElementById(
            "login-form"
        );

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "login-email"
                ).value.trim();


            const password =
                document.getElementById(
                    "login-password"
                ).value;


            const message =
                document.getElementById(
                    "login-message"
                );


            const savedUser =
                JSON.parse(
                    localStorage.getItem(
                        "bookHavenUser"
                    )
                );


            if (!savedUser) {

                showMessage(
                    message,
                    "No account found. Please sign up first.",
                    "error"
                );

                return;

            }


            if (
                email === savedUser.email &&
                password === savedUser.password
            ) {

                localStorage.setItem(
                    "bookHavenLoggedIn",
                    "true"
                );


                showMessage(
                    message,
                    `Welcome back, ${savedUser.name}! Login successful.`,
                    "success"
                );

            } else {

                showMessage(
                    message,
                    "Invalid email or password.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logout-btn"
        );

    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "bookHavenLoggedIn"
            );


            const message =
                document.getElementById(
                    "login-message"
                );


            showMessage(
                message,
                "You have been logged out successfully.",
                "success"
            );

        }
    );

}


/* =========================================================
   CART PAGE
========================================================= */

function setupCartPage() {

    const cartContainer =
        document.getElementById(
            "cart-container"
        );

    if (!cartContainer) {
        return;
    }


    function drawCart() {

        const cart =
            getCart();


        cartContainer.innerHTML =
            "";


        if (cart.length === 0) {

            cartContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🛒
                    </div>

                    <h2>
                        Your Cart is Empty
                    </h2>

                    <p>
                        Add some books to your cart to see them here.
                    </p>

                    <a
                        href="books.html"
                        class="btn primary-btn">
                        Browse Books
                    </a>

                </div>

            `;


            const summary =
                document.getElementById(
                    "cart-summary"
                );

            if (summary) {
                summary.innerHTML = "";
            }

            return;

        }


        let total =
            0;


        /* FOR LOOP */

        for (
            let i = 0;
            i < cart.length;
            i++
        ) {

            const item =
                cart[i];


            const book =
                BOOKS.find(
                    book =>
                        book.id === item.id
                );


            if (!book) {
                continue;
            }


            const itemTotal =
                book.price *
                item.quantity;


            total +=
                itemTotal;


            cartContainer.insertAdjacentHTML(
                "beforeend",
                `

                <article class="cart-item">

                    <img
                        src="${book.image}"
                        alt="${book.title}"
                    >


                    <div class="cart-item-info">

                        <span class="book-category">
                            ${book.category}
                        </span>

                        <h3>
                            ${book.title}
                        </h3>

                        <p>
                            ${book.author}
                        </p>

                        <strong>
                            ${money(book.price)}
                        </strong>

                    </div>


                    <div class="quantity-control">

                        <label>
                            Quantity
                        </label>

                        <input
                            type="number"
                            min="1"
                            value="${item.quantity}"
                            data-id="${book.id}"
                            class="cart-quantity"
                        >

                    </div>


                    <div class="cart-item-total">

                        <strong>
                            ${money(itemTotal)}
                        </strong>

                        <button
                            type="button"
                            class="remove-btn"
                            data-remove="${book.id}">
                            Remove
                        </button>

                    </div>

                </article>

                `
            );

        }


        const summary =
            document.getElementById(
                "cart-summary"
            );


        if (summary) {

            summary.innerHTML = `

                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        ${money(total)}
                    </strong>

                </div>


                <div class="cart-actions">

                    <button
                        type="button"
                        id="clear-cart"
                        class="btn secondary-btn">
                        Clear Cart
                    </button>


                    <button
                        type="button"
                        id="checkout-btn"
                        class="btn primary-btn">
                        Checkout
                    </button>

                </div>

            `;

        }


        setupCartEvents();

    }


    function setupCartEvents() {

        const quantityInputs =
            document.querySelectorAll(
                ".cart-quantity"
            );


        quantityInputs.forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        const id =
                            this.dataset.id;


                        const quantity =
                            Math.max(
                                1,
                                parseInt(
                                    this.value
                                ) || 1
                            );


                        const cart =
                            getCart();


                        const item =
                            cart.find(
                                product =>
                                    product.id === id
                            );


                        if (item) {

                            item.quantity =
                                quantity;

                            saveCart(
                                cart
                            );

                            drawCart();

                        }

                    }
                );

            }
        );


        const removeButtons =
            document.querySelectorAll(
                "[data-remove]"
            );


        removeButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.dataset.remove;


                        let cart =
                            getCart();


                        cart =
                            cart.filter(
                                item =>
                                    item.id !== id
                            );


                        saveCart(cart);

                        drawCart();

                    }
                );

            }
        );


        const clearButton =
            document.getElementById(
                "clear-cart"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "bookHavenCart"
                    );

                    updateCartCount();

                    drawCart();

                }
            );

        }


        const checkoutButton =
            document.getElementById(
                "checkout-btn"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                function () {

                    alert(
                        "Thank you! Checkout is a demo feature for this assignment."
                    );

                }
            );

        }

    }


    drawCart();

}


/* =========================================================
   REQUIRED LOOP EXAMPLE
   FOR + WHILE + IF
========================================================= */

function calculateBookStatistics() {

    let totalBooks = 0;


    /* FOR LOOP */

    for (
        let i = 0;
        i < BOOKS.length;
        i++
    ) {

        totalBooks++;

    }


    let index = 0;

    const categories = [];


    /* WHILE LOOP */

    while (
        index < BOOKS.length
    ) {

        const category =
            BOOKS[index].category;


        /* IF */

        if (
            !categories.includes(category)
        ) {

            categories.push(category);

        }


        index++;

    }


    console.log(
        "Total Books:",
        totalBooks
    );


    console.log(
        "Book Categories:",
        categories
    );

}


/* =========================================================
   INITIALIZE EVERYTHING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        renderFeaturedBooks();

        setupBooksPage();

        setupProductDetails();

        setupSignupForm();

        setupLoginForm();

        setupLogout();

        setupCartPage();

        calculateBookStatistics();

    }
);
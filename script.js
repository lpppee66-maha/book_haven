
const BOOKS = [
  {
    id: "silent-patient",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Mystery",
    price: 49,
    image: "images/silent-patient.png",
    description: "A psychological mystery about a famous painter who stops speaking after a shocking incident. A gripping story full of secrets and unexpected turns."
  },
  {
    id: "and-then-there-were-none",
    title: "And Then There Were None",
    author: "Agatha Christie",
    category: "Fiction",
    price: 65,
    image: "images/and-none.png",
    description: "Ten strangers, apparently with little in common,are lured to an island mansion off the coast of Devon by the mysteriousU.N.Owen. Over dinner, a record begins to play, and the voice of anunseen host accuses each person of hiding a guilty secret. That evening,former reckless driver Tony Marston is found murdered by a deadly doseof cyanide. The tension escalates as the survivors realise the killeris not only among them but is preparing to strike again...and again..."
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Development",
    price: 58,
    image: "images/atomic-habits.png",
    description: "A practical guide to building good habits, breaking unhelpful ones, and making small changes that lead to meaningful results."
  },
  {
    id: "hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    price: 52,
    image: "images/hobbit.png",
    description: "Join Bilbo Baggins on an unforgettable adventure through a world of dragons, treasure, and extraordinary friendships."
  },
  {
    id: "pride",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    price: 39,
    image: "images/pride-prejudice.png",
    description: "A classic story of love, family, first impressions, and the social expectations of nineteenth-century England."
  },
  {
    id: "educated",
    title: "Educated",
    author: "Tara Westover",
    category: "Education",
    price: 55,
    image: "images/educated.png",
    description: "A memoir about the transformative power of education and one woman's journey toward discovering her own voice."
  },
  {
    id: "dune",
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    price: 62,
    image: "images/dune.png",
    description: "An epic science-fiction adventure set on a desert planet where politics, power, and survival shape the future."
  },
{
  image: "images/story-collector.png",
    id: "story-collector",
    title: "The Story Collector",
    author: "Unknown",
    category: "Fiction",
    price: 59,
    image: "images/story-collector.png", 
    description: "Even Ordinary People Have Extraordinary Stories to Tell."
}
];

const money = n => `${n} SAR`;
const getCart = () => JSON.parse(localStorage.getItem("bookHavenCart") || "[]");
const saveCart = cart => { localStorage.setItem("bookHavenCart", JSON.stringify(cart)); updateCartCount(); };
function updateCartCount(){const count=getCart().reduce((sum,item)=>sum+item.qty,0);document.querySelectorAll(".cart-count").forEach(el=>el.textContent=count);}
function bookCard(book){return `<article class="book-card"><a href="product-details.html?id=${book.id}" class="book-cover"><img src="${book.image}" alt="Cover of ${book.title}" loading="lazy"></a><p class="book-category">${book.category}</p><h3><a href="product-details.html?id=${book.id}">${book.title}</a></h3><p class="book-author">by ${book.author}</p><p class="book-price">${money(book.price)}</p><button class="btn" onclick="addToCart('${book.id}',1)">Add to Cart</button></article>`;}
function addToCart(id,qty=1){const book=BOOKS.find(b=>b.id===id);if(!book)return;const cart=getCart();const found=cart.find(item=>item.id===id);if(found)found.qty+=qty;else cart.push({id,qty});saveCart(cart);alert(`${book.title} added to your cart.`);}
function renderBooks(container,books){if(container)container.innerHTML=books.map(bookCard).join("");}
document.addEventListener("DOMContentLoaded",()=>{
 updateCartCount();
 renderBooks(document.getElementById("featured-books"),BOOKS.slice(0,4));
 const allBooks=document.getElementById("all-books");
 if(allBooks){
   const search=document.getElementById("product-search"),filter=document.getElementById("category-filter");
   const params=new URLSearchParams(location.search);if(params.get("category"))filter.value=params.get("category");
   const apply=()=>{const term=search.value.toLowerCase();const cat=filter.value;const found=BOOKS.filter(b=>(b.title+" "+b.author+" "+b.category).toLowerCase().includes(term)&&(!cat||b.category===cat));renderBooks(allBooks,found);document.getElementById("no-products").hidden=found.length>0;};
   search.addEventListener("input",apply);filter.addEventListener("change",apply);apply();
 }
 const detail=document.getElementById("book-details");
 if(detail){const id=new URLSearchParams(location.search).get("id");const book=BOOKS.find(b=>b.id===id)||BOOKS[0];
 document.title=`${book.title} | Book Haven`;document.getElementById("detail-image").src=book.image;document.getElementById("detail-image").alt=`Cover of ${book.title}`;
 document.getElementById("detail-title").textContent=book.title;document.getElementById("detail-category").textContent=book.category;document.getElementById("detail-author").textContent=`By ${book.author}`;document.getElementById("detail-description").textContent=book.description;document.getElementById("detail-price").textContent=money(book.price);
 document.getElementById("add-detail-cart").addEventListener("click",()=>{const qty=Math.max(1,Math.min(10,Number(document.getElementById("quantity").value)||1));addToCart(book.id,qty);});}
 const cartItems=document.getElementById("cart-items");
 if(cartItems){const draw=()=>{const cart=getCart();document.getElementById("cart-content").hidden=cart.length===0;document.getElementById("empty-cart").hidden=cart.length!==0;
 cartItems.innerHTML=cart.map(item=>{const b=BOOKS.find(book=>book.id===item.id);if(!b)return "";return `<article class="cart-item"><img src="${b.image}" alt="${b.title}"><div><h3>${b.title}</h3><p>${b.author}</p><p>${money(b.price)} each</p><label>Qty <input type="number" min="1" max="10" value="${item.qty}" onchange="changeQty('${b.id}',this.value)"></label></div><div><strong>${money(b.price*item.qty)}</strong><br><button class="remove-btn" onclick="removeFromCart('${b.id}')">Remove</button></div></article>`;}).join("");
 const total=cart.reduce((sum,item)=>{const b=BOOKS.find(book=>book.id===item.id);return sum+(b?b.price*item.qty:0);},0);document.getElementById("cart-subtotal").textContent=money(total);document.getElementById("cart-total").textContent=money(total);updateCartCount();};
 window.changeQty=(id,value)=>{const cart=getCart();const item=cart.find(x=>x.id===id);if(item)item.qty=Math.max(1,Math.min(10,Number(value)||1));saveCart(cart);draw();};
 window.removeFromCart=id=>{saveCart(getCart().filter(x=>x.id!==id));draw();};
 document.getElementById("clear-cart").addEventListener("click",()=>{if(confirm("Clear all books from your cart?")){saveCart([]);draw();}});
 document.getElementById("checkout-btn").addEventListener("click",()=>{if(getCart().length){alert("Thank you! This is a demo store, so no real payment will be processed.");saveCart([]);draw();}});
 draw();}
 const login=document.getElementById("login-form");if(login)login.addEventListener("submit",e=>{e.preventDefault();document.getElementById("login-message").textContent="Demo only: login is not connected to an account system.";});
 const contact=document.getElementById("contact-form");if(contact)contact.addEventListener("submit",e=>{e.preventDefault();document.getElementById("contact-message").textContent="Thank you for contacting Book Haven! This demo form does not send messages.";contact.reset();});
});
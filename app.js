// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');


//CART
let cart = [];

//GETTING THE PRODUCTS
class Products {
 async getProducts() {
  try {
   let result = await fetch('products.json');
   let data = await result.json();
   let products = data.items;

   products = products.map(item => {
    const {title, price} = item.fields;
    const {id} = item.sys;
    const image = item.fields.image.fields.file.url;
    return {title, price, id, image}
   });
   return products;
  } catch (error) {
   console.log(error);
  }
 }
}

//DISPLAY PRODUCTS
class UI {
 displayProducts(prods) {
  let result = '';
  prods.forEach(p => {
   result += `
    <!-- single product -->
    <article class="product">
     <div class="img-container">
      <img src=${p.image} alt="product" class="product-img">
      <button class="bag-btn" data-id=${p.id}>
       <i class="fa fa-shopping-cart"></i>
       add to bag
      </button>
     </div>
     <h3>${p.title}</h3>
     <h4>$${p.price}</h4>
    </article>
    <!-- end of single product -->
   `;
  });
  productsDOM.innerHTML = result;
 }

 getBagButtons() {
  const buttons = [...document.querySelectorAll(".bag-btn")];
  console.log(buttons);
  buttons.forEach(button => {
   let id = button.dataset.id;
   let inCart = cart.find(item => item.id === id);
   if(inCart) {
    button.innerText = "In Cart";
    button.disabled = true;
   } else {
    button.addEventListener('click', (event) => {
     event.target.innerText = "In Cart";
     event.target.disabled = true;
     // continue
    });
   }
  });
 }
}

//LOCAL STORAGE
class Storage {
 static saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
 }
}

document.addEventListener("DOMContentLoaded", ()=> {
 const ui = new UI();
 const products = new Products();

 //GET ALL PRODUCTS
 products.getProducts().then(prods => {
  ui.displayProducts(prods);
  Storage.saveProducts(prods);
 }).then( ()=> {
  ui.getBagButtons();
 });

});
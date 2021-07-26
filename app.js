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
//BUTTONS
let buttonsDOM = [];

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
  buttonsDOM = buttons;
  buttons.forEach(button => {
   let id = button.dataset.id;
   let inCart = cart.find(item => item.id === id);
   if(inCart) {
    button.innerText = "In Cart";
    button.disabled = true;
   } 

   button.addEventListener('click', (event) => {
    event.target.innerText = "In Cart";
    event.target.disabled = true;
    // GET PRODUCT FROM PRODUCTS
    let cartItem = {...Storage.getProduct(id), amount:1};
    // ADD PRODUCT TO THE CART
    cart = [...cart, cartItem];
    console.log(cart);
    // SAVE CART IN LOCAL STORAGE
    Storage.saveCart(cart);
    // SET CART VALUES
    this.setCartValues(cart);
    // DISPLAY CART ITEMS
    this.addCartItem(cartItem);
    // SHOW THE CART
    this.showCart();
   });
  });
 }
 setCartValues(cart) {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map(item => {
   tempTotal += item.price * item.amount;
   itemsTotal += item.amount;
  });
  cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  cartItems.innerText = itemsTotal;
  console.log(cartTotal, cartItems);
 }
 addCartItem(item) {
  const div = document.createElement('div');
  div.classList.add('cart-item');
  div.innerHTML = `
   <img src=${item.image} alt="product">
   <div>
     <h4>${item.title}</h4>
     <h5>$${item.price}</h5>
     <span class="remove-item" data-id=${item.id}>remove</span>
   </div>
   <div>
     <i class="fa fa-chevron-up" data-id=${item.id}></i>
     <p class="item-amount">${item.amount}</p>
     <i class="fa fa-chevron-down" data-id=${item.id}></i>
   </div>
  `;
  cartContent.appendChild(div);
 }
 showCart() {
  cartOverlay.classList.add('transparentBcg');
  cartDOM.classList.add('showCart');
 }
}

//LOCAL STORAGE
class Storage {
 static saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
 }
 static getProduct(id) {
  let products = JSON.parse(localStorage.getItem('products'));
  return products.find(product => product.id == id);
 }
 static saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
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
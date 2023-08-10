const shopping = document.querySelector(".icon-div");
const sidebar = document.querySelector(".sidebar");

const products = document.querySelector(".products");
let containerBuyCart = document.querySelector(".shopping-cards");
let buyProducts =  [...document.querySelectorAll(".card-store")];

let buyThings = {};
let totalPrice = 0;
let openSideBar = 0;

shopping.addEventListener("click", ()=>{
    sidebar.classList.toggle("sidebar-active");
});

loadEventListeners();
function loadEventListeners(){
    products.addEventListener("click", addProduct);

    sidebar.addEventListener("click", deleteProduct);

    sidebar.addEventListener("click", confirmedBuy)
}

function confirmedBuy(e){
    e.preventDefault();
    if(e.target.classList.contains("final-buy")){
        if(Object.values(buyThings).length>=1){
            for(const id in buyThings){
                buyThings[id].amount = 0;
                delete buyThings[id];
            }
            updateTotalPrice();
            loadHTML();

            const confirmedCard = document.querySelector(".complete-purcharse");
            confirmedCard.classList.add("complete-purcharse-add");
            setTimeout(()=>{
                confirmedCard.classList.toggle("complete-purcharse-add");
            }, 3000)
        }
    }
    
}

function deleteProduct(e){
    if(e.target.classList.contains("delete")){
        const id = e.target.parentElement.getAttribute("data-id");
        if(buyThings[id].amount <= 1){
            delete buyThings[id];
            loadHTML();
            updateTotalPrice();
        } else {
            buyThings[id].amount--;
            updateAmount(id, buyThings[id].amount);
            updateTotalPrice();
        }
    }
}

function addProduct(e){
    e.preventDefault();
    if(e.target.classList.contains("shop-button")){
        if(openSideBar===0){   
            sidebar.classList.add("sidebar-active");
            openSideBar++;
        }
        const product = e.target.parentElement;
        const id = product.querySelector("a").getAttribute("data-id");

        if(buyThings[id]){
            buyThings[id].amount++;
            updateAmount(id, buyThings[id].amount);
        } else {
            const infoProduct = {
                image: product.querySelector(".cardimg").src,
                name: product.querySelector(".name").textContent,
                price: product.querySelector(".price").textContent,
                id: id,
                amount: 1
            };
    
            buyThings[id] = infoProduct;
            console.log(buyThings);
            loadHTML();
        }

        updateTotalPrice();
    }
}

function updateAmount(id, newQuantity){
    const cartItem = document.querySelector(`.card-store[data-id="${id}"]`);
    const amountElement = cartItem.querySelector(".amount");
    amountElement.textContent = `Kilos: ${newQuantity}`;
}

function updateTotalPrice(){
    totalPrice = 0;

    // Recorre todos los productos en buyThings y suma sus precios al totalPrice
    for (const id in buyThings) {
        const { price, amount } = buyThings[id];
        totalPrice += parseFloat(price.replace('$', '').replace('/kg', '')) * amount;
    }

    // Refleja el precio total en la vista
    const totalPriceElement = document.querySelector(".total-price");
    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function loadHTML(){
    containerBuyCart.innerHTML = "";
    for(const id in buyThings){
        const {image, name, price, amount} = buyThings[id];
        const row = document.createElement("div");
        row.classList.add("card-store");
        row.setAttribute("data-id", `${id}`);
        row.innerHTML = `
            <img src="${image}" class="img-store">
            <div class="name-price">
                <span class="text">${name}</span>
                <span class="amount">Kilos: ${amount}</span>
                <span class="text price">${price}</span>                                                                                    
            </div>
            <i class='bx bx-minus-circle delete' data-id="${id}"></i>
        `;
        containerBuyCart.appendChild(row);
    }
}
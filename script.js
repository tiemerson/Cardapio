const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


//abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal(); 
    cartModal.style.display="flex"
})

//fechar  o modal quando clicar fora
cartModal.addEventListener("click",function(event){
    if(event.target === cartModal){
        cartModal.style.display="none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //console.log(event.targe)
    let parentButton = event.target.closest(".add-to-cart-btn")
    console.log(parentButton)

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

       // console.log(name)
        //console.log(price)

        //adicionar no carrinho.
        addToCart(name,price)

    }

})

//função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        //se o item ja existe , aumenta a quantidade em mais +1
        existingItem.quantity +=1;
    }else{
        cart.push({
        name,
        price,
        quantity:1,
    })
    }

    updateCartModal()
}

//atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML ="";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4","flex-col")

        cartItemElement.innerHTML=`
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd:${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p> 
                <br>
            </div>

            
            <button class="remove-from-cart-btn" data-name="${item.name}">
                remover 
            </button>    
            
        </div>
        `

        total +=item.price *item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    })

    cartCounter.innerHTML = cart.length;

}

//função para remover ite m do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")   
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        console.log(item)

        if(item.quantity >1){
            item.quantity -=1;
            updateCartModal();
            return;
        }
        
        cart.splice(index,1);
        updateCartModal();
    }
}






addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !==""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
  
    }


})

//finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "OPS o restaurante está fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Montando a mensagem para o WhatsApp
    let message = "";

    cart.forEach(item => {
        message += `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price.toFixed(2)}\n`;
    });

    message += `\nEndereço: ${addressInput.value}\n`;
    message += `Total: ${cartTotal.textContent.trim()}`;

    const encodedMessage = encodeURIComponent(message);
    const phone = "5592992200626";

    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");

    cart = [];
    updateCartModal();
});




//verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
     return hora >= 1 && hora <25;
    //true = restaurante esta aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
//fim da verificação do ho do restaurante
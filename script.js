//URL to find data
const url =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

//Global variables
let datos = "";
let pedidos = 0;
let cart = [];

//Fetch data from json
fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    datos = data;
    buildCards(datos[0]);
    initButtons();
  });

function initButtons() {
  document.getElementById("carrito").addEventListener("click", buildTable);
  document
    .getElementById("burgers")
    .addEventListener("click", () => changeMenu(0));
  document
    .getElementById("tacos")
    .addEventListener("click", () => changeMenu(1));
  document
    .getElementById("salads")
    .addEventListener("click", () => changeMenu(2));
  document
    .getElementById("desserts")
    .addEventListener("click", () => changeMenu(3));
  document
    .getElementById("sides")
    .addEventListener("click", () => changeMenu(4));
  document
    .getElementById("cancelOrderButton")
    .addEventListener("click", clearOrder);
}

function buildCards(data) {
  let string = "";
  for (let i = 0; i < data.products.length; i++) {
    const element = data.products[i];
    string += `<div class="col mb-3">
      <div class="card h-100">
        <img src="${element.image}" class="card-img-top" alt="${element.name}">
        <div class="card-body">
          <h5 class="card-title">${element.name}</h5>
          <p class="card-text">${element.description}</p>
          <p class="card-text price">$<span id="value">${element.price}</span></p>
          <a class="btn btn-dark foodItem">Add to cart</a>
        </div>
      </div>
    </div>`;
  }
  document.getElementById("pedido").innerHTML = "";
  document.getElementById("cards").innerHTML = string;
  document.getElementById("title").innerHTML = data.name;

  //Add event listeners to buttons
  let elements = document.querySelectorAll(".foodItem");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.addEventListener("click", () => anadir(element));
  }
}

function changeMenu(index) {
  buildCards(datos[index]);
}

function anadir(button) {
  //Add one to counter
  pedidos++;
  document.getElementById("numero").textContent = pedidos;

  //Search if it is already in the cart
  let info = button.parentNode;
  let nombre = info.querySelector("h5").textContent;
  let found = false;
  for (let i = 0; i < cart.length && !found; i++) {
    const element = cart[i];
    //If it is already in the cart add 1 to qty and exit for
    if (nombre === element.description) {
      found = true;
      cart[i].quantity++;
    }
  }

  //If not, add it
  if (!found) {
    let nuevo = {
      item: cart.length + 1,
      quantity: 1,
      description: info.querySelector("h5").textContent,
      unitPrice: parseFloat(info.querySelector("#value").textContent),
    };

    cart.push(nuevo);
  }
}

function buildTable() {
  document.getElementById("title").textContent = "Order detail";
  //Create elements of the table

  //Table
  let table = document.createElement("table");
  table.classList.add("table");
  table.classList.add("table-striped");
  //thead
  let thead = document.createElement("thead");
  //tr
  let trHead = document.createElement("tr");
  //th's
  let itemHead = document.createElement("th");
  itemHead.textContent = "Item";
  let qtyHead = document.createElement("th");
  qtyHead.textContent = "Qty.";
  let descriptionHead = document.createElement("th");
  descriptionHead.textContent = "Description";
  let priceHead = document.createElement("th");
  priceHead.textContent = "Unit Price";
  let amountHead = document.createElement("th");
  amountHead.textContent = "Amount";

  //Append to table
  trHead.appendChild(itemHead);
  trHead.appendChild(qtyHead);
  trHead.appendChild(descriptionHead);
  trHead.appendChild(priceHead);
  trHead.appendChild(amountHead);

  thead.appendChild(trHead);

  table.appendChild(thead);

  //Create tbody
  tbody = document.createElement("tbody");
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const element = cart[i];
    //New row
    let row = document.createElement("tr");
    //New cells
    let item = document.createElement("td");
    item.textContent = element.item;
    let qty = document.createElement("td");
    qty.textContent = element.quantity;
    let description = document.createElement("td");
    description.textContent = element.description;
    let price = document.createElement("td");
    price.textContent = element.unitPrice;
    let amount = document.createElement("td");
    amount.textContent = element.quantity * element.unitPrice;
    total += element.quantity * element.unitPrice;
    //Append cells to row
    row.appendChild(item);
    row.appendChild(qty);
    row.appendChild(description);
    row.appendChild(price);
    row.appendChild(amount);

    //Append row to body
    tbody.appendChild(row);
  }
  //Append body to table
  table.appendChild(tbody);

  //Modify html to show table
  document.getElementById("cards").innerHTML = "";
  document.getElementById("pedido").innerHTML = "";
  document.getElementById("pedido").appendChild(table);

  //Create bottom row with total and buttons
  let bottom = document.createElement("div");
  bottom.classList.add("row");

  //Create p to show total price
  let totalPrice = document.createElement("p");
  totalPrice.classList.add("font-weight-bold");
  totalPrice.classList.add("col-9");
  totalPrice.textContent = "Total: $" + Number(total.toFixed(2));

  //Create buttons
  let buttons = document.createElement("span");
  buttons.classList.add("col-3");
  let butCancel = document.createElement("button");
  butCancel.classList.add("orderBut");
  butCancel.classList.add("but-red");
  butCancel.textContent = "Cancel";
  butCancel.addEventListener("click", toggleModal);
  let butConfirm = document.createElement("button");
  butConfirm.classList.add("orderBut");
  butConfirm.classList.add("but-white");
  butConfirm.textContent = "Confirm order";
  butConfirm.addEventListener("click", printOrder);

  buttons.appendChild(butCancel);
  buttons.appendChild(butConfirm);

  //Add price and buttons to the bottom
  bottom.appendChild(totalPrice);
  bottom.appendChild(buttons);

  document.getElementById("pedido").appendChild(bottom);
}

//Show modal
function toggleModal() {
  $("#modalDelete").modal("show");
}

//Clear the order and the table after confirmation
function clearOrder() {
  pedidos = 0;
  cart = [];
  document.getElementById("numero").textContent = pedidos;
  document.getElementById("pedido").innerHTML = "";
  buildTable();
  $("#modalDelete").modal("hide");
}

//Print the order details through console
function printOrder() {
  console.log(cart);
}

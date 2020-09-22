const url =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

let datos = "";
let pedidos = 0;

//Fetch data from json
fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    datos = data;
    buildCards(datos[0]);
  });

function buildCards(data) {
  console.log(data);
  let string = "";
  for (let i = 0; i < data.products.length; i++) {
    const element = data.products[i];
    string += `<div class="card col-3" style="width: 18rem;">
    <img src="${element.image}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${element.name}</h5>
      <p class="card-text">${element.description}</p>
      <p class="card-text">$${element.price}</p>
      <a href="#" onclick="anadir()" class="btn btn-primary">Add to cart</a>
    </div>
  </div>`;
  }
  document.getElementById("cards").innerHTML = string;
  document.getElementById("title").innerHTML = data.name;
}

function changeMenu(index) {
  buildCards(datos[index]);
}

function anadir() {
  pedidos++;
  document.getElementById("numero").innerHTML = pedidos;
}

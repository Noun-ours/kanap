main();
function main(){

  const chariotTxt = localStorage.getItem("panier")||"[]";
  const chariot =JSON.parse(chariotTxt);
console.log(chariot);
for (const article of chariot){
  fetch(`http://localhost:3000/api/products/${article.idArticle}`)
  .then(res=>res.json())
  .then(info=>{donnePanier(info,article.couleur,article.itemQuantity);})
  .catch(erreur=>alert(erreur));
}



// //localStorage.getItem( "articleSelectionne" )
// let i =0
// while (let i =0 ;i<nombreArticle;i++){
// alert(i)
//   const totalProduit=localStorage.getItem(localStorage.panier(i))
//   const jSON.parse(totalProduit)
// }

0.
// const nombreArticle=localStorage.length
// console.log("combien d'articles:", nombreArticle);



// fetch(`http://localhost:3000/api/products/${"elementsPanier"}`)
// .then(reponse =>reponse.json())
// .then((res) =>donnePanier(res))

function donnePanier(produit,couleur,itemQuantity) { 

  
  const elementsPanier=document.getElementById("cart__items")
  elementsPanier.insertAdjacentHTML("beforeend",` <article class="cart__item" data-id="${produit._id}" data-color="${couleur}">
  <div class="cart__item__img">
  <img src="${produit.imageUrl}" alt=" ${produit.altTxt} ">
  </div>
  <div class="cart__item__content">
  <div class="cart__item__content__description">
  <h2>${produit.name} </h2>
  <p>${couleur} </p>
  <p>${produit.price} €</p>
  </div>
  <div class="cart__item__content__settings">
  <div class="cart__item__content__settings__quantity">
  <p>Qté : ${itemQuantity}  </p>
  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemQuantity}">
  </div>
  <div class="cart__item__content__settings__delete">
  <p class="deleteItem">Supprimer</p>
  </div>
  </div>
  </div>
  </article> `)
}
 }
// 	Implémenter la suppression d'un article et la modification de la quantité sur la page "cart.html".
// •	Implémenter le total en quantité et en prix.

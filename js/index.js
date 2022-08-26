console.log("bonjour javascript")
fetch("http://localhost:3000/api/products")
.then(reponse=>reponse.json())
.then(produits=>{console.log(produits);
const listeProduits=document.getElementById("items");
produits.forEach(produit=> {
    listeProduits.insertAdjacentHTML("beforeend",`<a href="./product.html?id=${produit._id}">
    <article>
      <img src="${produit.imageUrl}" alt="${produit.altTxt}">
      <h3 class="productName">${produit.name}</h3>
      <p class="productDescription">${produit.description}</p>
    </article>
  </a>`)
});
})
.catch(erreur=>alert(erreur))
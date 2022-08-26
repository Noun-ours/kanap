/*
-lire le id depuis l'url avec urlsearchparams
-faire fetch avec l'url de l'api + le id 
- afficher le resultat a lutilisateur
*/


const queryString_url_id = window.location.search;


const urlParams = new URLSearchParams(queryString_url_id);

const id = urlParams.get("id");

fetch(`http://localhost:3000/api/products/${id}`)
.then(reponse=>reponse.json()) 
.then((res)=> handleData(res))

function handleData(canape){
 
    const { altTxt, colors, description, imageUrl, price, name, _id }= canape;
    makeImage(imageUrl, altTxt);
    makeTitle(name);
    afficherPrix(price);
    afficherDescription(description);
    afficherCouleurs(colors);


}

function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    //<img src="../images/logo.png" alt="Photographie d'un canapé"> 
    image.src= imageUrl
    image.alt= altTxt
    const parent= document.querySelector(".item__img")
   
    if (parent !=null) parent.appendChild(image)
}


function makeTitle(name){
    const h1 = document.querySelector("#title")
    if (h1 !=null) h1.textContent =name
   }

function afficherPrix(prix){
    const spanPrice = document.getElementById("price");
    spanPrice.textContent=prix.toFixed(2)+" " ;
}

function afficherDescription( description){
    document.getElementById("description").textContent=description;

}

function afficherCouleurs(tableauCouleurs){
    const selectColor = document.getElementById("colors");
    tableauCouleurs.forEach(couleur=>selectColor.insertAdjacentHTML("beforeend",` <option value="${couleur}">${couleur}</option>`))

}
document.getElementById("addToCart").addEventListener("click",ajouterAuPanier);
function ajouterAuPanier(){
    console.log("verification")
    const articleSelectionner={
        couleur:document.getElementById("colors").value
    }
    console.log("articleSelectionner: ",articleSelectionner)
    localStorage.setItem("panier",JSON.stringify(articleSelectionner))
}





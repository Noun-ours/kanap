/*
-lire le id depuis l'url avec urlsearchparams
-faire fetch avec l'url de l'api + le id 
- afficher le resultat a lutilisateur
*/
//

const queryString_url_id = window.location.search;
const urlParams = new URLSearchParams(queryString_url_id);
const id = urlParams.get("id");
let afficherSomme = 0

fetch(`http://localhost:3000/api/products/${id}`)
    .then(reponse => reponse.json())
    .then((res) => handleData(res))

function handleData(canape) {

    const { altTxt, colors, description, imageUrl, price, name, _id } = canape;
    makeImage(imageUrl, altTxt);
    makeTitle(name);
    afficherPrix(price);
    afficherDescription(description);
    afficherCouleurs(colors);
    afficherSomme = price;


}
// pour l'affichage de l'image produit et son texte alternatif
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    //<img src="../images/logo.png" alt="Photographie d'un canapé"> 
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")

    if (parent != null) parent.appendChild(image)
}

//affichage du nom du produit;;;;;;;;;
function makeTitle(name) {
    const h1 = document.querySelector("#title")
    if (h1 != null) h1.textContent = name
}
//pour l'affichage du prix
function afficherPrix(prix) {
    const spanPrice = document.getElementById("price");
    spanPrice.textContent = prix.toFixed(2) + " ";
}
// la description du produit
function afficherDescription(description) {
    document.getElementById("description").textContent = description;

}
//pour l'affichage des differentes couleurs
function afficherCouleurs(tableauCouleurs) {
    const selectColor = document.getElementById("colors");
    tableauCouleurs.forEach(couleur => selectColor.insertAdjacentHTML("beforeend", ` <option value="${couleur}">${couleur}</option>`))

}

//pour l'ajout de produits au panier et verification du panier valide
const btnAjouterAuPanier = document.getElementById("addToCart");
btnAjouterAuPanier.addEventListener("click", ajouterAuPanier);
function ajouterAuPanier() {
    const couleurChoisie = document.getElementById("colors").value;
    const quantiteChoisie = document.getElementById("quantity").value;
    if (!panierValide(couleurChoisie, quantiteChoisie)) {
        return;
    }
    //console.log("quantite")
    console.log("verification")
    const articleSelectionne = {
        idArticle: id,
        couleur: couleurChoisie,
        itemQuantity: quantiteChoisie,
    }
    console.log(articleSelectionne)
    enregistrementPanier(articleSelectionne)
}
//pour enregistrer le panier dans le localStorage
function enregistrementPanier(produit) {
    const chariotTxt = localStorage.getItem("panier") || "[]";
    const chariot = JSON.parse(chariotTxt);
    if (chariot === []) {
        chariot.push(produit);

    }
    else {
        const produitExistant = chariot.find((article) => (article.idArticle === produit.idArticle && article.couleur === produit.couleur));
        if (!produitExistant) {


            chariot.push(produit);
        }
        else {
            console.log("contenu du produit")
            console.log(produit)
            produitExistant.itemQuantity = parseInt(produitExistant.itemQuantity) + parseInt(produit.itemQuantity);
        }

    }
    // stockage du panier dans le localstorage 
    localStorage.setItem("panier", JSON.stringify(chariot))
    window.location.href = "cart.html"

}
//pour la validité couleur et quantite des produits
function panierValide(couleur, itemQuantity) {
    if (couleur == null || couleur == "") {
        alert("veuillez choisir une couleur ")
        return false;

    }
    if (itemQuantity == null || itemQuantity == "" || itemQuantity == 0) {
        alert("veuillez choisir une quantite")
        return false;

    }
    return true;
}



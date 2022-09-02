function sauvegardePanier(panier){
localStorage.setItem("panier",panier);
}

function lePanier(){
    localStorage.getItem("panier");
}
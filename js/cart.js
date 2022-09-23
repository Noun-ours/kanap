// ;;;;;;;;;;pour l'affichage du panier a l'utilisateur:::::::::::::::
main();

async function main(){
  
  const chariotTxt = localStorage.getItem("panier")||"[]";
  let chariot =JSON.parse(chariotTxt);
  let chariotAvecPrix=[];
  console.log("chariot: ",chariot);
  for (const article of chariot){
    await fetch(`http://localhost:3000/api/products/${article.idArticle}`)
    .then(res=>res.json())
    .then(infoArticle=>{donnePanier(infoArticle,article.couleur,article.itemQuantity);})
    .catch(erreur=>alert(erreur));
  }
  
  function donnePanier(infoProduit,couleur,itemQuantity) { 
    const elementsPanier=document.getElementById("cart__items")
    elementsPanier.insertAdjacentHTML("beforeend",` <article class="cart__item" data-id="${infoProduit._id}" data-color="${couleur}">
    <div class="cart__item__img">
    <img src="${infoProduit.imageUrl}" alt=" ${infoProduit.altTxt} ">
    </div>
    <div class="cart__item__content">
    <div class="cart__item__content__description">
    <h2>${infoProduit.name} </h2>
    <p>${couleur} </p>
    <p>${infoProduit.price} €</p>
    </div>
    <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
    <p>Qté :  </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemQuantity}">
    </div>
    <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer </p>
    </div>
    </div>
    </div>
    </article> `)

    const articleAvecPrix={ id :infoProduit._id,couleur:couleur,quantite:itemQuantity,prix:infoProduit.price};
    chariotAvecPrix.push(articleAvecPrix);

  }
  affichageDesTotaux();
  // pourAffichageTotal(chariot)
  // function pourAffichageTotal(totalQuantity){
    //   const totalQuantity=document.querySelectorAll("#totalQuantity")
    // }
    
    //donnePanier()
    //supprimeElement(itemQuantity,couleur);
    
    
    const deleteItems=document.querySelectorAll(".deleteItem");
    //deleteItems.addEventListener("click",supprimer);
    console.log("test",deleteItems);
    deleteItems.forEach(deleteItemNode=>
      deleteItemNode.addEventListener("click",function(){
        const elementASupprimer=deleteItemNode.closest(".cart__item");
        elementASupprimer.remove();
        console.log(elementASupprimer.dataset); 
        const chariotFiltrer=chariot.filter(x=>((x.idArticle != elementASupprimer.dataset.id) || (x.couleur != elementASupprimer.dataset.color)));
        localStorage.setItem("panier", JSON.stringify(chariotFiltrer));
        chariot = chariotFiltrer;
        const chariotAvecPrixFiltrer=chariotAvecPrix.filter(x=>((x.id!= elementASupprimer.dataset.id) || (x.couleur != elementASupprimer.dataset.color)));
        
        chariotAvecPrix = chariotAvecPrixFiltrer;
        affichageDesTotaux();
      })
      )
      
      const changeQuantites=document.querySelectorAll(".itemQuantity");
      //deleteItems.addEventListener("click",supprimer);
      console.log("test2",changeQuantites);
      changeQuantites.forEach(changeInput=>
        changeInput.addEventListener("click",function(){
          const articleEnCours=changeInput.closest(".cart__item");
          
          console.log(articleEnCours.dataset); 
          const chariotFind=chariot.find(x=>((x.idArticle == articleEnCours.dataset.id) || (x.couleur == articleEnCours.dataset.color)));
          console.log("testnouveau",chariotFind);
          chariotFind.itemQuantity=changeInput.value
          localStorage.setItem("panier", JSON.stringify(chariot));
        

        })
        
        )
        
        
        
        
                  // const calculDesTotaux=async(chariot,changeInput,changeQuantites,deleteItemNode,deleteItem)=>{
                  //   await chariot;
                  //   await changeInput.value;
                  //   await changeQuantites;
                  //   await deleteItem;
                  //   await deleteItemNode;
                  //   console.log("je log",chariotFind);
                  // }
                  // calculDesTotaux()
        
        
        
function affichageDesTotaux(){
  let prixTotal=0;
  let quantiteTotal=0;
  for (const article of chariotAvecPrix){
    quantiteTotal=quantiteTotal+Number( article.quantite);
    prixTotal=prixTotal+(Number (article.quantite)*Number(article.prix));


  }
  
  const spanTotalQuantity=document.getElementById("totalQuantity");
    spanTotalQuantity.textContent=quantiteTotal
    
    const spanTotalPrice=document.getElementById("totalPrice");
    spanTotalPrice.textContent=prixTotal.toFixed(2);
  

}
  
  
  //:::::::::::::::::reduce technique pour combiner les sommes:::::::::::::
  
  // const totalSomme=localStorage.getItem("prixDue",articleEnCours.price)|| "[]";
  // const prixTotalPanier=JSON.stringify(totalSomme);
  // console.log("pourVoir",[key]);
  // console.log("pourVoir",articleEnCours.price);
  // console.log("pourVoir",chariot);
  // console.log("pourVoir",chariotTxt);
  // console.log("pourVoir",[key]);
  
  // let sommeTotal=prixTotalPanier.reduce((itemQuantity, produit)=>{
  //   return itemQuantity+produit.price
  // })  
  






// function pourAffichageTotal(){
  // }  
  
  // console.log(totalQuantity);
  
  // function totalPrixPanier(article,itemQuantity,couleur,){
    //   const divDeTotaux=document.createElement("div")  
//   divDeTotaux.classList.add("cart__price")
//   const pParaSpanTotal=document.querySelector("#totalQuantity","#totalPrice")
//   pParaSpanTotal.textContent=(article.itemQuantity)
//   divDeTotaux.appendChild(pParaSpanTotal)
//   couleur,itemQuantity.appendChild(divDeTotaux)
//   console.log("totalPrixPanier",divDeTotaux);
// } 




  
  





//:::::::::::::::::reduce technique pour combiner les sommes:::::::::::::

// const totalSomme=localStorage.setItem("prixDue",totalQuantity)|| "[]";
// const prixTotalPanier=JSON.parse(totalSomme);
// console.log(prixTotalPanier);

// let sommeTotal=prixTotalPanier.reduce((itemQuantity, produit)=>{
//   return itemQuantity+produit.price
// })  



}









//  ::::::::::::: pour la suppression d'un article;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



//::::::::::::::::::totalQuantity & totalPrice;;;;;;;;;;;;;;;;;;;;

// 	Implémenter la suppression d'un article et la modification de la quantité sur la page "cart.html".
//	Implémenter le total en quantité et en prix//




// •	Implémenter l'affichage de la quantité totale et du prix total.
// •	Valider les inputs du formulaire.
// •	Préparer la requête "Post" pour envoyer les informations de la commande au backend.
// •	Préparer le plan des test.

// ;;;;;;;;;;pour l'affichage du panier a l'utilisateur:::::::::::::::
main();

async function main() {

  const chariotTxt = localStorage.getItem("panier") || "[]";
  let chariot = JSON.parse(chariotTxt);
  let chariotAvecPrix = [];
  console.log("chariot: ", chariot);
  for (const article of chariot) {
    await fetch(`http://localhost:3000/api/products/${article.idArticle}`)
      .then(res => res.json())
      .then(infoArticle => { donnePanier(infoArticle, article.couleur, article.itemQuantity); })
      .catch(erreur => alert(erreur));
  }

  function donnePanier(infoProduit, couleur, itemQuantity) {
    const elementsPanier = document.getElementById("cart__items")
    elementsPanier.insertAdjacentHTML("beforeend", ` <article class="cart__item" data-id="${infoProduit._id}" data-color="${couleur}">
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

    const articleAvecPrix = { id: infoProduit._id, couleur: couleur, quantite: itemQuantity, prix: infoProduit.price };
    chariotAvecPrix.push(articleAvecPrix);

  }
  affichageDesTotaux();


  const deleteItems = document.querySelectorAll(".deleteItem");
  deleteItems.forEach(deleteItemNode =>
    deleteItemNode.addEventListener("click", function () {
      const elementASupprimer = deleteItemNode.closest(".cart__item");
      elementASupprimer.remove();
      const chariotFiltrer = chariot.filter(x => ((x.idArticle != elementASupprimer.dataset.id) || (x.couleur != elementASupprimer.dataset.color)));
      localStorage.setItem("panier", JSON.stringify(chariotFiltrer));
      chariot = chariotFiltrer;
      const chariotAvecPrixFiltrer = chariotAvecPrix.filter(x => ((x.id != elementASupprimer.dataset.id) || (x.couleur != elementASupprimer.dataset.color)));
      chariotAvecPrix = chariotAvecPrixFiltrer;
      affichageDesTotaux();
    })
  )

  const changeQuantites = document.querySelectorAll(".itemQuantity");
  changeQuantites.forEach(changeInput =>
    changeInput.addEventListener("click", function () {
      const articleEnCours = changeInput.closest(".cart__item");

      console.log(articleEnCours.dataset);
      const chariotFind = chariot.find(x => ((x.idArticle == articleEnCours.dataset.id) || (x.couleur == articleEnCours.dataset.color)));
      // console.log("testnouveau", chariotFind);
      chariotFind.itemQuantity = changeInput.value
      localStorage.setItem("panier", JSON.stringify(chariot));
      //pour affichage des totaux::::::::::::::::::::::
      const chariotAvecPrixFind = chariotAvecPrix.find(x => ((x.id == articleEnCours.dataset.id) || (x.couleur == articleEnCours.dataset.color)));
      chariotAvecPrixFind.quantite = changeInput.value;
      affichageDesTotaux();


    })

  )


  function affichageDesTotaux() {
    let prixTotal = 0;
    let quantiteTotal = 0;
    for (const article of chariotAvecPrix) {
      quantiteTotal = quantiteTotal + Number(article.quantite);
      prixTotal = prixTotal + (Number(article.quantite) * Number(article.prix));


    }

    const spanTotalQuantity = document.getElementById("totalQuantity");
    spanTotalQuantity.textContent = quantiteTotal

    const spanTotalPrice = document.getElementById("totalPrice");
    spanTotalPrice.textContent = prixTotal.toFixed(2);


  }

  // pour le formulaire et les regex :::::::::::::::

  const btnCommander = document.getElementById("order");
  btnCommander.addEventListener("click", envoyerCommande);
  function envoyerCommande(e) {
    e.preventDefault()
    if (!formulaireValide()) {
      return;
    }
    console.log("envoie commande");
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const email = document.getElementById("email").value
    console.log(chariot);

    //format exigé pour l'api;;;;;;;;;;;;;;;;;;;
    const commande = {
      contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email,
      },
      products: chariot.map((a) => a.idArticle),
    };
    console.log(commande);
    console.log();
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commande),
    })
      .then(response => {
        // console.log("test res", response);
        if (response.status == 201) {
          console.log("res ok");
          response.json().then(infoApi => {
            console.log(infoApi.orderId);
            localStorage.removeItem("panier");
            window.location.href = "/html/confirmation.html?orderId="+ infoApi.orderId;
          })
        }
      })
      .catch(erreur => console.log(erreur.message));
  }

  function formulaireValide(formUtilisateur) {
    console.log();
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const email = document.getElementById("email").value





    const regexName = /^[A-Za-z][A-Za-zéç]+(\s[A-Za-z][A-Za-zéç]+)*$/;
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexAddress = /^[A-Za-z0-9éç°',]+(\s[A-Za-z0-9éç°',]+)*$/;
    const regexCity = /^[A-Z][A-Za-zéç]+(\s[A-Z][A-Za-zéç]+)*$/;


    if (!regexName.test(firstName)) {
      alert("veuillez renseigner les champs valide")
      return false;
    }
    return true;
  }



  // localStorage.setItem("order",JSON.stringify(order))











  // const formulaireUtilisateur=localStorage.getItem("formulaireValide");

  // const formUtilisateur=JSON.parse(formulaireUtilisateur)

  // document.querySelector("#firstName").value =order.firstName;
  // document.querySelector("#lastName").setAttribute('value',formUtilisateur.lastName)
  // console.log( "curieux", order);


  // console.log( "blingbling" ,formUtilisateur);












  //     console.log( "chariot avec prix", chariotAvecPrix);
  //     console.log("pour voir",order );
  //     console.log(envoyerCommande);
  //     console.log()
  //     const formulaireDeValidation = { chariotAvecPrix, formulaireValide,order,envoyerCommande ,};
  //     console.log(formulaireValide);
  //     localStorage.setItem("formulaireValide", JSON.stringify(formulaireDeValidation));
  //     console.log("teteste", formulaireDeValidation);
  //     //localStorage.getItem("formulaireValide",JSON.parse(order))



  //   function affichageValidation(){
  //     const validationTotal=document.getElementById("orderId")
  //     validationTotal.textContent=""

  //   }













}









//  ::::::::::::: pour la suppression d'un article;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



//::::::::::::::::::totalQuantity & totalPrice;;;;;;;;;;;;;;;;;;;;

// 	Implémenter la suppression d'un article et la modification de la quantité sur la page "cart.html".
//	Implémenter le total en quantité et en prix//




// •	Implémenter l'affichage de la quantité totale et du prix total.
// •	Valider les inputs du formulaire.
// •	Préparer la requête "Post" pour envoyer les informations de la commande au backend.
// •	Préparer le plan des test.





// •	Compléter la validation du formulaire.
// •	Envoyer les informations de la commande au backend.
// •	Afficher le code de confirmation sur la page "confirmation.html".

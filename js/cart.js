// ::::::::::::pour l'affichage du panier a l'utilisateur:::::::::::::::
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

  //                     pour la suppression d'un article 
  // 	Implémenter la suppression d'un article et la modification de la quantité sur la page "cart.html".

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
  // pour changer la quantité d'article du panier
  const changeQuantites = document.querySelectorAll(".itemQuantity");
  changeQuantites.forEach(changeInput =>
    changeInput.addEventListener("click", function () {
      const articleEnCours = changeInput.closest(".cart__item");

      console.log(articleEnCours.dataset);
      const chariotFind = chariot.find(x => ((x.idArticle == articleEnCours.dataset.id) || (x.couleur == articleEnCours.dataset.color)));
      chariotFind.itemQuantity = changeInput.value
      localStorage.setItem("panier", JSON.stringify(chariot));
      //pour affichage des totaux
      const chariotAvecPrixFind = chariotAvecPrix.find(x => ((x.id == articleEnCours.dataset.id) || (x.couleur == articleEnCours.dataset.color)));
      chariotAvecPrixFind.quantite = changeInput.value;
      affichageDesTotaux();


    })
  )

  // 	Implémenter l'affichage de la quantité totale et du prix total.
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

  // pour le formulaire et les regex 
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

    //format exigé pour l'api
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

    //  la requête "Post" pour envoyer les informations de la commande au backend.
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commande),
    })
      .then(response => {
        if (response.status == 201) {
          console.log("res ok");
          response.json().then(infoApi => {
            console.log(infoApi.orderId);
            //pour supprimer le panier apres validation au backend
            localStorage.removeItem("panier");
            window.location.href = "/html/confirmation.html?orderId=" + infoApi.orderId;
          })
        }
      })
      .catch(erreur => console.log(erreur.message));
  }



  //Compléter la validation du formulaire.
  function formulaireValide() {
    console.log("test");
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const email = document.getElementById("email").value

      const regexName = /^[A-Ÿa-ÿ][A-Ÿa-ÿéç-]+(\s[A-Ÿa-ÿ][A-Ÿa-ÿéç-]+)*$/;
    const regexEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexAddress = /^[A-Ÿa-ÿ0-9éç°',]+(\s[A-Ÿa-ÿ0-9éç°',]+)*$/;

   // Valider les inputs du formulaire.
    const msgErrPrenom = "veuillez renseigner un prénom valide"
    const msgErrNom = "veuillez renseigner un nom valide"
    const msgErrAddress="veuillez entrer une adresse valide"
    const msgErrCity="veuillez renseigner une ville valide"
    const msgErrEmail="veuillez entrez un email valide"
    if (!inputValide(firstName, regexName, msgErrPrenom)) {
      return false;
    }
    if (!inputValide(lastName, regexName, msgErrNom)) {
      return false;
    }
    if (!inputValide(address, regexAddress,msgErrAddress)) {
      return false
    }
    if (!inputValide(city,regexName, msgErrCity)) {     
      return false;
    }
    if (!inputValide(email,regexEmail,msgErrEmail)) {
      return false
    }
    return true;
  }
  function inputValide(valeur, regex, message) {
    if (!regex.test(valeur)) {
      alert(message);
      return false
    }
    return true;
  }



}

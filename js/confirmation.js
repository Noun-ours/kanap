
function affichageOrderId() {
    const AfficheIdOrder = window.location.search
    const urlParams = new URLSearchParams(AfficheIdOrder)
    const orderId = urlParams.get("orderId")
    document.getElementById("orderId").textContent=orderId;
}
affichageOrderId();
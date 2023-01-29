const auth = new Auth();

document.querySelector("#btnLogout").addEventListener("click", (e) => {
    auth.logOut();
});
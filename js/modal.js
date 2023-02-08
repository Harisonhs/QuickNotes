const modal = document.querySelector(".modal");
const closeModal = modal.querySelector(".modal-close");
closeModal.addEventListener('click', () => {
    modal.style.display = "none";
})

window.addEventListener("click", (evt) => {
    if (evt.target == modal) {
        modal.style.display = "none";
    }
});
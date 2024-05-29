/* Error handling for add friend form */
document.getElementById("confirmAddFriend").addEventListener("click", function (event) {
    if (friendPhone.value === "" && friendEmail.value.trim() === "") {
        event.preventDefault();
        emptyEmailPhoneWarning.classList.remove("hidden");

    }
});

Inputmask({ "mask": "(999) 999-9999" }).mask(document.getElementById("friendPhone"));

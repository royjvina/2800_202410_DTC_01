document.getElementById("confirmAddFriend").addEventListener("click", function (event) {
    if (friendName.value.trim() === "") {
        event.preventDefault();
        emptyNameWarning.classList.remove("hidden");
    }
    else if (friendPhone.value === "" && friendEmail.value.trim() === "") {
        event.preventDefault();
        emptyNameWarning.classList.add("hidden");
        emptyEmailPhoneWarning.classList.remove("hidden");

    }
});

Inputmask({ "mask": "(999) 999-9999" }).mask(document.getElementById("friendPhone"));

document.getElementById("confirmAddFriend").addEventListener("click", function (event) {
    if (friendName.value.trim() === "") {
        event.preventDefault();
        emptyNameWarning.classList.remove("hidden");
    }
    else if (friendPhone.value === "") {
        event.preventDefault();
        emptyNameWarning.classList.add("hidden");
        emptyPhoneWarning.classList.remove("hidden");

    }
});
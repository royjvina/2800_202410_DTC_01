
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

document.getElementById("friendPhone").addEventListener("keyup", function () {
    var num = this.value.replace(/\D/g, '');
    this.value = '(' + num.substring(0, 3) + ')' + num.substring(3, 6) + '-' + num.substring(6, 10);
    console.log(this.value);
});
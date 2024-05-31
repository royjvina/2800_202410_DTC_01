/**
 * Adds an event listener to the "confirmAddFriend" button to validate form fields.
 * Prevents form submission and shows a warning if both friendPhone and friendEmail are empty.
 * @param {Event} event - The click event
 */
document.getElementById("confirmAddFriend").addEventListener("click", function (event) {
    if (friendPhone.value === "" && friendEmail.value.trim() === "") {
        event.preventDefault(); // Prevent form submission
        emptyEmailPhoneWarning.classList.remove("hidden"); // Show warning message
    }
});

/**
 * Applies an input mask to the friendPhone input field.
 * The mask format is (999) 999-9999.
 */
Inputmask({ "mask": "(999) 999-9999" }).mask(document.getElementById("friendPhone"));

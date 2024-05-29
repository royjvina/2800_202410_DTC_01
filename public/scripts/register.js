/**
 * Event listener for the profile image input change event.
 * When a file is selected, it reads the file and displays a preview of the image.
 */
profileImage.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewProfileImage.src = e.target.result; // Set the image preview source to the selected file
            removePic.classList.remove('hidden'); // Show the remove picture button
            selectPic.classList.add('hidden'); // Hide the select picture button
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});

/**
 * Event listener for the remove picture button click event.
 * Resets the profile image preview to the default placeholder and hides the remove button.
 */
removePic.addEventListener("click", function () {
    previewProfileImage.src = "/images/homepageIconsAndPlaceholders/addProfilePic.svg"; // Set the image preview to the default placeholder
    profileImage.value = ""; // Clear the file input value
    removePic.classList.add('hidden'); // Hide the remove picture button
    selectPic.classList.remove('hidden'); // Show the select picture button
});

/**
 * Event listener for DOMContentLoaded to ensure the DOM is fully loaded before executing the script.
 * Applies an input mask to the phone number input field.
 */
document.addEventListener("DOMContentLoaded", function () {
    Inputmask({ "mask": "(999) 999-9999" }).mask(document.getElementById("phoneNumber")); // Apply input mask to phone number field
});

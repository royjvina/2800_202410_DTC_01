/**
 * Event listener for DOMContentLoaded to ensure the DOM is fully loaded before executing the script.
 */
document.addEventListener('DOMContentLoaded', function () {
    const settingsProfilePic = document.getElementById('settingsProfilePic'); // Element for the settings profile picture
    const settingsProfilePicSrc = settingsProfilePic.getAttribute('data-src'); // Data source for the profile picture

    settingsProfilePic.src = settingsProfilePicSrc; // Set the source of the profile picture

    /**
     * Event handler for profile picture error event.
     * Sets the profile picture source to a placeholder if an error occurs (e.g., image not found).
     */
    settingsProfilePic.onerror = function () {
        settingsProfilePic.src = '/images/homepageIconsAndPlaceholders/profilePicPlaceholderSettings.svg'; // Placeholder image source
    };

    // Attach event listener after DOM content has loaded
    const profileImage = document.getElementById('profileImage'); // File input element for uploading a new profile picture

    /**
     * Event listener for the profile image input change event.
     * Reads the selected file and updates the profile picture preview.
     */
    profileImage.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                settingsProfilePic.src = e.target.result; // Update the profile picture preview
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    });
});

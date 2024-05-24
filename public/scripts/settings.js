document.addEventListener('DOMContentLoaded', function () {
    const settingsProfilePic = document.getElementById('settingsProfilePic');
    const settingsProfilePicSrc = settingsProfilePic.getAttribute('data-src');

    settingsProfilePic.src = settingsProfilePicSrc;

    settingsProfilePic.onerror = function () {
        settingsProfilePic.src = '/images/homepageIconsAndPlaceholders/profilePicPlaceholderSettings.svg';
    };

    // Attach event listener after DOM content has loaded
    const profileImage = document.getElementById('profileImage');
    profileImage.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                settingsProfilePic.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

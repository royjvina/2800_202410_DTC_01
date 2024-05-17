document.addEventListener('DOMContentLoaded', function () {
    const settingsProfilePic = document.getElementById('settingsProfilePic');
    const settingsProfilePicSrc = settingsProfilePic.getAttribute('data-src');

    settingsProfilePic.src = settingsProfilePicSrc;

    settingsProfilePic.onerror = function () {
        settingsProfilePic.src = '/images/homepageIconsAndPlaceholders/profilePicPlaceholder.svg';
    };
});

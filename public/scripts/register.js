profileImage.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewProfileImage.src = e.target.result;
            removePic.classList.remove('hidden');
            selectPic.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

removePic.addEventListener("click", function () {
    previewProfileImage.src = "/images/homepageIconsAndPlaceholders/addProfilePic.svg";
    profileImage.value = "";
    removePic.classList.add('hidden');
    selectPic.classList.remove('hidden');
});
document.addEventListener("DOMContentLoaded", function () {
Inputmask({ "mask": "(999) 999-9999" }).mask(document.getElementById("phoneNumber"));
});
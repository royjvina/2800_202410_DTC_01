
/**
 * Validates the user's password.
 * @param {*} password 
 * @returns {boolean} True if the password is valid, false otherwise.
 */
function validatePassword(password) {
    const minLength = 8;
    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return false;
    }
    if (!uppercasePattern.test(password)) {
        return false;
    }
    if (!lowercasePattern.test(password)) {
        return false;
    }
    if (!numberPattern.test(password)) {
        return false;
    }
    if (!specialCharPattern.test(password)) {
        return false;
    }

    return true;
}

/**
 * Event handler for the change password button.
 * Validates the new password and displays a warning message if the password is invalid, shows a confirm change password button if the password is valid.
 * */
function changePasswordHandler() {
    changePass.addEventListener('click', function () {
        console.log('clicked');
        let newPassword = document.getElementById('newPassword').value;
        let confirmPassword = document.getElementById('confirmPassword').value;
        if (newPassword == "" || confirmPassword == "") {
            passwordWarning.textContent = 'Please enter a password';
            passwordFormat.classList.remove('text-red-500');
        }
        else if (newPassword !== confirmPassword) {
            passwordWarning.textContent = 'Passwords do not match';
            passwordFormat.classList.remove('text-red-500');
        }
        else if (!validatePassword(newPassword)) {
            passwordFormat.classList.add('text-red-500');
            passwordWarning.textContent = ""
        }
        else {
            confirmChangePass.classList.remove('hidden');
            confirmChangePass.classList.add('hideManually');
            changePass.classList.add('hidden');
            setTimeout(() => {
                confirmChangePass.classList.remove('hideManually');
            }, 10);
            confirmChangePass.classList.add('flex');
        }


    });
}

/**
 * show the change password form.
 * */
function showChangePassword() {
    if (changePassForm.classList.contains('hidden')) {
        changePassForm.classList.remove('hidden');
        changePassForm.classList.add('hideManually');
        setTimeout(() => {
            changePassForm.classList.remove('hideManually');
        }, 10);
        changePassForm.classList.add('flex');
    }
    else {
        changePassForm.classList.add('hidden');
        changePassForm.classList.remove('flex');
    }
    if (passArrow.src.includes('down')) {
        passArrow.src = 'images/otherIcons/upArrowSettings.svg';
    }
    else {
        passArrow.src = 'images/otherIcons/downArrowSettings.svg';
    }
}


/**
 * Event handler for the change phone button.
 * Validates the new phone number and displays a warning message if the phone number is invalid, shows a confirm change phone button if the phone number is valid.
 * */
function changePhoneHandler() {
    changePhone.addEventListener('click', function () {
        let newPhoneValue = newPhone.value;
        newPhoneValue = newPhoneValue.replace(/\D/g, '');
        if (newPhoneValue.length < 10 || newPhoneValue == "") {
            phoneWarning.textContent = 'Please enter a phone number';
        }
        else {
            confirmChangePhone.classList.remove('hidden');
            confirmChangePhone.classList.add('hideManually');
            changePhone.classList.add('hidden');
            setTimeout(() => {
                confirmChangePhone.classList.remove('hideManually');
            }, 10);
            confirmChangePhone.classList.add('flex');
        }
    });
}

/**
 * show the delete account form.
 * */
function showDeleteAccount() {
    if (deleteAccountFormAuth.classList.contains('hidden')) {
        deleteAccountFormAuth.classList.remove('hidden');
        deleteAccountFormAuth.classList.add('hideManually');
        setTimeout(() => {
            deleteAccountFormAuth.classList.remove('hideManually');
        }, 10);
        deleteAccountFormAuth.classList.add('flex');
    }
    else {
        deleteAccountFormAuth.classList.add('hidden');
        deleteAccountFormAuth.classList.remove('flex');
    }
    if (deleteArrow.src.includes('down')) {
        deleteArrow.src = 'images/otherIcons/upArrowSettings.svg';
    }
    else {
        deleteArrow.src = 'images/otherIcons/downArrowSettings.svg';
    }
    deleteAccountForm.classList.add('hidden');
}
/**
 * show the change phone form.
 * */
function showChangePhone() {
    if (changePhoneForm.classList.contains('hidden')) {
        changePhoneForm.classList.remove('hidden');
        changePhoneForm.classList.add('hideManually');
        setTimeout(() => {
            changePhoneForm.classList.remove('hideManually');
        }, 10);
        changePhoneForm.classList.add('flex');
    }
    else {
        changePhoneForm.classList.add('hidden');
        changePhoneForm.classList.remove('flex');
    }

    if (phoneArrow.src.includes('down')) {
        phoneArrow.src = 'images/otherIcons/upArrowSettings.svg';
    }
    else {
        phoneArrow.src = 'images/otherIcons/downArrowSettings.svg';
    }
}

/**
 * Event handler for the cancel change password button.
 * Hides the confirm change password button and shows the change password button.
 * */
function cancelChangePassword() {
    cancelChangePass.addEventListener('click', function () {
        confirmChangePass.classList.add('hidden');
        changePass.classList.remove('hidden');
        passwordWarning.textContent = '';
        document.getElementById('newPassword').value = "";
        document.getElementById('confirmPassword').value = "";
        showChangePassword();
    });
}

/**
 * Event handler for the delete account button.
 * Validates the password and displays a warning message if the password is invalid.
 * */
function deleteAccountPassword() {
    const deleteAccount = document.getElementById('deleteAccount'); // Delete account button
    deleteAccount.addEventListener('click', function (event) {
    if (deletePassword.value == "") {
        event.preventDefault();
        deleteWarning.textContent = 'Please enter your password';
    }
});

}

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
    changePasswordHandler();
    pennywise.textContent = 'Settings';
    pennywise.classList.add('text-lg');
    topLogo.innerHTML = `<button class="text-4xl flex flex-row items-center text-white pl-1 mb-2" id="backSettings"> &#8249; </button>`;
    backSettings.addEventListener('click', function () {
        history.back();
    });
    cancelChangePassword();
    changePassSetting.addEventListener('click', showChangePassword);
    Inputmask({ "mask": "(999) 999-9999" }).mask(document.getElementById("newPhone"));
    changePhoneHandler();
    changePhoneSetting.addEventListener('click', showChangePhone);
    cancelChangePhone.addEventListener('click', function () {
        confirmChangePhone.classList.add('hidden');
        changePhone.classList.remove('hidden');
        phoneWarning.textContent = '';
        newPhone.value = "";
        showChangePhone();
    });
    deleteAccountSetting.addEventListener('click', showDeleteAccount);
    cancelDeleteAccount.addEventListener('click', function () {
        deleteAccountFormAuth.classList.add('hidden');
        deleteAccountFormAuth.classList.remove('flex');
        deleteAccountForm.classList.add('hidden');
        deleteAccountForm.classList.remove('flex');
        deleteWarning.textContent = '';
        deletePassword.value = "";
    });
    deleteAccountPassword();
});

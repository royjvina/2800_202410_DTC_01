/**
 * This script is used to handle homepage javascript functionalities
 */


/**
 * This function is used to handle the click event on the groups tab    
 * @balpreet787
 */
function groupsTabHandler() {
    AddButtonsDiv.classList.remove('justify-end');
    AddButtonsDiv.classList.add('justify-start');
    showFriends.classList.remove('bg-[#4b061a]');
    showFriends.classList.remove('text-white');
    showGroups.classList.add('bg-[#4b061a]');
    showGroups.classList.add('text-white');
    friends.classList.add('hidden');
    groups.classList.remove('hidden');
    groups.classList.add('flex');
    createGroup.classList.add('hidden');
    addFriendSecondaryDiv.classList.add('hidden');
    addGroupSecondaryDiv.classList.remove('hidden');
    addGroupSecondaryDiv.classList.add('flex');
    removeSecondaryButtons();
}
/**
 * This function is used to handle the click event on the friends tab    
 * @balpreet787
 */
function friendsTabHandler() {
    AddButtonsDiv.classList.remove('justify-start');
    AddButtonsDiv.classList.add('justify-end');
    showGroups.classList.remove('bg-[#4b061a]');
    showGroups.classList.remove('text-white');
    showFriends.classList.add('bg-[#4b061a]');
    showFriends.classList.add('text-white');
    groups.classList.add('hidden');
    friends.classList.remove('hidden');
    friends.classList.add('flex');
    addFriend.classList.add('flex');
    addGroupSecondaryDiv.classList.add('hidden');
    addFriendSecondaryDiv.classList.remove('hidden');
    addFriendSecondaryDiv.classList.add('flex');
    removeSecondaryButtons();
}

/**
 * This function is used to remove the secondary buttons when the number of friends or groups exceeds 5
 * @balpreet787
 * */
function removeSecondaryButtons() {
    const addFriendSecondary = document.getElementById('addFriendSecondaryDiv');
    const addGroupSecondary = document.getElementById('addGroupSecondaryDiv');
    const addFriend = document.getElementById('addFriend');
    const addGroup = document.getElementById('createGroup');

    if (document.querySelectorAll('.friend').length >= 5 && !friends.classList.contains('hidden')) {
        addFriendSecondary.classList.add('hidden');
        addFriend.classList.remove('hidden');

    }
    else {
        addFriend.classList.add('hidden');
        addFriendSecondary.classList.remove('hidden');
    }
    if (document.querySelectorAll('.group').length >= 5 && !groups.classList.contains('hidden')) {
        console.log(document.querySelectorAll('.group').length);
        addGroupSecondary.classList.add('hidden');
        console.log('heree');
        addGroup.classList.remove('hidden');
    }
    else if (!groups.classList.contains('hidden')) {
        addFriendSecondary.classList.add('hidden');
        addGroup.classList.add('hidden');
        addGroupSecondary.classList.remove('hidden');
        addGroupSecondary.classList.add('flex');
        console.log('here');
    }
}




/**
 * This function is used to handle the delete a friend
 * @balpreet787
 * */
function deleteFriendHandler() {
    document.querySelectorAll('.deleteFriend').forEach(deleteFriend => {
        deleteFriend.addEventListener('click', function () {
            let deleteFriendPhone = (this.id).replace('Delete', '');
            let selectedFriend = document.getElementById(deleteFriendPhone + 'Selected');
            let confirmDeleteOptions = document.getElementById(deleteFriendPhone + 'ConfirmDeleteOptionsFriends');
            let cancelDelete = document.getElementById(deleteFriendPhone + 'CancelDelete');
            confirmDeleteOptions.classList.toggle('hidden');
            confirmDeleteOptions.classList.add('hideManually');
            selectedFriend.value = deleteFriendPhone;
            setTimeout(() => {
                confirmDeleteOptions.classList.toggle('hideManually');
            }, 10);
            confirmDeleteOptions.classList.toggle('flex');
            cancelDelete.addEventListener('click', function () {
                confirmDeleteOptions.classList.add('hidden');
                confirmDeleteOptions.classList.remove('hideManually');
                confirmDeleteOptions.classList.remove('flex');
                selectedFriend.value = '';

            });

        });
    });
}



/**
 * This function is used to handle the form fields for settling a debt with a friend
 * @balpreet787
 * @param {string} friendPhone 
 */
function formFieldsHandler(friendPhone) {
    const totalPayable = document.getElementById('payAmount' + friendPhone);
    
    const enterAmount = document.getElementById('enterAmount' + friendPhone);
    const submitSettle = document.getElementById('submitSettle' + friendPhone);
    const confirmfriend = document.getElementById('confirmfriend' + friendPhone);
    const cancelSettle = document.getElementById('cancelSettle' + friendPhone);
    const EnterAmountWarning = document.getElementById('EnterAmountWarning' + friendPhone);
    console.log(totalPayable);
    enterAmount.value = totalPayable.textContent;
    enterAmount.addEventListener('input', function () {
        confirmfriend.classList.add('hidden');
        confirmfriend.classList.remove('flex');
        submitSettle.classList.remove('hidden');
    });
    cancelSettle.addEventListener('click', function () {

        confirmfriend.classList.add('hidden');
        confirmfriend.classList.remove('flex');
        submitSettle.classList.remove('hidden');
        submitSettle.classList.add('hideManually');

        setTimeout(() => {
            submitSettle.classList.toggle('hideManually');
        }, 10);
    });
    submitSettle.addEventListener('click', function (event) {
        event.preventDefault();

        if (enterAmount.value === '' || Number(enterAmount.value) === 0 || Number(enterAmount.value) > Number(totalPayable.textContent) || Number(enterAmount.value) < 0){
            EnterAmountWarning.classList.toggle('hidden');
            setTimeout(() => {
                EnterAmountWarning.classList.toggle('hideManually');
            }, 10);
        }
        else {
            EnterAmountWarning.classList.add('hidden');
            submitSettle.classList.toggle('hidden');
            confirmfriend.classList.remove('hidden');
            confirmfriend.classList.add('hideManually');
            setTimeout(() => {
                confirmfriend.classList.remove('hideManually');
            }, 10);
            confirmfriend.classList.add('flex');
        }

    });


}

addFriendSecondary.addEventListener('mouseenter', function () {
    const addFriendPic = document.getElementById('addFriendPic');
    addFriendPic.src = "/images/homepageIconsAndPlaceholders/addFriendHover.svg";
});
addFriendSecondary.addEventListener('mouseleave', function () {
    const addFriendPic = document.getElementById('addFriendPic');
    addFriendPic.src = '/images/homepageIconsAndPlaceholders/addFriend.svg';
});
addGroupSecondary.addEventListener('mouseenter', function () {
    const addGroupPic = document.getElementById('addGroupPic');
    addGroupPic.src = "/images/homepageIconsAndPlaceholders/addGroupHover.svg";
});
addGroupSecondary.addEventListener('mouseleave', function () {
    const addGroupPic = document.getElementById('addGroupPic');
    addGroupPic.src = '/images/homepageIconsAndPlaceholders/addGroup.svg';
});


function toggleFriendSettleUp() {
    document.querySelectorAll('.friend').forEach(friend => {
        const friendId = friend.id;
        let friendPhone = friendId.substring(6, friendId.length);
        if(document.getElementById("payAmount" + friendPhone)){
            friend.addEventListener('click', function () {
            const formFriend = document.getElementById("formFriend" + friendPhone);
            formFriend.classList.toggle('hidden');
            setTimeout(() => {
                formFriend.classList.toggle('hideManually');
            }, 10);

            if (!formFriend.classList.contains('hidden')) {
                this.classList.add('bg-secondary');
                this.classList.add('text-[#6E0924]');
            }
            else {
                this.classList.remove('bg-secondary');
                this.classList.remove('text-[#6E0924]');
            }
            formFieldsHandler(friendPhone);
        });}

    });
}
document.addEventListener('DOMContentLoaded', function () {
    removeSecondaryButtons();
    toggleFriendSettleUp();
    deleteFriendHandler();
    const profileImage = document.getElementById('homepagePic');
    const profileImageSrc = profileImage.getAttribute('data-src');

    profileImage.src = profileImageSrc;

    profileImage.onerror = function () {
        profileImage.src = '/images/homepageIconsAndPlaceholders/profilePicPlaceholder.svg';
    };
});





showGroups.addEventListener('click', groupsTabHandler);
showFriends.addEventListener('click', friendsTabHandler);
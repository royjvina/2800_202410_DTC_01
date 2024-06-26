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
    showFriends.classList.add('bg-white');
    showFriends.classList.add('text-black');
    showGroups.classList.remove('bg-white');
    showGroups.classList.remove('text-black');
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
    showGroups.classList.add('bg-white');
    showGroups.classList.add('text-black');
    showFriends.classList.add('bg-[#4b061a]');
    showFriends.classList.add('text-white');
    showFriends.classList.remove('bg-white');
    showFriends.classList.remove('text-black');
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
        addGroupSecondary.classList.add('hidden');
        addGroup.classList.add('hidden');
        addFriend.classList.remove('hidden');

    }
    else if (!friends.classList.contains('hidden')) {
        addFriend.classList.add('hidden');
        addFriendSecondary.classList.remove('hidden');
        addFriendSecondary.classList.add('flex');
        addGroup.classList.add('hidden');
        addGroupSecondary.classList.add('hidden');

    }
    if (document.querySelectorAll('.group').length >= 5 && !groups.classList.contains('hidden')) {
        addFriendSecondary.classList.add('hidden');
        addFriend.classList.add('hidden');
        addGroupSecondary.classList.add('hidden');
        addGroup.classList.remove('hidden');
    }
    else if (!groups.classList.contains('hidden')) {
        addFriendSecondary.classList.add('hidden');
        addFriend.classList.add('hidden');
        addGroup.classList.add('hidden');
        addGroupSecondary.classList.remove('hidden');
        addGroupSecondary.classList.add('flex');
    }
}




/**
 * This function is used to handle the delete a friend
 * @balpreet787
 * */
function deleteFriendHandler() {
    document.querySelectorAll('.deleteFriend').forEach(deleteFriend => {
        deleteFriend.addEventListener('click', function () {
            let deleteFriendid = (this.id).replace('Delete', '');
            let selectedFriend = document.getElementById(deleteFriendid + 'Selected');
            let confirmDeleteOptions = document.getElementById(deleteFriendid + 'ConfirmDeleteOptionsFriends');
            let cancelDelete = document.getElementById(deleteFriendid + 'CancelDelete');
            confirmDeleteOptions.classList.toggle('hidden');
            confirmDeleteOptions.classList.add('hideManually');
            selectedFriend.value = deleteFriendid;
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
 * @param {string} friendid 
 */
function formFieldsHandler(friendid) {
    const totalPayable = document.getElementById('payAmount' + friendid);

    const enterAmount = document.getElementById('enterAmount' + friendid);
    const submitSettle = document.getElementById('submitSettle' + friendid);
    const confirmfriend = document.getElementById('confirmfriend' + friendid);
    const cancelSettle = document.getElementById('cancelSettle' + friendid);
    const EnterAmountWarning = document.getElementById('EnterAmountWarning' + friendid);
    enterAmount.value = totalPayable.textContent.slice(1);
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

        if (enterAmount.value === '' || Number(enterAmount.value) === 0 || Number(enterAmount.value) > Number(totalPayable.textContent) || Number(enterAmount.value) < 0) {
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
// Event listeners for the secondary buttons activated on hover
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

/**
 * This function is used to handle to toggle the display of the settle up form for a friend
 * @balpreet787
 * */
function toggleFriendSettleUp() {
    document.querySelectorAll('.friend').forEach(friend => {
        const friendId = friend.id;
        let friendid = friendId.substring(6, friendId.length);
        if (document.getElementById("payAmount" + friendid)) {
            friend.addEventListener('click', function () {
                const formFriend = document.getElementById("formFriend" + friendid);
                const settleArrow = document.getElementById("settleArrow" + friendid);
                if (settleArrow.src.includes('downArrow')) {
                    settleArrow.src = settleArrow.src.replace('downArrow', 'upArrow');
                }
                else {
                    settleArrow.src = settleArrow.src.replace('upArrow', 'downArrow');
                }
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
                formFieldsHandler(friendid);
            });
        }
    });
}

/**
 * This function is used to toggle the display of the settle up form for a group
 * @balpreet787
 * */
function deleteFriendHandler(removableFriends) {
    if (removableFriends && removableFriends.length > 0) {
        removableFriends.forEach(removableFriend => {
            const id = removableFriend.id.replace('Div', '');
            const friendDiv = document.getElementById('friend' + id);
            friendDiv.addEventListener('click', function () {

                const deleteOptions = document.getElementById(id + 'ConfirmDeleteOptionsFriends');
                const settleArrow = document.getElementById("settleArrow" + id);
                const deleteBtn = document.getElementById(id + 'Delete');
                const deleteForm = document.getElementById(id + 'DeleteForm');
                const cancelDelete = document.getElementById(id + 'CancelDelete');
                if (settleArrow.src.includes('downArrow')) {
                    settleArrow.src = settleArrow.src.replace('downArrow', 'upArrow');
                }
                else {
                    settleArrow.src = settleArrow.src.replace('upArrow', 'downArrow');
                }
                deleteOptions.classList.toggle('hidden');
                deleteOptions.classList.add('hideManually');
                setTimeout(() => {
                    deleteOptions.classList.toggle('hideManually');
                }, 10);
                deleteOptions.classList.toggle('flex');
                deleteBtn.addEventListener('click', function () {
                    deleteBtn.parentNode.parentNode.classList.add('hidden');
                    document.getElementById(id + 'Selected').value = id;
                    deleteForm.classList.remove('hidden');
                    deleteForm.classList.add('hideManually');
                    setTimeout(() => {
                        deleteForm.classList.remove('hideManually');
                    }, 10);
                    deleteForm.classList.add('flex');
                });
                cancelDelete.addEventListener('click', function () {
                    document.getElementById(id + 'Selected').value = '';
                    deleteForm.classList.add('hidden');
                    deleteForm.classList.remove('hideManually');
                    deleteForm.classList.remove('flex');
                    deleteBtn.parentNode.parentNode.classList.remove('hidden');
                    deleteBtn.parentNode.parentNode.classList.add('flex');
                });

            });
        });
    }
}

/**
 * This function is used to get the settled up friends and groups and toggle their display if the number of friends or groups exceeds 4
 * @param {string} entity - The entity to be handled
 * @balpreet787
 * */
function settledUpFriendAndGroupHandler(entity) {
    const parentDivs = document.querySelectorAll(`.parentDiv${entity}`);
    const showMore = document.getElementById(`showMore${entity}`);
    const dataLength = showMore.dataset.length;
    const showLess = document.getElementById(`showLess${entity}`);
    let balanceZeroParentDivs = [];
    parentDivs.forEach(parentDiv => {
        const balanceZeroDiv = parentDiv.querySelector('.balanceZero');

        if (balanceZeroDiv) {
            balanceZeroParentDivs.push(parentDiv);


            if (dataLength > 4) {
                parentDiv.classList.add('hidden');
                showMore.classList.remove('hidden');
            }
        }
    });
    showMore.addEventListener('click', function () {
        balanceZeroParentDivs.forEach(parentDiv => {
            parentDiv.classList.remove('hidden');
            parentDiv.classList.add('hideManually');
            setTimeout(() => {
                parentDiv.classList.remove('hideManually');
            });
            showMore.classList.add('hidden');
            showLess.classList.remove('hidden');
        });
    });
    showLess.addEventListener('click', function () {
        balanceZeroParentDivs.forEach(parentDiv => {
            parentDiv.classList.add('hidden');
            showMore.classList.remove('hidden');
            showLess.classList.add('hidden');
        });
    });
    if (entity === 'Friends') {
        deleteFriendHandler(balanceZeroParentDivs);
    }
}


// Event listener for the dom content loaded event calling the functions to handle the friends and groups
document.addEventListener('DOMContentLoaded', function () {
    settledUpFriendAndGroupHandler('Groups');
    settledUpFriendAndGroupHandler('Friends');
    removeSecondaryButtons();
    toggleFriendSettleUp();
    const profileImage = document.getElementById('homepagePic');
    const profileImageSrc = profileImage.getAttribute('data-src');

    profileImage.src = profileImageSrc;

    profileImage.onerror = function () {
        profileImage.src = '/images/homepageIconsAndPlaceholders/profilePicPlaceholder.svg';
    };


});





showGroups.addEventListener('click', groupsTabHandler);
showFriends.addEventListener('click', friendsTabHandler);
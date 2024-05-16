/**
 * This script is used to handle homepage javascript functionalities
 */


/**
 * This function is used to handle the click event on the groups tab    
 * @balpreet787
 */
function groupsTabHandler() {
    showFriends.classList.remove('bg-[#4b061a]');
    showFriends.classList.remove('text-white');
    showGroups.classList.add('bg-[#4b061a]');
    showGroups.classList.add('text-white');
    groupSearch.classList.remove('hidden');
    friendSearch.classList.add('hidden');
    friends.classList.add('hidden');
    groups.classList.remove('hidden');
    groups.classList.add('flex');
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
    showGroups.classList.remove('bg-[#4b061a]');
    showGroups.classList.remove('text-white');
    showFriends.classList.add('bg-[#4b061a]');
    showFriends.classList.add('text-white');
    groupSearch.classList.add('hidden');
    friendSearch.classList.remove('hidden');
    groups.classList.add('hidden');
    friends.classList.remove('hidden');
    friends.classList.add('flex');
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
    const addFriendSecondary = document.getElementById('addFriendSecondary');
    const addGroupSecondary = document.getElementById('addGroupSecondary');
    const addFriend = document.getElementById('addFriend');
    const addGroup = document.getElementById('createGroup');

    if (document.querySelectorAll('.friend').length >= 5 && !addFriendSecondaryDiv.classList.contains('hidden')) {
        addFriendSecondary.classList.add('hidden');
        addFriend.classList.remove('hidden');
    }
    else {
        addFriend.classList.add('hidden');
        addFriendSecondary.classList.remove('hidden');
    }
    if (document.querySelectorAll('.group').length >= 5 && !addGroupSecondaryDiv.classList.contains('hidden')) {
        addGroupSecondary.classList.add('hidden');
        addGroup.classList.remove('hidden');
    }
    else {
        addGroup.classList.add('hidden');
        addGroupSecondary.classList.remove('hidden');
    }
}

/**
 * This function is used to handle selecting a group in which they can settle a debt with their friend
 * @balpreet787
 */
function groupSelectorHandler(friendPhone) {
    groupToSettle = document.getElementById('groupToSettle' + friendPhone);
    const confirmGroup = document.getElementById('confirmGroup' + friendPhone);
    const submitSettle = document.getElementById('submitSettle' + friendPhone);
    const groups = document.querySelectorAll('.group');
    groups.forEach(group => {
        group.addEventListener('click', function () {
            const selectedGroup = this.textContent;
            groupToSettle.value = selectedGroup;
            confirmGroup.classList.add('hidden');
            confirmGroup.classList.remove('flex');
            submitSettle.classList.remove('hidden');
        });
    });
}

function deleteGroupHandler() {
    document.querySelectorAll('.deleteGroup').forEach(deleteGroup => {
        deleteGroup.addEventListener('click', function () {
            deleteGroupName = (this.id).replace('Delete', '');
            console.log(deleteGroupName);
            confirmDeleteOptions = document.getElementById(deleteGroupName + 'ConfirmDeleteOptions');
            cancelDelete = document.getElementById(deleteGroupName + 'CancelDelete');
            confirmDeleteOptions.classList.toggle('hidden');
            confirmDeleteOptions.classList.add('hideManually');
            setTimeout(() => {
                confirmDeleteOptions.classList.toggle('hideManually');
            }, 10);
            confirmDeleteOptions.classList.toggle('flex');
            cancelDelete.addEventListener('click', function () {
                confirmDeleteOptions.classList.toggle('hidden');
                confirmDeleteOptions.classList.remove('hideManually');
                confirmDeleteOptions.classList.toggle('flex');
                
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
    const amount = document.getElementById('amount' + friendPhone);
    const groupToSettle = document.getElementById('groupToSettle' + friendPhone);
    const selectGroupDropDown = document.getElementById('selectGroupDropDown' + friendPhone);
    const submitSettle = document.getElementById('submitSettle' + friendPhone);
    const confirmGroup = document.getElementById('confirmGroup' + friendPhone);
    const cancelSettle = document.getElementById('cancelSettle' + friendPhone);
    const selectGroupWarning = document.getElementById('selectGroupWarning' + friendPhone);
    const EnterAmountWarning = document.getElementById('EnterAmountWarning' + friendPhone);
    const arrow = document.getElementById('arrow' + friendPhone);
    amount.addEventListener('input', function () {
        confirmGroup.classList.add('hidden');
        confirmGroup.classList.remove('flex');
        submitSettle.classList.remove('hidden');
    });
    cancelSettle.addEventListener('click', function () {

        confirmGroup.classList.add('hidden');
        confirmGroup.classList.remove('flex');
        submitSettle.classList.remove('hidden');
        submitSettle.classList.add('hideManually');

        setTimeout(() => {
            submitSettle.classList.toggle('hideManually');
        }, 10);
    });
    submitSettle.addEventListener('click', function (event) {
        event.preventDefault();
        if (groupToSettle.value === '') {
            selectGroupWarning.classList.toggle('hidden');
            setTimeout(() => {
                selectGroupWarning.classList.toggle('hideManually');
            }, 10);
        }
        else if (amount.value === '' || isNaN(amount.value)) {
            EnterAmountWarning.classList.toggle('hidden');
            setTimeout(() => {
                EnterAmountWarning.classList.toggle('hideManually');
            }, 10);
            selectGroupWarning.classList.add('hidden');
        }
        else {
            selectGroupWarning.classList.add('hidden');
            EnterAmountWarning.classList.add('hidden');
            submitSettle.classList.toggle('hidden');
            confirmGroup.classList.remove('hidden');
            confirmGroup.classList.add('hideManually');
            setTimeout(() => {
                confirmGroup.classList.toggle('hideManually');
            }, 10);
            confirmGroup.classList.add('flex');
        }

    });
    selectGroupDropDown.addEventListener('click', function () {
        const groupDropDown = document.getElementById('groupChoices');
        groupDropDown.classList.toggle('hidden');


        if (groupDropDown.classList.contains('hidden')) {
            arrow.innerHTML = '&#x25BC;'
        }
        else {
            arrow.innerHTML = '&#x25B2'
            groupDropDown.classList.add('hideManually');
            setTimeout(() => {
                groupDropDown.classList.toggle('hideManually');
            }, 10);
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


document.querySelectorAll('.friend').forEach(friend => {
    friend.addEventListener('click', function () {
        const friendId = this.id;
        friendPhone = friendId.substring(6, friendId.length);
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
        groupSelectorHandler(friendPhone);
    });

});

removeSecondaryButtons();
deleteGroupHandler();
showGroups.addEventListener('click', groupsTabHandler);
showFriends.addEventListener('click', friendsTabHandler);
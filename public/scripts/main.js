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

showGroups.addEventListener('click', groupsTabHandler);
showFriends.addEventListener('click', friendsTabHandler);
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

removeSecondaryButtons();
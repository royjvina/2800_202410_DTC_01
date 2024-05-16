/**
 * This script is used to handle homepage javascript functionalities
 */

/**
 * This function is used to handle the click event on the groups tab    
 * @balpreet787
 */
function groupsTabHandler() {
    showFriends.classList.remove('bg-primary');
    showFriends.classList.remove('text-white');
    showGroups.classList.add('bg-primary');
    showGroups.classList.add('text-white');
    groupSearch.classList.remove('hidden');
    friendSearch.classList.add('hidden');
    friends.classList.add('hidden');
    groups.classList.remove('hidden');
    groups.classList.add('flex');
    addFriendSecondaryDiv.classList.add('hidden');
    addGroupSecondaryDiv.classList.remove('hidden');
    addGroupSecondaryDiv.classList.add('flex');
}
/**
 * This function is used to handle the click event on the friends tab    
 * @balpreet787
 */
function friendsTabHandler() {
    showGroups.classList.remove('bg-primary');
    showGroups.classList.remove('text-white');
    showFriends.classList.add('bg-primary');
    showFriends.classList.add('text-white');
    groupSearch.classList.add('hidden');
    friendSearch.classList.remove('hidden');
    groups.classList.add('hidden');
    friends.classList.remove('hidden');
    friends.classList.add('flex');
    addGroupSecondaryDiv.classList.add('hidden');
    addFriendSecondaryDiv.classList.remove('hidden');
    addFriendSecondaryDiv.classList.add('flex');
}


showGroups.addEventListener('click', groupsTabHandler);
showFriends.addEventListener('click', friendsTabHandler);

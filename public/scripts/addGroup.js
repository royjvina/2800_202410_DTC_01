/** JavaScript for handling add group form elements */




/**
 * Function to handle the friend selection in the add group form
 * @balpreet787
 * */
function addFriendsToGroupHandler() {
    const friends = document.querySelectorAll("#groupFriendChoices li");
    friends.forEach(friend => {
        friend.addEventListener("click", function () {
            const friendId = friend.id;
            const addFriendbtnId = friendId.replace("select", "add");
            friend.classList.toggle("bg-secondary");
            friend.classList.toggle("bg-primary");
            friend.classList.toggle("text-white");

            if (friend.classList.contains("bg-primary")) {
                friendInput.value += friendId.replace("selectFriend", "");
                friendInput.value += ",";
                document.getElementById(addFriendbtnId).textContent = '-';
                console.log(addFriendbtnId)
            }
            else {
                let friendValue = friendId.replace("selectFriend", "");
                let friendInputValueArray = friendInput.value.split(',').filter(id => id && id !== friendValue);
    
                friendInput.value = friendInputValueArray.join(',') + (friendInputValueArray.length ? ',' : '');
                document.getElementById(addFriendbtnId).textContent = '+';
            }
        });
    });
}


document.getElementById("confirmAddGroup").addEventListener("click", function (event) {
    if (document.getElementById("groupName").value.trim() === "") {
        event.preventDefault();
        emptyGroupNameWarning.classList.remove("hidden");
    }
    else if (friendInput.value === "" && checkGroup.value === "GroupDoesNotExist") {
        event.preventDefault();
        emptyFriendWarning.classList.remove("hidden");

    }
});

groupImage.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


/**
 * This function is used to handle the delete a groups
 * @balpreet787
 * */
function deleteGroupHandler() {
            deleteGroup = document.querySelector('.deleteGroup');
            deleteGroup.addEventListener('click', function () {
            let deleteGroupId = (this.id).replace('Delete', '');
            let selectedGroup = document.getElementById(deleteGroupId + 'Selected');
            console.log(deleteGroupId);
            let confirmDeleteOptions = document.getElementById(deleteGroupId + 'ConfirmDeleteOptions');
            let cancelDelete = document.getElementById(deleteGroupId + 'CancelDelete');
            confirmDeleteOptions.classList.toggle('hidden');
            confirmDeleteOptions.classList.add('hideManually');
            deleteGroup.classList.remove('flex');
            deleteGroup.classList.add('hidden');
            selectedGroup.value = deleteGroupId;
            setTimeout(() => {
                confirmDeleteOptions.classList.toggle('hideManually');
            }, 10);
            confirmDeleteOptions.classList.toggle('flex');
            cancelDelete.addEventListener('click', function () {
                confirmDeleteOptions.classList.add('hidden');
                confirmDeleteOptions.classList.remove('hideManually');
                confirmDeleteOptions.classList.remove('flex');
                deleteGroup.classList.remove('hidden');
                deleteGroup.classList.add('flex');
                selectedGroup.value = '';

            });

        });
}

// categoryHandler();
addFriendsToGroupHandler();
deleteGroupHandler();
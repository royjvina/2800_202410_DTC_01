/** JavaScript for handling add group form elements */


/**
 * Function to handle the category selection in the add group form
 * @balpreet787
 */
// function categoryHandler() {
//     const categories = document.querySelectorAll("#groupCategoryChoices li");
//     categories.forEach(category => {
//         category.addEventListener("click", function () {
//             categories.forEach(category => {
//                 category.classList.remove("bg-primary");
//                 category.classList.add("bg-secondary");
//                 category.classList.remove("text-white");
//                 let img = category.querySelector('img');
//                 let categoryId = category.id;
//                 img.src = `/images/addGroupIcons/${categoryId}Black.svg`;
//             });
//             category.classList.toggle("bg-secondary");
//             category.classList.toggle("bg-primary");
//             category.classList.toggle("text-white");
//             let img = category.querySelector('img');
//             let categoryId = category.id;

//             if (category.classList.contains("bg-primary")) {
//                 categoryInput.value = category.textContent;
//                 img.src = `/images/addGroupIcons/${categoryId}White.svg`;
//             }
//             else {
//                 categoryInput.value = "misc";

//             }
//         });
//     });
// }

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
                let friendInputValue = friendInput.value;
                friendInputValue = friendInputValue.replace(friendId + ",", "");
                friendInput.value = friendInputValue;
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
    else if (friendInput.value === "") {
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

// categoryHandler();
addFriendsToGroupHandler();
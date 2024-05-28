/**
 * This script is used to handle adding expenses javascript functionalities
 */

/**
 * This function is used to handle the click event on cancel button in the add expense form   
 * @claaudiaale
 */

function goBackFromAddExpenses() {
    document.querySelector('.addExpenseCancelButton').addEventListener('click', () => {
        history.back();
    })
}


/**
 * This function is used to handle the click event on the split expenses equal tab    
 * @claaudiaale
 */
let GlobalGroupId;
function equalExpenseTabHandler(event) {
    event.preventDefault();
    showPercentageExpense.classList.remove('bg-[#4b061a]');
    showPercentageExpense.classList.remove('text-white');
    showManualExpense.classList.remove('bg-[#4b061a]');
    showManualExpense.classList.remove('text-white');
    showEqualExpense.classList.add('bg-[#4b061a]');
    showEqualExpense.classList.add('text-white');
    splitExpensePercentage.classList.add('hidden');
    splitExpenseManually.classList.add('hidden');
    splitExpenseEqually.classList.remove('hidden');
    splitExpenseEqually.classList.add('flex-col');
}

/**
 * This function is used to erase the percentage and manual fields on change events in the equal tab 
 * @claaudiaale
 */

function erasePercentageManualFields() {
    let percentageInputs = document.querySelectorAll('input.percentage')
    percentageInputs.forEach(input => {
        input.value = "";
    })

    let percentageTotals = document.querySelectorAll('span.amountPercentage')
    percentageTotals.forEach(total => {
        total.innerHTML = '$0.00';
    })

    let manualInputs = document.querySelectorAll('input.manual')
    manualInputs.forEach(input => {
        input.value = "";
        input.placeholder = "0.00";
    })
}


/**
 * This function is used to handle the click event on the split expenses by percentage tab    
 * @claaudiaale
 */
function percentageExpenseTabHandler(event) {
    event.preventDefault();
    showManualExpense.classList.remove('bg-[#4b061a]');
    showManualExpense.classList.remove('text-white');
    showEqualExpense.classList.remove('bg-[#4b061a]');
    showEqualExpense.classList.remove('text-white');
    showPercentageExpense.classList.add('bg-[#4b061a]');
    showPercentageExpense.classList.add('text-white');
    splitExpenseEqually.classList.add('hidden');
    splitExpenseManually.classList.add('hidden');
    splitExpensePercentage.classList.remove('hidden');
    splitExpensePercentage.classList.add('flex-col');

    let equalTotals = document.querySelectorAll('input.equalValue')
    equalTotals.forEach(total => {
        total.value = "";
    })

    let equalDisplays = document.querySelectorAll('p.equalDisplay')
    equalDisplays.forEach(display => {
        display.innerHTML = '$0.00';
    })

    let equalChecks = document.querySelectorAll('.userEqualSplit')
    equalChecks.forEach(check => {
        check.checked = false;
    })

    let manualInputs = document.querySelectorAll('input.manual')
    manualInputs.forEach(input => {
        input.value = "";
        input.placeholder = "0.00";
    })
}

/**
 * This function is used to handle the click event on the split expenses manually tab    
 * @claaudiaale
 */
function manualExpenseTabHandler(event) {
    event.preventDefault();
    showPercentageExpense.classList.remove('bg-[#4b061a]');
    showPercentageExpense.classList.remove('text-white');
    showEqualExpense.classList.remove('text-white');
    showEqualExpense.classList.remove('bg-[#4b061a]');
    showManualExpense.classList.add('bg-[#4b061a]');
    showManualExpense.classList.add('text-white');
    splitExpenseEqually.classList.add('hidden');
    splitExpensePercentage.classList.add('hidden');
    splitExpenseManually.classList.remove('hidden');
    splitExpenseManually.classList.add('flex-col');

    let equalTotals = document.querySelectorAll('input.equalValue')
    equalTotals.forEach(total => {
        total.value = "";
    })

    let equalDisplays = document.querySelectorAll('p.equalDisplay')
    equalDisplays.forEach(display => {
        display.innerHTML = '$0.00';
    })

    let equalChecks = document.querySelectorAll('.userEqualSplit')
    equalChecks.forEach(check => {
        check.checked = false;
    })

    let percentageInputs = document.querySelectorAll('input.percentage')
    percentageInputs.forEach(input => {
        input.value = "";
    })

    let percentageTotals = document.querySelectorAll('span.amountPercentage')
    percentageTotals.forEach(total => {
        total.innerHTML = '$0.00';
    })
}

/**
 * This function is used to check which split method is being used, determined by checking if that given tab is coloured
 * @claaudiaale
 */
function checkSplitMethod() {
    if (showEqualExpense.classList.contains('bg-[#4b061a]')) {
        return "Equal";
    } else if (showPercentageExpense.classList.contains('bg-[#4b061a]')) {
        return "Percentage";
    } else if (showManualExpense.classList.contains('bg-[#4b061a]')) {
        return "Manual";
    }
}

/**
 * This function is used to automatically add the expense total to the user who paid for an expense
 * @claaudiaale
 */
function addExpenseToPaidByUser() {
    let splitMethod = checkSplitMethod();
    let expenseTotal = parseFloat(document.getElementById('selectedExpenseAmount').value);
    let paidByUser = GlobalGroupId + document.getElementById('selectedPaidBy').value;

    document.querySelectorAll('.user' + splitMethod + 'Split').forEach(user => {
        user.checked = false;
        if (splitMethod == 'Equal') {
            document.getElementById(user.id + 'Amount' + splitMethod).innerHTML = '$0.00';
        } else if (splitMethod == 'Percentage') {
            document.getElementById(user.id + 'Percentage').value = "";
        } else {
            document.getElementById(user.id + 'Amount' + splitMethod).value = '$0.00';
        }
    })

    if (expenseTotal > 0) {
        document.getElementById(paidByUser).checked = true;
        if (splitMethod == "Equal") {
            document.getElementById(paidByUser + 'Amount' + splitMethod).innerHTML = ('$' + expenseTotal.toFixed(2));
        } else if (splitMethod == 'Percentage') {
            document.getElementById(paidByUser + 'Percentage').value = 100;
            document.getElementById(paidByUser + 'Amount' + splitMethod).innerHTML = ('$' + expenseTotal.toFixed(2));
        } else if (splitMethod == 'Manual') {
            document.getElementById(paidByUser + 'AmountManual').value = expenseTotal.toFixed(2);
        }
    }
}

/**
 * This function is used to handle computation of splitting an expense's total equally as users are selected   
 * @claaudiaale
 */

function calculateExpenseEqually() {
    var expenseTotal = parseFloat(document.getElementById('selectedExpenseAmount').value);
    var selectedGroup = document.getElementById('selectedGroup');
    var groupId = selectedGroup.value;

    // Query the users within the selected group's split container
    let usersToSplitFor = document.querySelectorAll(`.userEqualSplit:checked`);
    var numberOfUsers = usersToSplitFor.length;

    // Reset amounts for all users
    document.querySelectorAll(`.userEqualSplit`).forEach(user => {
        let userId = user.getAttribute('data-user-id');
        if (document.getElementById(`${groupId}${userId}AmountEqual`)) {
            document.getElementById(`${groupId}${userId}AmountEqual`).textContent = '$0.00';
            document.getElementById(`${groupId}${userId}AmountEqualInput`).value = ''; // Reset input value
        }
    });

    if (expenseTotal > 0 && numberOfUsers > 0) {
        var splitAmount = (expenseTotal / numberOfUsers).toFixed(2);

        // Set amounts for users who are checked
        usersToSplitFor.forEach(user => {
            let userId = user.getAttribute('data-user-id');
            document.getElementById(`${groupId}${userId}AmountEqual`).textContent = '$' + splitAmount;
            document.getElementById(`${groupId}${userId}AmountEqualInput`).value = splitAmount; // Update input value
        });
    }
}



/**
 * This function is used to handle computation of calculating the total percentage that a user inputs for an expense
 * @claaudiaale
 */
function calculateUsersPercentage() {
    let totalPercentage = 0;

    let percentageInputs = document.querySelectorAll('.percentage');
    percentageInputs.forEach(input => {
        if (!input.value) {
            totalPercentage += 0;
        } else {
            totalPercentage += parseFloat(input.value);
        }
    })
    return totalPercentage;
}

/**
 * This function is used to handle computation of splitting an expense's total percentage wise as users are selected   
 * @claaudiaale
 */

function calculateExpensePercentage() {
    var expenseTotal = parseFloat(document.getElementById('selectedExpenseAmount').value);
    var selectedGroup = document.getElementById('selectedGroup');
    var groupId = selectedGroup.value;
    let totalPercentage = calculateUsersPercentage();
    let usersToSplitFor = [];

    if (totalPercentage == 100) {
        let users = document.querySelectorAll('.percentage');

        users.forEach(user => {
            if (!Number.isNaN(user.value) && !user.value == "") {
                usersToSplitFor.push(user)
            }
        })

        usersToSplitFor.forEach(user => {
            let userId = user.getAttribute('data-user-id');
            let userPercentage = parseFloat(document.getElementById(`${groupId}${userId}Percentage`).value);
            let userAmount = (expenseTotal * (userPercentage / 100)).toFixed(2);
            if (userAmount == 'NaN') {
                userAmount = '0.00';
            }
            document.getElementById(`${groupId}${userId}PercentageAmount`).textContent = '$' + userAmount;
            document.getElementById(`${groupId}${userId}AmountPercentage`).value = userAmount;
        }); 
    } 
}

/**
 * This function is used to handle computation of splitting an expense's total manually as a user inputs given split amounts  
 * @claaudiaale
 */

function calculateExpenseManual() {
    let expenseTotal = parseFloat(document.getElementById('selectedExpenseAmount').value);
    let userTotal = 0;
    let manualInputs = document.querySelectorAll('.manual');

    manualInputs.forEach(input => {
        if (!input.value) {
            userTotal += 0;
        } else {
            userTotal += parseFloat(input.value);
        }
    })
    return userTotal == expenseTotal;
}

/**
 * Function to handle the category selection in the add group form
 * @balpreet787
 */
function categoryHandler() {
    const categories = document.querySelectorAll("#groupCategoryChoices li");
    groupDroupDown.addEventListener("click", function () {
        if (groupCategoryChoices.classList.contains("hidden")) {
            groupCategoryChoices.classList.remove("hidden");
            groupCategoryChoices.classList.add("flex");
            categoryArrow.src = "/images/otherIcons/upArrow.svg";
        }
        else {
            groupCategoryChoices.classList.add("hidden");
            groupCategoryChoices.classList.remove("flex");
            categoryArrow.src = "/images/otherIcons/downArrow.svg";
        }
    });
    categories.forEach(category => {
        category.addEventListener("click", function () {
            categories.forEach(category => {
                category.classList.remove("bg-primary");
                category.classList.add("bg-secondary");
                category.classList.remove("text-white");
                let img = category.querySelector('img');
                let categoryId = category.id;
                img.src = `/images/addGroupIcons/${categoryId}Black.svg`;
            });
            category.classList.toggle("bg-secondary");
            category.classList.toggle("bg-primary");
            category.classList.toggle("text-white");
            let img = category.querySelector('img');
            let categoryId = category.id;

            if (category.classList.contains("bg-primary")) {
                categoryInput.value = categoryId
                img.src = `/images/addGroupIcons/${categoryId}White.svg`;
                categoryHeader.textContent = category.textContent;
                categoryHeader.classList.add("text-primary");
            }
            else {
                categoryInput.value = "miscellaneous";
                categoryHeader.textContent = "miscellaneous";

            }
        });
    });
}

/**
 * This function is used to handle the modal display when there is an error in the expense split
 * @claaudiaale
 */

function displayErrorModal(errorMessage) {
    let errorModal = document.getElementById('errorModal');
    document.getElementById('errorMessage').innerHTML = errorMessage;
    errorModal.showModal();
}

/**
 * This function is used to handle the modal display when there is an error in empty fields when adding an expense
 * @claaudiaale
 */

function displayEmptyFieldModal(event) {
    let totalPercentage = calculateUsersPercentage();
    let splitMethod = checkSplitMethod();
    if (!selectedGroup.value) {
        event.preventDefault();
        let errorMessage = 'Please select a group to add an expense to.';
        displayErrorModal(errorMessage);
    } else if (!selectedDate.value) {
        event.preventDefault();
        let errorMessage = 'Please select a date for the expense.';
        displayErrorModal(errorMessage);
    } else if (!selectedExpenseName.value) {
        event.preventDefault();
        let errorMessage = 'Please enter a name for the expense.';
        displayErrorModal(errorMessage);
    } else if (!selectedExpenseAmount.value) {
        event.preventDefault();
        let errorMessage = 'Please enter an amount for the expense.';
        displayErrorModal(errorMessage);
    } else if (!selectedPaidBy.value) {
        event.preventDefault();
        let errorMessage = 'Please select a user who paid for the expense.';
        displayErrorModal(errorMessage);
    } else if (splitMethod == 'Percentage' && totalPercentage != 100) {
        event.preventDefault();
        let errorMessage = 'Please ensure that the total percentage of the expense is 100.';
        displayErrorModal(errorMessage);
    } else if (splitMethod == 'Manual' && !calculateExpenseManual()) {
        event.preventDefault();
        let errorMessage = 'Please ensure that your manual inputs are equal to the total expense amount.';
        displayErrorModal(errorMessage);
    } else if (splitMethod == 'Equal' && selectedExpenseAmount.value == 0) {
        event.preventDefault();
        let errorMessage = 'Please ensure that the expense amount is greater than 0.';
        displayErrorModal(errorMessage);
    }
}

const groupsDataElement = document.getElementById('groupsData');
const groupsData = JSON.parse(groupsDataElement.dataset.groups);

// Function to execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date and set it in the date input field

    let transactionDate = document.getElementById('selectedDate').dataset.date;
    if (transactionDate == "0") {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('selectedDate').value = formattedDate;
    }

});

// Function to get group ID from group name
async function getGroupIdFromName(groupId) {
    try {
        for (let i = 0; i < groupsData.length; i++) {
            if (groupsData[i]._id === groupId) {
                return groupsData[i]._id;
            }
        }
        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Function to get group index by ID
function getGroupById(groupId) {
    for (let i = 0; i < groupsData.length; i++) {
        if (groupsData[i]._id === groupId) {
            return groupsData[i];
        }
    }
    console.log(`Group with ID '${groupId}' not found.`);
    return null;
}

// Function to populate the dropdown menu with users from the selected group
function populateUsersDropdown(groupId) {
    // Clear existing options
    const selectElement = document.getElementById('selectedPaidBy');
    selectElement.innerHTML = '<option value="" selected disabled class="hidden">Select User</option>';

    // Get the group by ID
    const group = getGroupById(groupId);

    // Check if group exists
    if (group) {
        // Iterate through members and add them to the dropdown
        group.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.user_id._id;
            option.textContent = member.user_id.username;
            selectElement.appendChild(option);
        });

    }
}

document.getElementById('selectedGroup').addEventListener('change', function () {
    var selectedGroupId;
    for (i = 0; i < groupsData.length; i++) {
        if (groupsData[i]._id === document.getElementById('selectedGroup').value) {
            selectedGroupId = groupsData[i]._id;
        }
    }
    GlobalGroupId = selectedGroupId;
    populateUsersDropdown(selectedGroupId);
});

// Function to toggle visibility of split based on selected group
async function toggleSplitVisibility() {
    const selectedGroup = await getGroupIdFromName(document.getElementById('selectedGroup').value);
    const allSplits = document.querySelectorAll('.split-container');

    displayMembersToSplitFor();
    resetCheckboxes(); // Reset checkboxes when switching groups            

    allSplits.forEach(split => {
        // Check if the split id matches the selected group
        if (split.id === `${selectedGroup}-equally` ||
            split.id === `${selectedGroup}-percentage` ||
            split.id === `${selectedGroup}-manually`) {
            split.classList.remove('hidden');
        } else {
            split.classList.add('hidden');
        }
    });
}

/**
 * This function is used to ensure that a payee must be selected in order to view members to split for
 * @claaudiaale
 */
function displayMembersToSplitFor() {
    let payeeMenu = document.getElementById('selectedPaidBy');
    let splitDisplay = document.getElementById('allSplitMethods');

    payeeMenu.addEventListener('change', function () {
        let payee = payeeMenu.value;
        if (payee !== "") {
            splitDisplay.classList.remove('hidden');
        } else {
            splitDisplay.classList.add('hidden');
        }
    })
}


// Function to reset checkboxes
function resetCheckboxes() {
    let checkboxes = document.querySelectorAll('.userEqualSplit');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Add onchange event listener to selectedGroup dropdown
document.getElementById('selectedGroup').addEventListener('change', toggleSplitVisibility);

// Call toggleSplitVisibility once initially to set the initial state based on the default selected group
toggleSplitVisibility();



showEqualExpense.addEventListener('click', function (event) { equalExpenseTabHandler(event) });
let equalChecks = document.querySelectorAll('.userEqualSplit')
equalChecks.forEach(check => {
    check.addEventListener('change', erasePercentageManualFields);
})

showPercentageExpense.addEventListener('click', function (event) { percentageExpenseTabHandler(event) });


showManualExpense.addEventListener('click', function (event) { manualExpenseTabHandler(event) });
document.querySelectorAll('.userEqualSplit').forEach(user => {
    user.addEventListener('change', calculateExpenseEqually);
});
selectedExpenseAmount.addEventListener('input', calculateExpenseEqually);
selectedPaidBy.addEventListener('change', function () { addExpenseToPaidByUser("") });
selectedPaidBy.addEventListener('change', function () { addExpenseToPaidByUser("Percentage") });
selectedPaidBy.addEventListener('change', function () { addExpenseToPaidByUser("Manual") });

splitExpensePercentage.addEventListener('change', calculateExpensePercentage);
splitExpenseManually.addEventListener('change', calculateExpenseManual);

let percentageInputs = document.querySelectorAll('.percentage');
percentageInputs.forEach(input => {
    input.addEventListener('input', calculateExpensePercentage);
});

confirmAddExpense.addEventListener('click', function (event) { displayEmptyFieldModal(event) });
closeExpenseError.addEventListener('click', function () { errorModal.close() })
categoryHandler();
goBackFromAddExpenses();

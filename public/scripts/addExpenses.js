/**
 * This script is used to handle adding expenses javascript functionalities
 */


/**
 * This function is used to handle the click event on the split expenses equal tab    
 * @claaudiaale
 */
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
    let paidByUser = document.getElementById('selectedPaidBy').value;

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
    var groupId = document.getElementsByClassName(selectedGroup.value)[0].id;
    
    // Query the users within the selected group's split container
    let usersToSplitFor = document.querySelectorAll(`.userEqualSplit:checked`);
    let usersNotToSplitFor = document.querySelectorAll(`.userEqualSplit:not(:checked)`);
    var numberOfUsers = usersToSplitFor.length;

    // Reset amounts for all users
    usersNotToSplitFor.forEach(user => {
        let userId = user.getAttribute('data-user-id');
        document.getElementById(`${groupId}${userId}AmountEqual`).textContent = '$0.00';
        document.getElementById(`${groupId}${userId}AmountEqualInput`).value = '0.00'; // Reset input value
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
    let totalPercentage = calculateUsersPercentage();
    let usersToSplitFor = [];

    if (totalPercentage == 100) {
        let users = document.querySelectorAll('.percentage');
        users.forEach(user => {
            let userId = user.id
            if (!Number.isNaN(user.value) || user.value == "") {
                usersToSplitFor.push(userId)
            }
        })
        usersToSplitFor.forEach(user => {
            let userPercentage = parseFloat(document.getElementById(user).value);
            let userAmount = (expenseTotal * (userPercentage / 100)).toFixed(2);
            if (userAmount == 'NaN') {
                userAmount = '0.00';
            }
            document.getElementById(user.slice(0, -10) + 'AmountPercentage').innerHTML = ('$' + userAmount);
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
    } else if (splitMethod == 'Manual' && calculateExpenseManual()) {
        event.preventDefault();
        let errorMessage = 'Please ensure that your manual inputs are equal to the total expense amount.';
        displayErrorModal(errorMessage);
    }
}


showEqualExpense.addEventListener('click', function (event) {equalExpenseTabHandler(event)});
showPercentageExpense.addEventListener('click', function (event) {percentageExpenseTabHandler(event)});
showManualExpense.addEventListener('click', function (event) {manualExpenseTabHandler(event)});
document.querySelectorAll('.userEqualSplit').forEach(user => {
    user.addEventListener('change', calculateExpenseEqually);
});
selectedExpenseAmount.addEventListener('input', calculateExpenseEqually);
selectedPaidBy.addEventListener('change', function() {addExpenseToPaidByUser("")});
selectedPaidBy.addEventListener('change', function() {addExpenseToPaidByUser("Percentage")});
selectedPaidBy.addEventListener('change', function() {addExpenseToPaidByUser("Manual")});

let percentageInputs = document.querySelectorAll('.percentage');
percentageInputs.forEach(input => {
    input.addEventListener('input', calculateExpensePercentage);
});

confirmAddExpense.addEventListener('click', function(event) {displayEmptyFieldModal(event)});
closeExpenseError.addEventListener('click', function() {errorModal.close()})



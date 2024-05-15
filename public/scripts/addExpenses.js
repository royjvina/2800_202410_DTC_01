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
 * This function is used to automatically add the expense total to the user who paid for an expense
 * @claaudiaale
 */
function addExpenseToPaidByUser() {
    let expenseTotal = parseFloat(document.getElementById('selectedExpenseAmount').value);
    let paidByUser = document.getElementById('selectedPaidBy').value;

    document.querySelectorAll('.userEqualSplit').forEach(user => {
        user.checked = false;
        document.getElementById(user.id + 'Amount').innerHTML = '$0.00';
    })

    if (expenseTotal > 0) {
        document.getElementById(paidByUser + 'Amount').innerHTML = ('$' + expenseTotal.toFixed(2));
        document.getElementById(paidByUser).checked = true;
    }

}


/**
 * This function is used to handle computation of splitting an expense's total equally as users are selected   
 * @claaudiaale
 */

function calculateExpenseEqually() {
    let expenseTotal = parseFloat(document.getElementById('selectedExpenseAmount').value);
    let usersToSplitFor = document.querySelectorAll('.userEqualSplit:checked');
    let usersNotIncluded = document.querySelectorAll('.userEqualSplit:not(:checked)');
    let numberOfUsers = usersToSplitFor.length;

    if (expenseTotal > 0 && numberOfUsers > 0) {
        let splitAmount = (expenseTotal / numberOfUsers).toFixed(2);
        usersToSplitFor.forEach(user => {
            let userId = user.id
            document.getElementById(userId + 'Amount').innerHTML = ('$' + splitAmount);
        })
        usersNotIncluded.forEach(user => {
            let userId = user.id
            document.getElementById(userId + 'Amount').innerHTML = '$0.00';
        })
    } else if (numberOfUsers == 0) {
        usersNotIncluded.forEach(user => {
            let userId = user.id
            document.getElementById(userId + 'Amount').innerHTML = '$0.00';
        })
    }
}




showEqualExpense.addEventListener('click', function (event) {equalExpenseTabHandler(event)});
showPercentageExpense.addEventListener('click', function (event) {percentageExpenseTabHandler(event)});
showManualExpense.addEventListener('click', function (event) {manualExpenseTabHandler(event)});
document.querySelectorAll('.userEqualSplit').forEach(user => {
    user.addEventListener('click', calculateExpenseEqually);
});
selectedExpenseAmount.addEventListener('input', calculateExpenseEqually);
selectedPaidBy.addEventListener('change', addExpenseToPaidByUser);


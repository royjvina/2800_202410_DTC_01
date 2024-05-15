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
 * This function is used to handle the click event on the split expenses by percentage tab    
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


showEqualExpense.addEventListener('click', function(event){equalExpenseTabHandler(event)});
showPercentageExpense.addEventListener('click', function(event){percentageExpenseTabHandler(event)});
showManualExpense.addEventListener('click', function(event){manualExpenseTabHandler(event)});
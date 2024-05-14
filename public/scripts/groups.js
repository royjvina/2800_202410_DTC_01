/**
 * This script is used to handle homepage javascript functionalities
 */


/**
 * This function is used to handle the click event on the balances tab    
 * @claaudiaale
 */

function expensesTabHandler() {
    showBalances.classList.remove('bg-[#4b061a]');
    showBalances.classList.remove('text-white');
    showExpenses.classList.add('bg-[#4b061a]');
    showExpenses.classList.add('text-white');
    balances.classList.add('hidden');
    expenses.classList.remove('hidden');
    expenses.classList.add('flex');
}

/**
 * This function is used to handle the click event on the balances tab    
 * @claaudiaale
 */

function balancesTabHandler() {
    showExpenses.classList.remove('bg-[#4b061a]');
    showExpenses.classList.remove('text-white');
    showBalances.classList.add('bg-[#4b061a]');
    showBalances.classList.add('text-white');
    expenses.classList.add('hidden');
    balances.classList.remove('hidden');
    balances.classList.add('flex');
}

showExpenses.addEventListener('click', expensesTabHandler);
showBalances.addEventListener('click', balancesTabHandler);
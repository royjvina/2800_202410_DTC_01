/**
 * This script is used to handle an individual expense's javascript functionalities
 */



/**
 * This function is used to handle the click event on back button on an individual expense's page  
 * @claaudiaale
 */

function goBackToGroupsPage() {
    // go back to previous page, remember history 
    document.getElementById('goBack').addEventListener('click', () => {
        history.back()
    })
}

/**
 * This function is used to handle the click event on delete button on an individual expense's page
 * @balpreet787
 */
function deleteExpenseHandler() {
    deleteExpense.addEventListener('click', () => {
        // on click, show delete expense form and hide delete button
        deleteExpenseForm.classList.remove('hidden');
        deleteExpenseForm.classList.add('flex');
        deleteExpenseForm.classList.add('hideManually');
        setTimeout(() => {
            deleteExpenseForm.classList.remove('hideManually');
        }, 10);
        deleteExpense.classList.add('hidden');
    });
    CancelDeleteExpense.addEventListener('click', () => {
        deleteExpenseForm.classList.add('hidden');
        deleteExpenseForm.classList.remove('flex');
        deleteExpense.classList.remove('hidden');
        deleteExpense.classList.add('hideManually');
        setTimeout(() => {
            deleteExpense.classList.remove('hideManually');
        }, 10);
    });
}

goBackToGroupsPage();
deleteExpenseHandler();
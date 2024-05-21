/**
 * This script is used to handle individual expense javascript functionalities
 */


/**
 * This function is used to handle the click event when the delete button is clicked  
 * @claaudiaale
 */

function deleteExpenseHandler() {
    document.getElementById('expenseDelete').addEventListener('click', function () {
        confirmDeleteOptions = document.getElementById('expenseConfirmDeleteOptions');
        cancelDelete = document.getElementById('expenseCancelDelete');
        confirmDeleteOptions.classList.toggle('hidden');
        confirmDeleteOptions.classList.add('hideManually');
        setTimeout(() => {
            confirmDeleteOptions.classList.toggle('hideManually');
        }, 10);
        confirmDeleteOptions.classList.toggle('flex');
        cancelDelete.addEventListener('click', function () {
            confirmDeleteOptions.classList.add('hidden');
            confirmDeleteOptions.classList.remove('hideManually');
            confirmDeleteOptions.classList.remove('flex');
        })
    })
}

deleteExpenseHandler();
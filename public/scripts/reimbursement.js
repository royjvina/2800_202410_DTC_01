// Event listener for the 'backIndividualExpense' button to navigate back in browser history
backIndividualExpense.addEventListener('click', () => {
    history.back();
});

/**
 * This function is used to display the confirm option for the reimbursements
 * @balpreet787
 */
function displayConfirmOpiton() {
    // Select all elements with the class 'displayConfirmReimburse'
    const reimburseBtns = document.querySelectorAll('.displayConfirmReimburse');
    reimburseBtns.forEach((btn) => {
        let btnId = btn.id;
        let userId = btnId.replace('displayConfirmReimburse', ""); // Extract user ID from button ID
        let confirmOptions = document.getElementById(`confirmOption${userId}`);
        let cancelBtn = document.getElementById(`cancel${userId}`);
        let confirmBtn = document.getElementById(`confirm${userId}`);
        let amount = document.getElementById(`amount${userId}`);

        // Event listener for displaying confirm options
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            let Enteredamount = amount.value;

            // Show warning if the entered amount is invalid
            if (Enteredamount === "" || Number(Enteredamount) <= 0) {
                amountWarning.classList.remove('hidden');
                amountWarning.classList.add('hideManually');
                setTimeout(() => {
                    amountWarning.classList.remove('hideManually');
                }, 10);
            } else {
                // Display confirm options and hide the button
                confirmOptions.classList.remove('hidden');
                confirmOptions.classList.add('flex');
                confirmOptions.classList.add('hideManually');
                setTimeout(() => {
                    confirmOptions.classList.remove('hideManually');
                }, 10);
                btn.classList.add('hidden');
            }
        });

        // Call function to handle cancel and confirm actions
        cancelAndConfirmReimburse(btn, confirmOptions, cancelBtn, confirmBtn, amount);

        // Event listener for hiding amount warning on input change
        amount.addEventListener('input', function (event) {
            amountWarning.classList.add('hidden');
            amountWarning.classList.add('hideManually');
            setTimeout(() => {
                amountWarning.classList.remove('hideManually');
            }, 10);
        });
    });
}

/**
 * This function is used to cancel and confirm the reimbursement
 * @param {HTMLElement} btn - The button that was clicked
 * @param {HTMLElement} confirmOptions - The confirm options for the reimbursement
 * @param {HTMLElement} cancelBtn - The cancel button for the reimbursement
 * @param {HTMLElement} confirmBtn - The confirm button for the reimbursement
 * @param {HTMLElement} amount - The amount input field
 * @balpreet787
 */
function cancelAndConfirmReimburse(btn, confirmOptions, cancelBtn, confirmBtn, amount) {
    // Event listener for cancel button
    cancelBtn.addEventListener('click', function (event) {
        event.preventDefault();
        confirmOptions.classList.add('hidden');
        confirmOptions.classList.remove('flex');
        btn.classList.remove('hidden');
        btn.classList.add('flex');
        btn.classList.add('hideManually');
        setTimeout(() => {
            btn.classList.remove('hideManually');
        }, 10);
    });

    // Event listener for confirm button
    confirmBtn.addEventListener('click', function (event) {
        let Enteredamount = amount.value;
        if (Enteredamount === "" || Number(Enteredamount) <= 0) {
            event.preventDefault();
            amountWarning.classList.remove('hidden');
            amountWarning.classList.add('hideManually');
            setTimeout(() => {
                amountWarning.classList.remove('hideManually');
            }, 10);
        }
    });
}

// Initialize the displayConfirmOpiton function
displayConfirmOpiton();

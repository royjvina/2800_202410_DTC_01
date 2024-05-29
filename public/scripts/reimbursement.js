backIndividualExpense.addEventListener('click', () => {
    history.back();
});

/**
 * This function is used to display the confirm option for the reimbursements
 * @balpreet787
 * */
function displayConfirmOpiton() {
    const reimburseBtns = document.querySelectorAll('.displayConfirmReimburse');
    reimburseBtns.forEach((btn) => {
        let btnId = btn.id;
        let userId = btnId.replace('displayConfirmReimburse', "");
        let confirmOptions = document.getElementById(`confirmOption${userId}`);
        let cancelBtn = document.getElementById(`cancel${userId}`);
        let confirmBtn = document.getElementById(`confirm${userId}`);
        let amount = document.getElementById(`amount${userId}`);
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            let Enteredamount = amount.value;
            if (Enteredamount === "" || Number(Enteredamount) <= 0) {
                amountWarning.classList.remove('hidden');
                amountWarning.classList.add('hideManually');
                setTimeout(() => {
                    amountWarning.classList.remove('hideManually');
                }, 10);
            }
            else {
                confirmOptions.classList.remove('hidden');
                confirmOptions.classList.add('flex');
                confirmOptions.classList.add('hideManually');
                setTimeout(() => {
                    confirmOptions.classList.remove('hideManually');
                }, 10);
                btn.classList.add('hidden');
            }

        });
        cancelAndConfirmReimburse(btn, confirmOptions, cancelBtn, confirmBtn, amount);
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
 * */
function cancelAndConfirmReimburse(btn, confirmOptions, cancelBtn, confirmBtn, amount) {
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
displayConfirmOpiton();
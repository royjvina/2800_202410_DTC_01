backIndividualExpense.addEventListener('click', () => {
    history.back();
});

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
        amount.addEventListener('input', function (event) {
            console.log(event.target.value);
            amountWarning.classList.add('hidden');
            amountWarning.classList.add('hideManually');
                setTimeout(() => {
                    amountWarning.classList.remove('hideManually');
                }, 10);
        });

});
}
displayConfirmOpiton();
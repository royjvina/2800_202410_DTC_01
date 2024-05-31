/**
 * This function is used to handle the click event on cancel button in the add expense form   
 * @claaudiaale
 */

function goBackFromAddExpenses() {
    document.querySelector('.addExpenseCancelButton').addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            history.back()
        } else {
            window.location.href = '/home';
        }
    })
}

/**
 * This function is used to handle the click event on the split expenses equal tab    
 * @claaudiaale
 */
function equalExpenseTabHandler() {
    // Remove backgrond colour and text colour from other tabs, add background colour and text colour to the selected tab
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
    // Add event listener to the select payee dropdown menu to automatically add the expense total to the user who paid for the expense
    selectedPaidBy.addEventListener('change', function () { addExpenseToPaidByUser(equal = true) });

}

/**
 * This function is used to handle the click even on the split expenses by percentage tab    
 * @claaudiaale
 */
function percentageExpenseTabHandler() {
    // Remove backgrond colour and text colour from other tabs, add background colour and text colour to the selected tab
    showManualExpense.classList.remove('bg-[#4b061a]');
    showManualExpense.classList.remove('text-white');
    showEqualExpense.classList.remove('bg-[#4b061a]');
    showEqualExpense.classList.remove('text-white');
    showPercentageExpense.classList.add('bg-[#4b061a]');
    showPercentageExpense.classList.add('text-white');
    showPercentageExpense.classList.remove('hidden');
    splitExpenseEqually.classList.add('hidden');
    splitExpenseManually.classList.add('hidden');
    splitExpensePercentage.classList.remove('hidden');
    splitExpensePercentage.classList.add('flex-col');
}

/**
 * This function is used to handle the click event on the split expenses manually tab    
 * @claaudiaale
 */
function manualExpenseTabHandler() {
    // Remove backgrond colour and text colour from other tabs, add background colour and text colour to the selected tab
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
 * This function is used to handle the input event on the percentage fields
 * @balpreet787
 * */
function percentageHandler() {
    let percentageFields = document.querySelectorAll('.percentage');
    percentageFields.forEach(percentageField => {
        // Add event listener to the percentage fields to automatically calculate the amount based on the percentage
        percentageField.addEventListener('input', () => {

            let totalAmount = selectedExpenseAmount.value;
            let id = percentageField.id;
            let inputField = document.getElementById(id.replace('Percentage', 'AmountPercentage'));
            // Calculate the amount based on the percentage, round it to 2 decimal places and display it in the input field, change value of given fields and set the other fields to 0
            inputField.value = "$" + ((percentageField.value / 100) * totalAmount).toFixed(2);
            refreshfields(equal = true, percentage = false, manual = true);
        });
    });
}

/**
 * This function is used to refresh the fields of the form
 * @balpreet787
 * @param {boolean} equal - whether to refresh the equal fields
 * @param {boolean} percentage - whether to refresh the percentage fields
 * @param {boolean} manual - whether to refresh the manual fields
 */
function refreshfields(equal = false, percentage = false, manual = false) {
    // if equal is true, reset the equal fields to 0, uncheck the checkboxes
    if (equal) {
        equalFields = document.querySelectorAll('.userEqualSplit');
        equalFields.forEach(equalField => {
            equalField.checked = false;
        });
        inputValues = document.querySelectorAll('.equalValue');
        inputValues.forEach(inputValue => {
            inputValue.value = "$0.00";
        });
    }
    // if percentage is true, reset the percentage fields to 0, set the values to $0.00
    if (percentage) {
        percentageFields = document.querySelectorAll('.percentage');
        percentageFields.forEach(percentageField => {
            percentageField.value = "$0.00";
        });
        inputValues = document.querySelectorAll('.percentageValue');
        inputValues.forEach(inputValue => {
            inputValue.value = "$0.00";
        });
    }
    // if manual is true, reset the manual fields to 0, set the values to $0.00
    if (manual) {
        manualFields = document.querySelectorAll('.friendAmountManual');
        manualFields.forEach(manualField => {
            manualField.value = "";
        });
    }
}

/**
 * This function is used to handle the input event on the equal split fields
 * @balpreet787
 */
function equalHandler() {
    equalFields = document.querySelectorAll('.userEqualSplit');
    equalFields.forEach(equalField => {
        equalField.addEventListener('input', () => {
            let totalChecked = 0;
            let totalAmount = selectedExpenseAmount.value;
            let id = equalField.id;
            checkedFields = [];
            equalFields.forEach(equalField => {
                if (equalField.checked) {
                    checkedFields.push((equalField.id).replace('Equal', ''));
                    totalChecked++;
                }
            });
            inputValues = document.querySelectorAll('.equalValue');
            inputValues.forEach(inputValue => {
                // if the field is checked, set the value to the total amount divided by the number of checked fields
                if (checkedFields.includes((inputValue.id).replace('AmountEqualInput', ''))) {
                    inputValue.value = "$" + (totalAmount / totalChecked).toFixed(2);
                } else {
                    // if the field is not checked, set the value to 0
                    inputValue.value = "$0.00";
                }
            });
            // only reset the percentage and manual fields 
            refreshfields(equal = false, percentage = true, manual = true);
        });
    });
}

/**
 * This function is used to handle the input event on the manual amount fields 
 * @balpreet787
 */
function manualHandler() {
    // Add event listener to the manual fields to automatically calculate the amount based on the manual input
    manualFields = document.querySelectorAll('.friendAmountManual');
    manualFields.forEach(manualField => {
        manualField.addEventListener('input', () => {
            // only reset the equal and percentage fields
            refreshfields(equal = true, percentage = true, manual = false);
        });
    });
}

/**
 * This function is used to check the validity of the form if the expense is split equally
 * @balpreet787
 */
function checkFormValidityForEqual() {
    inputValues = document.querySelectorAll('.equalValue');
    let totalAmount = selectedExpenseAmount.value;
    let total = 0;
    inputValues.forEach(inputValue => {
        inputValue.value = parseFloat(inputValue.value.replace('$', ''));
        total += parseFloat(inputValue.value.replace('$', ''));
    });
    if (Math.round(total) != totalAmount) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * This function is used to check the validity of the form if the expense is split by percentage
 * @balpreet787
 */
function checkFormValidityForPercentage() {
    percentageFields = document.querySelectorAll('.percentageValue');
    let totalAmount = selectedExpenseAmount.value;
    let total = 0;
    percentageFields.forEach(percentageField => {
        if (percentageField.value != "") {
            total += parseFloat(percentageField.value.replace('$', ''));
        }
    });
     // after computation, check if the user's percentage input total is equal to the total expense amount
    if (total != totalAmount) {
        console.log('Total: ' + total);
        return false;
    }
    else {
        return true;
    }
}

/**
 * This function is used to check the validity of the form if the expense is split manually
 * @balpreet787
 */
function checkFormValidityForManual() {
    manualFields = document.querySelectorAll('.friendAmountManual');
    let totalAmount = selectedExpenseAmount.value;
    let total = 0;
    manualFields.forEach(manualField => {
        total += parseFloat(manualField.value);
    });
    // after computation, check if the user's input total is equal to the total expense amount
    if (total != totalAmount) {
        return false;
    }
    else {
        return true;
    }
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
 * This function is used to validate the form when the user clicks on the add expense button
 * @balpreet787
 * */
function fullFormValidation() {
    const showEqualExpense = document.getElementById('showEqualExpense');
    const showPercentageExpense = document.getElementById('showPercentageExpense');
    const showManualExpense = document.getElementById('showManualExpense');
    if (showEqualExpense.classList.contains('bg-[#4b061a]')) {
        if (!checkFormValidityForEqual()) {
            let errorMessage = 'Please pick the participants for equal split.';
            displayErrorModal(errorMessage);
            return false;
        }
        else {
            return true;
        }
    } else if (showPercentageExpense.classList.contains('bg-[#4b061a]')) {
        if (!checkFormValidityForPercentage()) {
            let errorMessage = 'Please ensure that the total percentage of the expense is 100.';
            displayErrorModal(errorMessage);
            return false;
        }
        else {
            return true;
        }
    } else if (showManualExpense.classList.contains('bg-[#4b061a]')) {
        if (!checkFormValidityForManual()) {
            let errorMessage = 'Please ensure that your manual inputs are equal to the total expense amount.';
            displayErrorModal(errorMessage);
            return false;
        }
        else {
            return true;
        }
    }
    else if (selectedExpenseAmount.value == 0) {
        let errorMessage = 'Please ensure that the expense amount is greater than 0.';
        displayErrorModal(errorMessage);
        return false;
    }
    else if (!selectedDate.value) {
        event.preventDefault();
        let errorMessage = 'Please select a date for the expense.';
        displayErrorModal(errorMessage);
        return false;
    } else if (!selectedExpenseName.value) {
        event.preventDefault();
        let errorMessage = 'Please enter a name for the expense.';
        displayErrorModal(errorMessage);
        return false;
    }
    else {
        console.log('Form validation successful');
        return true;
    }
}

/**
 * Function to handle the category selection in the add group form
 * @balpreet787
 */
function categoryHandler() {
    const categories = document.querySelectorAll("#groupCategoryChoices li");
    categories.forEach(category => {
        // add event listener to the category choices to change the category input value and the category header
        category.addEventListener("click", function () {
            categories.forEach(category => {
                // add the background colour and text colour for a selected category, remove it from the other categories
                category.classList.remove("bg-primary");
                category.classList.add("bg-secondary");
                category.classList.remove("text-secondary");
                let img = category.querySelector('img');
                let categoryId = category.id;
                img.src = `/images/addGroupIcons/${categoryId}Black.svg`;
            });
            // enable toggling of the background colour and text colour for categories
            category.classList.toggle("bg-secondary");
            category.classList.toggle("bg-primary");
            category.classList.toggle("text-secondary");
            let img = category.querySelector('img');
            let categoryId = category.id;

            if (category.classList.contains("bg-primary")) {
                categoryInput.value = categoryId
                img.src = `/images/addGroupIcons/${categoryId}White.svg`;
                if (category.textContent == "Misc.")
                    categoryHeader.textContent = "Miscellaneous"
                else
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
 * This function is used to handle the click event on the add expense button
 * @balpreet787
 */
function addExpenseHandler() {
    const form = document.getElementById('addExpenseForm');
    form.addEventListener('submit', async (event) => {
        splitType = document.getElementById('splitType');
        if (showEqualExpense.classList.contains('bg-[#4b061a]')) {
            splitType.value = "Equal";
        }
        else if (showPercentageExpense.classList.contains('bg-[#4b061a]')) {
            splitType.value = "Percentage";
        }
        else {
            splitType.value = "Manual";
        }
        if (!fullFormValidation()) {
            console.log('Form validation failed');
            event.preventDefault();
            return;
        }
    });
}

/**
 * This function is used to automatically add the expense total to the user who paid for an expense
 * @claaudiaale
 */
function addExpenseToPaidByUser() {
    let expenseTotal = parseFloat(document.getElementById('selectedExpenseAmount').value);
    let groupId = document.querySelector(".groupMenuSpan").id
    let paidByUser = groupId + document.getElementById('selectedPaidBy').value;

    if (expenseTotal > 0) {
        // set the value of the selected payee to the expense total, refresh fields for equal split and set the correct equal split checkbox to checked
        // only enable this in equal tab (doing this in the percentage or manual tab would cause more work for the user)
        refreshfields(equal = true, percentage = false, manual = false);
        document.getElementById(paidByUser + "Equal").checked = true;
        document.getElementById(paidByUser + "AmountEqualInput").value = expenseTotal.toFixed(2);
    }
}


/**
 * This function is executed when the DOM is fully loaded  
 */
document.addEventListener('DOMContentLoaded', () => {
    const showEqualExpense = document.getElementById('showEqualExpense');
    const showPercentageExpense = document.getElementById('showPercentageExpense');
    const showManualExpense = document.getElementById('showManualExpense');
    percentageHandler();
    equalHandler();
    manualHandler();
    addExpenseHandler();
    showEqualExpense.addEventListener('click', equalExpenseTabHandler);
    showPercentageExpense.addEventListener('click', percentageExpenseTabHandler);
    showManualExpense.addEventListener('click', manualExpenseTabHandler);
    closeExpenseError.addEventListener('click', function () { errorModal.close() })
    goBackFromAddExpenses();
    categoryHandler();
});

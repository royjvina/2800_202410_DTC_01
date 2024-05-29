/**
 * Event listener for DOMContentLoaded to ensure the DOM is fully loaded before executing the script.
 */
document.addEventListener('DOMContentLoaded', () => {
  const dropdownButton = document.getElementById('dropdownDefaultButton'); // Button to toggle the dropdown menu
  const dropdownMenu = document.getElementById('dropdown'); // Dropdown menu element
  const dropdownItems = dropdownMenu.getElementsByTagName('a'); // Items within the dropdown menu
  const expenseForm = document.getElementById('expenseForm'); // Expense form element
  const expenseTableBody = document.getElementById('expenseTable').querySelector('tbody'); // Table body to append new expense rows

  /**
   * Toggles the visibility of the dropdown menu when the dropdown button is clicked.
   */
  dropdownButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hidden'); // Toggle the 'hidden' class to show/hide the dropdown menu
  });

  /**
   * Adds event listeners to each dropdown item to handle selection.
   */
  for (let item of dropdownItems) {
    item.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent the default link behavior
      const selectedCategory = event.target.textContent; // Get the text content of the selected item
      dropdownButton.innerHTML = `${selectedCategory}
        <svg class="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>`; // Update the dropdown button to show the selected category
      dropdownMenu.classList.add('hidden'); // Hide the dropdown menu
    });
  }

  /**
   * Handles the form submission to add a new expense.
   * @param {Event} event - The submit event
   */
  expenseForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    const date = document.getElementById('date').value; // Get the date value from the form
    const category = dropdownButton.textContent.trim(); // Get the selected category from the dropdown button
    const amount = document.getElementById('Amount').value; // Get the amount value from the form

    if (date && category && amount) {
      const newRow = document.createElement('tr'); // Create a new table row
      newRow.innerHTML = `
        <td class="px-4 py-2 text-xs">${date}</td>
        <td class="px-4 py-2 text-xs">${category}</td>
        <td class="px-4 py-2 text-xs">${amount}</td>
      `; // Populate the new row with the date, category, and amount
      expenseTableBody.appendChild(newRow); // Append the new row to the table body

      // Clear form fields
      expenseForm.reset(); // Reset the form fields
      dropdownButton.innerHTML = `Category
        <svg class="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>`; // Reset the dropdown button text to the default
    } else {
      alert('Please fill out all fields.'); // Alert the user to fill out all fields if any are missing
    }
  });
});

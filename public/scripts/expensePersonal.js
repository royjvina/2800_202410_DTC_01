document.addEventListener('DOMContentLoaded', () => {
  const dropdownButton = document.getElementById('dropdownDefaultButton');
  const dropdownMenu = document.getElementById('dropdown');
  const dropdownItems = dropdownMenu.getElementsByTagName('a');
  const expenseForm = document.getElementById('expenseForm');
  const expenseTableBody = document.getElementById('expenseTable').querySelector('tbody');

  dropdownButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hidden');
  });

  for (let item of dropdownItems) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const selectedCategory = event.target.textContent;
      dropdownButton.innerHTML = `${selectedCategory}
        <svg class="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>`;
      dropdownMenu.classList.add('hidden');
    });
  }

  expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const category = dropdownButton.textContent.trim();
    const amount = document.getElementById('Amount').value;

    if (date && category && amount) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td class="px-4 py-2 text-xs">${date}</td>
        <td class="px-4 py-2 text-xs">${category}</td>
        
        <td class="px-4 py-2 text-xs">${amount}</td>
      `;
      expenseTableBody.appendChild(newRow);

      // Clear form fields
      expenseForm.reset();
      dropdownButton.innerHTML = `Category
        <svg class="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>`;
    } else {
      alert('Please fill out all fields.');
    }
  });
});

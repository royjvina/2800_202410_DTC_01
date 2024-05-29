/**
 * Event listener for DOMContentLoaded to ensure the DOM is fully loaded before executing the script.
 */
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('budget-form'); // Budget form element
  const addCategoryButton = document.getElementById('add-category'); // Button to add a new category
  const removeCategoryButton = document.getElementById('remove-category'); // Button to remove the last category
  const categoriesContainer = document.getElementById('categories'); // Container to hold category inputs

  let categoryCount = 4; // Initial count of categories

  /**
   * Function to add a new category input field.
   */
  const addCategory = () => {
    categoryCount++;
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'flex items-center bg-slate-300 rounded-lg px-4 py-1 mb-4 mt-3 shadow-md';
    categoryDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-filled" width="12"
        height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" stroke-width="0" fill="currentColor"/>
      </svg>
      <input type="text" name="category-label-${categoryCount}" class="ml-2 text-sm text-gray-800 bg-transparent outline-none w-24" placeholder="Category ${categoryCount}">
      <div class="flex items-center rounded-lg ml-auto px-3 py-1">
        <span class="mr-1">$</span>
        <input type="text" name="category-value-${categoryCount}" class="bg-transparent outline-none w-16" placeholder="1234.00">
      </div>
    `;
    categoriesContainer.appendChild(categoryDiv);
  };

  /**
   * Function to remove the last category input field.
   */
  const removeCategory = () => {
    if (categoryCount > 4) {
      categoriesContainer.removeChild(categoriesContainer.lastChild);
      categoryCount--;
    }
  };

  // Add event listener to the add category button
  addCategoryButton.addEventListener('click', addCategory);
  
  // Add event listener to the remove category button
  removeCategoryButton.addEventListener('click', removeCategory);

  /**
   * Event listener for form submission to save budget data.
   * @param {Event} event - The submit event
   */
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const budgetData = [];
    const categories = [];
    const labels = form.querySelectorAll('input[name^="category-label"]');
    const values = form.querySelectorAll('input[name^="category-value"]');
    labels.forEach((label, index) => {
      const categoryName = label.value.trim() || `Category ${index + 1}`;
      const categoryValue = parseFloat(values[index].value) || 0;
      categories.push(categoryName);
      budgetData.push(categoryValue);
    });

    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    alert('Budget saved!');
  });
});

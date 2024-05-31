/**
 * Fetches expenses data by time range and updates the chart.
 */
function searchByTime() {
  document.getElementById('searchIcon').style.filter = 'invert(1)'; // Invert search icon color
  const startDate = document.getElementById('startDate').value; // Get start date
  const endDate = document.getElementById('endDate').value; // Get end date


  let url = '/api/insight';
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }

  // Fetch expenses data
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => {
      updateChart(data);
    })
    .catch(error => {
      document.getElementById('donut-chart').innerHTML = '<p>Error loading chart data.</p>';
    });
}


/**
 * Updates the chart with the given expenses data on DOM load.
 */

document.addEventListener('DOMContentLoaded', async () => {

  const donutChartElement = document.getElementById('donut-chart');

  try {
    // Fetch initial expenses data
    const response = await fetch('/api/insight', {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      credentials: 'include'
    });


    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    const expenses = await response.json();

    updateChart(expenses); // Update chart with fetched expenses data

  } catch (error) {
    donutChartElement.innerHTML = '<p>Error loading chart data.</p>';
  }
});

/**
 * Updates the donut chart with expenses data.
 * @param {Array} expenses - Array of expense objects
 */

function updateChart(expenses) {
  const donutChartElement = document.getElementById('donut-chart');

  if (!Array.isArray(expenses) || expenses.length === 0) {
    donutChartElement.innerHTML = '<p>No expenses data available.</p>';
    updateRanking([]);
    return;
  }

  // Define categories and colors
  const categories = ['home', 'food', 'travel', 'business', 'miscellaneous', 'recreation'];
  const categoryColors = {
    'home': '#1C64F2',
    'food': '#16BDCA',
    'travel': '#E74694',
    'business': '#6C5DD3',
    'miscellaneous': '#FDBA8C',
    'recreation': '#F9A8D4'
  };

  const categoryMap = {};

  // Map expenses to categories

  expenses.forEach(expense => {
    if (categories.includes(expense.category)) {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category].totalCost += expense.totalCost;
        categoryMap[expense.category].details = categoryMap[expense.category].details.concat(expense.details);
      } else {
        categoryMap[expense.category] = { totalCost: expense.totalCost, details: expense.details };
      }
    }
  });

  const series = [];
  const labels = [];
  const colors = [];

  // populate series, labels, and colors
  for (const category in categoryMap) {
    if (categoryMap[category].totalCost > 0) {
      series.push(categoryMap[category].totalCost);
      labels.push(category);
      colors.push(categoryColors[category]);
    }
  }

  if (series.length === 0) {
    donutChartElement.innerHTML = '<p>No expenses data available.</p>';
    updateRanking([]);
    return;
  }



  // Define chart options
  const chartOptions = {
    series: series,
    chart: {
      type: 'donut',
      height: 390,
    },
    labels: labels,
    colors: colors,
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label: "Total Spent",
              formatter: function () {
                const total = series.reduce((a, b) => a + b, 0);
                return '$' + total.toFixed(2);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
    }
  };

  // Render chart
  const chart = new ApexCharts(donutChartElement, chartOptions);
  chart.render();
  updateRanking(categoryMap);
}

/**
 * Updates the ranking of categories based on the expenses data.
 * @param {Object} categoryMap - Object mapping categories to their total costs
 */
function updateRanking(categoryMap) {
  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1].totalCost - a[1].totalCost);
  const topThree = sortedCategories.slice(0, 3);

  topThree.forEach((item, index) => {
    const rankElement = document.getElementById(`rank-${index + 1}`);
    if (rankElement) {
      rankElement.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex-1">
          <span class="font-bold text-lg">${index + 1}.</span> ${item[0][0].toUpperCase() + item[0].slice(1)} - $${item[1].totalCost.toFixed(2)}
        </div>
        <span  ><img class="downArrow w-5 h-3" id="arrowrank-${index + 1}" src="images/otherIcons/downArrowSettings.svg" alt></span>
      </div>
    `;
      rankElement.classList.add('text-sm', 'text-gray-700', 'shadow-lg', 'p-3', 'rounded-md', 'border-l-4', 'hover:bg-gray-100', 'transition', 'duration-300');
      rankElement.dataset.category = item[0]; // Store category name in data attribute
      rankElement.dataset.details = JSON.stringify(item[1].details); // Store details in data attribute
      rankElement.onclick = toggleDisplayExpenses; // Add click event listener
    }
  });

  for (let i = topThree.length; i < 3; i++) {
    const rankElement = document.getElementById(`rank-${i + 1}`);
    if (rankElement) {
      rankElement.textContent = `${i + 1}. Not defined yet`;
      rankElement.dataset.category = '';
      rankElement.onclick = null;
    }
  }

  if (topThree.length > 0) {
    document.getElementById('most-spent-category').textContent = topThree[0][0];
  } else {
    document.getElementById('most-spent-category').textContent = 'Not defined yet';
  }
}

function toggleDisplayExpenses(event) {
  const rankElement = event.currentTarget;
  const category = rankElement.dataset.category;
  const details = JSON.parse(rankElement.dataset.details);


  let expenseDetailsElement = rankElement.querySelector('.expense-details');

  if (!expenseDetailsElement) {
    expenseDetailsElement = document.createElement('div');
    expenseDetailsElement.classList.add('expense-details');
    rankElement.appendChild(expenseDetailsElement);
    rankElement.parentElement.querySelector('.downArrow').style.transform = 'rotate(180deg)';
  }

  if (expenseDetailsElement.classList.contains('show')) {
    expenseDetailsElement.classList.remove('show');
    rankElement.parentElement.querySelector('.downArrow').style.transform = 'rotate(0deg)';
    expenseDetailsElement.innerHTML = '';
  } else {
    expenseDetailsElement.classList.add('show');
    expenseDetailsElement.innerHTML = `<h3 class="mt-2 mb-2 underline font-semibold">Transactions:</h3>`;

    if (!details || details.length === 0) {
      expenseDetailsElement.innerHTML += '<p class="text-gray-600">No expenses found for this category.</p>';
      return;
    }

    // Sort details by date
    details.sort((a, b) => new Date(a.date) - new Date(b.date));

    details.forEach(expense => {
      const expenseElement = document.createElement('div');
      expenseElement.classList.add('expense-item', 'flex', 'items-center', 'py-2', 'border-b', 'border-gray-200');

      expenseElement.innerHTML = `
    <span class="date text-gray-600 w-1/4 text-xs">${new Date(expense.date).toLocaleDateString()}</span>
    <span class="name text-gray-800 w-1/2 text-xs">${expense.name}</span>
    <span class="cost text-red-600 w-1/4 text-">$${expense.total_cost.toFixed(2)}</span>
  `;

      expenseDetailsElement.appendChild(expenseElement);
    });
  }
}
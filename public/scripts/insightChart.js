function searchByTime() {
  document.getElementById('searchIcon').style.filter = 'invert(1)';
}


document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');

  var donutChartElement = document.getElementById('donut-chart');
  console.log('Donut Chart Element:', donutChartElement);

  if (!donutChartElement) {
    console.error('Donut chart element not found');
    return;
  }

  if (typeof ApexCharts === 'undefined') {
    console.error('ApexCharts is not defined');
    return;
  }

  try {
    const response = await fetch('/api/insight', {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      credentials: 'include'
    });

    console.log('Fetch response:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    const expenses = await response.json();
    console.log('Fetched expenses:', expenses);

    if (!Array.isArray(expenses) || expenses.length === 0) {
      console.log('No expenses found');
      donutChartElement.innerHTML = '<p>No expenses data available.</p>';
      return;
    }

    const categories = ['home', 'food', 'travel', 'entertainment', 'miscellaneous', 'recreation'];
    const categoryColors = {
      'home': '#1C64F2',
      'food': '#16BDCA',
      'travel': '#E74694',
      'entertainment': '#6C5DD3',
      'miscellaneous': '#FDBA8C',
      'recreation': '#F9A8D4'
    };
    const categoryMap = {};

    expenses.forEach(expense => {
      if (categories.includes(expense.category)) {
        categoryMap[expense.category] = expense.totalCost;
      }
    });

    const series = [];
    const labels = [];
    const colors = [];

    for (const category in categoryMap) {
      if (categoryMap[category] > 0) {
        series.push(categoryMap[category]);
        labels.push(category);
        colors.push(categoryColors[category]);
      }
    }

    if (series.length === 0) {
      donutChartElement.innerHTML = '<p>No expenses data available.</p>';
      return;
    }

    console.log('Series:', series);
    console.log('Labels:', labels);
    console.log('Colors:', colors);


    const chartOptions = {
      series: series,
      chart: {
        type: 'donut',
        height: 350
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
                label: "You've spent",
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
        position: 'bottom'
      }
    };




    const chart = new ApexCharts(donutChartElement, chartOptions);
    await chart.render();
    console.log('Chart rendered successfully');

    // Ranking 
    const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const topThree = sortedCategories.slice(0, 3);

    topThree.forEach((item, index) => {
      const rankElement = document.getElementById(`rank-${index + 1}`);
      if (rankElement) {
        rankElement.textContent = `${index + 1}. ${item[0]} - $${item[1].toFixed(2)}`;
      }
    });
    if (topThree.length > 0) {
      document.getElementById('most-spent-category').textContent = topThree[0][0];
    }


  } catch (error) {
    console.error('Error fetching or rendering chart:', error);
    donutChartElement.innerHTML = '<p>Error loading chart data.</p>';
  }
});

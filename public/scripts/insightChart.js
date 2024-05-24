console.log('insightChart.js loaded');

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
    const categoryMap = {};

    expenses.forEach(expense => {
      if (categories.includes(expense.category)) {
        categoryMap[expense.category] = expense.totalCost;
      }
    });

    const series = Object.values(categoryMap).filter(totalCost => totalCost > 0);
    const labels = Object.keys(categoryMap).filter(category => categoryMap[category] > 0);

    if (series.length === 0) {
      donutChartElement.innerHTML = '<p>No expenses data available.</p>';
      return;
    }

    console.log('Series:', series);
    console.log('Labels:', labels);

    const chartOptions = {
      series: series,
      chart: {
        type: 'donut',
        height: 350
      },
      labels: labels,
      colors: ['#ea5545', '#b33dc6', '#ef9b20', '#ede15b', '#87bc45', '#27aeef'],
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
  } catch (error) {
    console.error('Error fetching or rendering chart:', error);
    donutChartElement.innerHTML = '<p>Error loading chart data.</p>';
  }
});

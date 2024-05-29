/**
 * Event listener for DOMContentLoaded to ensure the DOM is fully loaded before executing the script.
 */
document.addEventListener('DOMContentLoaded', function () {
  const defaultCategories = ['grocery', 'travel', 'rent', 'tuition'];
  const defaultBudgetData = [200, 150, 300, 250];
  const spendingData = [95, 30, 150, 120];

  const budgetData = JSON.parse(localStorage.getItem('budgetData')) || defaultBudgetData;
  const categories = JSON.parse(localStorage.getItem('categories')) || defaultCategories;

  /**
   * Returns the chart options for the donut chart.
   * @returns {Object} Chart options object
   */
  const getChartOptions = () => {
    return {
      series: spendingData,
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694", "#6C5DD3, #F9A8D4"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "You've spent",
                fontFamily: "Inter, sans-serif",
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                  return '$' + sum + 'k';
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                  return value + "k";
                },
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: categories,
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "k";
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value + "k";
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };

  if (document.getElementById("donut-chart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions());
    chart.render();
  }

  /**
   * Updates the bar chart with budget and spending data.
   * @param {Array} budgetData - Array of budget amounts for each category
   * @param {Array} spendingData - Array of spending amounts for each category
   */
  const updateBarChart = (budgetData, spendingData) => {
    const barChart = document.getElementById('bar-chart');
    barChart.innerHTML = '';

    categories.forEach((category, index) => {
      const budget = budgetData[index];
      const spent = spendingData[index];
      const percentage = (spent / budget) * 100;

      const barContainer = document.createElement('div');
      barContainer.className = 'px-3 pb-4';

      const barInfo = document.createElement('div');
      barInfo.className = 'flex mb-1 justify-between items-center';

      const barCategory = document.createElement('span');
      barCategory.className = 'font-medium text-blue-700 text-sm';
      barCategory.textContent = category;

      const barPercentage = document.createElement('span');
      barPercentage.className = 'text-xs items-center font-medium text-blue-700';
      barPercentage.textContent = `${percentage.toFixed(1)}%`;

      const barBackground = document.createElement('div');
      barBackground.className = 'w-full bg-gray-200 rounded-full h-2.5';

      const barFill = document.createElement('div');
      barFill.className = 'bg-blue-600 h-2.5 rounded-full';
      barFill.style.width = `${percentage}%`;

      const budgetInfo = document.createElement('div');
      budgetInfo.className = 'text-xs text-gray-500 mt-2 flex';
      budgetInfo.textContent = `Spent: $${spent} | Budget: $${budget}`;

      barInfo.appendChild(barCategory);
      barInfo.appendChild(barPercentage);

      barBackground.appendChild(barFill);
      barContainer.appendChild(barInfo);
      barContainer.appendChild(barBackground);
      barContainer.appendChild(budgetInfo);

      barChart.appendChild(barContainer);
    });
  };

  updateBarChart(budgetData, spendingData);
});
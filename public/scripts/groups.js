document.addEventListener("DOMContentLoaded", function() {
    /**
     * This script is used to handle homepage javascript functionalities
     */


    /**
     * This function is used to handle the click event on the balances tab    
     * @claaudiaale
     */

    function expensesTabHandler() {
        showBalances.classList.remove('bg-[#4b061a]');
        showBalances.classList.remove('text-white');
        showExpenses.classList.add('bg-[#4b061a]');
        showExpenses.classList.add('text-white');
        balances.classList.add('hidden');
        expenses.classList.remove('hidden');
        expenses.classList.add('flex');
    }

    /**
     * This function is used to handle the click event on the balances tab    
     * @claaudiaale
     */

    function balancesTabHandler() {
        showExpenses.classList.remove('bg-[#4b061a]');
        showExpenses.classList.remove('text-white');
        showBalances.classList.add('bg-[#4b061a]');
        showBalances.classList.add('text-white');
        expenses.classList.add('hidden');
        balances.classList.remove('hidden');
        balances.classList.add('flex');
    }

    /**
     * This function is used to handle the click event on the users list  
     * @claaudiaale
     */

    function userListHandler() {
        let lessUsers = document.getElementById('moreThanThreeUsers')
        let allUsers = document.getElementById('allUsers')
        let moreUsers = document.querySelectorAll('.moreUsers')

        moreUsers.forEach(user => {
            user.addEventListener('click', function() {
                if (lessUsers.classList.contains('hidden')) {
                    lessUsers.classList.remove('hidden');
                    lessUsers.classList.add('flex');
                    allUsers.classList.add('hidden');
                } else {
                    lessUsers.classList.add('hidden');
                    allUsers.classList.remove('hidden');
                    allUsers.classList.add('flex');
                }
            })
        })
    }

    showExpenses.addEventListener('click', expensesTabHandler);
    showBalances.addEventListener('click', balancesTabHandler);
    userListHandler();
    const balances = document.getElementById('balances');
    const friendDebt = JSON.parse(balances.dataset.friendDebt);

    const debtData = Object.values(friendDebt).map(friend => ({
        x: friend.name,
        y: friend.amount,
        color: friend.amount >= 0 ? '#00E396' : '#FF4560'
    }));

    console.log(debtData);

    // chart API for balances
    const data = debtData.sort((a, b) => a.y - b.y);

    var options = {
        chart: {
            type: 'bar',
            height: 400,
            toolbar: {
                show: false
            },
            style: {
                marginLeft: 50,
                marginRight: 50,
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                borderRadiusApplication: 'end',
                horizontal: true,
                barHeight: '50%',
                distributed: true,
                dataLabels: {
                    position: 'bottom'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return val < 0 ? `-$${Math.abs(val).toFixed(2)}` : `$${val.toFixed(2)}`;
            },
            offsetX: -105,
            style: {
                fontSize: '14px',
                colors: ['#000'],
                fontWeight: 'medium'
            }
        },
        stroke: {
            show: false,
        },
        series: [{
            name: '',
            data: data.map(item => ({
                x: item.x,
                y: item.y,
                fillColor: item.color
            }))
        }],
        xaxis: {
            categories: data.map(item => item.x),
            labels: {
                show: false,
                formatter: function(val) {
                    return `$${Math.abs(val)}`;
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            title: {
                text: undefined
            },
            labels: {
                style: {
                    colors: ['#000'],
                    fontWeight: 'bold',
                    fontSize: '14px'
                }
            }
        },
        fill: {
            type: 'solid',
            colors: data.map(item => item.color),
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val < 0 ? `-$${Math.abs(val)}` : `$${val}`;
                }
            }
        },
        grid: {
            borderColor: '#f1f1f1',
            xaxis: {
                lines: {
                    show: false
                }
            }
        },
        legend: {
            show: false
        },
    };

    var chart = new ApexCharts(document.querySelector("#balances"), options);
    chart.render();
});
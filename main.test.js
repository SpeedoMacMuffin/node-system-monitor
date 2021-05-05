const Chart = require('chart.js')

it('renders correctly', () => {
    const el = document.createElement('canvas')
    let myChart = new Chart(el, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [{
                label: 'CPU Usage in %',
                data: [100, 50, 75, 25, 33, 66, 20, 40, 60, 80],
            }]
        },
        options: {
            responsive: true,
            animation: false,
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100,
                    }
                }]

            }
        }
    })
    expect(myChart).toMatchSnapshot();
});
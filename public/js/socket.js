// SOCKET IO
const socket = io();

// default label values for charts
const array_range = (start, len) => {
    const arr = new Array(len);
    for (let i = 0; i < len; i++, start++) {
        arr[i] = start;
    }
    return arr;
};

// HTML-elements for cpu- & ram-usage updates
const labelCpu = document.querySelector('.cpu-label');
const progCpu = document.querySelector('.cpu-bar');
const labelRam = document.querySelector('.ram-label');
const progRam = document.querySelector('.ram-bar');

// Default chart-data for cpu & ram on load
let cpuAvgData = new Array(61).fill(0);
let ramData = new Array(61).fill(0);

// update cpu-values and create/update chart
socket.on('cpuUsage', cpu => {
    // Set average cpu-load
    let cpuLoad = cpu;

    // Set cpu label
    labelCpu.innerHTML = `<span>CPU used: ${cpuLoad.toFixed(2)} %</span>`;
    // Set cpu bar
    progCpu.value = cpuLoad;

    // adds new value at the end & deletes first element from cpuAvgData-array

    cpuAvgData.push(cpuLoad);
    if (cpuAvgData.length > 61) {
        cpuAvgData.shift();
    }

    const cpuChart = document.getElementById('cpuChart').getContext('2d');
    new Chart(cpuChart, {
        type: 'line',
        data: {
            labels: array_range(0, 61),
            datasets: [{
                label: 'CPU Usage in %',
                data: cpuAvgData,
                borderColor: 'chartreuse',
                borderWidth: '1',
                radius: '1',
            }, ],
        },
        options: {
            events: [],
            responsive: true,
            animation: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100,
                    },
                }, ],
            },
        },
    });
});

// update ram-values and create/update Chart
socket.on('ramUsage', ram => {
    // Set ram label
    const ramUsed = ((ram.used / ram.total) * 100).toFixed(2);

    labelRam.innerHTML = `<span>RAM used: ${ramUsed} % </span>`;
    // Set Ram bar
    progRam.value = ramUsed;
    // adds new value at the end & deletes first element from ramData-array
    ramData.push(ramUsed);
    if (ramData.length > 61) {
        ramData.shift();
    }

    const ramChart = document.getElementById('ramChart').getContext('2d');
    new Chart(ramChart, {
        type: 'line',
        data: {
            labels: array_range(0, 61),
            datasets: [{
                label: 'RAM Usage in %',
                data: ramData,
                borderColor: 'chartreuse',
                borderWidth: '1',
                radius: '1',
            }, ],
        },
        options: {
            events: [],
            responsive: true,
            animation: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100,
                    },
                }, ],
            },
        },
    });
});
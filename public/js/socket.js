// SOCKET IO
const socket = io();

// default label for charts (0 - 60)
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
let cpuData = new Array(61).fill(0);
let ramData = new Array(61).fill(0);

// update cpu-values and create/update Chart
socket.on('cpuUsage', cpu => {
    // Set cpu label
    labelCpu.innerHTML = `<span>CPU used: ${cpu} %</span>`;
    // Set cpu bar
    progCpu.value = cpu;

    // adds new value at the end & deletes first element from cpuData-array
    cpuData.push(cpu);
    if (cpuData.length > 61) {
        cpuData.shift();
    }

    const cpuChart = document.getElementById('cpuChart').getContext('2d');
    let myCpuChart = new Chart(cpuChart, {
        type: 'line',
        data: {
            labels: array_range(0, 61),
            datasets: [{
                label: 'CPU Usage in %',
                data: cpuData,
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
socket.on('ramUsage', info => {
    // Set ram label
    usedMemRel = (100 - info.freeMemPercentage).toFixed(2);
    labelRam.innerHTML = `<span>RAM used: ${usedMemRel} % </span>`;
    // Set Ram bar
    progRam.value = usedMemRel;
    // adds new value at the end & deletes first element from ramData-array
    ramData.push(usedMemRel);
    if (ramData.length > 61) {
        ramData.shift();
    }

    const ramChart = document.getElementById('ramChart').getContext('2d');
    let myRamChart = new Chart(ramChart, {
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
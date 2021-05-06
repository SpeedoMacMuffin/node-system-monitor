const brand = document.querySelector('.brand');
const speed = document.querySelector('.speed');
const cores = document.querySelector('.cores');
const labelCpu = document.querySelector('.cpu-label');
const progCpu = document.querySelector('.cpu-bar');

let cpuData = new Array(61).fill(0);

// CPU Information
socket.on('cpuInfo', cpuInfo => {
    brand.innerHTML = `<span>Brand: ${cpuInfo.manufacturer} ${cpuInfo.brand}</span>`;
    speed.innerHTML = `<span>Speed: ${cpuInfo.speed} GHz</span>`;
    cores.innerHTML = `<span>Cores: ${cpuInfo.cores}</span>`;
});

// ON CPU USAGE EVENT
socket.on('cpuUsage', cpu => {
    // Set cpu label
    labelCpu.innerHTML = `<span>CPU used: ${cpu} %</span>`;
    // Set cpu bar
    progCpu.value = cpu;

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
            responsive: false,
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
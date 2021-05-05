// SOCKET IO
const socket = io();

// SELECT ELEMENTS
const labelRam = document.querySelector('.ram-label');
const progRam = document.querySelector('.ram-bar');
const labelCpu = document.querySelector('.cpu-label');
const progCpu = document.querySelector('.cpu-bar');
const labelDrive = document.querySelector('.drive-label');
const progDrive = document.querySelector('.drive-bar')
const user = document.querySelector('.user');
const os = document.querySelector('.os');
const hostname = document.querySelector('.host');
const platform = document.querySelector('.platform');
const model = document.querySelector('.sysmod');
const brand = document.querySelector('.brand');
const speed = document.querySelector('.speed');
const cores = document.querySelector('.cores');
const ramtotal = document.querySelector('.ramtotal');
const drivetotal = document.querySelector('.drivetotal');
const driveused = document.querySelector('.driveused');
const drivefree = document.querySelector('.drivefree');


let ramData = new Array(61).fill(0);
let cpuData = new Array(61).fill(0);
const array_range = (start, len) => {
    const arr = new Array(len);
    for (let i = 0; i < len; i++, start++) {
        arr[i] = start;
    }
    return arr;
}

// ON CONNECT EVENT
socket.on('connect', () => {
    console.log('Connected');
});
// ON RAM USAGE EVENT
socket.on('ramUsage', (info) => {
    // Set ram label
    usedMemRel = (100 - info.freeMemPercentage).toFixed(2)
    labelRam.innerHTML = `<span>RAM used: ${usedMemRel} % </span>`;
    // Set Ram bar
    progRam.value = usedMemRel;

    // Set Ram Graph and Values
    ramData.push(usedMemRel)
    if (ramData.length > 61) {
        ramData.shift()

    }
    const ramChart = document.getElementById('ramChart').getContext('2d');
    let myRamChart = new Chart(ramChart, {
        type: 'line',
        data: {
            labels: array_range(0, 61),
            datasets: [{
                label: 'RAM Usage in %',
                data: ramData,
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

});

// ON CPU USAGE EVENT
socket.on('cpuUsage', (cpu) => {
        // Set cpu label
        labelCpu.innerHTML = `<span>CPU used: ${cpu} %</span>`
            // Set cpu bar
        progCpu.value = cpu;

        cpuData.push(cpu)
        if (cpuData.length > 61) {
            cpuData.shift()

        }
        console.log(cpu.cores)
        const cpuChart = document.getElementById('cpuChart').getContext('2d')
        let myCpuChart = new Chart(cpuChart, {
            type: 'line',
            data: {
                labels: array_range(0, 61),
                datasets: [{
                    label: 'CPU Usage in %',
                    data: cpuData,
                    borderColor: 'white'
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
    })
    //Operating System Information
socket.on('osInfo', ({ osInfo, username }) => {

    platform.innerHTML = `<span>Platform: ${osInfo.platform}</span>`;
    os.innerHTML = `<span>OS: ${osInfo.distro}</span>`
    user.innerHTML = `<span>User: ${username}</span>`;
    hostname.innerHTML = `<span> Hostname: ${osInfo.hostname}</span>`
})

socket.on('sysInfo', (sysData) => {
    model.innerHTML = `<span>Model: ${sysData.model}</span>`
})

// CPU Information
socket.on('cpuInfo', (cpuInfo) => {
    brand.innerHTML = `<span>Brand: ${cpuInfo.manufacturer} ${cpuInfo.brand}</span>`
    speed.innerHTML = `<span>Speed: ${cpuInfo.speed} GHz</span>`
    cores.innerHTML = `<span>Cores: ${cpuInfo.cores}</span>`
})

// RAM Information
socket.on('ramInfo', (ramInfo) => {
    const total = (ramInfo.total / Math.pow(1024, 3)).toFixed(2)
    ramtotal.innerHTML = `<span>Total: ${total} Gb</span>`

})

// Drive Information
socket.on('driveInfo', (driveInfo) => {
    driveUsedRel = (driveInfo.usedGb * 100 / Math.round(driveInfo.totalGb)).toFixed(0);
    labelDrive.innerHTML = `<span>Drive used: ${driveInfo.usedPercentage} %</span>`;
    progDrive.value = driveInfo.usedPercentage;
    drivetotal.innerHTML = `<span>Total: ${driveInfo.totalGb} Gb</span>`;
    driveused.innerHTML = `<span>Used: ${driveInfo.usedGb} Gb</span>`;
    drivefree.innerHTML = `<span>Free: ${driveInfo.freeGb} Gb</span>`;
})
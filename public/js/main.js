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
const drivefree = document.querySelector('.drivefree')

// ON CONNECT EVENT
socket.on('connect', () => {
    console.log('Connected');
});
// ON RAM USAGE EVENT
socket.on('ram-usage', ({ ram, cpu }) => {
    // Set ram label
    labelRam.innerHTML = `<span>RAM used: ${ram} % </span>`;
    // Set Ram bar
    progRam.value = ram;
    // Set cpu label
    labelCpu.innerHTML = `<span>CPU used: ${cpu} %</span>`
        // Set cpu bar
    progCpu.value = cpu;
    // Set disk label
    // labelDisk.innerHTML = `<span>Disk ${drive.total} %`
    // Set disk bar
});

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

socket.on('cpuInfo', (cpuInfo) => {
    brand.innerHTML = `<span>Brand: ${cpuInfo.manufacturer} ${cpuInfo.brand}</span>`
    speed.innerHTML = `<span>Speed: ${cpuInfo.speed} GHz</span>`
    cores.innerHTML = `<span>Cores: ${cpuInfo.cores}</span>`
})

socket.on('ramInfo', (ramInfo) => {
    const total = Math.round(ramInfo.total / Math.pow(1024, 3)).toFixed(2)
    ramtotal.innerHTML = `<span>Total: ${total} Gb</span>`
})

socket.on('driveInfo', (driveInfo) => {
    driveUsedRel = (driveInfo.usedGb * 100 / Math.round(driveInfo.totalGb)).toFixed(0);
    labelDrive.innerHTML = `<span>Drive used: ${driveInfo.usedPercentage} %</span>`;
    progDrive.value = driveInfo.usedPercentage;
    drivetotal.innerHTML = `<span>Total: ${driveInfo.totalGb} Gb</span>`;
    driveused.innerHTML = `<span>Used: ${driveInfo.usedGb} Gb</span>`;
    drivefree.innerHTML = `<span>Free: ${driveInfo.freeGb} Gb</span>`;
})
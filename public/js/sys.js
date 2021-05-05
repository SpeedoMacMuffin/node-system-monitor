const user = document.querySelector('.user');
const os = document.querySelector('.os');
const hostname = document.querySelector('.host');
const platform = document.querySelector('.platform');
const model = document.querySelector('.sysmod');

//General System Information
socket.on('osInfo', ({ osInfo, username }) => {
    platform.innerHTML = `<span>Platform: ${osInfo.platform}</span>`;
    os.innerHTML = `<span>OS: ${osInfo.distro}</span>`;
    user.innerHTML = `<span>User: ${username}</span>`;
    hostname.innerHTML = `<span> Hostname: ${osInfo.hostname}</span>`;
});

socket.on('sysInfo', sysData => {
    model.innerHTML = `<span>Model: ${sysData.model}</span>`;
});

module.exports = sys;
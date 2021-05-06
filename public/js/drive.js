const drivetotal = document.querySelector('.drivetotal');
const driveused = document.querySelector('.driveused');
const drivefree = document.querySelector('.drivefree');
const labelDrive = document.querySelector('.drive-label');
const progDrive = document.querySelector('.drive-bar');

// Drive Information
socket.on('driveInfo', driveInfo => {
    driveUsedRel = (
        (driveInfo.usedGb * 100) /
        Math.round(driveInfo.totalGb)
    ).toFixed(0);
    labelDrive.innerHTML = `<span>Drive used: ${driveInfo.usedPercentage} %</span>`;
    progDrive.value = driveInfo.usedPercentage;
    drivetotal.innerHTML = `<span>Total: ${driveInfo.totalGb} Gb</span>`;
    driveused.innerHTML = `<span>Used: ${driveInfo.usedGb} Gb</span>`;
    drivefree.innerHTML = `<span>Free: ${driveInfo.freeGb} Gb</span>`;
});
const si = require('systeminformation');

// Byte to GigaByte conversion
const byteToGigabyte = bytes => {
    return (bytes / 1073741824).toFixed(2);
};

// get User Information (username)
const getUser = async() => {
    try {
        const users = await si.users();
        return users[0].user;
    } catch (e) {
        console.error(e);
    }
};

// get Drive Information (total, used, available, use(in %))
const getDrives = async() => {
    try {
        const drives = await si.fsSize();
        return drives.map(drive => {
            return {
                total: byteToGigabyte(drive.size),
                used: byteToGigabyte(drive.used),
                available: byteToGigabyte(drive.available),
                use: drive.use,
            };
        });
    } catch (e) {
        console.error(e);
    }
};

// get Cpu Information (Processor, Speed, Cores)
const getCpu = async() => {
    try {
        return await si.cpu();
    } catch (e) {
        console.error(e);
    }
};

// get Ram Information (total, used(incl. buffers/cache))
const getRam = async() => {
    try {
        const ram = await si.mem();
        return {
            total: byteToGigabyte(ram.total),
            used: byteToGigabyte(ram.used),
        };
    } catch (e) {
        console.error(e);
    }
};

// get OS Information (platform, distro, release, hostname)
const getOsInfo = async() => {
    try {
        return await si.osInfo();
    } catch (e) {
        console.error(e);
    }
};

// get System Information (model)
const getSysInfo = async() => {
    try {
        return await si.system();
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    byteToGigabyte,
    getUser,
    getDrives,
    getCpu,
    getRam,
    getOsInfo,
    getSysInfo,
};
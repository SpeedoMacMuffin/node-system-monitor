const http = require('http');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);
const si = require('systeminformation');
const osUtils = require('node-os-utils');
const systemInfo = require('./src/systemInfo');

// View Engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Route
app.get('/', async(__, res) => {
    res.render('index.ejs', {
        username: await systemInfo.getUser(),
        drives: await systemInfo.getDrives(),
        cpu: await systemInfo.getCpu(),
        ram: await systemInfo.getRam(),
        osInfo: await systemInfo.getOsInfo(),
        sysInfo: await systemInfo.getSysInfo(),
    });
});

// SOCKET IO for dynamic value updates (cpu- & ram-usage)
io.on('connection', async socket => {
    console.log(`${socket.id} connected`);
    // Refresh monitor after 1s - send updated stats
    setInterval(() => {
        // RAM usage in %
        const ramUsage = async() => {
            try {
                const ram = await si.mem();
                socket.emit('ramUsage', {
                    used: systemInfo.byteToGigabyte(ram.used),
                    total: systemInfo.byteToGigabyte(ram.total),
                });
            } catch (e) {
                console.error(e);
            }
        };
        ramUsage();
        // CPU usage in %
        const cpuUsage = async() => {
            try {
                const cpu = await si.currentLoad();
                socket.emit('cpuUsage', cpu.currentLoad);
            } catch (e) {
                console.error(e);
            }
        };
        //cpuUsage(); // module returns random 'null'-values, added node-os-utils cpu.usage instead to run stable
        osUtils.cpu.usage().then(cpu => {
            socket.emit('cpuUsage', cpu);
        });
    }, 1000);
});

// Run the server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const http = require('http');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const osUtils = require('node-os-utils');
const os = require('os');
const io = require('socket.io')(httpServer);
const si = require('systeminformation');
const Chart = require('chart.js')

// View Engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Route
app.get('/', (__, res) => {
    res.render('index.ejs');
});

// CPU
const cpu = osUtils.cpu;

// RAM
const mem = osUtils.mem.info();

// USER and OS
const username = os.userInfo([{ encoding: 'buffer' }]).username;



// SOCKET IO
io.on('connection', socket => {
    console.log(`${socket.id} connected`);
    // Refresh monitor after 1s - send updated stats
    setInterval(() => {
        // RAM used (total - free)
        let ramUsed = Math.round(os.totalmem()) - Math.round(os.freemem());
        // RAM usage in %
        let ram = osUtils.mem.info()
        osUtils.mem.info()
            .then(info => socket.emit('ramUsage', info))
            // .catch(error => console.error(error))
            // CPU usage in %
        cpu.usage()
            .then(cpu => socket.emit('cpuUsage', cpu))
            // .catch(error => console.error(error))
    }, 1000);

    // Emit OS information
    si.osInfo()
        .then(osInfo => socket.emit('osInfo', { osInfo, username }))
        .catch(error => console.error(error))

    // Emit System information
    si.system()
        .then(sysData => socket.emit('sysInfo', sysData))
        .catch(error => console.error(error));

    // Emit CPU information
    si.cpu()
        .then(cpuInfo => socket.emit('cpuInfo', cpuInfo))
        .catch(error => console.error(error));

    // Emit RAM information
    si.mem()
        .then(ramInfo => socket.emit('ramInfo', ramInfo))
        .catch(error => console.error(error))

    // Emit Drive information
    osUtils.drive.info()
        .then(driveInfo => socket.emit('driveInfo', driveInfo))
        .catch(error => console.error(error))
});

// Run the server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
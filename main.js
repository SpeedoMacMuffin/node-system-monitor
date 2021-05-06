const http = require('http');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const osUtils = require('node-os-utils');
const os = require('os');
const io = require('socket.io')(httpServer);
const si = require('systeminformation');

// View Engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// initiating variables for static information

// username
const username = os.userInfo([{ encoding: 'buffer' }]).username;

// drive information
let drive = osUtils.drive.info().then(data => {
    drive = data;
});

// cpu information
let cpu = si
    .cpu()
    .then(data => {
        cpu = data;
    })
    .catch(error => console.error(error));

// ram information
let ram = si
    .mem()
    .then(data => {
        ram = (data.total / Math.pow(1024, 3)).toFixed(2); //converts initial value from Bytes to GigaBytes
    })
    .catch(error => console.error(error));

// operating system information
let osInfo = si
    .osInfo()
    .then(data => {
        osInfo = data;
    })
    .catch(error => console.error(error));

// system information
let sysInfo = si
    .system()
    .then(data => {
        sysInfo = data;
    })
    .catch(error => console.error(error));

// Route
app.get('/', (__, res) => {
    res.render('index.ejs', {
        username,
        drive,
        cpu,
        ram,
        osInfo,
        sysInfo,
    });
});

// SOCKET IO for dynamic value updates (cpu- & ram-usage)
io.on('connection', socket => {
    console.log(`${socket.id} connected`);
    // Refresh monitor after 1s - send updated stats
    setInterval(() => {
        // RAM used (total - free)
        let ramUsed = Math.round(os.totalmem()) - Math.round(os.freemem());
        // RAM usage in %
        osUtils.mem
            .info()
            .then(info => socket.emit('ramUsage', info))
            .catch(error => console.error(error));
        // CPU usage in %
        osUtils.cpu
            .usage()
            .then(cpu => socket.emit('cpuUsage', cpu))
            .catch(error => console.error(error));
    }, 1000);
});

// Run the server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
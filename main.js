const http = require('http');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const osUtils = require('node-os-utils');
const os = require('os');
const io = require('socket.io')(httpServer);

// View Engine

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Route

app.get('/', (req, res) => {
    res.render('index.ejs');
});

// CPU

const cpu = osUtils.cpu;

// USER and OS

const username = os.userInfo([{ encoding: 'buffer' }]).username;
const osInfo = osUtils.os.type().toUpperCase();
const osVer = os.version();
const cpuType = cpu.model();
const host = os.hostname();
const netSpeed = osUtils.netstat.stats();
const drive = osUtils.drive.free()
console.log(os.cpus()[0].speed)

// SOCKET IO

io.on('connection', socket => {
    console.log(`${socket.id} connected`);
    // Refresh monitor after 1s - send updated stats
    setInterval(() => {
        // RAM used (total - free)
        let ramUsed = Math.round(os.totalmem()) - Math.round(os.freemem());
        // RAM usage in %
        let ram = (ramUsed * 100 / Math.round(os.totalmem())).toFixed(0);
        // CPU usage in %
        cpu.usage().then(cpu => socket.emit('ram-usage', { ram, cpu, username, osInfo, cpuType, host, netSpeed, drive }))
    }, 1000);
});

// Run the server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
const ramtotal = document.querySelector('.ramtotal');
const labelRam = document.querySelector('.ram-label');
const progRam = document.querySelector('.ram-bar');

let ramData = new Array(61).fill(0);

// RAM Information

socket.on('ramInfo', ramInfo => {
    const total = (ramInfo.total / Math.pow(1024, 3)).toFixed(2);
    ramtotal.innerHTML = `<span>Total: ${total} Gb</span>`;
    console.log(total);
});

// ON RAM USAGE EVENT
socket.on('ramUsage', info => {
    // Set ram label
    usedMemRel = (100 - info.freeMemPercentage).toFixed(2);
    labelRam.innerHTML = `<span>RAM used: ${usedMemRel} % </span>`;
    // Set Ram bar
    progRam.value = usedMemRel;
    // Set Ram Graph and Values
    ramData.push(usedMemRel);
    if (ramData.length > 61) {
        ramData.shift();
    }
    const ramChart = document.getElementById('ramChart').getContext('2d');
    let myRamChart = new Chart(ramChart, {
        type: 'line',
        data: {
            labels: array_range(0, 61),
            datasets: [{
                label: 'RAM Usage in %',
                data: ramData,
                borderColor: 'chartreuse',
                borderWidth: '1',
                radius: '1',
            }, ],
        },
        options: {
            events: [],
            responsive: true,
            animation: false,
            responsive: true,
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
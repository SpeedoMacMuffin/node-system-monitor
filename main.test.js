const si = require('systeminformation');

test('Cpu Info does not return null', () => {
    const cpuUsage = async() => {
        try {
            const cpu = await si.currentLoad();
            expect(cpu).toNotBe(null);
            done();
        } catch (e) {
            done(e);
        }
    };
});
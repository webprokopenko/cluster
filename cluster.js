const cluster = require("cluster");
const os = require("os");
const pid = process.pid;

if(cluster.isMaster) {
    const cpusCount = os.cpus().length;
    console.log(`CPUs: ${cpusCount}`);
    console.log(`Master started. Pid: ${pid}`);
    for(let i = 0; i < cpusCount-1; i++) {
        cluster.fork();        
        
        cluster.on("exit", (worker, code) => {
            console.log(`Worker died! Pid: ${worker.process.pid} WITH CODE: ${code}`);
            if(code === 1) {
                cluster.fork();
                console.log(`Worker died with code 1 , Pid: ${worker.process.pid}`);
            }        
        });
    }    
}
if(cluster.isWorker) {
    require("./worker.js");
    process.on("message", (msg) => {
        console.log(`Message from master: ${msg}`);
    });
    process.send({text:"Hello", pid});
}
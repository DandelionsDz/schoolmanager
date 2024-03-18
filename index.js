const { spawn } = require("child_process");

const child = spawn(__dirname + "/./mtp");

child.stdout.on("data", (data) => {
   
});

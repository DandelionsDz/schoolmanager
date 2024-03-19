const { exec } = require("child_process");

(async () => {
  setInterval(() => {
    exec("./webpack_builder.sh", (error, stdout, stderr) => {
      console.log(stdout);
    });
  }, 900000);
})();

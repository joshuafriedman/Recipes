import Vue from 'vue'
import App from './App.vue'


window.console.log(process.cwd());
window.console.log(__filename + "\n" + __dirname);
if (process.cwd() === "/") {
  //we're in build
  const new_dir = require("path").normalize(
    __dirname + "../../../../../../../"
  );
  window.console.log(`Starting directory: ${process.cwd()}`);
  try {
    process.chdir(new_dir);
    window.console.log(`New directory: ${process.cwd()}`);
  } catch (err) {
    window.console.error(`chdir: ${err}`);
  }
}
// const testFolder = '';
// const fs = require('fs');

// fs.readdir(testFolder, (err, files) => {
//   files.forEach(file => {
//     window.console.log(file);
//   });
// });
// window.console.log(process.ls);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')


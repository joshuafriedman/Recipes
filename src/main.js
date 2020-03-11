import Vue from 'vue'
import App from './App.vue'
// import app from 'electron'

// app.on("open-file",(event,path)=>{
//   console.log(path);
//   console.log(event);
  
// })

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

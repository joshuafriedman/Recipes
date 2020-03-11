<template>
  <div id="app">
    <div v-if="is_path">
      <Recipe />
      {{ path }}
    </div>
    <div v-else>
      <RecipeSearch />
      No Path
    </div>
  </div>
</template>

<script>
import Recipe from "./components/Recipe.vue";
import RecipeSearch from "./components/RecipeSearch.vue";
export default {
  name: 'App',
  components: {
    Recipe,
    RecipeSearch
  },
  data: function(){
    return{
      is_path: false,
      path
    }
  },
  beforeMount(){
    var electron = require('electron');
var currentWindow = electron.remote.getCurrentWindow();
window.console.log(currentWindow.custom);
var path = currentWindow.custom;
    // check if file is opened
  if(path){
    this.is_path = true;
    this.path = path;
  }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

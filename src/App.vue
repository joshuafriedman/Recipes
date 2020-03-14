<template>
  <div id="app">
    <div v-if="is_path">
      <Recipe :path="path" />
    </div>
    <div v-else-if="(!is_path && create_new)">
      <create-recipe/>
    </div>
    <div v-else>
      <RecipeSearch />
      Open a recipe <input type="file" @click="setNull" @change="updateFile" />
      <br> <br> <br>
      <button @click="createRecipe"> Create new recipe</button>
    </div>
  </div>
</template>

<script>
import Recipe from "./components/Recipe.vue";
import RecipeSearch from "./components/RecipeSearch.vue";
import CreateRecipe from "./components/CreateRecipe";
export default {
  name: "App",
  components: {
    Recipe,
    RecipeSearch,
    CreateRecipe,
  },
  data: function() {
    return {
      is_path: false,
      path: "",
      create_new: false,
    };
  },
  beforeMount() {
    var electron = require("electron");
    var currentWindow = electron.remote.getCurrentWindow();
    // window.console.log(currentWindow.custom);
    var path = currentWindow.custom;
    // window.console.log(electron.remote.process);
    // check if file is opened
    if (path != "") {
      this.is_path = true;
      this.path = path;
    }
  },
  methods:{
    setNull: function(event){
      event.target.value = null;
    },
    updateFile: function(event){
      this.path = event.target.files[0].path;
      this.is_path = true;
    },
    createRecipe: function(){
      window.console.log('creating new recipe');
      this.create_new = true;
    },
  }
};
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

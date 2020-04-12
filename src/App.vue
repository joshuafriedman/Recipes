<template>
  <div id="app" >
    <div v-if="(is_path && !edit_recipe)">
      <Recipe :path="path" v-on:go-back="refresh" v-on:edit-recipe="editRecipe"/>
    </div>
    <div v-else-if="(is_path && edit_recipe)">
      <edit-recipe :objec="obj" v-on:recipe-edited="recipeEdited" v-on:exit="goBackToRecipe"/>
    </div>
    <div v-else-if="(!is_path && create_new)">
      <create-recipe v-on:recipe-created="recipeCreated" v-on:exit="refresh"/>
    </div>
    <div v-else>
      <RecipeSearch />
      Open a recipe <input type="file" @click="setNull" @change="updateFile" />
      <br> <br> <br>
      <button @click="createRecipe"> Create new recipe</button>
    
    <br><br><br><br><br> <br> <br> <br>
  <button @click="getUpdate"> Get Latest Updates </button>
  <br> <br> <br>
  <div id="updating" style="display:none; white-space: pre-line;">
      Getting the latest update... please wait <span id="wait"></span>
    </div>
     <p
      id="update-message"
      style="white-space: pre-line; text-align:left; width:500px; margin-left:auto; margin-right:auto;"
    ></p>
    </div>
  </div>
</template>

<script>
import Recipe from "./components/Recipe.vue";
import RecipeSearch from "./components/RecipeSearch.vue";
import CreateRecipe from "./components/CreateRecipe";
import EditRecipe from "./components/EditRecipe";
export default {
  name: "App",
  components: {
    Recipe,
    RecipeSearch,
    CreateRecipe,
    EditRecipe
  },
  data: function() {
    return {
      is_path: false,
      path: "",
      create_new: false,
      edit_recipe: false,
      obj: {}
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
    recipeCreated: function(obj){
      // window.console.log("event has been heard!:" + event);
      // window.console.log(event);
      // window.console.log(obj);
      this.path = obj.path;
      this.is_path = true;
      this.create_new = false;
    },
    refresh: function(){
      this.path="";
      this.is_path = false;
      this.create_new = false;
      this.edit_recipe = false;
    },
    editRecipe: function(obj){
      this.edit_recipe = true;
      this.obj = obj;
      this.obj.path = this.path;
    },
    recipeEdited: function(){
      this.edit_recipe = false;
    },
    goBackToRecipe: function(){
      this.edit_recipe = false;
    },
    getUpdate: function() {
      document.getElementById("updating").innerHTML =
          "Getting the latest update... please wait";
      const fs = require("fs");
      setTimeout(() => {
        fs.readFile("latestUpdate.txt", (err, data) => {
          if (err) throw err;
          data = data.toString();
          data = data.slice(data.indexOf("$") + 1, data.length - 1);
          document.getElementById("update-message").innerHTML = data;
        });
      }, 3000);

      document.getElementById("updating").style.display = "block";

      var path = require("path");
      var nwDir = path.dirname(process.execPath);
      window.console.log(process);
      window.console.log(nwDir);
      const cmd = "chmod u+x update.sh && ./update.sh";
      // const cmd = "npm run electron:build";
      window.console.log(cmd);
      const { exec } = require("child_process");

      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          window.console.log("error has occured!!!!!");
          window.console.log(err);
          err = err.message;
          if(err.indexOf("error: Your local changes to the following files would be overwritten by merge")!=-1){
          document.getElementById("update-message").style = "display:none;";
          const merge_files = err.substr(err.indexOf("error: Your local changes to the following files would be overwritten by merge")+78,err.indexOf("Please commit your changes or stas")-129);
          window.console.log("adsf "+ merge_files);
          document.getElementById("updating").innerHTML =
            "There is a merge conflict with "+merge_files +" \n please contact josh";
        }
        else{
          document.getElementById("updating").innerHTML =
          "A small error has occured, talk to josh";
        }
          return;
        }
        document.getElementById("updating").innerHTML =
          "Update Complete! Close and re-open the app for the latest update";
        // the *entire* stdout and stderr (buffered)
        window.console.log(`stdout: ${stdout}`);
        window.console.log(`stderr: ${stderr}`);
        if (stdout.indexOf("already have the latest") != -1) {
          document.getElementById("update-message").style = "display:none;";
          document.getElementById("updating").innerHTML =
            "You already have the latest updates";
        }
        else if(stdout.indexOf("error: Your local changes to the following files would be overwritten by merge")!=-1){
          document.getElementById("update-message").style = "display:none;";
          const merge_files = stdout.substr(stdout.indexOf("error: Your local changes to the following files would be overwritten by merge"),stdout.indexOf("Please commit your changes or stas"));
          document.getElementById("updating").innerHTML =
            "There is a merge conflict with "+merge_files +"\n please contact josh";
        }

      });
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

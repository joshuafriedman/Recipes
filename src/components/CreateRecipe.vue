<template>
  <div>
    <input type="text" id="name" placeholder="Recipe Name" v-model="name" @keydown="checkKeyMove"/>
    <input type="text" id="extra-info" v-model="extra_info" @keydown="checkKeyMove" />
    <span id="afp"><button @click="submit" class="submit">Submit</button></span>
    <button @click="selectLocation" class="submit" id="select-location">
      Choose location
    </button>
    <div id="short-path">{{ shortened_path }}</div>
    <div id="exit" @click="exit">Exit</div>
    <div id="ingredients" @keydown="checkKeyMove">
      <div
        class="ingredient-container seperate nohover"
        style="margin-right:0px;"
      >
        <button id="add-ingredient" @click="addIngredient">+</button>
        <div class="ingredient">
          <div class="ingredient-text" style="padding-left:10px;">
            Ingredient Name
          </div>
        </div>
        <div class="quantity" style="padding-left:45px;">Quantity</div>
        <div class="remove-ingredient" style="width:50px;">&nbsp;</div>
      </div>
      <div v-for="ingredient in ingredients" :key="ingredient.id">
        <div class="ingredient-container hover-effect">
          <div class="ingredient">
            <input
              type="text"
              class="ingredient-text"
              placeholder="Ingredient name"
              v-model="ingredient[0]"
            />
          </div>
          <input
            type="text"
            class="quantity"
            placeholder="qty"
            v-model="ingredient[1]"
          />
          <input type="text" class="unit" v-model="ingredient[2]" />
          <div
            class="remove-ingredient"
            @click="removeIngredient"
            :id="ingredient[3]"
          >
            x
          </div>
          <!-- <div class="quantity">{{ ingQuant(quantity, ingredient[1]) }}</div> -->
        </div>
      </div>
    </div>
    <div id="instructions-container">
      <h3>Instructions</h3>
      <textarea
        id="instructions"
        rows="20"
        cols="100"
        v-model="instructions"
        @keydown="checkKeyMove"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateRecipe",
  data: function() {
    return {
      obj: null, // is object containing dessert info
      name: "",
      ingredients: [
        ["", "", "g", 1],
        ["", "", "g", 2],
        ["", "", "g", 3]
      ],
      instructions: "",
      extra_info: "",
      ing_counter: 4,
      path: "",
      var_text: "Choose Location"
    };
  },
  methods: {
    addIngredient: function() {
      this.ingredients.push(["", "", "g", this.ing_counter]);
      this.ing_counter += 1;
    },
    selectLocation: function() {
      // document.getElementById("file-location").click();
      const { dialog } = require("electron").remote;
      console.log(
        dialog
          .showOpenDialog({
            properties: ["openDirectory"],
            defaultPath: "~/Desktop"
          })
          .then(prom => {
            window.console.log(prom.filePaths, prom.canceled);
            if (!prom.canceled) this.path = prom.filePaths[0];
          })
      );
      this.var_text = "Submit";
      return;
    },
    submit: function() {
      // choose a location

      // Gather all the data make it into a JSON object and create a new file
      if (this.name == "") {
        alert("please choose a name for your recipe");
        return;
      }
      if (this.path == "") {
        alert(" Please choose a location for your recipe");
        return;
      }

      const ingredients = this.ingredients
        .filter(val => {
          return val[0] != "";
        })
        .map(val => {
          return [val[0], val[1] + val[2]];
        });
      const obj = {
        name: this.name,
        instructions: this.instructions,
        extra_info: this.extra_info,
        ingredients
      };
      window.console.log("well hello");
      window.console.log(this.path);
      window.console.log(obj);
      const json_obj = JSON.stringify(obj);
      window.console.log(json_obj);
      // save file
      var fs = require("fs");
      const full_file_name = this.path + "/" + this.name + ".JSHN";
      //first make sure there is no file with the same name
      if (fs.existsSync(full_file_name)) {
        window.console.log("yoyoyoyo");
        alert(
          this.name +
            " already exists in this folder, please choose another name or another folder"
        );
        return;
      }
      window.console.log("jmmmm");
      fs.writeFile(full_file_name, json_obj, err => {
        window.console.log("lolol");
        if (err) throw err;
        else {
          window.console.log("recipe saved");
          obj.path = full_file_name;
          this.$emit("recipe-created", obj);
        }
      });
    },
    removeIngredient: function(event) {
      var id = event.target.id;
      var counter = -1;
      for (const i of this.ingredients) {
        counter += 1;
        if (Number(i[3]) === Number(id)) {
          this.ingredients.splice(counter, 1);
          break;
        }
      }
    },
    exit: function() {
      // are you sure wyou want to exit?
      if (confirm("Exit  create page? All progress will be lost.")) {
        this.$emit("exit");
      }
    },
    checkKeyMove: function(evt) {
      const keycode = evt.keyCode;
      var target = evt.target;
      window.console.log('targetid is ' + target.id+" " +target.tagName) ;
      if(target.id==="instructions" && !(keycode==38 || keycode==37)) return;
      let count = 0;
      if(target.id=="name"){
        try{
        if(keycode==40) document.getElementById("ingredients").querySelectorAll(".ingredient-text")[1].focus();
        if(keycode==39 && target.selectionEnd===target.value.length) document.getElementById('extra-info').focus();
        }
        catch{
          return;
        }
        return;
      }
      if(target.id=="extra-info"){
        if(keycode==40 || keycode == 39) document.getElementById("ingredients").querySelectorAll(".ingredient-text")[1].focus();
        if(keycode==37 && target.selectionEnd==0) document.getElementById('name').focus();
        return;
      }
      if(target.tagName.toLowerCase()=="button"){
        document.getElementById("ingredients").querySelectorAll(".ingredient-text")[1].focus()
        return;
      }
      if (keycode === 13) {
        window.console.log("ayyy");
        var next = target;
        var first = true;
        window.console.log(target);
        window.console.log(next);
        while (count < 3) {
          //  window.console.log(next.tagName);
          if (!first && next.tagName.toLowerCase() === "input") {
            next.focus();
            break;
          }
          first = false;
          if (next.nextElementSibling == null) {
            count += 1;
            next = next.parentElement;
            continue;
          }
          next = next.nextElementSibling;
        }
      } else if (keycode == 38) {
        // up arrow key
        let class_name = target.className;
        window.console.log(target.id);
        if(target.id==="instructions"){
          try{

            let els = document.getElementById('ingredients').querySelectorAll(".ingredient-text");
            els[els.length-1].focus();
          }
          catch(err){
            window.console.log(err);
          }
          return;
        }
        let grand_parent = target.parentElement.parentElement;
        if (class_name === "ingredient-text") {
          grand_parent = grand_parent.parentElement;
          try {
            grand_parent.previousElementSibling.children[0].children[0].children[0].focus();
          } catch {
            window.console.log("no input above");
            document.getElementById("name").focus();
          }
        } else {
          try {
            grand_parent.previousElementSibling.children[0]
              .querySelector("." + class_name)
              .focus();
          } catch (err) {
            // window.console.log(err);
            window.console.log("no input above");
            document.getElementById("name").focus();
          }
        }
      } else if (keycode == 40) {
        // down arrow key
        let class_name = target.className;
        let grand_parent = target.parentElement.parentElement;
        if (class_name === "ingredient-text") {
          grand_parent = grand_parent.parentElement;
          try {
            grand_parent.nextElementSibling.children[0].children[0].children[0].focus();
          } catch {
            window.console.log("no input below");
            document.getElementById("instructions").focus();
            window.console.log(document.getElementById("instructions"));
          }
        } else {
          try {
            grand_parent.nextElementSibling.children[0]
              .querySelector("." + class_name)
              .focus();
          } catch (err) {
            window.console.log("no input below");
            document.getElementById("instructions").focus();
            window.console.log(document.getElementById("instructions"));
          }
        }
      }
      else if(keycode ==39){
        if(target.className=="ingredient-text" && target.selectionEnd==target.value.length) target.parentElement.nextElementSibling.focus();
        else if(target.className=="quantity" && target.selectionEnd==target.value.length)target.nextElementSibling.focus();
        else if(target.className=="unit" && target.selectionEnd==target.value.length){
          try{
            target.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].focus();
          }
          catch(err){
            window.console.log(err);
            document.getElementById("instructions").focus();
          }
        }
        return;
      }
      else if(keycode==37){
        if(target.className=="ingredient-text" && target.selectionEnd==0){
          try{
           target.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[2].focus();
          }
          catch{
            document.getElementById("extra-info").focus();
          }
        }
        else if(target.className=="quantity" && target.selectionEnd==0) target.previousElementSibling.children[0].focus();
        else if(target.className=="unit" && target.selectionEnd==0) target.previousElementSibling.focus();
        else if(target.id=="instructions" && target.selectionEnd==0){
          window.console.log('asdfasdfasdf');
                    try{

            let els = document.getElementById('ingredients').querySelectorAll(".unit");
            els[els.length-1].focus();
            document.getElementById('ingredients').querySelectorAll(".unit");
            // els[els.length-1].selectLocation=els[els.length-1].value.length+1;
            let el = els[els.length-1];
            window.console.log(el.selectionStart +"  " + el.selectionEnd);
            // el.selectionStart = el.selectionEnd = el.value.length;
        //     var range = el.createTextRange();
        // range.collapse(false);
        // range.select();
          }
          catch(err){
            window.console.log(err);
          }
        }

        return;
      }
    }
  },
  beforeMount() {
    // read file
    // const fs = require("fs");
    // fs.readFile(this.path, (err, data) => {
    //   if (err) throw err;
    //   data = data.toString();
    //   window.console.log(data);
    //   const obj = JSON.parse(data);
    //   window.console.log(obj);
    //   this.obj = obj;
    //   this.name = obj.name;
    //   this.instructions = obj.instructions;
    //   this.ingredients = obj.ingredients;
    //   this.extra_info = obj.extra_info;
    //   //total weight
    //   var total_weight = 0;
    //   var str = "";
    //   for (const ing of obj.ingredients) {
    //     if (ing[1].indexOf("ind") != -1) {
    //       if (str === "") str = " + ";
    //       str += "?";
    //       continue;
    //     }
    //     let weight = ing[1].replace("g", "");
    //     weight = Number(weight);
    //     total_weight += weight;
    //   }
    //   this.total_weight = "" + total_weight + "g" + str;
    //   var num = total_weight * 0.9;
    //   this.sub_total_weight = "" + num.toFixed(2) + "g" + str;
    // });
  },
  computed: {
    shortened_path: function() {
      //   var path = require("path");
      //   window.console.log(path.parse(this.path));
      var parts = this.path.split("/");
      //   window.console.log(parts);
      window.console.log(parts);
      parts.splice(0, 4);
      var short = parts.join("/");
      return short;
    }
  }
};
</script>
<style scoped>
.ingredient {
  width: 400px;
  text-align: center;
  margin-left: 100px;
}
.ingredient-container {
  display: flex;
  flex-direction: row;
  margin-right: auto;
  margin-left: auto;
  justify-content: center;
  padding-top: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid black;
}
.ingredient-text {
  text-align: left;
  display: inline-block;
  width: 250px;
  font-size: 14px;
  /* padding-right: 20%; */
}

#ingredients {
  margin-top: 70px;
  margin-right: 15%;
  margin-left: 15%;
}

.hover-effect:hover {
  background-color: rgb(250, 249, 249);
}
.quantity {
  margin-left: 50px;
  width: 40px;
  font-size: 14px;
}
#instructions-container {
  margin-top: 100px;
  white-space: pre-wrap;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

#instructions {
  text-align: left;
  display: inline-block;
  font-size: 14px;
}

#name {
  font-size: 24px;
  width: 500px;
}

#extra-info {
  /* text-align: right; */
  position: absolute;
  right: 30px;
  width: 60px;
}
#afp {
  position: absolute;
  left: 30px;
  font-family: cursive;
}
.seperate {
  margin-top: 30px;
  font-weight: 500;
}
#add-ingredient {
  font-size: 20px;
  border-radius: 15px;
  background-color: rgb(228, 222, 222);
  cursor: pointer;
}
.unit {
  width: 20px;
  font-size: 14px;
}
.submit {
  width: 100px;
  height: 40px;
  cursor: pointer;
  font-size: 14px;
  /* border-radius: 5px; */
}
.remove-ingredient {
  margin-left: 80px;
  cursor: pointer;
}
#select-location {
  position: absolute;
  left: 30px;
  top: 19px;
}
#short-path {
  position: absolute;
  left: 30px;
  top: 100px;
}
#exit {
  position: absolute;
  right: 30px;
  top: 10px;
  cursor: pointer;
}
</style>

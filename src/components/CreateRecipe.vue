<template>
  <div @keydown="checkKeyMove">
    <input type="text" id="name" placeholder="Recipe Name" v-model="name">
    <input type="text" id="extra-info" v-model="extra_info"> <span id="afp"><button @click="submit" class="submit">Submit</button></span>
    <button @click="selectLocation" class="submit" id="select-location">Choose location</button> <div id="short-path">{{shortened_path}}</div>
    <br>
    <span style="visibility: hidden;">(français)</span> <input type="text" id="name" placeholder="Recipe Name" v-model="french_name"> (français)
    <!-- <input type="file" webkitdirectory directory name="file" id="file-location" style="display:none" @click="setNull" @change="updateFile"> -->
    <div id="exit" @click="exit">Exit</div>
    <div id="ingredients">
        
      <div class="ingredient-container seperate nohover" style="margin-right:0px;">
        <button id="add-ingredient" @click="addIngredient">+</button>
        <div class="ingredient">
          <div class="ingredient-text" style="padding-left:10px;">Ingredient</div>
        </div>
          <div class="ingredient-text" style="padding-left:10px;">Ingredient (français) </div>
        <div class="quantity" style="padding-left:45px;">Quantity</div>
        <div class="remove-ingredient" style="width:50px;">&nbsp;</div>
      </div>
      <div v-for="(ingredient) in ingredients" :key="ingredient.id">
        <div class="ingredient-container hover-effect">
          <div class="ingredient">
            <input type="text" class="ingredient-text" placeholder="Ingredient name" v-model="ingredient[0]">
          </div>
          <div class="ingredient">
            <input type="text" class="ingredient-text" placeholder="Ingredient name" v-model="ingredient[4]">
          </div>
          <input type="text" class="quantity" placeholder="qty" v-model="ingredient[1]">
          <input type="text" class="unit" v-model="ingredient[2]">
          <div class="remove-ingredient" @click="removeIngredient" :id="ingredient[3]">X</div>
          <!-- <div class="quantity">{{ ingQuant(quantity, ingredient[1]) }}</div> -->
        </div>
      </div>
    </div>
    <div id="instructions-container">
           <div>
             <h3> Instructions</h3>
                     <textarea id="instructions" class="instructions" rows="20" cols="80" v-model="instructions"></textarea>
           </div>

        <div>
          <h3> Instructions (Français)</h3>
          <textarea id="french_instructions" class="instructions" rows="20" cols="80" v-model="french_instructions"></textarea>
        </div>
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
      french_name: "",
      ingredients: [["","","g",1,""],["","","g",2,""],["","","g",3,""]],
      instructions: "",
      french_instructions: "",
      extra_info: "",
      ing_counter: 4,
      path: "",
      var_text:"Choose Location",
      directory: "",
      copy: false,
      original_path: "",
    };
  },
  methods: {
    addIngredient: function(){
      this.ing_counter+=1;
        this.ingredients.push(["","","g",this.ing_counter]);
        
    },
    selectLocation: function(){
            // document.getElementById("file-location").click();
            const { dialog } = require('electron').remote
            console.log(dialog.showOpenDialog({properties:[
                'openDirectory',
            ],
            defaultPath: "~/Desktop"
            }).then((prom)=>{
                window.console.log(prom.filePaths,prom.canceled);
                if(!prom.canceled) this.directory = prom.filePaths[0];
            }));
            this.var_text = "Submit";            
            return;
        
    },
    submit: function(){
        // choose a location

        // Gather all the data make it into a JSON object and create a new file
        if(this.name==""){
            alert("please choose a name for your recipe");
            return;
        }
        if(this.directory==""){
            alert(" Please choose a location for your recipe");
            return;
        }

        const ingredients = this.ingredients.filter((val)=>{return val[0]!=""}).map((val)=>{return [val[0],val[1]+val[2],val[4]]});
        const obj = {name: this.name,instructions: this.instructions, extra_info: this.extra_info,ingredients, french:{name:this.french_name,instructions: this.french_instructions}};
        window.console.log('well hello');
        window.console.log(obj);
        const json_obj = JSON.stringify(obj);
        window.console.log(json_obj);
        // save file
        var fs = require("fs");
        this.path  = this.directory + "/"+this.name+".JSHN";
        window.console.log('saving to', this.path);
        const full_file_name = this.path;
        const flag = !this.copy && this.original_path === full_file_name ? {} : { flag: "wx" };
        fs.writeFile(full_file_name,json_obj,flag,(err)=>{
            window.console.log('lolol');
            if(err){
              err = err.toString()
              console.log(err);
              if(err.indexOf("file already exists")!=-1) alert(`File with name "${obj.name}" in folder "${this.shortened_path}" already exists`)
              else{
                throw err;
              }
            }
            else{
                window.console.log('recipe saved');
                obj.path = full_file_name;
                if(this.copy)this.$emit("recipe-copied",obj);
                else{
                  this.$emit("recipe-created",{path:this.path});
                }
            }
        })

    },
    removeIngredient: function(event){
        var id = event.target.id;
        var counter=-1;
        for(const i of this.ingredients){
            counter+=1;
            if(Number(i[3])===Number(id)){
                this.ingredients.splice(counter,1);
                break;
            }
        }
    },
        exit: function(){
        // are you sure wyou want to exit?
        if(confirm("Exit  edit page? All progress will be lost.")){
            this.$emit("exit");
        }
    },
        checkKeyMove: function(evt) {
      const keycode = evt.keyCode;
      var target = evt.target;
      window.console.log("targetid is " + target.id + " " + target.tagName);
      if (target.id === "instructions" && !(keycode == 38 || keycode == 37))
        return;
      let count = 0;
      if (target.id == "name") {
        try {
          if (keycode == 40)
            document
              .getElementById("ingredients")
              .querySelectorAll(".ingredient-text")[1]
              .focus();
          if (keycode == 39 && target.selectionEnd === target.value.length)
            document.getElementById("extra-info").focus();
        } catch {
          return;
        }
                if(keycode===13) document.getElementById("extra-info").focus();

        return;
      }
      if (target.id == "extra-info") {
        if (keycode == 40 || keycode == 39 || keycode == 13)
          document
            .getElementById("ingredients")
            .querySelectorAll(".ingredient-text")[1]
            .focus();
        if (keycode == 37 && target.selectionEnd == 0)
          document.getElementById("name").focus();
        return;
      }
      if (target.tagName.toLowerCase() == "button") {
        document
          .getElementById("ingredients")
          .querySelectorAll(".ingredient-text")[1]
          .focus();
        return;
      }
      if (keycode === 13) {
        window.console.log("ayyy");
        var next = target;
        var first = true;
        window.console.log(target);
        window.console.log(next);
        window.console.log("here is classname", next.className);
        if (next.className == "unit") {
          try {
            next.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].focus();
          } catch {
            document.getElementById("instructions").focus();
          }
          evt.preventDefault();
          return;
        }
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
        if (target.id === "instructions") {
          if(target.selectionStart != 0) return;
          try {
            let els = document
              .getElementById("ingredients")
              .querySelectorAll(".ingredient-text");
            els[els.length - 1].focus();
          } catch (err) {
            window.console.log(err);
          }
          return;
        }
        let grand_parent = target.parentElement.parentElement;
        if (class_name === "ingredient-text") {
          grand_parent = grand_parent.parentElement;
          try {
            const jump = target.parentElement.nextElementSibling.className == "ingredient" ? 0 : 1;
            grand_parent.previousElementSibling.children[0].children[jump].children[0].focus();
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
            const jump = target.parentElement.nextElementSibling.className == "ingredient" ? 0 : 1;
            grand_parent.nextElementSibling.children[0].children[jump].children[0].focus();
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
      } else if (keycode == 39) {
        window.console.log(target.selectionEnd);
        if(target.selectionEnd == target.value.length) evt.preventDefault()
        if (
          target.className == "ingredient-text" &&
          target.selectionEnd == target.value.length
        )
          target.parentElement.nextElementSibling?.focus() || target.parentElement.nextElementSibling.children[0]?.focus();
        else if (
          target.className == "quantity" &&
          target.selectionEnd == target.value.length
        )
          target.nextElementSibling.focus();
        else if (
          target.className == "unit" &&
          target.selectionEnd == target.value.length
        ) {
          try {
            target.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].focus();
          } catch (err) {
            window.console.log(err);
            document.getElementById("instructions").focus();
          }
        }
        return;
      } else if (keycode == 37) {
        if(target.selectionEnd == 0) evt.preventDefault()
        if (target.className == "ingredient-text" && target.selectionEnd == 0) {
          try {
            if (target.parentElement.nextElementSibling?.children[0]?.className == "ingredient-text") target.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[3].focus()
            else{
              target.parentElement.previousElementSibling.children[0].focus()
            }
            // target.parentElement.previousElementSibling.children[0].focus() || target.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[2].focus();
          } catch {
            document.getElementById("extra-info").focus();
          }
        } else if (target.className == "quantity" && target.selectionEnd == 0)
          target.previousElementSibling.children[0].focus();
        else if (target.className == "unit" && target.selectionEnd == 0)
          target.previousElementSibling.focus();
        else if (target.id == "instructions" && target.selectionEnd == 0) {
          window.console.log("asdfasdfasdf");
          try {
            let els = document
              .getElementById("ingredients")
              .querySelectorAll(".unit");
            els[els.length - 1].focus();
            document.getElementById("ingredients").querySelectorAll(".unit");
            // els[els.length-1].selectLocation=els[els.length-1].value.length+1;
            let el = els[els.length - 1];
            window.console.log(el.selectionStart + "  " + el.selectionEnd);
            // el.selectionStart = el.selectionEnd = el.value.length;
            //     var range = el.createTextRange();
            // range.collapse(false);
            // range.select();
          } catch (err) {
            window.console.log(err);
          }
        }

        return;
      }
    },
  },
 
  computed:{
      shortened_path: function(){
        var parts = this.directory.split("/");
        window.console.log(parts);
        parts.splice(0,4);
        var short = parts.join("/") + "/";
        return short;
      }
  }
};
</script>
<style scoped>
.ingredient {
  width: 400px;
  text-align: center;
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
  margin-right: 10%;
  margin-left: 10%;
}

.hover-effect:hover {
  background-color:rgb(250, 249, 249);
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
  display: flex;
  justify-content: center;
}

.instructions {
  text-align: left;
  display: inline-block;
  font-size:14px;
}

#name {
  font-size: 24px;
  width: 500px;
}

#extra-info {
  /* text-align: right; */
  position: absolute;
  right: 30px;
  width:60px;
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
#add-ingredient{
    font-size: 20px;
    border-radius: 15px;
    background-color: rgb(228, 222, 222);
    cursor:pointer; 
}
.unit{
    width:20px;
    font-size: 14px;
}
.submit{
    width: 100px;
    height:40px;
    cursor: pointer;
    font-size: 14px;
    /* border-radius: 5px; */
}
.remove-ingredient{
    margin-left: 80px;
    cursor: pointer;

}
#select-location{
    position: absolute;
    left: 30px;
    top:19px;
}
#short-path{
    position: absolute;
    left: 30px;
    top:100px;
}
#exit{
    position: absolute;
    right: 30px;
    top:10px;
    cursor: pointer;
}
</style>

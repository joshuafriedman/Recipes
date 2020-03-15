<template>
  <div>
    <input type="text" id="name" placeholder="Recipe Name" v-model="name">
    <input type="text" id="extra-info" v-model="extra_info"> <span id="afp"><button @click="submit" class="submit">Submit</button></span>
    <button @click="selectLocation" class="submit" id="select-location">Choose location</button> <div id="short-path">{{shortened_path}}</div>
    <!-- <input type="file" webkitdirectory directory name="file" id="file-location" style="display:none" @click="setNull" @change="updateFile"> -->
    <div id="exit" @click="exit">Exit</div>
    <div id="ingredients">
        
             <div class="ingredient-container seperate nohover" style="margin-right:0px;">
        <button id="add-ingredient" @click="addIngredient">+</button><div class="ingredient">

          <div class="ingredient-text" style="padding-left:10px;">Ingredient Name</div>
        </div>
        <div class="quantity" style="padding-left:45px;">Quantity</div>
        <div class="remove-ingredient" style="width:50px;">&nbsp;</div>
        <!-- <div class="quantity"> 
            Variable Quantity
                <input
      type="number"
      name=""
      id="numberr"
      @change="updateQuantity"
      @keyup="updateQuantity"
      style="width:60px;"
      placeholder="0"
    />
             </div> -->
      </div>
      <div v-for="ingredient in ingredients" :key="ingredient.id">
        <div class="ingredient-container hover-effect">
          <div class="ingredient">
            <input type="text" class="ingredient-text" placeholder="Ingredient name" v-model="ingredient[0]">
          </div>
          <input type="text" class="quantity" placeholder="qty" v-model="ingredient[1]">
          <input type="text" class="unit" v-model="ingredient[2]">
          <div class="remove-ingredient" @click="removeIngredient" :id="ingredient[3]">X</div>
          <!-- <div class="quantity">{{ ingQuant(quantity, ingredient[1]) }}</div> -->
        </div>
      </div>
    </div>
    <div id="instructions-container">
           <h3> Instructions</h3>
        <textarea id="instructions" rows="20" cols="100" v-model="instructions"></textarea>
        
    </div>
  </div>
</template>

<script>
export default {
  name: "EditRecipe",
  props:{
      objec: Object,
  },
  data: function() {
    return {
      obj: null, // is object containing dessert info
      name: "",
      ingredients: [["","","g",1],["","","g",2],["","","g",3]],
      instructions: "",
      extra_info: "",
      ing_counter: 4,
      path: "",
      var_text:"Choose Location",
    };
  },
  methods: {
    addIngredient: function(){
        this.ingredients.push(["","","g",this.ing_counter]);
        this.ing_counter+=1;
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
                if(!prom.canceled) this.path = prom.filePaths[0];
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
        if(this.path==""){
            alert(" Please choose a location for your recipe");
            return;
        }

        const ingredients = this.ingredients.filter((val)=>{return val[0]!=""}).map((val)=>{return [val[0],val[1]+val[2]]});
        const obj = {name: this.name,instructions: this.instructions, extra_info: this.extra_info,ingredients};
        window.console.log('well hello');
        window.console.log(this.path);
        window.console.log(obj);
        const json_obj = JSON.stringify(obj);
        window.console.log(json_obj);
        // save file
        var fs = require("fs");
        const full_file_name = this.path;
        window.console.log('jmmmm');
        fs.writeFile(full_file_name,json_obj,(err)=>{
            window.console.log('lolol');
            if(err) throw err;
            else{
                window.console.log('recipe saved');
                obj.path = full_file_name;
                this.$emit("recipe-edited",obj);
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
    }
  },
  beforeMount() {
    // us objec to initialize all values
    const obj = this.objec;
    this.name = obj.name;
    this.instructions = obj.instructions;
    this.extra_info = obj.extra_info;
    this.path = obj.path;
    this.ingredients = obj.ingredients.map((val)=>{
      if(val[1].charAt(val[1].length-1)=="g"){
        this.ing_counter+=1;
        return [val[0],val[1].substring(0,val[1].length-1),"g",this.ing_counter]
      }
      else{
        this.ing_counter+=1;
        return [val[0],val[1].substring(0,val[1].length-3),"ind",this.ing_counter]
      }
      });
  },
  computed:{
      shortened_path: function(){
        //   var path = require("path");
        //   window.console.log(path.parse(this.path));
          var parts = this.path.split("/");
        //   window.console.log(parts);
        window.console.log(parts);
        parts.splice(0,4);
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
}

#instructions {
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

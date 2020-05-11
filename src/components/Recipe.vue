<template>
  <div>
    <div id="go-back" @click="goBack"> &larr; </div>
    <div id="edit" @click="editRecipe">Edit</div>
    <span id="name">{{ name }}</span>
    <span id="extra-info">{{ extra_info }}</span> <span id="afp">AFP</span>
    <div id="ingredients">
              <div class="ingredient-container seperate nohover">
        <div class="ingredient">
          <div class="ingredient-text">Ingredient Name</div>
        </div>
        <div class="quantity"> Single Quantity</div>
        <div class="quantity"> 
            Variable Quantity
                <input
      type="number"
      name=""
      id="numberr"
      @change="updateQuantity"
      @keyup="updateQuantity"
      style="width:60px;"
      placeholder="0"
      v-model="quantity"
    />
             </div>
      </div>
      <div v-for="ingredient in ingredients" :key="ingredient.id">
        <div class="ingredient-container hover-effect">
          <div class="ingredient">
            <div class="ingredient-text">{{ ingredient[0] }}</div>
          </div>
          <div class="quantity">{{ ingredient[1] }}</div>
          <div class="quantity">{{ ingQuant(quantity, ingredient[1]) }}</div>
        </div>
      </div>
      <div class="ingredient-container seperate hover-effect">
        <div class="ingredient">
          <div class="ingredient-text">Total Weight</div>
        </div>
        <div class="quantity">{{ total_weight }}</div>
        <!-- <div class="quantity">{{ ingQuant(quantity, total_weight) }}</div> -->
        <input class="quantity" id="total_var_weight" type="text" v-model="total_variable_weight" style="text-align:center; font-size:16px;">
      </div>
      <div class="ingredient-container hover-effect" style="font-weight:500;">
        <div class="ingredient">
          <div class="ingredient-text" style="padding-right:5px;">Total Weight - </div><span><input type="number" style="width:30px; font-size:16px;" v-model="percent">%</span> 
        </div>
        <div class="quantity">{{ ingQuant(1,sub_total_weight) }}</div>
        <div class="quantity">{{ ingQuant(quantity, sub_total_weight) }}</div>
      </div>
    </div>
    <div id="instructions-container">
      <div id="instructions">
        {{ instructions }}
      </div>
      <br> <br>
    </div>
  </div>
</template>

<script>
export default {
  name: "Recipe",
  props: {
    path: String
  },
  data: function() {
    return {
      obj: null, // is object containing dessert info
      name: "",
      ingredients: "",
      instructions: "",
      extra_info: "",
      total_weight: "",
      sub_total_weight: "",
      quantity: 0,
      total_variable_weight:"0g",
      switch: true,
      percent:10,
      first: true,
    };
  },
  methods: {
    updateQuantity: function(event) {
      window.console.log(event.target.value);
      this.quantity = event.target.value || 0;
    },
    // calculate the new mulitplied quantity
    ingQuant: function(multiplier, quant) { 
      quant=quant || ""
      quant = quant.toString();
      // window.console.log('mult: ' + multiplier);
      multiplier = multiplier || 0;
      // window.console.log('hiaare');
      if(isNaN(multiplier))multiplier=0;
      // let p = multiplier || 99
      // window.console.log(p);
      // window.console.log('here are some things');
            // window.console.log(multiplier);
            // window.console.log(quant);
      multiplier = Number(multiplier);
      quant=quant.replace(" + ?","")
      // window.console.log('here');
      // window.console.log(multiplier);
      var final_string, final_quantity;
      var index = quant.indexOf("ind") == -1 ? -2 : -4;
      // window.console.log("multiplier:  " + multiplier);
      // window.console.log('num: '+ Number(quant.slice(0, index+1)));
      var num = multiplier * Number(quant.slice(0, index+1));
      final_quantity = this.rounder(num);

      var temp_str = quant.slice(index+1, quant.length);
      final_string = final_quantity + temp_str;
      return final_string;
    },
    rounder: function(number){

      number = Number(number.toString());
      // if number has no decimals return number
      if(number%1==0) return number;

      // separate number into decimal and non deciaml
      let nondecimals = number.toString().split(".")[0];
      if(nondecimals.length>2) return Math.round(Number(nondecimals));
      // if(nondecimals.length==2) return number.toFixed(1);
      if(nondecimals.length<3) return number.toFixed(2-Math.floor(Math.log10(number)));
      // use at most three digits otherwise and get rid of 
        
    },
    goBack: function(){
      this.$emit("go-back");
    },
    editRecipe: function(){
      this.$emit("edit-recipe",this.obj);
    },
  },
  beforeMount() {
    // read file
    const fs = require("fs");
    fs.readFile(this.path, (err, data) => {
      if (err) throw err;
      data = data.toString();
      window.console.log(data);
      const obj = JSON.parse(data);
      window.console.log(obj);
      this.obj = obj;
      this.name = obj.name;
      this.instructions = obj.instructions;
      this.ingredients = obj.ingredients;
      this.extra_info = obj.extra_info;

      //total weight
      var total_weight = 0;
      var str = "";
      for (const ing of obj.ingredients) {
        if (ing[1].indexOf("ind") != -1) {
          if (str === "") str = " + ";
          str += "?";
          continue;
        }
        let weight = ing[1].replace("g", "");
        weight = Number(weight);
        total_weight += weight;
      }
      this.total_weight = "" + total_weight + "g" + str;
      var num = total_weight * 0.9;
      this.sub_total_weight = "" + num.toFixed(2) + "g" + str;
      // this.total_variable_weight = this.ingQuant(this.quantity,total_weight);
      this.total_variable_weight = "0g";

      //let's check that rounding function works properly
      let a = [1,2,3.000,3.001,2.99,3.01,0.000123,5678.345]
      for(let i of a){
        window.console.log(i + "  " + this.rounder(i));
      }
    });
  },
  watch:{
    quantity: function(){
      if(!this.switch){
        this.switch = true;
        return;
      }
      this.switch = false;
      this.total_variable_weight = this.ingQuant(this.quantity,this.total_weight);
      window.console.log('watch quantity has been called' + this.quantity);
    },
    total_variable_weight: function(){
      if(!this.switch){
        this.switch = true;
        return;
      }

      this.switch = false;
      let total_weight = this.total_weight.replace(" + ?","");
      window.console.log('here is the total weight: ' + total_weight);
      window.console.log('total var weight: ' + this.total_variable_weight);
       window.console.log('total var weight: ' + document.getElementById("total_var_weight").value);

      var index = total_weight.indexOf("ind") == -1 ? -2 : -4;


      window.console.log('yes ysesdfahsfkjjsdfhakj fajsdfhlakjshflka jsdflkajsdfkajsdfkjasdfkjadlsfkjh');
      this.quantity = this.rounder(Number(this.total_variable_weight.replace('g',"").replace("ind",""))/Number(total_weight.slice(0, index+1)));
      window.console.log(total_weight.slice(0, index+1));
      window.console.log(Number(total_weight.slice(0, index+1)) + "   aa");
      window.console.log('watch total_variable_weight has been called' + this.quantity);
    },
    percent: function(){
      let percentage = this.rounder(1-this.percent/100);
      this.sub_total_weight = this.ingQuant(percentage, this.total_weight);
    },
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
  text-align: center;
  display: inline-block;
  padding-right: 20%;
}

#ingredients {
  margin-top: 70px;
  margin-right: 15%;
  margin-left: 15%;
}

.hover-effect:hover {
  background-color: blue;
  color: red;
}
.quantity {
  margin-left: 40px;
  width: 120px;
}
#instructions-container {
  margin-top: 70px;
  white-space: pre-wrap;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

#instructions {
  text-align: left;
  display: inline-block;
}

#name {
  font-size: 24px;
}

#extra-info {
  text-align: right;
  position: absolute;
  right: 30px;
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
#go-back{
  position: absolute;
  left:25px;
  top:25px;
  cursor: pointer;
}
#edit{
  position: absolute;
  top: 25px;
  right:25px;
  cursor: pointer;
}
</style>

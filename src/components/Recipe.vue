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
        <input class="quantity" type="text" v-model="total_variable_weight" style="text-align:center; font-size:16px;">
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
      total_variable_weight:"",
      switch: true,
      percent:10,
    };
  },
  methods: {
    updateQuantity: function(event) {
      window.console.log(event.target.value);
      this.quantity = event.target.value || 0;
    },
    // calculate the new mulitplied quantity
    ingQuant: function(multiplier, quant) { 
      multiplier = multiplier || 0;
      // window.console.log('hiaare');
      if(isNaN(multiplier))multiplier=0;
      // let p = multiplier || 99
      // window.console.log(p);
      multiplier = Number(multiplier);
      window.console.log('here');
      window.console.log(multiplier);
      var final_string, final_quantity;
      var index = quant.indexOf("ind") == -1 ? -2 : -4;
      var num = multiplier * Number(quant.slice(0, index+1));
      final_quantity = this.rounder(num);

      var temp_str = quant.slice(index+1, quant.length);
      final_string = final_quantity + temp_str;
      return final_string;
    },
    rounder: function(number){
        number = number.toFixed(2)
        // if num = has no decimals return num
        var decimals = number.toString().split(".")[1];
        if (!decimals) return number;
        // if number conatains 1 single decimal / the last decimal is 0
        const a = decimals[0];
        const b = decimals[1];
        if(!b || b==0){
            return Number(number.toString())
        }
        // round if decimals are close to 0 or 1
        else if(a+b=="00" || a+b=="99") return Number(number.toString().split(".")[0]);
        else{
            return number;
        }
        
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
      this.total_variable_weight = this.ingQuant(this.quantity,this.total_weight);
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
      this.quantity = this.rounder(this.total_variable_weight/this.total_weight);
      var index = this.total_weight.indexOf("ind") == -1 ? -2 : -4;
      this.quantity = this.rounder(Number(this.total_variable_weight.slice(0, index+1))/Number(this.total_weight.slice(0, index+1)));
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

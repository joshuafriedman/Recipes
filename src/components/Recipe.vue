<template>
  <div id="main">
    <div v-if="edit" id="go-back" @click="goBack">&larr;</div>
    <div v-if="edit" id="edit" @click="editRecipe">Edit</div>
    <div v-if="edit" id="copy" @click="copyRecipe">Copy</div>
    <span id="name" @click="toggleViewMode">{{ name }}</span>
    <span id="extra-info">{{ extra_info }}</span> <span id="afp">AFP</span>
    <div id="ingredients">
      <div class="ingredient-container seperate nohover">
        <div class="ingredient">
          <div class="ingredient-text" :class="{ 'down': variable_quantities.length!=0, 'up':variable_quantities.length==0 }" >Ingredient Name</div>
        </div>
        <div class="quantity" :class="{ 'down': variable_quantities.length!=0 , 'up':variable_quantities.length==0}" >Single Quantity</div>
        <div v-for="(quant,index) in variable_quantities" :key="quant.key" >
          <div class="quantity">
          Variable Quantity
          <input
            type="number"
            name=""
            id="numberr"
            style="width:60px;font-size:16px;"
            placeholder=""
            v-model="variable_quantities[index]"
            :class="{ 'hide-box': !edit }"
          />
        </div>
        </div>

        <button v-if="edit" class="del-variable-quantity" @click="delCol">
          -
        </button>
        <button v-if="edit" class="add-variable-quantity" @click="addCol">
          +
        </button>
      </div>

      

      <div v-for="(ingredient, index) in ingredients" :key="ingredient.id">
        <div
          class="ingredient-container hover-effect"
          :class="{ alternate: !edit && index % 2 == 0 }"
        >
          <div class="ingredient">
            <div class="ingredient-text">{{ ingredient[0] }}</div>
          </div>
          <div class="quantity">{{ ingredient[1] }}</div>
          <div v-for="(quant) in variable_quantities" :key="quant.id">

          <div class="quantity">{{ ingQuant(quant, ingredient[1]) }}</div>

          </div>
        </div>
      </div>
      <div class="ingredient-container seperate hover-effect">
        <div class="ingredient">
          <div class="ingredient-text">Total Weight</div>
        </div>
        <div class="quantity">{{ total_weight }}</div>
        <!-- <div class="quantity">{{ ingQuant(quantity, total_weight) }}</div> -->

        <div v-for="(weight,index) in variable_weights" :key="weight.id">

        <input
          :class="{ 'hide-box': !edit }"
          class="quantity"
          id="total_var_weight"
          type="text"
          v-model="variable_weights[index]"
          style="text-align:center; font-size:16px;"
        />

      </div>

      </div>
      <div class="ingredient-container hover-effect" style="font-weight:500;">
        <div class="ingredient">
          <div class="ingredient-text" style="padding-right:5px;">
            Total Weight -
          </div>
          <span
            ><input
              :class="{ 'hide-box': !edit }"
              type="number"
              style="width:40px; font-size:16px;"
              v-model="percent"
            />%</span
          >
        </div>
        <div class="quantity">{{ ingQuant(1, sub_total_weight) }}</div>
        <!-- <div class="quantity">{{ ingQuant(quantity, sub_total_weight) }}</div> -->

        <div v-for="(weight) in variable_weights" :key="weight.id">
          <div class="quantity">{{ ingQuant(percentage, weight) }}</div>
        </div>

      </div>

      

    </div>
    <div id="instructions-container">
      <div id="instructions">
        {{ instructions }}
      </div>
      <br />
      <br />
    </div>
  </div>
</template>

<script>
export default {
  name: "Recipe",
  props: {
    path: String,
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
      total_variable_weight: "0g",
      switch: true,
      percent: 10,
      percentage: 90,
      first: true,
      edit: true, // view/print mode,
      variable_quantities: [0],
      variable_weights: ["0g"],
    };
  },
  methods: {
    updateQuantity: function(event) {
      window.console.log(event.target.value);
      this.quantity = event.target.value || 0;
    },
    // calculate the new mulitplied quantity
    ingQuant: function(multiplier, quant) {
      quant = quant || "";
      quant = quant.toString();
      // window.console.log('mult: ' + multiplier);
      multiplier = multiplier || 0;
      // window.console.log('hiaare');
      if (isNaN(multiplier)) multiplier = 0;
      // let p = multiplier || 99
      // window.console.log(p);
      // window.console.log('here are some things');
      // window.console.log(multiplier);
      // window.console.log(quant);
      multiplier = Number(multiplier);
      quant = quant.replace(" + ?", "");
      // window.console.log('here');
      // window.console.log(multiplier);
      var final_string, final_quantity;
      var index = quant.indexOf("ind") == -1 ? -2 : -4;
      // window.console.log("multiplier:  " + multiplier);
      // window.console.log('num: '+ Number(quant.slice(0, index+1)));
      var num = multiplier * Number(quant.slice(0, index + 1));
      final_quantity = this.rounder(num);

      var temp_str = quant.slice(index + 1, quant.length);
      final_string = final_quantity + temp_str;
      return final_string;
    },
    rounder: function(number) {
      number = Number(number.toString());
      // if number has no decimals return number
      if (number % 1 == 0) return number;

      // separate number into decimal and non deciaml
      let nondecimals = number.toString().split(".")[0];
      if (nondecimals.length > 2) return Math.round(Number(nondecimals));
      // if(nondecimals.length==2) return number.toFixed(1);
      if (nondecimals.length < 3)
        return number.toFixed(2 - Math.floor(Math.log10(number)));
      // use at most three digits otherwise and get rid of
    },
    goBack: function() {
      this.$emit("go-back");
    },
    editRecipe: function() {
      this.$emit("edit-recipe", this.obj);
    },
    copyRecipe: function() {
      this.$emit("edit-recipe", {...this.obj, copy:true});
    },
    toggleViewMode: function() {
      // switch view between edit and print
      this.edit = !this.edit;
    },
    addCol: function() {
      this.variable_quantities.push(0);
      this.variable_weights.push("0g");
    },
    delCol: function() {
      this.variable_quantities = this.variable_quantities.slice(0,this.variable_quantities.length-1);
      this.variable_weights = this.variable_weights.slice(0,this.variable_weights.length-1);
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
    });
  },
  beforeUpdate() {
    (() => (document.getElementById("main").style.opacity = 1))();
    // setTimeout(()=>document.getElementById("main").style.opacity = 1,50)
  },
  watch: {
    quantity: function() {
      if (!this.switch) {
        this.switch = true;
        return;
      }
      this.switch = false;
      this.total_variable_weight = this.ingQuant(
        this.quantity,
        this.total_weight
      );
      window.console.log("watch quantity has been called" + this.quantity);
      window.console.log(this.quantity == "");
    },
    variable_quantities: {
      deep: true,
      handler: function(new_val) {

        if (!this.switch) {
        this.switch = true;
        return;
      }
      this.switch = false;
      this.variable_weights = this.variable_quantities.map( val => this.ingQuant(
        val,
        this.total_weight
      ));

        window.console.log("watch_var_quants", this.total_weight);
        window.console.log(new_val);
      },
    },
    variable_weights: {
      deep: true,
      handler: function(new_val) {

        if (!this.switch) {
        this.switch = true;
        return;
      }

      this.switch = false;
      for (let i = 0; i < new_val.length; i++) {
        
      let total_weight = this.total_weight.replace(" + ?", "");
      window.console.log("here is the total weight: " + total_weight);
      window.console.log("total var weight: " + this.total_variable_weight);
      window.console.log(
        "total var weight: " + document.getElementById("total_var_weight").value
      );

      var index = total_weight.indexOf("ind") == -1 ? -2 : -4;

      window.console.log(
        "yes ysesdfahsfkjjsdfhakj fajsdfhlakjshflka jsdflkajsdfkajsdfkjasdfkjadlsfkjh"
      );
      this.variable_quantities[i] = this.rounder(
        Number(new_val[i].replace("g", "").replace("ind", "")) /
          Number(total_weight.slice(0, index + 1))
      );
      window.console.log(total_weight.slice(0, index + 1));
      window.console.log(Number(total_weight.slice(0, index + 1)) + "   aa");
      window.console.log(
        "watch total_variable_weight has been called" + this.quantity
      );
      }

        this.variable_quantities = [...this.variable_quantities]
        window.console.log("watch_var_weights");
      },
    },
    total_variable_weight: function() {
      if (!this.switch) {
        this.switch = true;
        return;
      }

      this.switch = false;
      let total_weight = this.total_weight.replace(" + ?", "");
      window.console.log("here is the total weight: " + total_weight);
      window.console.log("total var weight: " + this.total_variable_weight);
      window.console.log(
        "total var weight: " + document.getElementById("total_var_weight").value
      );

      var index = total_weight.indexOf("ind") == -1 ? -2 : -4;

      window.console.log(
        "yes ysesdfahsfkjjsdfhakj fajsdfhlakjshflka jsdflkajsdfkajsdfkjasdfkjadlsfkjh"
      );
      this.quantity = this.rounder(
        Number(this.total_variable_weight.replace("g", "").replace("ind", "")) /
          Number(total_weight.slice(0, index + 1))
      );
      window.console.log(total_weight.slice(0, index + 1));
      window.console.log(Number(total_weight.slice(0, index + 1)) + "   aa");
      window.console.log(
        "watch total_variable_weight has been called" + this.quantity
      );
    },
    percent: function() {
      let percentage = this.rounder(1 - this.percent / 100);
      this.percentage = percentage;
      this.sub_total_weight = this.ingQuant(percentage, this.total_weight);
    },
  },
};
</script>
<style scoped>
#main {
  transition: opacity 0.05s;
  opacity: 0;
}
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

#name:hover {
  cursor: pointer;
}
#name:active {
  font-weight: bold;
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
#go-back {
  position: absolute;
  left: 25px;
  top: 25px;
  cursor: pointer;
}
#edit {
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
}
.alternate {
  background-color: rgb(244, 244, 244);
  -webkit-print-color-adjust: exact;
}
.down {
  position: relative;
  bottom: -20px;
}
.up{
  position: relative;
  bottom: 20px;
}
.hide-box {
  border: none;
}
.add-variable-quantity {
  font-size: 20px;
  border-radius: 15px;
  background-color: rgb(228, 222, 222);
  cursor: pointer;
  height:30px;
  position: absolute;
  right:100px;
}
.del-variable-quantity {
  font-size: 20px;
  border-radius: 15px;
  background-color: rgb(228, 222, 222);
  cursor: pointer;
  height:30px;
  position: absolute;
  right:130px;
  width: 30px;
}
</style>

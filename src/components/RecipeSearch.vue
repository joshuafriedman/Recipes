<template>
  <div>
    <!-- <input type="text" name="" id="search" v-model="inp" autofocus /> -->
    <div id="search-input">
      <div class="form__group field">
        <input
          type="input"
          class="form__field"
          placeholder="Name"
          name="name"
          id="name"
          autofocus
          v-model="inp"
        />
        <label for="name" class="form__label">Recipe name</label>
      </div>
    </div>
    <div v-for="recipe in recipes" :key="recipe.key">
      <div
        class="recipee"
        @click="$emit('openRecipe', { path: recipe.path, event: $event })"
        v-if="recipe.name.toLowerCase().indexOf(inp) != -1"
      >
        {{ recipe.name }}
      </div>
    </div>
    <div v-if="no_matches" id="no-recipe-match">No recipes matched</div>
  </div>
</template>

<script>
export default {
  name: "RecipeSearch",
  data: function() {
    // get all recipes paths
    const homedir = require("os").homedir();
    window.console.log(homedir);
    const recipes_path = homedir + "/desktop/all_recipes"; //"../all_recipes";

    var recursive = require("recursive-readdir");
    const that = this;
    var path = require("path");
    recursive(recipes_path, (err, files) => {
      if (err) throw err;
      window.console.log("getting recipes!");
      window.console.log(files);
      that.recipes = files
        .filter(
          (val) =>
            val.toLowerCase().indexOf(".jshn") != -1 &&
            val.toLowerCase().indexOf(".ds_s") == -1
        )
        .map((val) => ({
          path: val,
          name: path.basename(val.substring(0, val.length - 5)),
        }));
      window.console.log("dee recipes", that.recipes);
      that.update = true;
    });
    // only care about files with jshn extension

    return {
      inp: "",
      recipes: {},
      udpdate: false,
      no_matches: false,
    };
  },
  watch: {
    inp: function() {
      if (
        this.recipes.filter(
          (recipe) => recipe.name.toLowerCase().indexOf(this.inp) != -1
        ).length === 0
      )
        this.no_matches = true;
      else {
        this.no_matches = false;
      }
    },
  },
};
</script>
<style scoped>
#no-recipe-match {
  opacity: 0.7;
}
.recipee:hover {
  cursor: pointer;
  text-decoration: underline;
}
.recipee {
  width: 300px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1px;
}
#search-input {
  margin-bottom: 40px;
}

#search-input {
  margin-left: auto;
  margin-right: auto;
}

.form__group {
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}
.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid #9b9b9b;
  outline: 0;
  font-size: 1.3rem;
  /* color: #fff; */
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;
}
.form__field::placeholder {
  color: transparent;
}
.form__field:placeholder-shown ~ .form__label {
  font-size: 1.3rem;
  cursor: text;
  top: 20px;
}
.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #9b9b9b;
}
.form__field:focus {
  padding-bottom: 6px;
  border-width: 3px;
  border-image: linear-gradient(to right, #11998e, #38ef7d);
  border-image-slice: 1;
}
.form__field:focus ~ .form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #11998e;
  font-weight: 700;
}
/* reset input */
.form__field:required,
.form__field:invalid {
  box-shadow: none;
}
/* demo */
body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  background-color: #222;
}
</style>

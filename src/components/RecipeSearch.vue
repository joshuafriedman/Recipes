<template>
    <div>
        <input type="text" name="" id="name" v-model="inp">
        <div v-for="recipe in recipes" :key=recipe.key>
            <div class="recipee" @click="$emit('openRecipe',recipe.path)" v-if="recipe.name.toLowerCase().indexOf(inp)!=-1"> {{ recipe.name }} </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "RecipeSearch",
    data: function(){
        // get all recipes paths
        const recipes_path = "../all_recipes"
        var recursive = require("recursive-readdir");
        const that = this;
        var path = require('path');
        recursive(recipes_path,(err,files)=>{
            if(err) throw err;
            window.console.log('getting recipes!');
            window.console.log(files);
            that.recipes = files.filter(val=>val.toLowerCase().indexOf('.jshn')!=-1 && val.toLowerCase().indexOf('.ds_s')==-1).map(val=>({path:val,name:path.basename(val.substring(0,val.length-5))}));
            window.console.log('dee recipes',that.recipes);
            that.update = true;
        });
        // only care about files with jshn extension

        return{
            inp:"",
            recipes:{},
            udpdate: false
        }
    }
}
</script>
<style scoped>
.recipee:hover{
    cursor: pointer;
}
</style>
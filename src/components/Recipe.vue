<template>
    <div>
        <span><h3>{{ name }}</h3>  {{ extra_info }}hmm </span>
        <div id="ingredients">
            <div v-for="ingredient in ingredients" :key="ingredient.id">
                <div class="ingredient"> {{ ingredient[0] }} </div>
                <span class="quantity"> {{ ingredient[1] }}</span>
            </div>
        </div>
        <div id="instructions"> {{instructions}} </div>

    </div>
</template>

<script>
export default {
    name: "Recipe",
    props:{
        path: String
    },
    data: function(){
        return{
            obj: null, // is object containing dessert info
            name: "",
            ingredients:"",
            instructions:"",
            extra_info:"",
        }
    },
    beforeMount(){
        // read file
        const fs = require("fs");
        fs.readFile(this.path,(err,data)=>{
            if(err) throw err;
            data = data.toString();
            window.console.log(data);
            const obj = JSON.parse(data);
            window.console.log(obj);
            this.obj = obj;
            this.name = obj.name;
            this.instructions = obj.instructions;
            this.ingredients = obj.ingredients;
            this.extra_info = obj.extra_info;
        });
    },
}
</script>
<style scoped>
.ingredient{
    width: 400px;
}
#instructions{
    margin-top: 80px;
}


#instructions{
    margin-top: 80px;
    white-space: pre-wrap;
}
</style>
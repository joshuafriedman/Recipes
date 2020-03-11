<template>
    <div>
        <span id="name">{{ name }}</span> <span id="extra-info">{{ extra_info }}</span> <span id="afp">AFP</span>
        <input type="number" name="" id="number" @keydown="udpateQuantity">
        <div id="ingredients">
            <div v-for="ingredient in ingredients" :key="ingredient.id">
                <div class="ingredient-container">
                <div class="ingredient"> <div class="ingredient-text">{{ ingredient[0] }} </div></div>
                <div class="quantity"> {{ ingredient[1] }}</div>
                <div class="quantity"> {{ quantity*ingredient[1] }}</div>
                </div>
            </div>
            <div class="ingredient-container seperate">
                <div class="ingredient"> <div class="ingredient-text"> Total Weight </div></div>
                <div class="quantity"> {{ total_weight }}</div>
                </div>
            <div class="ingredient-container" style="font-weight:500;">
                <div class="ingredient"> <div class="ingredient-text"> Total Weight -10% </div></div>
                <div class="quantity"> {{ sub_total_weight }}</div>
                </div>
        </div>
        <div id="instructions-container"> 
            <div id="instructions">
                {{instructions}}
            </div>
             </div>

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
            total_weight: "",
            sub_total_weight: "",
            quantity:0
        }
    },
    mathods:{},
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

            //total weight
            var total_weight=0;
            var str = "";
            for(const ing of obj.ingredients){
                if(ing[1].indexOf("ind")!=-1){
                    if(str==="") str=" + "
                    str+="?"
                    continue
                }
                let weight = ing[1].replace("g","");
                weight = Number(weight)
                total_weight+=weight
            }
            this.total_weight = ""+total_weight+"g" + str;
            var num  = total_weight*0.9;
            this.sub_total_weight = ""+ num.toFixed(2)+"g"+str;
        });
    },
}
</script>
<style scoped>
.ingredient{
    width: 400px;
    text-align: center;
}
.ingredient-container{
    display: flex;
    flex-direction: row;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
    padding-top: 4px;
    padding-bottom: 4px;
    border-bottom: 1px solid black;
}
.ingredient-text{
    text-align: center;
    display:inline-block;
    padding-right:20%; 
}

#ingredients{
    margin-top: 70px;
    margin-right: 15%;
    margin-left: 15%;
}

.ingredient-container:hover{
    background-color:blue;
    color: red;
}
.quantity{
    margin-left: 100px;
}
#instructions-container{
    margin-top: 70px;
    white-space: pre-wrap;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}


#instructions{
    text-align: left;
    display: inline-block;
}

#name{
    font-size: 24px;
}

#extra-info{
    text-align: right;
    position: absolute;
    right: 30px;
}
#afp{
    position: absolute;
    left: 30px;
    font-family: cursive;
}
.seperate{
    margin-top: 30px;
    font-weight: 500;
}
</style>
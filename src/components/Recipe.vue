<template>
    <div></div>
</template>

<script>
export default {
    name: "Recipe",
    props:{
        path: String
    },
    beforeMount(){
        // read file
        const fs = require("fs");
        fs.readFile(this.path,(err,data)=>{
            if(err) throw err;
            window.console.log(data);
        });
    }
}
</script>
<style scoped>

</style>
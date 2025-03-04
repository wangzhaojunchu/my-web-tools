
const Sleep = function(millisec:number){
    return new Promise(resolve => {
        setTimeout(resolve, millisec);
    })
}

export default Sleep
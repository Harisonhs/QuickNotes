class Fields{
    constructor(form){
        this.fields = new Array();
        for(let i in form.children){
            let child = form.children[i];
            for(let j in child.children){
                let node = child.children[j];
                if(node.nodeName == "INPUT"){
                    this.fields.push(node.className);
                }
            }
        }
    }
}
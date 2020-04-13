// Author : Hritik Vaishnav

HTMLElement.prototype.$e = $e;
HTMLElement.prototype.closestX = closestX;
HTMLElement.prototype.$cs = $cs;
HTMLElement.prototype.$s = $s;
HTMLElement.prototype.$a = $a;
HTMLElement.prototype.$evt = $evt;
HTMLElement.prototype.toggleX = toggleX;
HTMLElement.prototype.checkOverflowX = checkOverflowX;

//function definations----
//new element creation function
let newElement = function (props) {
    let elem = document.createElement(props.e);
    props.id ? elem.id = props.id: null;
    props.cls ? elem.className = props.cls: null;
    props.link ? elem.href = props.link: null;
    props.src ? elem.src = props.src: null;
    props.txt ? elem.innerText = props.txt: null;
    props.evt ? elem.addEventListener(props.evt,props.fn) : null;
    return elem;
}

//search elem
function $e(elem){
    if(this === window){
        if(elem[0] === '@'){
            let temp = elem.substr(1)
            return document.querySelectorAll(temp);
        }
        else{
            return document.querySelector(elem);
        }
    }
    else{
        if(elem[0] === '@'){
            let temp = elem.substr(1)
            return this.querySelectorAll(temp);
        }
        else{
            return this.querySelector(elem);
        }
    }
}

//fast for
function fast4(start,end,callback){
    for(let i=start; i<end; i++){
        callback(i);
    }
}

//styling of element
let styleDict = {h:'height',w:'width',c:'color',bg:'background',bgc:'background-color',
        f:'font',t:'top',b:'bottom',r:'right',l:'left',d:'display',tr:'transform',
        ts:'transition',br:'border',brs:'border-radius',fs:'font-size',fw:'font-weight',
        a:'animation',ad:'animation-duration',v:'visibility',maxh:'max-height',minw:'max-width',
        minh:'min-height',minw:'min-width',p:'padding',pt:'padding-top',pb:'padding-bottom',
        pr:'padding-right',pl:'padding-left',m:'margin',mt:'margin-top',mb:'margin-bottom',
        mr:'margin-right',ml:'margin-left'}
function $s(styles,num) {
    let elem  = this;
    let temp = styles.split(',');
    if(temp[0][0] === '?'){
        let result=[];
        fast4(0,temp.length,function(i){
            let value = elem.style.getPropertyValue(styleDict[temp[i].substr(1)]);
            if(num){
                let z = parseInt(value);
                if(!isNaN(z)){
                    value = z;
                }
            }
            result.push(value);        
        });
        return result.length < 2 ? result[0] : result;
    }
    else{
        fast4(0,temp.length,function(i){
            let z = temp[i].match(/[!]?(.*)[:](.*)/);
            
            if(temp[i][0] === '!') elem.style.setProperty(styleDict[z[1]],z[2],'important');
            else elem.style.setProperty(styleDict[z[1]],z[2]);
        });
        return elem;
    }
}

//get attribute value
function $a(attribute,callback){
    let elem  = this;
    let temp = attribute.split(',');
    if(temp[0][0] === '?'){
        let result=[];
        fast4(0,temp.length,function(i){
            let value = elem.getAttribute(temp[i].substr(1));
            result.push(value);        
        });
        return result.length < 2 ? result[0] : result;
    }
    else if(callback){
        elem[attribute+'_callback'] = callback;
        elem.setAttribute(attribute,'this.'+attribute+'_callback()');
    }
    else{
        fast4(0,temp.length,function(i){
            let index = temp[i].indexOf(':');
            console.log(temp[i]);
            elem.setAttribute(temp[i].substr(0,index),temp[i].substr(index+1));
        });
        return elem;
    }
}

//string dom maker
function newBlock(data){
    let callbackCode = [], dom = null, tree;
    if(data.indexOf('{') > -1){
        data = data.replace(/ /g,'');
        let pairs = findBracketPairs(data,'{','}');
        let temp = 1000;
        for(let i=pairs.length-1; i>-1; i--){
            if(pairs[i][1] < temp){
                temp = pairs[i][0];
                let str = data.substring(pairs[i][0],pairs[i][1]+1);
                callbackCode.push(str);
                data = data.replace(str,'callback');
            }
        }
        tree = data.split('>');
    }
    else{
        tree = data.replace(/ /g,'').split('>');
    }
    for(let i=0; i<tree.length; i++){
        let block = createBlock(tree[i]);
        dom === null ? dom=block : block.map(function(item){
            dom[dom.length-1].append(item);
        });
    }
    return dom;
    function createBlock(block){
        let temp = block.split('+');
        let elements = [];
        for(let i=0; i<temp.length; i++){
            if(temp[i] === 'callback'){
                let str = callbackCode.pop();
                let code = str.substring(1,str.length-1);
                let output = newBlock(code);
                output.length > 1 ? null:output = output[0];
                elements.push(output);
            }
            else{
                let element = create(temp[i]);
                elements.push(element);
            }
        }
        return elements;
    }
    function create(elem){
        let temp = elem.replace(/[#/]/g,' ').replace('.',' ').split(" ");
        let tag = temp[0];
        let txt = elem.search('/') > -1 ? temp[temp.length-1].replace(/[_]/g,' '):null;
        let id = elem.search('#') > -1 ? temp[1] :null;
        let classs = elem.search('[.]') > -1 ? (id ? temp[2] : temp[1]).replace(/[.]/g,' '):null;
        let e  = newElement({e:tag,cls:classs,id:id,txt:txt});
        return e;
    }
}

//finding bracket pairs indexs
function findBracketPairs(str,o,c){
    let open = []
    let pairs = [];
    for(var i=0; i<str.length;i++) {
        if (str[i] === o) open.push(i);
        else if(open.length > 0){
            if(str[i] === c){
                    let a = open.pop();
                    pairs.push([a,i]);
            }
        }
    }
    return pairs;
}

//finding the closest elem
function closestX(data){
    let p = this.parentElement;
    let tag;
    if(p === null){ return undefined }
    else{ tag = p.tagName.toLowerCase() }
    if(typeof data === 'string'){
        if(data.indexOf('.') > -1){
            let temp = data.split("."); 
            return find(temp); 
        }
        else{
            if(tag === data) { return p }
            else { find(data) }
        }
    }
    else { return find(data) }
    
    function find(temp){
        let cls = p.classList;
        if(tag === temp[0]){
            if(temp.length < 3){
                if(cls.contains(temp[1])) { return p }
                else { return p.closestX(temp) }
            }
            else{
                let flag;
                for(let i=1; i < (temp.length); i++){
                    if(cls.contains(temp[i])){ flag = true }
                    else{ return p.closestX(temp) }
                }
                if(flag) { return p }
            }
        }
        else{ return p.closestX(temp) }
    }
}

//getting computed style
function $cs(props,num){
    let output=[];
    let e = this;
    props = props.split(',');
    fast4(0,props.length,function(i){
        let value = window.getComputedStyle(e,null).getPropertyValue(styleDict[props[i]]);
        if(num){
            let z = parseInt(value);
            if(!isNaN(z)){
                value = z;
            }
        }
        output.push(value);
    });
    return output.length < 2 ? output[0] : output;
}

//popup event listners
class ClosePopUp{
    constructor(data){
        this.elem = data.e;
        this.outer = data.o;
        this.flag = false;
        this.fn1 = function(){event.stopPropagation()};
        this.fn2 = function(){data.fn()};
    }

    setListner(){
        this.elem.addEventListener('click',this.fn1);
        this.outer.addEventListener('click',this.fn2);
    }

    rmListners(){
        this.elem.removeEventListener('click',this.fn1);
        this.outer.removeEventListener('click',this.fn2);
    }
}

// open box function
function toggleBox(target,props,dflag,state){
    let e; 
    typeof target === 'string' ? e = document.querySelector(target):e = target;
    let status = e.toggleBoxFlag;
    status === undefined ? state ? setId(state) : setId() : null;
    if(props){
        props.s ? null : props.s ='fadeIn';
        props.e ? null : props.e ='fadeOut';
        props.t ? null : props.t =400;
    } 
    else{
        props.s ='fadeIn';
        props.e ='fadeOut';
        props.t =400;
    }
    e.style.animationDuration = props.t+'ms';

    if(dflag){
        if(status){
            e.className += ' ' + props.e;
            setTimeout(function(){
                e.$s("d:none,ad:");
                e.classList.remove(props.s,props.e);
                e.toggleBoxFlag = false;
            },props.t-10);
        }
        else{
            e.className += ' ' +props.s;
            e.$s("d:"+props.d);
            e.toggleBoxFlag = true;
        }
    }
    else{
        if(status){
            e.className += ' ' + props.e;
            setTimeout(function(){
                e.$s("v:hidden,ad:");
                e.classList.remove(props.s,props.e);
                e.toggleBoxFlag = false;
            },props.t-10);
        }
        else{
            e.$s("v:visible");
            e.className += ' ' +props.s;
            e.toggleBoxFlag = true;
        }
    }

    function setId(state){
        if(state) { 
           if(state='enter') {e.toggleBoxFlag = false; status = false}
           else {e.toggleBoxFlag = true; status = true} 
        }
        else if(e.$cs('d') !== "none"){
            if(e.$cs('v') !== "hidden") { e.toggleBoxFlag = true; status = true }
            else { e.toggleBoxFlag = false; status = false }
        }
        else{
            e.toggleBoxFlag = false; status = false;
        }
    }
}

//setpop function
function setPopUp({tar,out,btn,props}){
    let obj = new ClosePopUp({e:tar,o:out,fn:toDo});
    btn.addEventListener('click',toDo);
    function toDo(){
        event.stopPropagation();
        toggleBox(tar,props);
        if(obj.flag){
            obj.rmListners();
            obj.flag = false;
        }
        else{
            obj.setListner();
            obj.flag = true;
        }
    }
}

//add event listner
class listnerObj{
    constructor(type,fn,elem,name){
        this.temp = 1;
        this.callbacks={};
        name ? null : name='fn' + this.temp;
        this.callbacks[name] = fn;
        this.type = type;
        this.elem = elem;
    }

    add(fn,name){
        name ? null : name='fn'+this.temp + 1;
        this.callbacks[name] = fn;
    }

    rm(fn){
        let target = this.elem;
        let functions = this.callbacks;
        let type = this.type;
        if(!fn){
            let k = keys(functions);
            fast4(0,k.length,function(i){
                target.removeEventListener(type,functions[k[i]])
            });
        }
        else{
            fn = fn.split(',');
            fast4(0,fn.length,function(i){
                let fntorm = functions[fn[i]];
                target.removeEventListener(type,fntorm)
            });
        }
    }
}

function $evt(type,callback,name){
    let elem = this === window ? document : this;
    elem[type+'evt'] ? elem[type+'evt'].add(callback,name):
                        elem[type+'evt'] = new listnerObj(type,callback,elem,name);
    this.addEventListener(type,callback);
}

//check if elem is in overflow state
function checkOverflowX(){
    let padding = this.$cs('pt',true) + this.$cs('pb',true);
    let height = this.offsetHeight;
    let scrHeight = this.scrollHeight;
    if(scrHeight > padding + height) return true;
    else return false;
}

function toggleX(prop,value){
    let cvalue,property,temp;
    switch (prop[0]) {
        case 's':
            temp = prop.split('.')[1];
            property = temp[0] === '!' ? styleDict[temp.substr(1)] : styleDict[temp];
            let oldValue = 'old'+property.replace('-','_');
            this.style[property] ? cvalue = this.style[property] : cvalue="";
            this[oldValue] !== undefined ? null : this[oldValue] = cvalue;
            if(temp[0] === '!'){
                if(typeof value === 'object'){
                    if(cvalue === value[0]) this.style.setProperty(property,value[1],'important');
                    else this.style.setProperty(property,value[0],'important');
                }
                else{
                    if(cvalue === value) this.style.setProperty(property,this[oldValue],'important');
                    else this.style.setProperty(property,value,'important');
                }
            }
            else{
                if(typeof value === 'object'){
                    if(cvalue === value[0]) this.style.setProperty(property,value[1]);
                    else this.style.setProperty(property,value[0]);
                }
                else{
                    if(cvalue === value) this.style.setProperty(property,this[oldValue]);
                    else this.style.setProperty(property,value);
                }
            }
            break;
    
        case 't':
            cvalue = this.innerText;
            this.oldText ? null : this.oldText = cvalue;
            if(typeof value === 'object'){
                if(cvalue === value[0]) this.innerText = value[1];
                else this.innerText = value[0];
            }
            else{
                if(cvalue === value) this.innerText = this.oldText;
                else this.innerText = value;
            }
            break;

        case 'a':
            property = prop.split('.')[1];
            cvalue = this.getAttribute(property);
            this['old'+property] ? null : this['old'+property] = cvalue;
            if(typeof value === 'object'){
                if(cvalue === value[0]) this.setAttribute(property,value[1]);
                else this.setAttribute(property,value[0]);
            }
            else{
                if(cvalue === value) this.setAttribute(property,this['old'+property]);
                else this.setAttribute(property,value);
            }
            break;
            
        case 'c':
            cvalue = this.className;
            this.oldClass ? null : this.oldClass = cvalue;
            if(typeof value === 'object'){
                if(cvalue === this.oldClass+' '+value[0]) this.className = this.oldClass+' '+value[1];
                else this.className = this.oldClass+' '+value[0];
            }
            else{
                if(cvalue !== this.oldClass) this.className = this.oldClass;
                else this.className = cvalue+' '+value;
            }
            break;        

        default:
            break;
    }
}
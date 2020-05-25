// Author : Hritik Vaishnav
// LinkedIn : https://in.linkedin.com/in/hritik-vaishnav

HTMLElement.prototype.$e = $e;
HTMLElement.prototype.$E = $E;
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
    props.rel ? elem.rel = props.rel: null;
    props.src ? elem.src = props.src: null;
    props.txt ? elem.innerText = props.txt: null;
    props.evt ? elem.addEventListener(props.evt,props.fn) : null;
    return elem;
}

//search elem
function $id(a){
    return document.getElementById(a);
}
function $cls(a){
    return document.getElementsByClassName(a);
}
function $tag(a){
    return document.getElementsByTagName(a);
}
function $E(elem){
    let e = this.nodeType === 1 ? this : document;
    switch (elem[0]) {
        case '#':
            return e.getElementById(elem.substr(1));
        case '.':
            return e.getElementsByClassName(elem.substr(1));
        default:
            return e.getElementsByTagName(elem);
    }
}
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
        mr:'margin-right',ml:'margin-left',of:'overflow',ofy:'overflow-y',ofx:'overflow-x',
        bgp:'background-position',bgpx:'background-position-x',bgpy:'background-position-y'}
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

//manipulating stylesheet
function addCSSRuleX(sheet, selector, rules, index) {
    index = index !== undefined ? index : length();
	if(sheet.insertRule) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else if(sheet.addRule) {
		sheet.addRule(selector, rules, index);
    }
    function length(){
        if(sheet.cssRules) return sheet.cssRules.length
        else return sheet.rules.length;
    }
}
function rmCssRuleX([sheet,rule],index) {
    let rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
    index = index !== undefined ? index : findIndex();
    if(index !== null){
        sheet.deleteRule ? sheet.deleteRule(index) : sheet.removeRule(index);
    }
    else{
        throw "No such rule exist";
    }
    function findIndex(){
        for(let i=0; i < rules.length; i++){
            if(rules[i].selectorText === rule)
                return i
        }
        return null;
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
            elem.setAttribute(temp[i].substr(0,index),temp[i].substr(index+1));
        });
        return elem;
    }
}

//string dom maker
function newBlock(data,rThis){
    rThis ? null : rThis = window;
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
                let output = newBlock(code,rThis);
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
        let temp = elem.split('@');
        let temp2 = temp[0].replace(/[#/]/g,' ').replace('.',' ').split(" ");
        let tag = temp2[0];
        let txt = temp[0].search('/') > -1 ? temp2[temp2.length-1].replace(/[_]/g,' '):null;
        let id = temp[0].search('#') > -1 ? temp2[1] :null;
        let classs = temp[0].search('[.]') > -1 ? (id ? temp2[2] : temp2[1]).replace(/[.]/g,' '):null;
        let fn = temp[1];
        let evt = fn ? 'click':null;
        let e  = newElement({e:tag,cls:classs,id:id,txt:txt,evt:'click',fn:rThis[fn]});
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

//finding the closest elem // newClosest X
function closestX(data){
    let temp = data;
    typeof data === 'object' ? null : (function(){
        let temp2 = data.indexOf('.');
        if(temp2 < 0) data = [temp];
        else data = [temp.substr(0,temp2),temp.substr(temp2+1).replace('.',' ')];
    })();
    return check(this);
    
    function check(e){
        if(checkName(e)){ return e }
        else{ 
            let p = e.parentElement;
            if(p !== null) return check(p)
            else return undefined;
        };
    } 
    function checkName(e){
        if(data[0]){
            if(e.tagName.toLowerCase() === data[0]){
                if(data[1])  return checkClass(e);
                else return true;
            }
            else return false;
        }
        else return checkClass(e);
    }
    function checkClass(e){
        let cls = data[1];
        if(e.className.search(cls) > -1) return true;
        else return false;
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
        this.fn1 = function(event){event.stopPropagation()};
        this.fn2 = function(event){data.fn(event)};
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
    let status = e.toggleBoxData ? e.toggleBoxData.flag : undefined;
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
            e.className = e.toggleBoxData.cls + ' ' + props.e;
            setTimeout(function(){
                e.$s("d:none,ad:");
                e.className = e.toggleBoxData.cls;
                e.toggleBoxData.flag = false;
            },props.t-10);
        }
        else{
            e.className += ' ' +props.s;
            e.$s("d:"+props.d);
            e.toggleBoxData.flag = true;
        }
    }
    else{
        if(status){
            e.className = e.toggleBoxData.cls + ' ' + props.e;
            setTimeout(function(){
                e.$s("v:hidden,ad:");
                e.className = e.toggleBoxData.cls;
                e.toggleBoxData.flag = false;
            },props.t-10);
        }
        else{
            e.$s("v:visible");
            e.className += ' ' +props.s;
            e.toggleBoxData.flag = true;
        }
    }

    function setId(state){
        e.toggleBoxData = {};
        e.toggleBoxData.cls = e.className;
        if(state) { 
           if(state='enter') {e.toggleBoxData.flag = false; status = false}
           else {e.toggleBoxData.flag = true; status = true} 
        }
        else if(e.$cs('d') !== "none"){
            if(e.$cs('v') !== "hidden") { e.toggleBoxData.flag = true; status = true }
            else { e.toggleBoxData.flag = false; status = false }
        }
        else{
            e.toggleBoxData.flag = false; status = false;
        }
    }
}

//setpop function
function setPopUp({tar,ignore,out,btn,props,dflag},bodyOverflowFlag){
    tar = typeof tar === 'string' ? $e(tar) : tar;
    fast4(0,btn.length,function(i){
        btn[i] = typeof btn[i] === 'string' ? $e(btn[i]) : btn[i];
        btn[i].addEventListener('click',toDo);
    });
    let obj = ignore ? new ClosePopUp({e:ignore,o:out,fn:toDo}) : new ClosePopUp({e:tar,o:out,fn:toDo});
    function toDo(event){
        event.stopPropagation();
        bodyOverflowFlag ? document.body.toggleX('s.of','hidden') : null;
        dflag ? toggleBox(tar,props,dflag) : toggleBox(tar,props);
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
    constructor(type,fn,elem,name,capture){
        this.temp = 1;
        this.callbacks={};
        this.captureFlags={};
        name ? null : name='fn' + this.temp;
        capture ? this.captureFlags[name]=true : this.captureFlags[name]=false;
        this.callbacks[name] = fn;
        this.type = type;
        this.elem = elem;
    }

    add(fn,name,capture){
        name ? null : name='fn'+this.temp + 1;
        capture ? this.captureFlags[name]=true : this.captureFlags[name]=false;
        this.callbacks[name] = fn;
    }

    rm(fn){
        let target = this.elem;
        let functions = this.callbacks;
        let type = this.type;
        let captureFlags = this.captureFlags;
        if(!fn){
            let k = keys(functions);
            fast4(0,k.length,function(i){
                temp(type,functions[k[i]],captureFlags[k[i]])
            });
        }
        else{
            fn = fn.split(',');
            fast4(0,fn.length,function(i){
                temp(type,functions[fn[i]],captureFlags[fn[i]])
            });
        }

        function temp(type,fn,capture){
            if(capture) target.removeEventListener(type,fn,capture)
            else target.removeEventListener(type,fn);
        }
    }
}

function $evt(type,callback,name,capture){
    let elem = this.nodeType === 1 ? this : document;
    elem[type+'evt'] ? elem[type+'evt'].add(callback,name,capture):
                        elem[type+'evt'] = new listnerObj(type,callback,elem,name,capture);

    capture ? elem.addEventListener(type,callback,true):
                elem.addEventListener(type,callback);
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

//CustomCursor
class customCursorX{
    constructor(cursor,elems){
        this.elemList = typeof elems === 'object' ? elems : $e(elems);
        this.cursor = typeof cursor === 'object' ? cursor : newBlock(cursor)[0];
        this.setListners();
    }

    setListners(){
        let elems = this.elemList;
        let cursor = this.cursor;
        cursor.className += " customCursorX";
        let body = document.body;
        let position;

        fast4(0,elems.length,function(i){
            elems[i].className += " customCursorXelem";
            elems[i].$evt('mouseenter',function(){
                body.appendChild(cursor.$s('d:flex'));
                setPositon(event);
            });

            elems[i].$evt('mousemove',function(){
                setPositon(event);
            });

            elems[i].$evt('mouseleave',function(){
                cursor.$s('d:none');
            });
        });

        function setPositon(event){
            position = "translateX(" + event.clientX + "px) translateY(" + event.clientY + "px)";
            cursor.style.transform = position;
        }
    }
}

//functions for wiki

//documentReady
var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

//elemInScrollTopRange
function festr(x,y){
    let elem = document.elementFromPoint(x,y);
    let info = {
        e:elem,
        t:elem.getBoundingClientRect().top,
    }
    return info;
}

//scrollToElement
function scrollToX(elem, callback, scrollWaitTime) {
    elem = typeof elem === 'object' ? elem : $E(elem);
    elem[0] ? elem = elem[0] : null;
    if(callback){
        callback = callback.bind(elem);
        scrollWaitTime ? onScrollEnd(callback,scrollWaitTime) : onScrollEnd(callback);
    }
    const y = elem.getBoundingClientRect().top + window.scrollY;
    window.scroll({ top: y - 130, behavior: 'smooth' });
}

//onScrollEndListner
function onScrollEnd(callback, waitTill) {
    let y = window.scrollY;
    let x = window.scrollX;
    let newY, newX, callAfterWait;

    $evt('scroll', function () {
        waitTill ? clearTimeout(callAfterWait) : null;
        let interval = setInterval(function () {
            newY = window.scrollY;
            newX = window.scrollX;
            if (newY === y && newX === x) {
                clearInterval(interval);
                console.log('interval Cleared');
                callback();
            } else {
                y = newY;
                x = newX
            }
        }, 50);
        document.scrollevt.rm('onScrollEnd');
    }, 'onScrollEnd');

    if (waitTill) {
        callAfterWait = setTimeout(function () {
            document.scrollevt.rm('onScrollEnd');
            callback();
        }, waitTill);
    }
}

//highlightElement
function highlightE({elem,cls},normalizeTime){
    normalizeTime = normalizeTime ? normalizeTime:500;
    cls = cls ? cls : 'highlighted';
    elem.className += " "+cls+" ";
    setTimeout(function(){
        elem.classList.remove(cls);
    },normalizeTime);
}

//collapsible headings
function makeCollapseHead(head,suffix,styleSheet){
    let childs = {};
    head.classList.add('expandBtn');
    head.suffix = suffix;
    head.collapseState = false;
    head.$evt('click',function(){
        if(head.collapseState){
            prepareTables();
            head.collapseState = false;
            head.classList.add('visible');
            rmCssRuleX([styleSheet,`.collapse-head-child-${suffix}`]);
        }
        else{
            head.collapseState = true;
            head.classList.remove('visible');
            addCSSRuleX(styleSheet,`.collapse-head-child-${suffix}`,"display:none !important");
        }
    },'collapseEvt');

    let sibling = head.nextElementSibling;
    let tag = sibling.tagName;
    while(tag !== 'H2'){
        childs[tag] ? childs[tag].push(sibling) : childs[tag] = [sibling];
        sibling.classList.add(`collapse-head-child-${suffix}`);
        sibling.parentRef = head;
        sibling = sibling.nextElementSibling;
        if(sibling) tag = sibling.tagName
        else return;
    }

    if(suffix > 0) head.click();
    else {
        prepareTables();
        head.classList.add('visible');
    }

    function prepareTables(){
        if(childs.TABLE){
            if(childs.toolsAdded) null
            else{
                addScrollBtns(childs.TABLE);
                childs.toolsAdded = true;
            }
        }
    }
}

//text alerts
function alertUserX([data,parent],timeout){
    timeout ? null : timeout = 1000;
    let span = document.createElement('span');
    span.className = 'textAlertX';
    span.innerHTML = data;
    parent ? null : parent = document.body;
    parent.appendChild(span);
    setTimeout(function(){
        span.classList.add('fadeOut');
        setTimeout(function(){
            span.remove();
        },200)
    },timeout) 
}

//getsetblack
function fixDarkModeX(input){
    let a = typeof input === 'object' ? input : $e(input);
    b = a.querySelectorAll("[style]");
    for(let i=0; i<b.length; i++){
        b[i].style.backgroundColor = "";
        b[i].style.borderColor = "#444";
        b[i].style.color = "";
    }
}

//get extention resource URL
function curl(d){
    return chrome.runtime.getURL(d);
}

//toggle extention setting
function toggleSetting(){
    let str;
    switch (this.innerText) {
        case 'DarkTheme':
            str = 'darkModeOn';
            break;
        case 'References':
            str = 'referStatusFalse';
            break;
        case 'MonoText':
            str = 'monoText';
            break;
        case 'PureRead':
            str = 'pureRead monoText referStatusFalse';
            break;
        case 'ImageViewer':
            str = 'useImageViewer';
            break;
        default:
            break;
    }

    chrome.storage.local.get(['theme'], function (result) {
        let temp = str.split(' ');
        if(result.theme.search(temp[0]) > -1){
            chrome.storage.local.set({theme:result.theme.replace(str,"")});
            str[0] === 'd' ?  (function(){
                $id('wikiR_css').href = curl('css/wikiNew.css');
                $id('wikiR_typo').href = curl('css/fonts.css');
                $id('imgBox').classList.remove('inverted');
            })() : null;
            fast4(0,temp.length,function(i){
                body.classList.remove(temp[i]);
            });
        }
        else{
            chrome.storage.local.set({theme:result.theme += " "+str});
            str[0] === 'd' ?  (function(){
                $id('wikiR_css').href = curl('css/wikiNewDark.css');
                $id('wikiR_typo').href = curl('css/fontD.css');
                $id('imgBox').classList.add('inverted');
            })() : null;
            fast4(0,temp.length,function(i){
                body.classList.add(temp[i]);
            });
        }
    })
}

//open wikicustomMenu
function openWc() {
    let elm = $id('wikiCustomMenu');
    if (elm.classList.contains('wcopen')) {
        WRstorage.userMenuPop.rmListners();
        elm.classList.remove('wcopen');
    } else {
        WRstorage.userMenuPop.setListner();
        elm.classList.add('wcopen');
    }
}

//toggling sideMenu
function tSideMenu(event,target){
    body.eventBlocker = true;
    let width = target.$cs('w',true);
    let navbar = $id('mw-head');
    let elem = festr(350,300);
    if(target.toggleStatus){
        body.classList.remove('smOpen');
        target.style.transform = "translateX(-110%)";
        temp('0px','0px');
        target.toggleStatus = false;
    }
    else{
        body.classList.add('smOpen');
        target.style.transform = "translateX(0px)";
        temp(width+'px',width-30+'px');
        target.toggleStatus = true;
    }
    let y = -elem.t + elem.e.getBoundingClientRect().y + window.scrollY;
    window.scroll(0,y);
    setTimeout(function(){body.eventBlocker = false},200);
    function temp(w,w2){
        body.style.paddingLeft = w;
        target.id === "sidemenu" ? navbar.style.paddingLeft = w2:navbar.style.paddingLeft = w;
        event.target.style.transform = `translateX(${w})`;
    }
}

//scrollToReference
function scrollToReference(cite){
    body.eventBlocker = true;
    let elem = $E(cite);
    elemState(elem);
    setTimeout(function(){
        scrollToX(elem,function(){
            highlightE({elem:this,cls:'highlighted'},3000);
            setTimeout(function(){body.eventBlocker = false},200);
        },100);
    },50);
}

//checkElemAvaliablity
function elemState(elem){
    let oParent = elem.offsetParent;
    if(oParent === null){
        let temp = elem.closestX('.collapse-head-child');
        if(temp){
            if(temp.parentRef.collapseState === true){
                temp.parentRef.click();
            }
        }
    }
    else{
        if(oParent.className.search('expandBtn') > -1){
            if(oParent.collapseState === true){
                oParent.click();
            }
        }
    }
}

//scrollTop
function scrollToTop() {
    window.scroll({
        top: 0,
        behavior: 'smooth'
    });
}

//creating Cursor
function createCursor(data,bg,text) {
    var canvas = document.createElement('canvas');
    canvas.width = 34;
    canvas.height = 34;
    var ctx = canvas.getContext("2d");
    ctx.arc(16, 16, 14, 0 , 2*Math.PI);
    ctx.fillStyle = bg ? bg : "#e1463b";
    ctx.fill();
    ctx.fillStyle = text ? text : "white";
    ctx.font = "900 16px functionX";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data.txt, 16, 16);
    var dataURL = canvas.toDataURL('image/png');
    (data.e).style.cursor = 'url('+dataURL+'), auto';
}

//adding scroll btns to tables
function envelop(e,type,replace,toreplace){
    let container = document.createElement(type);
    let flag = false;
    replace ? toreplace ? 
        toreplace.parentElement.replaceChild(container,toreplace):
        function(){
            if(e.constructor.name === 'HTMLCollection' || e.constructor.name === 'Array')
                flag = e[0].parentElement;
            else
                e.parentElement.replaceChild(container,e)
        }():
        null;

    if(typeof e === 'string'){
        e = document.querySelector(e);
        container.appendChild(elem);
    }
    else{
        if(e.constructor.name === 'HTMLCollection' || e.constructor.name === 'Array'){
            const l = e.length;
            for(let i=0; i<l; i++){
                container.appendChild(e[0]);
            }
            flag ? flag.appendChild(container):null;
        }
        else{
            container.appendChild(e);
        }
    }
    return container;
}

function createScrollBtns({elem,toEnvelop,cTag,cCls}){
    toEnvelop ? null : toEnvelop = elem.children;
    cTag ? null : cTag = 'div';

    let left = document.createElement('span');
    left.className = 'createScrollBtn';
    let right = left.cloneNode();
    right.className += ' right';
    createCursor({e:left, txt:'\ue905'},'#000'); 
    createCursor({e:right, txt:'\ue909'},'#000'); 
    
    temp(left,-200);
    temp(right,200);
    
    toEnvelop = typeof toEnvelop === 'string' ? elem.querySelector(toEnvelop):toEnvelop;
    let container = envelop(toEnvelop,cTag,true);
    container.className = 'createScrollBtnContainer '+cCls;
    elem.style.position='relative';
    let fragment = new DocumentFragment;
    fragment.appendChild(container);
    fragment.appendChild(left);
    fragment.appendChild(right);
    elem.appendChild(fragment);

    function temp(e,gain) {
        e.addEventListener('click',function(){
            container.scroll({left:container.scrollLeft+gain, behavior:'smooth'});
        })
    }
}

function addScrollBtns(tables){
    function temp(event){
        let elem = event.target;
        let parent = elem.parentElement;
        console.log(elem,parent);
        if(parent.offsetWidth + 20 < parent.scrollWidth){
            createScrollBtns({elem:parent,toEnvelop:'tbody',cTag:'table',cCls:parent.classList[0]});
            elem.classList.add('active');
        }
        else alertUserX(["table is not overflowing\n\nUse the button if table is overflowing"],2000);
    }
    let btn = newElement({e:'span',cls:'checkAndAddScrollBtn'});
    fast4(0,tables.length,function(i){
        let a = btn.cloneNode();
        a.addEventListener('click',temp);
        let thead = tables[i].getElementsByTagName('thead')[0];
        if(thead){
            let tbody = tables[i].getElementsByTagName('tbody')[0];
            if(thead.parentElement === tables[i]){
                thead.classList.add('scrollTableHead');
                tbody.insertBefore(thead,tbody.firstElementChild);
            }
        }
        tables[i].style.position = 'relative';
        tables[i].appendChild(a);
    });
}

//WRconstructor
let WRconstruct = function(elem,toConstruct,clickFlag){
    elem.$evt('click',function(){
        toConstruct();
        elem.clickevt.rm('WRconstruct');
        if(clickFlag){
            setTimeout(function(){
                elem.click();
            },100);
        }
    },'WRconstruct');
}

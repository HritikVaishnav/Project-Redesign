//setting Events on navigation and terms of use
setPopUp({
    tar:"#nav-options",
    out:document,
    btn:["#nav-toggle-btn"],
    props:{
        s:'fadeInUp',
        e:'fadeOutDown',
        t:'400',
        d:'flex'
    },
    dflag:true
});

let termsOfUse = $e('#termsOfUse');
setPopUp({
    tar:termsOfUse,
    ignore:termsOfUse.firstElementChild,
    out:document,
    btn:[".termsOfUse",termsOfUse.$e('.closeBtn')],
    props:{
        s:'fadeIn',
        e:'fadeOut',
        t:'400',
        d:'flex'
    },
    dflag:true
},true);

//setting Event on votingList
let Vlist = $e("#voting-list");
Vlist.$evt('click',vote);

function vote(event){
    if(event.target.tagName === 'BUTTON'){
        Vlist.className += " voted";
        event.target.className += " active";
        allBtns = Vlist.$e('@button');

        //write your code here garvit
        fast4(0,allBtns.length,function(i){
            allBtns[i].innerText = "100%"
        })
    }
}
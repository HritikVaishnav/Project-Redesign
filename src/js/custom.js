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

const scrollTop = new scrollToTopX();
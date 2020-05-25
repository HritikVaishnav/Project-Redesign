var termsOfUse = $e('#termsOfUse');
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
var images = $e("@.promoImg img");
const imgViewer = new imageViewerX(images);
const customCursors = new customCursorX('span.iconx-zoom.promoImgCursor', images);
//animateBg($e("#content"));

function animateBg(elem) {
    var e = elem;
    elem.$evt('mousemove', animate, 'animateBg');
    var positionX = elem.$cs('bgpx', true);
    var positionY = elem.$cs('bgpy', true);

    function animate(event) {
        positionX = positionX - event.movementX * 0.02;
        positionY = positionY - event.movementY * 0.02;
        var newValue = positionX + 'px ' + positionY + 'px';
        e.$s("bgp:" + newValue);

    }
}

//compare img
var compareElems = $cls("imgcompare");
fast4(0, compareElems.length, function (i) {
    compareImg(compareElems[i])
});

function compareImg(elem) {
    var bar = elem.lastElementChild;
    var container = bar.previousElementSibling;
    var boundings;

    elem.onmousedown = start;
    elem.ontouchstart = start;

    function start(event) {
        event.preventDefault();
        boundings = elem.getBoundingClientRect();
        elem.onmousemove = drag;
        elem.onmouseup = stop;
        elem.ontouchmove = drag;
        elem.ontouchend = stop;
        drag(event);
    }

    function drag(event) {
        event.preventDefault();
        var clientX = event.clientX;
        clientX ? null : clientX = event.targetTouches["0"].clientX;
        var x = clientX - boundings.left;
        bar.style.left = x + 'px';
        container.style.width = x + 'px';
    }

    function stop(event) {
        elem.onmousemove = null;
        elem.onmouseup = null;
        elem.ontouchmove = null;
        elem.ontouchend = null;
    }
}
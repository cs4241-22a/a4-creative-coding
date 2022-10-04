let gibber = Gibber
const buttonStart = document.getElementById("button_start")
const buttonStop = document.getElementById("button_stop")
let bpmBox = document.getElementById("bpm_input_box")
let octBox = document.getElementById("oct_input_box")
let loaded = false;
let tpOffset = -1;
let crdOffset = 0;
let crd = [2,4,6]
window.onload = function() {
    document.getElementById("main_content").style.display="none";
    document.getElementById("click_to_start").style.display="block";
    buttonStart.onclick = function () {
        if (loaded==false) {
            loaded = true;
            gibber.init();
        }
        gibber.clear()
        resetGibber();
    }
    buttonStop.onclick = function () {
        gibber.clear()
    }     
}
document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    console.log(charStr)
    keyPressed(charStr);
};
function resetGibber(params) {
    sn1 = Snare().trigger.seq( 1, Gibber.Euclid(5,8)  )
    sn2 = Snare().trigger.seq( 1, sn2e=Gibber.Euclid(2,4)  )
    sn2e.rotate(1)
    sn3 = Snare().trigger.seq( 1, Gibber.Euclid(3,8)  )
    sn2.loudness = 0;
    sn3.loudness = 0;
    syn = PolyMono()
    syn7 = PolyMono()
    chords = [crd]
    chords7 = [[8]]
    syn.chord.seq( chords, 1/2 )
    syn7.chord.seq( chords7, 1/2 )
    kick = Kick().trigger.seq(1, 1 / 4)
    //bass = FM('deepbass').note.seq( sine(2,4), Gibber.Euclid(3,8)  )
    //bass.fx.add(Flanger())
    syn7.loudness = 0;
    updateNotes();
}
function updateNotes() {
    chords.reset()
    chords.transpose(crdOffset+(tpOffset*7))
    chords7.reset()
    chords7.transpose(crdOffset+(tpOffset*7))
}
let keyMap = [
    ["q",0],
    ["w",1],
    ["e",2],
    ["r",3],
    ["t",4],
    ["y",5],
    ["u",6],
    ["i",7],
    ["o",8],
    ["p",9],

    [",",-1],
    ["m",-2],
    ["n",-3],
    ["b",-4],
    ["v",-5],
    ["c",-6],
    ["x",-7],
    ["z",-8],
]
function keyPressed(str) {
    keyMap.forEach(function(arr) {
        //console.log(arr)
        if (str==arr[0]) {
            crdOffset = arr[1];
            updateNotes();
        }
    })
}
function setBPM() {
    console.log("Setting BPM to "+bpmBox.value)
    Clock.bpm = bpmBox.value;
}
function setOcative(){
    console.log("Setting ocative to "+octBox.value)
    tpOffset = octBox.value;
    updateNotes();
}

function mode135() {
    if (loaded==true) {
        syn7.loudness = 0;
    }
}
function mode1357() {
    if (loaded==true) {
        syn7.loudness = 1;
    }
}
function snare1(){
    if (loaded==true) {
        sn1.loudness = 1;
        sn2.loudness = 0;
        sn3.loudness = 0;
    }  
}
function snare2(){
    if (loaded==true) {
        sn1.loudness = 0;
        sn2.loudness = 1;
        sn3.loudness = 0;
    }  
}
function snare3(){
    if (loaded==true) {
        sn1.loudness = 0;
        sn2.loudness = 0;
        sn3.loudness = 1;
    }  
}
function clickStart() {
    document.getElementById("main_content").style.display="block";
    document.getElementById("click_to_start").style.display="none";
}
// params, mainly for tweakpane
const params = {
    overall_sin: 0,
    overall_isPlaying: false,
    overall_volume: 30,

    freq1_frequency: 220,
    freq1_expSlider: 7.7813597135,
    freq1_octave: 3,
    freq1_note: Math.pow(2, 9/12),
    freq1_isActive: true,
    freq1_sine: 0,

    freq2_frequency: 440,
    freq2_expSlider: 8.7813597135,
    freq2_octave: 4,
    freq2_note: Math.pow(2, 9/12),
    freq2_isActive: true,
    freq2_sine: 0,

    freq3_frequency: 880,
    freq3_expSlider: 9.7813597135,
    freq3_octave: 5,
    freq3_note: Math.pow(2, 9/12),
    freq3_isActive: true,
    freq3_sine: 0,
}

let audioContext = null
let pane = null

// global arr of oscillators
const oscArr = []
const gainArr = []
const isActiveArr = []
const isStartedArr = []

// roughly the note C1 (if using A4 = 440Hz)
const C1 = 55 / Math.pow(2, 9/12)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// tweakpane element / on input functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function overallIsPlayingChange(ev) {
    console.log(`overall checkbox is checked: ${ev.value}`)
    if(ev.value) {
        // if checkbox is checked, reconnect ACTIVE oscillators
        let i = 0
        oscArr.forEach((osc) => {
            if(isActiveArr[i]) {
                // only reconnect if oscillator is active
                gainArr[i].connect(audioContext.destination)

                if(!isStartedArr[i]) {
                    // if not started, start oscillator
                    osc.start()
                    console.log(`oscillator ${i} started`)
                    isStartedArr[i] = true
                }
            }

            i++
        })
    }
    else {
        // if unchecked, disconnect oscillators
        gainArr.forEach((gain) => {
            gain.disconnect()
        })
    }
}

// function for frequency num input
function freqNumChange(ev, index) {
    const freq = ev.value
    const exp = Math.log2(freq)

    oscArr[index].frequency.value = freq
    //oscArr[index].frequency.exponentialRampToValueAtTime(freq, 0.1 + audioContext.currentTime)

    switch(index) {
        case 0:
            params.freq1_frequency = freq
            params.freq1_expSlider = exp
            break;
        case 1:
            params.freq2_frequency = freq
            params.freq2_expSlider = exp
            break;
        case 2:
            params.freq3_frequency = freq
            params.freq3_expSlider = exp
            break;
    }

    pane.refresh()
}

// function for exponent slider input
function expSliderChange(ev, index) {
    const exp = ev.value
    const freq = Math.pow(2, exp)

    oscArr[index].frequency.value = freq
    //oscArr[index].frequency.exponentialRampToValueAtTime(freq, 0.1 + audioContext.currentTime)


    switch(index) {
        case 0:
            params.freq1_frequency = freq
            params.freq1_expSlider = exp
            break;
        case 1:
            params.freq2_frequency = freq
            params.freq2_expSlider = exp
            break;
        case 2:
            params.freq3_frequency = freq
            params.freq3_expSlider = exp
            break;
    }

    pane.refresh()
}

// frequency calculator helper for octave/note choices
function calcFreqOctaveNote(octave, note) {
    const C = Math.pow(2, octave-1) * C1
    const freq = C * note

    return freq
}

// function for octave/note input
function octaveNoteChange(ev, index, octaveOrNote) {
    let octave = null
    let note = null
    let freq = null
    
    switch(index) {
        case 0:
            if(octaveOrNote === 'octave') {
                octave = ev.value
                note = params.freq1_note
            }
            else {
                note = ev.value
                octave = params.freq1_octave
            }
            freq = calcFreqOctaveNote(octave, note)
            oscArr[index].frequency.value = freq
            params.freq1_frequency = freq
            break
        case 1:
            if(octaveOrNote === 'octave') {
                octave = ev.value
                note = params.freq2_note
            }
            else {
                note = ev.value
                octave = params.freq2_octave
            }
            freq = calcFreqOctaveNote(octave, note)
            oscArr[index].frequency.value = freq
            params.freq2_frequency = freq
            break
        case 2:
            if(octaveOrNote === 'octave') {
                octave = ev.value
                note = params.freq3_note
            }
            else {
                note = ev.value
                octave = params.freq3_octave
            }
            freq = calcFreqOctaveNote(octave, note)
            oscArr[index].frequency.value = freq
            params.freq3_frequency = freq
            break
    }

    pane.refresh()
}

// function for isActiveArr checkbox input
function isActiveCheckChange(ev, index) {
    if(ev.value) {
        // if checked, set active
        isActiveArr[index] = true

        if(params.overall_isPlaying) {
            // if checked AND OVERALL PLAYING, reconnect oscillator
            gainArr[index].connect(audioContext.destination)

            if(!isStartedArr[index]) {
                // if not started, start oscillator
                oscArr[index].start()
                console.log(`oscillator ${index} started`)
                isStartedArr[index] = true
            }
        }
    }
    else {
        // if unchecked, disconnect oscillators
        gainArr[index].disconnect()
        isActiveArr[index] = false
    }
}

// function for calculating sin waves
//  --> only works properly up to ~4000Hz,
//      after that it's not sampling fast enough to display properly,
//      and i didn't want the lower frequencies' cycles to be too long
function calculateSinVal(index) {
    time = Date.now()

    let i = 0
    let overall_sin_val = 0
    oscArr.forEach(osc => {
        let freq_sin = null

        switch(i) {
            case 0:
                freq_sin = Math.sin(params.freq1_frequency/40000 * time)
                params.freq1_sine = freq_sin
                break
            case 1:
                freq_sin = Math.sin(params.freq2_frequency/40000 * time)
                params.freq2_sine = freq_sin
                break
            case 2:
                freq_sin = Math.sin(params.freq3_frequency/40000 * time)
                params.freq3_sine = freq_sin
                break
        }

        // only add each freq to overall if it's active
        //  and if overall is playing
        if(isActiveArr[i] && params.overall_isPlaying) {
            overall_sin_val += freq_sin
        }

        i++
    })

    params.overall_sin = overall_sin_val / oscArr.length
}

// everything else
window.onload = function() {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Initialize audio audioContext, make tweakpane, etc.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // start calculating sine waves at regular intervals
    setInterval(calculateSinVal, 5)

    // make audio audioContext, oscillators, etc.
    audioContext = new AudioContext()

    // make i oscillators
    for(let i = 0; i < 3; i++) {
        const osc = audioContext.createOscillator()
        osc.frequency.value = 220 * Math.pow(2, i)
        const gain = audioContext.createGain()
        gain.gain.value = 0.5
        osc.connect(gain)
        gain.connect(audioContext.destination)

        oscArr.push(osc)
        gainArr.push(gain)
        isActiveArr.push(true)
        isStartedArr.push(false)
    }
    
    // create tweakpane
    pane = new Tweakpane.Pane({
        //title: 'Frequency Visualizer',
        container: document.getElementById('container')
    })

    // ~~~~~~~~~~~~~~~~~~~
    // tweakpane elements
    // ~~~~~~~~~~~~~~~~~~~

    // folders
    const f1 = pane.addFolder({
        title: 'Individual Frequencies',
    });
    const f2 = pane.addFolder({
        title: 'Overall',
    });

    // first folder tabs, one for each oscillator
    const tab = f1.addTab({
        pages: [
          {title: 'Frequency 1'},
          {title: 'Frequency 2'},
          {title: 'Frequency 3'}
        ]
    });

    //      overall controls/monitor
    //     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    // monitor
    f2.addMonitor(params, 'overall_sin', {
        label: 'Combined sine wave',
        interval: 10,
        view: 'graph',
        min: -1,
        max: 1
    })

    // controls whether all tones are playing
    const overallCheckbox = f2.addInput(params, 'overall_isPlaying', {
        label: 'All tones are playing'
    })

    // controls overall volume
    const overallVolumeSlider = f2.addInput(params, 'overall_volume', {
        label: 'Overall gain',
        min: 0,
        max: 100,
        step: 5
    })

    //      first folder tabs (individual frequencies)
    //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // store elements in arrays
    const freqSliderArr = []
    const expSliderArr = []
    const octSliderArr = []
    const noteDropArr = []
    const checkboxArr = []
    const monitorArr = []

    // create tweakpane elements for each tab
    for(let i = 0; i < 3; i++) {
        //      OSCILLATOR #i+1
        //     ~~~~~~~~~~~~~~~~~
        // grab tab # i+1
        const tabx = tab.pages[i]

        // frequency (number) input --> slider? (to have min/max)
        const freqNum = tabx.addInput(params, `freq${i+1}_frequency`, {
            label: `Frequency ${i+1} (Hz)`,
            // min: 20,
            // max: 20000,
        })
        freqSliderArr.push(freqNum)

        // exponential slider
        const expSlider = tabx.addInput(params, `freq${i+1}_expSlider`, {
            label: `Frequency ${i+1} exponent`,
            min: 4.322,
            max: 14.287,    // rough range of human hearing (2^x Hz)
        })
        expSliderArr.push(expSlider)

        // octave slider
        const octSlider = tabx.addInput(params, `freq${i+1}_octave`, {
            label: `Note octave`,
            min: 1,
            max: 7,
            step: 1,
        })
        octSliderArr.push(octSlider)

        // note name dropdown
        const noteDrop = tabx.addInput(params, `freq${i+1}_note`, {
            label: 'Note name',
            options: {
                'C':        1.0,
                'C#/Db':    Math.pow(2, 1/12),
                'D':        Math.pow(2, 2/12),
                'D#/Eb':    Math.pow(2, 3/12),
                'E':        Math.pow(2, 4/12),
                'F':        Math.pow(2, 5/12),
                'F#/Gb':    Math.pow(2, 6/12),
                'G':        Math.pow(2, 7/12),
                'G#/Ab':    Math.pow(2, 8/12),
                'A':        Math.pow(2, 9/12),
                'A#/Bb':    Math.pow(2, 10/12),
                'B':        Math.pow(2, 11/12),
            }
        })
        noteDropArr.push(noteDrop)

        // is active checkbox
        const activeCheckbox = tabx.addInput(params, `freq${i+1}_isActive`, {
            label: `Frequency ${i+1} is active`,
        })
        checkboxArr.push(activeCheckbox)

        // monitor
        const sineMonitor = tabx.addMonitor(params, `freq${i+1}_sine`, {
            label: `Frequency ${i+1} sine wave`,
            interval: 10,
            view: 'graph',
            min: -1,
            max: 1, // fixed amplitude
        })
        monitorArr.push(sineMonitor)

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // attach tab's element's input functions
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        freqNum.on('change', function(ev) {
            freqNumChange(ev, i)
        })
        expSlider.on('change', function(ev) {
            expSliderChange(ev, i)
        })
        octSlider.on('change', function(ev) {
            octaveNoteChange(ev, i, 'octave')
        })
        noteDrop.on('change', function(ev) {
            octaveNoteChange(ev, i, 'note')
        })
        activeCheckbox.on('change', function(ev) {
            isActiveCheckChange(ev, i)
        })
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // attach overall input functions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    overallCheckbox.on('change', function(ev) {
        overallIsPlayingChange(ev)
    })

    overallVolumeSlider.on('change', function(ev) {
        gainArr.forEach(gain => {
            let volume = null
            if(ev.value === 0) {
                volume = 0.001
            }
            else {
                volume = ev.value/100
            }
            gain.gain.exponentialRampToValueAtTime(volume, 0.5 + audioContext.currentTime)
        })
    })
}


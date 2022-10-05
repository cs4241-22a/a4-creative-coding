
const values = {
    frequency_exp1: 7.7813597135,
    frequency_exp2: 8.7813597135,
    frequency_exp3: 9.7813597135,
    frequency1: 220,
    frequency2: 440,
    frequency3: 880,
    frequency_arr: [],  // holds frequencies for calculating sin wave
    freq_sin_func: 0,
    playing: false
}

// gives a visual representation of the combined sin waves
function calculateSinVal() {
    time = Date.now()

    if(!values.playing) {
        values.freq_sin_func = 0
        return
    }

    let val = 0
    values.frequency_arr.forEach((freq) => {
        // scaled visual
        val += Math.sin(freq/40000 * time)
    })

    values.freq_sin_func = val/values.frequency_arr.length
    return
}

// handles slider input change
function sliderChange(ev, index, osc) {
    // scales output logarithmically from 20Hz (0) to 20kHz (100)
    const freq = Math.pow(2, ev.value)
    console.log(freq)

    osc.frequency.value = freq
    values.frequency_arr[index] = freq
    
    switch(index) {
        case 0:
            values.frequency1 = freq
            break
        case 1:
            values.frequency2 = freq
            break
        case 2:
            values.frequency3 = freq
    }
}

window.onload = function() {
    // calculate combined sin every 10ms
    setInterval(calculateSinVal, 10)

    // create tweakpane
    const pane = new Tweakpane.Pane({
        container: document.getElementById('container')
    })

    // make audio context, node, etc
    const audioContext = new AudioContext()
    const osc_arr = []
    for(let i = 0; i < 3; i++) {
        // make 3 oscillators
        const osc = audioContext.createOscillator()
        osc.frequency.value = 220 * Math.pow(2, i)
        values.frequency_arr[i] = osc.frequency.value
        osc_arr.push(osc)
    }
    let isStarted = false

    // const values = {
    //     frequency_exp: 44.764,
    //     frequency: 440,
    //     freq_sin_func: 0,
    //     playing: false
    // }

    // ~~~~~~~~~~~
    // add inputs

    const pitchSlider1 = pane.addInput(
        values, 'frequency_exp1', {
            label: 'Frequency 1 Exponent',
            min: 4.322,
            max: 14.287,
            step: 0.001,
        // rough range of human hearing
    })
    const pitchSlider2 = pane.addInput(
        values, 'frequency_exp2', {
            label: 'Frequency 2 Exponent',
            min: 4.322,
            max: 14.287,
            step: 0.001,
        // rough range of human hearing
    })
    const pitchSlider3 = pane.addInput(
        values, 'frequency_exp3', {
            label: 'Frequency 3 Exponent',
            min: 4.322,
            max: 14.287,
            step: 0.001,
        // rough range of human hearing
    })

    const playCheckbox = pane.addInput(
        values, 'playing', {
            label: 'Tone is Playing'
        }
    )

    const freqMonitor = pane.addMonitor(values, 'frequency1', {
        label: 'Frequency 1',
        interval: 10,
        view: 'graph',
        min: 20,
        max: 20000,
    })

    const freqSinMonitor = pane.addMonitor(values, 'freq_sin_func', {
        interval: 10,
        view: 'graph',
        min: -1,
        max: 1,
        // fixed amplitude
    })

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~
    // on input change functions

    // pitch sliders
    pitchSlider1.on('change', function(ev) {
        sliderChange(ev, 0, osc_arr[0])
    })
    pitchSlider2.on('change', function(ev) {
        sliderChange(ev, 1, osc_arr[1])
    })
    pitchSlider3.on('change', function(ev) {
        sliderChange(ev, 2, osc_arr[2])
    })

    // play checkbox
    playCheckbox.on('change', function(ev) {
        if(ev.value) {
            // reconnect oscillators
            osc_arr.forEach((osc) => {
                osc.connect(audioContext.destination)
            })

            if(!isStarted) {
                // if not started, start oscillators
                osc_arr.forEach((osc) => {
                    console.log(osc)
                    osc.start()
                })
                isStarted = true
            }
        }
        else {
            // if playing, disconnect oscillators
            osc_arr.forEach((osc) => {
                osc.disconnect()
            })
        }
    })
}


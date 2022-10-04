import LoadedSounded from './sounds/api/LoadedSound'
import HiHat from './sounds/HiHat'
import Kick from './sounds/Kick'
import Snare from './sounds/Snare'
import ButtonPressHandler from './util/ButtonPressHandler'
import KeyPressHandler from './util/KeyPressHandler'

let instance = null
//https://analogcases.com/blogs/news/analog-supplies-vol-3
export default class Experience
{
    constructor(_svgID)
    {
        if(instance)
        {
            return instance
        }        
        instance = this
        this.pane = new Tweakpane.Pane()
        this.tweekPaneInit()

        this.kick = null
        this.snare = null
        this.buttonPressHandler = new ButtonPressHandler()
        this.keyPressHandler = new KeyPressHandler()

        this.buttonPressHandler.addButtonPressEvent("start", () => (this.onInfoPress()))
    }

    onInfoPress()
    {
        if(!this.audioContext)
            this.setup()

        document.getElementById("information").style.visibility = "hidden"
    }

    tweekPaneInit()
    {
        this.params = {
            kickTimeMultiplier: 1,
            btn9_gain: 1,
            btn8_gain: 1,
            btn7_gain: 1,
            btn6_gain: 1,
            btn5_gain: 1,
            btn4_gain: 1,
            btn3_gain: 1,
            btn2_gain: 1,
            btn1_gain: 1,
        }

        this.pane.addInput(
            this.params, "kickTimeMultiplier",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn9_gain",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn8_gain",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn7_gain",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn6_gain",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn5_gain",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn4_gain",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn3_gain",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn2_gain",
            {min: .1, max: 5, step: .1},
        )

        this.pane.addInput(
            this.params, "btn1_gain",
            {min: .1, max: 5, step: .1},
        )
    }

    setup()
    {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)
        this.kick = new Kick("9")
        this.snare = new Snare("8")
        this.hihat = new LoadedSounded("hi_hat.wav", "7")
        this.sizzle = new LoadedSounded("sizzel_snap.wav", "6")
        this.tunnel = new LoadedSounded("tunnel_shaker.wav", "5")
        this.low_and_slow = new LoadedSounded("low_and_slow_kick.wav", "4")
        this.throat = new LoadedSounded("throat_kick.wav", "3")
        this.fly = new LoadedSounded("fly_hi_hat.wav", "2")
        this.short = new LoadedSounded("short_and_sweet_hi_hat.wav", "1")
    }
}
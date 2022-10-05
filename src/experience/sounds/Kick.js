import Sound from "./api/Sound";

export default class Kick extends Sound
{
    constructor(triggerID)
    {
        super(triggerID)
    }

    _setup()
    {
        this.oscillator = this.experience.audioContext.createOscillator();
        this.gain = this.experience.audioContext.createGain();

        //connect oscillator node to gain node
        this.oscillator.connect(this.gain)
        //connect gain node to speakers
        this.gain.connect(this.experience.audioContext.destination)
    }

    _playSound()
    {        
        let time = this.experience.audioContext.currentTime
        this.gain.gain.setValueAtTime(1, time)
        this.gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5 * this.experience.params.kickTimeMultiplier)
        this.oscillator.frequency.setValueAtTime(150 * this.experience.params.kickTimeMultiplier, time)
        this.oscillator.frequency.exponentialRampToValueAtTime(0.001, time + 0.5 * this.experience.params.kickTimeMultiplier)

        this.oscillator.start(time)
        this.oscillator.stop(time + 2 * this.experience.params.kickTimeMultiplier)
    }
}
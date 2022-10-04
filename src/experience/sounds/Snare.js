import Sound from "./api/Sound";

export default class Snare extends Sound
{
    constructor(triggerID)
    {
        super(triggerID)
    }

    noiseBuffer()
    {
        let bufferSize = this.experience.audioContext.sampleRate;
        let buffer = this.experience.audioContext.createBuffer(1, bufferSize, this.experience.audioContext.sampleRate)
        let output = buffer.getChannelData(0)

        for(let i = 0; i < bufferSize; i++)
        {
            output[i] = Math.random() * 2 - 1
        }

        return buffer;
    }

    _setup()
    {
        this.noise = this.experience.audioContext.createBufferSource();
        this.noise.buffer = this.noiseBuffer()

        let noiseFilter = this.experience.audioContext.createBiquadFilter()
        noiseFilter.type = "highpass"
        noiseFilter.frequency.value = 1000;
        this.noise.connect(noiseFilter)

        this.noiseEnvelope = this.experience.audioContext.createGain()
        noiseFilter.connect(this.noiseEnvelope)
        this.noiseEnvelope.connect(this.experience.audioContext.destination)
    
        //Create Snap effect of snare
        this.oscillator = this.experience.audioContext.createOscillator()
        this.oscillator.type = "triangle"

        this.oscillatorEnvelope = this.experience.audioContext.createGain()
        this.oscillator.connect(this.oscillatorEnvelope)
        this.oscillatorEnvelope.connect(this.experience.audioContext.destination)
    }

    _playSound()
    {
        let time = this.experience.audioContext.currentTime

        this.noiseEnvelope.gain.setValueAtTime(1, time)

        this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
        this.noise.start(time)

        this.oscillator.frequency.setValueAtTime(100, time)
        this.oscillatorEnvelope.gain.setValueAtTime(0.7, time)
        this.oscillatorEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0,1)
        this.oscillator.start(time)

        this.oscillator.stop(time + 0.2)
        this.noise.stop(time + 0.2)
    }

}
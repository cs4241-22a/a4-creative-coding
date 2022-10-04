import Sound from "./Sound";

export default class LoadedSounded extends Sound
{
    constructor(fileName, triggerID)
    {
        super(triggerID)
        this.fileName = fileName
        this.loaded = false
        this._loadSound()
    }

    _setup()
    {
        this.source = this.experience.audioContext.createBufferSource()
        this.source.buffer = this.buffer
        this.gain = this.experience.audioContext.createGain()
        this.source.connect(this.gain)

        this.gain.connect(this.experience.audioContext.destination)

    }

    _playSound()
    {
        let gain = this.experience.params[`btn${this.triggerID}_gain`]
        console.log(gain)
        let time = this.experience.audioContext.currentTime
        this.gain.gain.setValueAtTime(gain, time)
        this.source.start(this.experience.audioContext.currentTime)
    }

    trigger()
    {
        if(!this.loaded)
            throw new Error("Sound not loaded!")

        this._setup()
        this._playSound()
    }

    _loadSound()
    {
        fetch( `${this.fileName}`, {
            method:'GET'
        })
        .then(response => {
            if(!response.ok)
                throw new Error(`HTTP error, status = ${response.status}`)
            
            return response.arrayBuffer()
        })
        .then(buffer => this.experience.audioContext.decodeAudioData(buffer))
        .then(decodedData => {
            this.buffer = decodedData;
            this.loaded = true;
        })
    }
}
import LoadedSounded from "./api/LoadedSound";

export default class HiHat extends LoadedSounded
{
    constructor(triggerID)
    {
        super(triggerID, "hi_hat.wav")
    }

    _setup()
    {
        this.source = this.experience.audioContext.createBufferSource()
        this.source.buffer = this.buffer
        this.source.connect(this.experience.audioContext.destination)

    }

    _playSound()
    {
        this.source.start(this.experience.audioContext.currentTime)
    }
}9
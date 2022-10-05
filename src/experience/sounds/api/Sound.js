import Experience from "../../Experience"

export default class Sound
{
    constructor(triggerID)
    {
        this.triggerID = triggerID;
        this.experience = new Experience()
        this.experience.buttonPressHandler.addButtonPressEvent(`btn${triggerID}`, () => (this.trigger()))
        this.experience.keyPressHandler.addKeyPress(`${triggerID}`, () => (this.trigger()))
    }

    _setup()
    {
        throw new Error("Method '_setup()' must be implemented.")

    }
    
    _playSound()
    {
        throw new Error("Method '_playSound()' must be implemented.")
    }

    trigger()
    {
        this._setup()
        this._playSound()
    }
}
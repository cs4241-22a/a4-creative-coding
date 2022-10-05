import Experience from "../Experience";

export default class KeyPressHandler
{
    constructor()
    {
        this.experience = new Experience()
        //stores keycode, function to call
        this.keyMap = new Map();
        window.addEventListener("keydown", (event) => (this._onKeyPress(event)))
    }

    addKeyPress(key, triggerFunction)
    {
        this.keyMap.set(key.toUpperCase().charCodeAt(0), triggerFunction)
        this.keyMap.set(this._getNumPadKey(key), triggerFunction)
    }

    removeKeyPress(key)
    {
        this.keyMap.delete(key)
    }

    _onKeyPress(event)
    {
        let key = event.keyCode
        let triggerFunction = this.keyMap.get(key)

        if(triggerFunction)
            triggerFunction()
    }
    
    _getNumPadKey(key)
    {
        switch(key)
        {
            case "9":
                return 33
            case "8":
                return 38
            case "7":
                return 36
            case "6":
                return 39
            case "5":
                return 12
            case "4":
                return 32
            case "3":
                return 34
            case "2":
                return 40
            case "1":
                return 35
        }

        return key;
    }
}
import Experience from "../Experience";

export default class ButtonPressHandler
{

    constructor()
    {
        this.experience = new Experience();
    }

    addButtonPressEvent(elementID, triggerFunction)
    {
        document.getElementById(elementID).addEventListener('click', () => triggerFunction())
    }
}
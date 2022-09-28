let tag_count = -1

const submit = function (e) {
    e.preventDefault();
    console.log("e")
    const bottom_text = document.querySelector('#bottom_text').value;
    const top_text = document.querySelector('#top_text').value;
    console.log(bottom_text);
    console.log(top_text);
}

window.onload = function () {
    console.log("Loaded and ready to go!!!!")
    const button = document.querySelector('button')
    button.onclick = submit
}


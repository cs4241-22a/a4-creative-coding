let tag_count = -1

const submit = async function (e) {
    e.preventDefault();
    //const image = document.querySelector('#image');
    //const img_url = URL.createObjectURL(image.files[0]);
    const image = await document.querySelector('#image').value;
    const bottom_text = document.querySelector('#bottom_text').value;
    const top_text = document.querySelector('#top_text').value;
    console.log(bottom_text);
    console.log(top_text);
    console.log(image);
    base_img = new Image();
    //base_img.src = img_url;
    base_img.src = await image;
    create_meme(bottom_text, top_text, base_img);
}



function create_meme(bottom_text, top_text, base_img){
    let width = base_img.width;
    let height = base_img.height;
    let w_scale = width/500;
    let h_scale = height/400;
    let new_width = width/w_scale;
    let new_height = height/h_scale;
    let canvas = document.querySelector('#output');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,509,609);
    ctx.font = '25px Arial';
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.fillText(top_text, 200, 50);
    ctx.fillText(bottom_text, 200, 550);
    ctx.drawImage(base_img, 0, 100, new_width, new_height);
}

const button = document.querySelector('#submit')
button.onclick = submit

window.onload = function () {
    console.log("Loaded and ready to go!!!!")
}


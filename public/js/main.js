const MAX_ITERATIONS = 100
const THRESHHOLD = 4

const REAL_RANGE = {
    low: -2,
    high: 1
}

const IMAGINARY_RANGE = {
    low: -1,
    high: 1
}

var colors = ['#50514F', '#F25F5C', '#FFE066', '#247BA0', '#70C1B3']

var mandelbrotSet = []

var user_selected_vals = {
    iterations: 15,
    escape_radius: 4,
    mandelbrot_color: '#000000',
    color1: colors[0],
    color2: colors[1],
    color3: colors[2],
    color4: colors[3],
    color5: colors[4],
}

var pane



const initTweakPane = () => {
    const PARAMS = user_selected_vals
    pane.addInput(
        PARAMS, 'iterations',
        {min: 10, max: MAX_ITERATIONS, step: 5}
    ).on('change', (e) => {
        if (e.last){
            user_selected_vals.iterations = e.value
            render()
        }
    })

    pane.addInput(
        PARAMS, 'escape_radius',
        {min: 1, max: 20, step: 1}
    ).on('change', (e) => {
        if (e.last){
            user_selected_vals.escape_radius = e.value
            render()
        }
    })

    pane.addInput(PARAMS, 'mandelbrot_color').on('change', (e) => {
        if (e.last){
            user_selected_vals.mandelbrot_color = e.value
            render()
        }
    })
    
    const f1 = pane.addFolder({
        title: 'Escaped color palette',
        expanded: false
      });

    f1.addInput(PARAMS, 'color1').on('change', (e) => {
        if (e.last){
            colors[0] = e.value
            render()
        }
    })
    f1.addInput(PARAMS, 'color2').on('change', (e) => {
        if (e.last){
            colors[1] = e.value
            render()
        }
    })
    f1.addInput(PARAMS, 'color3').on('change', (e) => {
        if (e.last){
            colors[2] = e.value
            render()
        }
    })
    f1.addInput(PARAMS, 'color4').on('change', (e) => {
        if (e.last){
            colors[3] = e.value
            render()
        }
    })
    f1.addInput(PARAMS, 'color5').on('change', (e) => {
        if (e.last){
            colors[4] = e.value
            render()
        }
    })
    const btn = pane.addButton({
        title: 'Download',
        label: 'Save Image' 
      });
    btn.on('click', () => {
        let canvasUrl = document.getElementById("mandelbrotCanvas").toDataURL();
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
        createEl.download = "mandelbrot_image";
        createEl.click();
        createEl.remove();        
    });  

}


// const render = () => {
//     const canvas = document.getElementById("mandelbrotCanvas")
//     const ctx = canvas.getContext('2d')
//     canvas.width = window.innerWidth
//     canvas.height = window.innerHeight
//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     for (let real = 0; real < canvas.width; real++){
//         for (let imaginary = 0; imaginary < canvas.height; imaginary++){
//             // Scaling window to working set
//             let complex = {
//                 r: REAL_RANGE.low + (real / canvas.width) * (REAL_RANGE.high - REAL_RANGE.low), 
//                 i: IMAGINARY_RANGE.low + (imaginary / canvas.height) * (IMAGINARY_RANGE.high - IMAGINARY_RANGE.low)
//             }
//             //printComplex(complex)
//             var result = mandelbrot(complex)
//             let color
//             if (result.inSet){
//                 // The complex value is in mandel brot set
//                 color = user_selected_vals.mandelbrot_color
//             } else {
//                 color = colors[(result.iteration % colors.length - 1) + 1]
                
//             }
//             ctx.fillStyle = color
//             ctx.fillRect(real, imaginary, 1, 1)
//         }
//     }

// }

const render = () => {
    // reset mandelbrot data
    mandelbrotSet = []
    const canvas = document.getElementById("mandelbrotCanvas")
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    var workingSetArray = []

    for (let real = 0; real < canvas.width; real++){
        for (let imaginary = 0; imaginary < canvas.height; imaginary++){
            // Scaling window to working set
            let complex = {
                r: REAL_RANGE.low + (real / canvas.width) * (REAL_RANGE.high - REAL_RANGE.low), 
                i: IMAGINARY_RANGE.low + (imaginary / canvas.height) * (IMAGINARY_RANGE.high - IMAGINARY_RANGE.low)
            }
            let pixelData = [real, imaginary, complex]
            workingSetArray.push(pixelData)
        }
    }
    let NUM_WORKERS = 4
    let workerArraySize = Math.floor(workingSetArray.length / NUM_WORKERS)
    for (let workerId = 0; workerId < NUM_WORKERS; workerId++){
        const myWorker = new Worker('./js/worker.js');
        let workerArray 
            if (workerId + 1 == NUM_WORKERS){
                workerArray = workingSetArray.slice(workerId*workerArraySize, workingSetArray.length + 1)
            } else {
                workerArray = workingSetArray.slice(workerId*workerArraySize, (workerId+1)*workerArraySize)
            }
            myWorker.postMessage([user_selected_vals, workerArray])
            myWorker.onmessage = (e) => {
                mandelbrotSet = mandelbrotSet.concat(e.data)
                checkMandelbrotSet()
                myWorker.terminate()
            }
    }




}

function checkMandelbrotSet(){
    //console.log(totalCount)

    const canvas = document.getElementById("mandelbrotCanvas")
    const ctx = canvas.getContext('2d')
    for (let i =0; i< mandelbrotSet.length; i++){
        let color
        if (mandelbrotSet[i][2].inSet){
            // The complex value is in mandel brot set
            color = user_selected_vals.mandelbrot_color
        } else {
            color = colors[(mandelbrotSet[i][2].iteration % colors.length - 1) + 1]
            
        }
        ctx.fillStyle = color
        ctx.fillRect(mandelbrotSet[i][0], mandelbrotSet[i][1], 1, 1)
    }
    
}

const mandelbrot = (complex) => {
    let z = {r: 0, i:0}
    for (let iteration=0; iteration < user_selected_vals.iterations; iteration++){
        let z_2 = { r: Math.pow(z.r,2) - Math.pow(z.i,2),
                i : 2 * z.r * z.i
        }
        z = {
            r : z_2.r + complex.r,
            i : z_2.i + complex.i
        }
        let distance = Math.pow(z.r,2) + Math.pow(z.i,2)
        if (distance > user_selected_vals.escape_radius){
            return {iteration: iteration}
        }
    }
    return {inSet: true}
}

const printComplex = (complex) => {
    let symbol = complex.i >=0 ? "+": ""
    console.log("COMPLEX: " + complex.r + " " +  symbol + " " + complex.i + "i")
}

function start(){
    const infoContainer = document.getElementById("infoContainer")
    infoContainer.style.display = "none"
    render()
}

window.onload = function () {
    const startButton = document.getElementById("startButton")
    startButton.onclick = start
    pane = new Tweakpane.Pane({
        container: document.getElementById("paneContainer"),
        title: 'Settings',
        expanded: true,
    });
    initTweakPane()
}



onmessage = (e) => {  
    var user_selected_vals = e.data[0] 
    var workingArray = e.data[1]
    var workerResult = []

    for (let i = 0; i< workingArray.length; i++){
        workerResult.push([workingArray[i][0], workingArray[i][1], mandelbrot(workingArray[i][2],user_selected_vals)])
    }
    postMessage(workerResult);
  }


const mandelbrot = (complex, user_selected_vals) => {
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
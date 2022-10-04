var program;
var PARAMS = {
    ball1Color: {r: 1.0, g: 0, b: 0.55},
    ball2Color: {r: 1.0, g: 0.0, b: 0.0},
    ball1Position: {x: -0.05, y: -0.12, z: 0.3},
    ball2Position: {x: -0.05, y: 0.4, z: 0.5}
};
var LastPARAMS = {
};


function createPane(){
    const pane = new Tweakpane.Pane({
        container: document.getElementById('tweak')
    });
    
    pane.addInput(PARAMS, 'ball1Color', {
        color: {type: 'float'},
        label: 'Ball 1 Color',
        picker: 'inline',
    });

    pane.addInput(PARAMS, 'ball2Color', {
        color: {type: 'float'},
        label: 'Ball 2 Color',
        picker: 'inline',
    });
    
    pane.addInput(PARAMS, 'ball1Position', {
        x: {min: -1, max: 1},
        y: {min: -1, max: 1},
        z: {min: -1, max: 1},
        label: 'Ball 1 Position',

    });

    pane.addInput(PARAMS, 'ball2Position', {
        x: {min: -1, max: 1},
        y: {min: -1, max: 1},
        z: {min: -1, max: 1},
        label: 'Ball 2 Position',
    });
}

function main()
{
    createPane()

    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL(canvas, undefined);
    if (!gl)
    {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    program = initShaders(gl, "vshader", "fshader");
    gl.useProgram(program);

    gl.viewport( 0, 0, canvas.width, canvas.height );

    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    render();
}

// Render image
function render(){
    if(!_.isEqual(PARAMS,LastPARAMS)){
        var buffer = gl.createBuffer();

        // Create a square as a strip of two triangles.
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1,1,
                0,1,
                1,0,
                -1,-1,
                0,1,
                -1,0]),
            gl.STATIC_DRAW
        );
        // Set the image number
        gl.uniform3fv(gl.getUniformLocation(program, "ball1color"), [PARAMS.ball1Color.r,PARAMS.ball1Color.g,PARAMS.ball1Color.b]);
        gl.uniform3fv(gl.getUniformLocation(program, "ball2color"), [PARAMS.ball2Color.r,PARAMS.ball2Color.g,PARAMS.ball2Color.b]);
        gl.uniform3fv(gl.getUniformLocation(program, "ball1position"), [PARAMS.ball1Position.x,PARAMS.ball1Position.y,PARAMS.ball1Position.z]);
        gl.uniform3fv(gl.getUniformLocation(program, "ball2position"), [PARAMS.ball2Position.x,PARAMS.ball2Position.y,PARAMS.ball2Position.z]);

        // Pass points to shaders
        gl.aPosition = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(gl.aPosition);
        gl.vertexAttribPointer(gl.aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        LastPARAMS = JSON.parse(JSON.stringify(PARAMS))
    }
    requestAnimationFrame(render);
}
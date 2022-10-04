const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

			const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
			const material = new THREE.MeshBasicMaterial( { color: 0xFFFF00 } );
			const cube = new THREE.Mesh( geometry, material );
			scene.add( cube );

			camera.position.z = 5;

			function animate() {
				requestAnimationFrame( animate );

				cube.rotation.x += 0.01;
				cube.rotation.y += 0.01;

				renderer.render( scene, camera );
			};

			animate();

      //Load background texture
      const loader = new THREE.TextureLoader();
      loader.load('space.jpg', function(texture)
      {
        scene.background = texture;  
      });

document.onkeydown = function (press) {
  //press A to move left
  if (press.keyCode === 65) {
    cube.position.x -=0.5;
  }

  //press D to move rigjt
  else if (press.keyCode === 87) {
    cube.position.y +=0.5;
  }

  //press W to move up
  else if (press.keyCode === 68) {
    cube.position.x +=0.5;
  }

  //press S to move down
  else if (press.keyCode === 83) {
    cube.position.y -=0.5;
  }

  //press Space to reset to (0,0,0)
  else if (press.keyCode === 32) {
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;

  }

}
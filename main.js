
window.addEventListener( 'load', () => {
  const radius = 40,
        y = 50
  let   color = 0

  const svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
  svg.setAttribute( 'width', 1000 )

  document.body.appendChild( svg )

  const pane = new Tweakpane.Pane();

      const PARAMS = {
        RGB: 0,
      };
      
      pane.addInput(PARAMS, 'RGB', {
        options: {
          Red: 0,
          Green: 1,
          Blue: 2,
        },
      }).on('change', (val) => {
        color = val.value});
      
      console.log(color)

  fetch( "https://api.exchangerate-api.com/v4/latest/GBP" )
    .then( data => data.json() )
    .then( jsonData => {
      //console.log( d3.select('body').selectAll('div') )
      

      const group = d3.select( 'svg' ).selectAll( 'circle' )
        .data( d3.entries( jsonData.rates ) )
        .join( 'g' )

      group.append('circle')
        .attr( 'fill', d => `rgba( ${ Math.floor(d.value) }, 100, 100, .5 )` )
        .attr( 'cx', (d,i) => i * radius )
        .attr( 'cy', y )
        .attr( 'r', radius )

      group.append( 'text' )
        .text( d => d.key )
        .attr( 'fill', 'white' )
        .attr( 'x', (d,i) => i * radius - radius / 2 )
        .attr( 'y', y + radius + 25 )

    })
})
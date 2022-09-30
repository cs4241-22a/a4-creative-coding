const ns  = 'http://www.w3.org/2000/svg'
const svg = document.createElementNS( ns, 'svg' )
const rct = document.createElementNS( ns, 'rect' )
rct.setAttribute( 'fill', 'red' )
rct.setAttribute( 'x', 0 )
rct.setAttribute( 'y', 0 )
rct.setAttribute( 'width', 50 )
rct.setAttribute( 'height', 50 )

svg.appendChild( rct )
document.body.innerHTML = ''
document.body.appendChild( svg )

window.onload = function() {
    fetch( "pokedex.json" )
      .then( data => data.json() )
      .then( jsonData => {
        d3.select( 'body' )
          .data( d3.entries( jsonData.pokemon ) )
          .join( 'div' )
            .text( datapoint => 'num: ' + datapoint )
            .style( 'color', 'white' )
      })
  }
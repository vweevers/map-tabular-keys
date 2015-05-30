var map    = require('./')
  , snake  = require('snake-case')
  , from   = require('from2-array')
  , concat = require('concat-stream')

from.obj([
  { 'column a': 3, columnB: 0.2 },
  { 'column a': 4, columnB: 0.3, ignored: true }
])

.pipe( map(snake) )
.pipe( concat(console.log.bind(console)) )

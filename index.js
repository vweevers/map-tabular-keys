var Transform = require('readable-stream/transform')
  , inherits  = require('inherits')
  , xtend     = require('xtend')

module.exports = Mapper

function Mapper(opts, map) {
  if (!(this instanceof Mapper)) {
    return new Mapper(opts, map)
  }

  if (typeof opts === 'function') {
    map = opts, opts = null
  }

  opts = xtend({defaultValue: 0}, opts, {objectMode: true})
  Transform.call(this, opts)

  this._keys = null
  this._map  = map || false
  this._default = opts.defaultValue
  this._bare = !! (Object.create && opts.bare)
}

inherits(Mapper, Transform)

Mapper.prototype._transform = function(row, _, next) {
  if (typeof row !== 'object') return next()

  if (this._keys === null) {
    this._keys = []

    Object.keys(row).forEach(function(original){
      var mapped = this._map ? this._map(original) : original

      if (typeof mapped === 'string' && mapped !== '') {
        this._keys.push([original, mapped])
      }
    }, this)

    if (this._keys.length === 0) {
      return next(new Error('No valid keys found'))
    }
  }

  var normal = this._bare ? Object.create(null) : {}
    , has = false

  for(var i=0, l=this._keys.length; i<l; i++) {
    var pair = this._keys[i]
      , val  = row[pair[0]]

    if (val == null) val = this._default
    else has = true

    normal[pair[1]] = val
  }

  if (has) this.push(normal)

  next()
}

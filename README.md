# map-tabular-keys

**Transform the keys of a tabular object stream with a map function. Because the data is assumed to be tabular, only the keys of the first row are mapped. The resulting keys are then used for all rows.**

[![npm status](http://img.shields.io/npm/v/map-tabular-keys.svg?style=flat-square)](https://www.npmjs.org/package/map-tabular-keys) [![Travis build status](https://img.shields.io/travis/vweevers/map-tabular-keys.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/map-tabular-keys) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/map-tabular-keys.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/map-tabular-keys) [![Dependency status](https://img.shields.io/david/vweevers/map-tabular-keys.svg?style=flat-square)](https://david-dm.org/vweevers/map-tabular-keys)

## example

```js
var map    = require('map-tabular-keys')
  , snake  = require('snake-case')
  , from   = require('from2-array')
  , concat = require('concat-stream')

from.obj([
  { 'column a': 3, columnB: 0.2 },
  { 'column a': 4, columnB: 0.3, ignored: true }
])

.pipe( map(snake) )
.pipe( concat(console.log.bind(console)) )
```

The output would be:
```js
[
  { column_a: 3, column_b: 0.2 },
  { column_a: 4, column_b: 0.3 }
]
```

## api

### `map([options], mapFunction)`

`mapFunction` receives a single argument, for every key of the first row. If it returns an empty string or anything other than a string, the key is ignored (i.e., not included in the emitted objects).

```js
map(function(key) {
  if (key === 'useless') return false
  return key.toUpperCase()
})
```

Options:

- `defaultValue: mixed` (default is `0`): fallback to use for `null` and `undefined` values
- `bare: boolean` (default is `false`): whether to emit bare objects (created with `Object.create(null)`) or plain objects

## install

With [npm](https://npmjs.org) do:

```
npm install map-tabular-keys
```

## license

[MIT](http://opensource.org/licenses/MIT) © [Vincent Weevers](http://vincentweevers.nl)

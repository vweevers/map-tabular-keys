var map     = require('./')
  , test    = require('tape')
  , from    = require('from2-array').obj
  , to      = require('concat-stream').bind(null, {encoding: 'object'})
  , snake   = require('snake-case')

test('no map function', function(t){
  t.plan(1)

  var input = [{hello: 'one'}]
  var expected = [{ hello: 'one'}]

  expect(t, input, expected)
})

test('always in object mode', function(t){
  var mapper = map({objectMode: false})

  from([{a: 10}]).pipe(mapper).pipe(to(function(output){
    t.same(typeof output, 'object')
    t.deepEqual(output, [{a: 10}])
    t.end()
  }))
})

test('first row defines keys', function(t){
  t.plan(1)

  var input = [
    { helloWorld:    1, ok: true, c: 384 },
    { hello_World:   2, no: true, c: 3   },
    {'hEllo-World':  3, ok: true, c: 556 },
    {' hello world': 4, ok: true, c: 34  },
    { helloWorld:    5, ok: true, c: 0   },
  ]

  var expected = [
    { hello_world:   1, ok: true, c: 384 }, 
    { hello_world:   0, ok: 0   , c: 3   }, 
    { hello_world:   0, ok: true, c: 556 }, 
    { hello_world:   0, ok: true, c: 34  },
    { hello_world:   5, ok: true, c: 0   }
  ]

  expect(t, input, expected, [snake])
})

test('ignores non objects', function(t){
  var keep = Object.create(null); keep.a = 20
  var input = [{a: 10}, 10, [], false, keep]
  var mapper = map()

  mapper.pipe(to(function(output){
    t.deepEqual(output, [{a: 10}, {a: 20}])
    t.end()
  }))

  input.forEach(function(v){ mapper.write(v) })
  mapper.end()
})

test('ignores (effectively) empty objects', function(t){
  var input = [{a: 10}, {}, {b: 20}, {a: null}]

  from(input).pipe(map()).pipe(to(function(output){
    t.deepEqual(output, [{a: 10}])
    t.end()
  }))
})

test('non-string mapped keys are ignored', function(t){
  t.plan(1)

  var input = [{a: 1, b: 2}, {a: 2, b: 3}]
  var expected = [{B: 2}, {B: 3}]

  expect(t, input, expected, [function(k){
    return k === 'b' ? k.toUpperCase() : false
  }])
})

test('default value is 0', function(t){
  t.plan(1)
  
  var input = [{ a: 1, b: 2 }, {b: 2}, { a: null, b: 2 }, { a: 4, b: 2 }]
  var expected = [{ a: 1, b: 2 }, { a: 0, b: 2 }, { a: 0, b: 2 }, {a: 4, b: 2}]
  
  expect(t, input, expected)
})

test('default value can be set', function(t){
  t.plan(3)

  var input = [ { a: 1, b: 1 }, { c: 1 }, { a: null, b: 1 }, { a: 4, b: 1 } ]
  
  var expected1 = [ { a: 1, b: 1 }, { a: null, b: 1 }, {a: 4, b: 1} ]
  var expected2 = [ { a: 1, b: 1 }, { a: undefined, b: 1 }, {a: 4, b: 1} ]
  var expected3 = [ { a: 1, b: 1 }, { a: 'thing', b: 1 }, {a: 4, b: 1} ]

  expect(t, input, expected1, [{ defaultValue: null }])
  expect(t, input, expected2, [{ defaultValue: undefined }])
  expect(t, input, expected3, [{ defaultValue: 'thing' }])
})

test('returns plain objects by default', function(t){
  from([{a: 10}]).pipe(map()).pipe(to(function(output){
    t.equal(typeof output[0].hasOwnProperty, 'function')
    t.end()
  }))
})

test('can return bare objects', function(t){
  var bare = map({bare: true})

  from([{a: 10}]).pipe(bare).pipe(to(function(output){
    t.equal(typeof output[0].hasOwnProperty, 'undefined')
    t.end()
  }))
})

function expect(t, input, expected, args) {
  var mapper = map.apply(null, args || [])

  from(input).pipe(mapper).pipe(to(function(output){
    t.deepEqual(output, expected)
  }))
}

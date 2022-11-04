const common = require('./common')
const Socket = require('../')
const test = require('tape')

test('duplex stream: send data before "connect" event', function (t) {
  t.plan(6)

  const socket = new Socket(common.SERVER_URL)
  socket.write('abc')

  socket.on('data', function (chunk) {
    t.ok(socket.connected)
    t.equal(chunk.toString(), 'abc', 'got correct message')
    socket.end()
  })
  socket.on('finish', function () {
    t.pass('got socket "finish"')
    t.ok(socket._writableState.ended)
  })
  socket.on('end', function () {
    t.pass('got socket "end"')
    t.ok(socket._readableState.ended)
  })
})

test('duplex stream: send data one-way', function (t) {
  t.plan(6)

  const socket = new Socket(common.SERVER_URL)
  socket.on('connect', function () {
    socket.write('abc')
  })

  socket.on('data', function (chunk) {
    t.ok(socket.connected)
    t.equal(chunk.toString(), 'abc', 'got correct message')
    socket.end()
  })
  socket.on('finish', function () {
    t.pass('got socket "finish"')
    t.ok(socket._writableState.ended)
  })
  socket.on('end', function () {
    t.pass('got socket "end"')
    t.ok(socket._readableState.ended)
  })
})

test('cleanup', t => {
  common.server.close()
  t.end()
})

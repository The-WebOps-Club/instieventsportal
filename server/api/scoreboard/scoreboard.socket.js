/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Scoreboard = require('./scoreboard.model');

exports.register = function(socket) {
  Scoreboard.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Scoreboard.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('scoreboard:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('scoreboard:remove', doc);
}
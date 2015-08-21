/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var scoreboard = require('./scoreboard.model');

exports.register = function(socket) {
  scoreboard.Scoreboard.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  scoreboard.Scoreboard.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('scoreboard:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('scoreboard:remove', doc);
}
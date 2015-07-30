/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Club = require('./club.model');

exports.register = function(socket) {
  Club.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Club.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('club:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('club:remove', doc);
}
/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Admin = require('./admin.model');

exports.register = function(socket) {
  Admin.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Admin.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('admin:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('admin:remove', doc);
}
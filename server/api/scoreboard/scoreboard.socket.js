/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ScoreboardSchema = require('./scoreboard.model');

exports.register = function(socket) {
  ScoreboardSchema.Scoreboard.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ScoreboardSchema.Scoreboard.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('scoreboard:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('scoreboard:remove', doc);
}
var gcm = require('node-gcm');

module.exports = function sendNotif(Type, Data, regIds) {
  var message = new gcm.Message();
  message.addData('message',"");
  message.addData('type',Type);
  message.addData('data',Data);
  if(!(regIds instanceof Array))
    regIds=[regIds]
  var sender = new gcm.Sender('AIzaSyC3G_081rzoIrxRkhN_kC6Fcs3V_fpi2fQ');

  sender.send(message, regIds, function (err, result) {
    if(err) console.error(err);
    else console.log(result);
  });
};
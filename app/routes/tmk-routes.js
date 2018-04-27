const parsingDeadline = new Date();

const ObjectID = require('mongodb').ObjectID;

// parsingDeadline.setMonth(parsingDeadline.getMonth() - 2);


module.exports = function(app, db) {
  app.get('/tmks', (req, res) => {
    const num = parseInt(req.params.num, 10);
    db.collection('tmks').find({ $or: [{parsed: false}, {lastParsed: {$lte: parsingDeadline}}]}, (err, tmks) => {
      if (err) {
        res.send({'error': 'An error has occurred'});
      } else {
        tmks.limit(num).toArray((err, tmks) => {
          if (err) {
            console.log(err);
          } else {
            res.send(tmks);
          }
        });
      }
    });
  });

  app.post('/tmks/:id', (req, res) => {
    const id = req.params.id;
    console.log('Inside tmk POST');
    const note = {tmk: id, parsed: req.body.body, lastParsed: new Date() };
    // const details = {'_id': new ObjectID(id)};
    db.collection('tmks').update({tmk: id}, note, {upsert: true}, (err) => {
      if (err) {
        res.send({'error': 'An error has occurred: ', err});
      } else {
        res.send(`Object ${note.tmk} is processed`);
	    }
    });
  });

  app.post('/permits/:appnumber', (req, res) => {
    const permit = { appNumber: req.params.appnumber, permit: req.body.body};
    db.collection('permits').update({appNumber: permit.appNumber}, permit, {upsert: true}, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result);
      }
    });
  });
};

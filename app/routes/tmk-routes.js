const parsingDeadline = new Date();

const ObjectID = require('mongodb').ObjectID;

// parsingDeadline.setMonth(parsingDeadline.getMonth() - 2);


module.exports = function(app, db) {
  app.get('/tmks', (req, res) => {
    const num = parseInt(req.params.num, 10);
    // TODO Add date difference
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
    const note = { lastParsed: new Date(), parsed: req.body.body};
    const details = {'_id': new ObjectID(id)};
    db.collection('tmks').update(details, note, {upsert: true}, (err) => {
      if (err) {
        res.send({'error': 'An error has occurred: ', err});
      } else {
        res.send(`Object ${details._id} is processed`);
	    }
    });
  });

  app.post('/permits', (req, res) => {
    const permit = { permit: req.body.body, appNumber: req.params.appNumber };
    db.collection('permits').update({'appNumber': permit.appNumber}, permit, {upsert: true}, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};

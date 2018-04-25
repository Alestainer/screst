module.exports = function(app, db) {
  app.get('/tmks', (req, res) => {
    const num = parseInt(req.params.num, 10);
    // TODO Add date difference
    db.collection('tmks').find({parsed: false}, (err, tmks) => {
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

  app.post('/tmks', (req, res) => {
    const id = req.params.tmk;
    const note = { lastParsed: new Date(), parsed: req.body.body };
    db.collection('tmks').update({tmk: id}, note, {upsert: true}, (err) => {
      if (err) {
        res.send({'error': 'An error has occurred: ', err});
      } else {
        console.log(`TMK ${id} is processed`);
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

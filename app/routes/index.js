const noteRoutes = require('./note_routes');

module.exports = function(app, db) {
  tmkRoutes(app,db);
  // Other route groups could go here, in the future
};

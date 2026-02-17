/**
 * NeDB database setup - replaces MongoDB/Mongoose for local development
 * NeDB is a lightweight, embedded, MongoDB-compatible database
 */

const Datastore = require('@seald-io/nedb');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Create datastores (persistent to disk)
const db = {
  users: new Datastore({ filename: path.join(DATA_DIR, 'users.db'), autoload: true }),
  collections: new Datastore({ filename: path.join(DATA_DIR, 'comics.db'), autoload: true }),
};

// Create indexes
db.users.ensureIndex({ fieldName: 'email', unique: true }, () => {});
db.users.ensureIndex({ fieldName: 'username', unique: true }, () => {});
db.collections.ensureIndex({ fieldName: 'userId' }, () => {});

// Promisify NeDB operations for async/await usage
const promisify = (datastore) => ({
  find: (query = {}, sort = null, skip = 0, limit = 0) =>
    new Promise((resolve, reject) => {
      let cursor = datastore.find(query);
      if (sort) cursor = cursor.sort(sort);
      if (skip) cursor = cursor.skip(skip);
      if (limit) cursor = cursor.limit(limit);
      cursor.exec((err, docs) => (err ? reject(err) : resolve(docs)));
    }),

  findOne: (query) =>
    new Promise((resolve, reject) =>
      datastore.findOne(query, (err, doc) => (err ? reject(err) : resolve(doc)))
    ),

  insert: (doc) =>
    new Promise((resolve, reject) =>
      datastore.insert(doc, (err, newDoc) => (err ? reject(err) : resolve(newDoc)))
    ),

  update: (query, update, options = {}) =>
    new Promise((resolve, reject) =>
      datastore.update(query, update, { returnUpdatedDocs: true, ...options }, (err, num, updatedDoc) =>
        err ? reject(err) : resolve(updatedDoc)
      )
    ),

  remove: (query, options = {}) =>
    new Promise((resolve, reject) =>
      datastore.remove(query, options, (err, numRemoved) => (err ? reject(err) : resolve(numRemoved)))
    ),

  count: (query = {}) =>
    new Promise((resolve, reject) =>
      datastore.count(query, (err, count) => (err ? reject(err) : resolve(count)))
    ),
});

module.exports = {
  users: promisify(db.users),
  collections: promisify(db.collections),
};

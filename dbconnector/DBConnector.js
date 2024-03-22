var promise = require("promise");

const initOptions = {
  promiseLib: promise,
};

const pgp = require("pg-promise")(initOptions);
pgp.pg.types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

// Parse date-time string values into a proper format if necessary
// pgp.pg.types.setTypeParser(1114, stringValue => stringValue);

// Database connection details;
const config = {
  host: 'localhost',
  port: 5433,
  database: 'workplacemanagement',
  user: 'postgres',
  password: 'root',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 50000,
};

// Creating a new database instance with the connection details
const db = pgp(config);

// Connect to the database
function ConnectToDB() {
  return db.connect()
    .then(obj => {
      obj.done(); // success, release connection to the pool
      console.log("Connected to the database");
    })
    .catch(error => {
      console.error('Database connection error:', error.message || error);
      throw error;
    });
}

// Run a generic query
function GenericQuery(genericQuery) {
  return db.any(genericQuery)
    .catch(error => {
      console.error('Error running the generic query:', error.message || error);
      throw error;
    });
}

// Run an update query and return result
function UpdateQueryResult(returningID, tableName, fields, condition) {
  const query = pgp.helpers.update(fields, null, tableName) + ' WHERE ' + condition;
  if (returningID) {
    query += ' RETURNING ' + returningID;
  }

  return db.one(query)
    .catch(error => {
      console.error('Error in UpdateQueryResult:', error.message || error);
      throw error;
    });
}

// Run an insert query and return result
function InsertQueryResult(returningID, tableName, fields) {
  const query = pgp.helpers.insert(fields, null, tableName) + ' RETURNING ' + returningID;

  return db.one(query)
    .catch(error => {
      console.error('Error in InsertQueryResult:', error.message || error);
      throw error;
    });
}

// Get a generic query result
function GetGenericQueryResult(tableName, fields, condition, sortingColumn, sortingOrder, limit) {
  let query = 'SELECT ${fields:name} FROM ${tableName:name}';
  const queryParams = { fields: '*', tableName };

  if (condition) {
    query += ' WHERE ' + condition;
  }
  if (sortingColumn && sortingOrder) {
    query += ' ORDER BY ${sortingColumn:name} ${sortingOrder:raw}';
    queryParams.sortingColumn = sortingColumn;
    queryParams.sortingOrder = sortingOrder;
  }
  if (limit) {
    query += ' LIMIT ${limit}';
    queryParams.limit = limit;
  }

  return db.any(query, queryParams)
    .catch(error => {
      console.error('Error in GetGenericQueryResult:', error.message || error);
      throw error;
    });
}

module.exports = db;

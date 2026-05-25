const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=.\\SQLEXPRESS;Database=Api_WasteLess;Trusted_Connection=yes;`,
  options: {
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

const getConnection = async () => {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
};

module.exports = { getConnection, sql };
module.exports = {
   "type": "mysql",
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": "root",
   "password": process.env.DB_PASSWORD,
   "database": process.env.DB_NAME,
   "synchronize": false,
   "logging": false,
   "entities": [
      "dist/**/*.entity.js"
   ],
   "migrations": [
      "dist/migration/*.js"
   ],
   "subscribers": [
      "dist/**/*.subscriber.js"
   ],
   "cli": {
      "entitiesDir": "src/entities",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};
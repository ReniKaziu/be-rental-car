module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.ENVIRONMEMNT === 'dev' ? ['query', 'error', 'schema', 'warn', 'info', 'log'] : false,
  maxQueryExecutionTime: 1000,
  logger: process.env.TYPEORM_LOGGER,
  entities: ['dist/entities/*.entity.js'],
  migrations: ['dist/migration/*.js'],
  subscribers: ['dist/**/*.subscriber.js'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
};

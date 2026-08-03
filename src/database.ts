import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  poolSize: 10,
  synchronize: process.env.DB_SYNCHRONIZE?.toLowerCase() === 'true',
  logging: 'all',
  entities: [Paciente, Endereco],
  migrations: [],
  invalidWhereValuesBehavior: { undefined: 'ignore', null: 'sql-null' },
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

import { DataSource } from "typeorm";
// Initialize datasource
export const db = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
    username: process.env.DB_USERNAME || 'cn',
    password: process.env.DB_PASSWORD || 'cn',
    database: process.env.DB_DATABASE || 'habu',
    entities: [process.env.DB_ENTITIES || 'src/entities.ts'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
});
import { DataSource } from "typeorm";
export const db = new DataSource({
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "cn",
    "password": "cn",
    "database": "habu",
    "entities": ["src/entities.ts"],
    "synchronize": true
});
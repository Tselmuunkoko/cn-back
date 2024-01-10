import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import {service} from "./services";
import {db} from "./connection";
import bodyParser from "body-parser";
import cors from 'cors';

dotenv.config()

const app: Express = express();
const port = process.env.PORT || 3000;
db.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

app.use(cors())
app.use(bodyParser.json())
app.use('/', service);
app.listen(port, () => {
        console.log(`[server]: Server is runnig at http://localhost:${port}`);
});

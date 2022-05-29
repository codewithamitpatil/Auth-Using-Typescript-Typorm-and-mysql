import "reflect-metadata";
import express, { Express, NextFunction, Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { container } from 'tsyringe';
import { createConnection } from "typeorm";
import hpp from 'hpp';

import routes from './routes/index.routes';


const host = config.get( 'host' ) as string;
const port = config.get( 'port' ) as number;
const origin = config.get( 'origin' ) as string;



const app: Express = express();

// enable cors
app.use( cors( {
    origin: ['http://localhost:3000', 'http://localhost:8000'],
    credentials: true
} ) )

// to secure HTTP Parameter Pollution attacks
app.use( hpp() );

// enable helmet for csrf
app.use( helmet( { contentSecurityPolicy: false } ) );

// parse json 
app.use( express.json() );

// parse url encoded data
app.use( express.urlencoded( { extended: true } ) );

// parse cookie
app.use( cookieParser() );


// check
app.use( async ( req: Request, res: Response, next: NextFunction ) => {
    console.log( req.url );
    console.log( req.body );
    console.log( req.headers );
    next();
} );

// intialize routes
app.use( '', routes );


// start db connection
const db = async () => {

    try {
        const connection = await createConnection();
        console.log( 'MYsql running' );
    } catch ( error ) {
        console.log( 'Mysql stop' );
        console.log( error );
    }

}

// start database connection
db();

export default app;

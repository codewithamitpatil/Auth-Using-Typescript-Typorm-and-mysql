import config from 'config';

import app from './app';

const host = config.get( 'host' ) as string;
const port = config.get( 'port' ) as number;

const server = () => {

    app.listen( port, () => {
        console.log( `Server is listening on http://${ host }:${ port }` );
    } );

};

server();


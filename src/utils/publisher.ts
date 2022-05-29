
import amqp from 'amqplib';
import config from 'config';

const uri = config.get( 'rabitMqUri' ) as string;

const Publish = async ( quename, message ) => {
    const connection = await amqp.connect( uri );
    const channel = await connection.createChannel();
    const que = await channel.assertQueue( quename, { durable: false } );
    channel.sendToQueue( quename, Buffer.from( JSON.stringify( message ) ) );

    setTimeout( () => {
        connection.close();
        console.log( 'connection closed' );
    }, 1000 );
}

export default Publish;
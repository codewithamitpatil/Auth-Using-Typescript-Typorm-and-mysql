
export default {

    host: "localhost",
    port: 5001,
    // for cors
    origin: '*',
    baseUrl: 'http://localhost:3000',
    serviceUrl: 'http://localhost:5001',
    saltWorkFactor: 10,
    // for messaging
    rabitMqUri: '',
    // for jwt token
    privateKey: 'amitisgood',
    accessTokenTtl: "10s",
    refreshTokenTtl: "1y",
    redisDb: {
        port: 6379,
        host: '127.0.0.1'
    },

    // for reset password token
    resetTokenTtl: '5m',

    // for nodemailer
    nodemailerOptions: {
        service: "gmail",
        auth: {
            user: 'amitwebdev2019@gmail.com',
            pass: ''
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    adminMail: 'amitwebdev2019@gmail.com',





}

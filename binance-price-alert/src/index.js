require('dotenv').config();

const player = require('play-sound')(opts = {});
const nodemailer = require("nodemailer");
const {WebsocketStream} = require('@binance/connector');
const {Console} = require('console');
const logger = new Console({stdout: process.stdout, stderr: process.stderr});

let priceAlertSent = false;

// Close websocket stream on SIGINT
process.on('SIGINT', () => {
    closeConnection();
});

const callbacks = {
    open: () => logger.debug('Connected to Websocket server'),
    close: () => logger.debug('Disconnected from Websocket server'),
    message: (data) => {
        handleValues(getCurrentPrice(data));
    }
}

logger.log(`Pair: ${process.env.TRADING_PAIR}, alert price: ${process.env.NOTIFFICATION_PRICE}`);

const websocketStreamClient = new WebsocketStream({logger, callbacks});
websocketStreamClient.kline(process.env.TRADING_PAIR, '1s');

function getCurrentPrice(data) {
    return JSON.parse(data).k.h;
}

async function handleValues(currentPrice) {
    if (priceAlertSent) {
        closeConnection();
        process.exit(1);
    }
    if (currentPrice * 1 >= process.env.NOTIFFICATION_PRICE * 1 && !priceAlertSent) {
        logger.log(`Current price is ${currentPrice}!!!`);
        if (process.env.PLAY_SOUND === '1') {
            player.play('./resources/alarm.mp3', function (err) {
                if (err) logger.log(err);
            });
        }
        if (process.env.SEND_EMAIL === '1') {
            await sendEmail(currentPrice);
        }

        priceAlertSent = true;
    }
}

async function sendEmail(price) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: `"Binance price alert" <${process.env.SMTP_SENDER_EMAIL}>`,
        to: process.env.EMAIL,
        subject: 'Binance price alert',
        text: `The current price of ${process.env.TRADING_PAIR} reached ${price}`,
    });

    logger.log("Message sent: %s", info.messageId);
}

function closeConnection() {
    websocketStreamClient.disconnect();
}

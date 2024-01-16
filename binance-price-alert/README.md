# Binance Price Alert System

This simple Node.js script monitors the real-time price of a specified trading pair on Binance using their WebSocket API. When the price reaches a predefined threshold, it sends an email alert using nodemailer.

## Prerequisites

- Node.js installed on your machine.
- An SMTP server for sending email alerts.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/SloppyCodes/binance-trading-helpers/binance-price-alert.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd binance-price-alert
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Create a `.env` file in the project root and add the following environment variables:**

    ```env
    TRADING_PAIR=BTCUSDT
    NOTIFICATION_PRICE=50000
    SMTP_HOST=your-smtp-host
    SMTP_PORT=your-smtp-port
    SMTP_USERNAME=your-smtp-username
    SMTP_PASSWORD=your-smtp-password
    SMTP_SENDER_EMAIL=your-email@example.com
    EMAIL=recipient-email@example.com
    ```

## Usage

Run the script:

```bash
npm run start

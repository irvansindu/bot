# WhatsApp Order Bot with Auto Payment

A WhatsApp bot that allows users to place orders and make payments automatically using Midtrans payment gateway.

## Features

- View menu items
- Place orders via WhatsApp
- Process payments using Midtrans
- Check order status
- Simple command interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Midtrans account (for payment processing)
- WhatsApp Web access (for the bot)

## Installation

1. Clone this repository
   ```bash
   git clone <repository-url>
   cd whatsapp-order-bot
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   - Copy `.env.example` to `.env`
   - Fill in your Midtrans credentials and MongoDB URI

4. Start the application
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. Scan the QR code with your WhatsApp
   - Open WhatsApp on your phone
   - Go to WhatsApp Web
   - Scan the QR code shown in the terminal

## Usage

Send the following commands to the bot:
- `!menu` - Show main menu
- `1` - View food menu
- `!pesan [menu_number] [quantity]` - Place an order
- `!konfirmasi` - Check payment status
- `!bantuan` - Show help

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/whatsapp-order-bot
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

## Payment Integration

This bot uses Midtrans for payment processing. You'll need to:

1. Sign up for a Midtrans account at [midtrans.com](https://midtrans.com/)
2. Get your Server Key and Client Key from the dashboard
3. Update the `.env` file with your Midtrans credentials

## License

This project is licensed under the MIT License.

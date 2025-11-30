require('dotenv').config({ path: __dirname + '/.env' });

// In-memory tracker (tidak lagi dipakai untuk greeting, tapi dibiarkan jika mau dipakai fitur lain)
const seenUsers = new Set();
const path = require('path');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const mongoose = require('mongoose');
const midtransClient = require('midtrans-client');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Admin WhatsApp number for order notifications (e.g. 628xxx)
const ADMIN_PHONE = process.env.ADMIN_PHONE;

// Simple digital products list (bisa kamu edit sendiri)
const PRODUCTS = [
  { name: 'ALIGHT MOTION', price: 15000 },
  { name: 'APPLE MUSIC', price: 15000 },
  { name: 'BSTATION', price: 15000 },
  { name: 'CANVA PRO', price: 20000 },
  { name: 'CAPCUT PRO', price: 9000 },
  { name: 'CHATGPT', price: 30000 },
  { name: 'DEEPL', price: 15000 },
  { name: 'GEMINI AI (VEO 3)', price: 30000 },
  { name: 'GMAIL', price: 15000 },
  { name: 'NETFLIX', price: 40000 },
  { name: 'PERPLEXITY AI', price: 30000 },
  { name: 'PRIME VIDEO', price: 30000 },
  { name: 'SCRIBD', price: 25000 },
  { name: 'SPOTIFY', price: 25000 },
  { name: 'STRAVA', price: 20000 },
  { name: 'VIU', price: 20000 },
  { name: 'VIDEO PRIVATE', price: 30000 },
  { name: 'VPN', price: 25000 },
  { name: 'WINDSURF AI', price: 30000 },
  { name: 'YOUTUBE', price: 30000 },
  { name: 'ZOOM', price: 20000 }
];

// MongoDB Connection (disabled for now, stok digital tidak pakai DB)
const MONGODB_URI = null;
let Product = null;
if (!MONGODB_URI) {
  console.log('MongoDB is disabled for product stock in this version of the bot.');
}

// Initialize WhatsApp client
const client = new Client({
  // clientId berbeda = session berbeda (akan minta scan QR baru)
  authStrategy: new LocalAuth({ clientId: 'store-bot-v2' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Midtrans configuration (optional)
let snap = null;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;

if (MIDTRANS_SERVER_KEY) {
  snap = new midtransClient.Snap({
    isProduction: false, // Set to true for production
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY
  });
  console.log('Midtrans enabled');
} else {
  console.log('Midtrans is NOT configured. Payments will be handled secara manual/dummy.');
}

// QR Code generation
client.on('qr', (qr) => {
  console.log('QR RECEIVED');
  qrcode.generate(qr, { small: true });
});

// When authenticated
client.on('authenticated', () => {
  console.log('Client is authenticated!');
});

// When ready
client.on('ready', () => {
  console.log('Client is ready!');
});

// Message handler
client.on('message', async (message) => {
  const content = message.body.toLowerCase();
  const sender = message.from;

  // Auto-greeting: setiap pesan di private chat (bukan grup)
  try {
    const chat = await message.getChat();
    const isGroup = chat && chat.isGroup;

    // Hanya greet jika:
    // - Bukan grup
    // - sender adalah user biasa (id berakhiran '@c.us')
    if (!isGroup && sender.endsWith('@c.us')) {
      await message.reply(
        `*QINZ STORE BOT* 👋\n` +
        `Selamat datang! / Welcome!\n\n` +
        `ID: Ketik *!menu* untuk melihat menu utama atau *!produk* untuk daftar produk digital.\n` +
        `EN: Type *!menu* for main menu or *!produk* to see digital products.\n`
      );
    }
  } catch (err) {
    console.error('Error saat cek chat untuk greeting:', err.message || err);
  }
  
  // Jika user mengirim foto (misalnya bukti transfer) di private chat, otomatis forward ke admin
  try {
    const chat = await message.getChat();
    const isGroup = chat && chat.isGroup;

    if (!isGroup && message.hasMedia && message.type === 'image') {
      const media = await message.downloadMedia();

      // Kirim ke admin / Forward to admin
      if (ADMIN_PHONE) {
        const adminId = `${ADMIN_PHONE}@c.us`;
        const caption =
          `*[BUKTI PEMBAYARAN / PAYMENT PROOF]*\n` +
          `ID: Dari ${sender.replace('@c.us', '')}\n` +
          `EN: From ${sender.replace('@c.us', '')}\n` +
          `Time: ${new Date().toLocaleString('id-ID')}\n` +
          `Note: Forwarded automatically by the bot.`;

        try {
          await client.sendMessage(adminId, media, { caption });
        } catch (err) {
          console.error('Gagal forward bukti pembayaran ke admin:', err.message || err);
        }
      }

      // Balas ke user / Reply to customer
      await message.reply(
        'ID: Terima kasih, bukti pembayaran sudah kami terima. Admin akan cek dan memproses pesanan secepatnya.\n' +
        'EN: Thank you, we have received your payment proof. Admin will verify and process your order as soon as possible.'
      );

      // Jangan lanjut ke handler teks lain untuk pesan ini
      return;
    }
  } catch (err) {
    console.error('Error saat memproses bukti pembayaran:', err.message || err);
  }
  
  // Simple command handler
  if (content === '!menu') {
    const menu = `*MENU UTAMA QINZ STORE / MAIN MENU*\n\n` +
      `1) *!produk*\n` +
      `   ID: Lihat daftar produk digital (ketik angka untuk pilih).\n` +
      `   EN: View digital products (type product number to select).\n` +
      `2) *!bantuan*\n` +
      `   ID: Cara order dan informasi lain.\n` +
      `   EN: How to order and more info.\n` +
      `3) *!konfirmasi*\n` +
      `   ID: Cek status / konfirmasi pembayaran.\n` +
      `   EN: Check payment / confirmation status.\n\n` +
      `*Fitur Lain / Other Commands:*\n` +
      `- *!beli [nomor]* → ID: Pilih produk dari list. EN: Choose product by its number.\n` +
      `- *!sudahbayar* → ID: Konfirmasi ke admin kalau sudah bayar. EN: Notify admin you have paid.\n` +
      `- *!tagall* → ID: Tag semua member (hanya di grup). EN: Mention all group members (group only).\n` +
      `- *!fitur* → ID: Lihat semua fitur. EN: Show full feature list.\n` +
      `- *!bantuan* → ID: Panduan lengkap. EN: Full help guide.`;
    
    await message.reply(menu);
  } else if (content === '!produk' || content.startsWith('!produk ')) {
    // List produk digital dengan pagination sederhana
    const parts = content.split(' ');
    const page = parseInt(parts[1] || '1', 10) || 1;
    const perPage = 10;
    const totalPages = Math.max(1, Math.ceil(PRODUCTS.length / perPage));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * perPage;
    const end = start + perPage;
    const items = PRODUCTS.slice(start, end);

    let text = `*LIST PRODUK QINZ STORE / PRODUCT LIST*\n` +
      `────────────────────────────\n\n`;

    items.forEach((item, idx) => {
      const number = start + idx + 1;
      text += `[${number}] ${item.name}\n` +
        `Harga: Rp ${item.price.toLocaleString('id-ID')}\n\n`;
    });

    text += `ID: Ketik *angka produk* untuk memilih (contoh: *${start + 1}*).\n` +
      `EN: Type the *product number* to select (e.g. *${start + 1}*).\n` +
      `ID: Bisa juga pakai *!beli [nomor]*.\n` +
      `EN: Or use *!beli [number]*.\n\n` +
      `Navigasi / Navigation:\n` +
      (safePage > 1 ? `- *!produk ${safePage - 1}* : Prev\n` : '') +
      (safePage < totalPages ? `- *!produk ${safePage + 1}* : Next\n` : '') +
      `\nHalaman ${safePage} dari ${totalPages}`;

    await message.reply(text);
  } else if (/^\d+$/.test(content)) {
    // Pilih produk hanya dengan mengetik angka
    const number = parseInt(content, 10);

    if (!number || number < 1 || number > PRODUCTS.length) {
      return message.reply(`Nomor produk tidak valid. Ketik *!produk* untuk melihat daftar produk.`);
    }

    const product = PRODUCTS[number - 1];

    // Hanya CAPCUT PRO yang tersedia, produk lain dianggap habis
    if (product.name !== 'CAPCUT PRO') {
      return message.reply('Maaf, stok produk ini sedang habis. Saat ini hanya *CAPCUT PRO 35 DAY* yang tersedia.');
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false });

    await message.reply(
      `*KONFIRMASI PESANAN 🛒*\n` +
      `╭ - - - - - - - - - - - - - - - - - - - - - ╮\n` +
      `┊・Produk: [${number}] ${product.name}\n` +
      `┊・Variasi: 35 HARI\n` +
      `┊・Harga satuan: Rp. ${product.price.toLocaleString('id-ID')}\n` +
      `┊・Stok tersedia: READY\n` +
      `┊ - - - - - - - - - - - - - - - - - - - - -\n` +
      `┊・Jumlah Pesanan: x1\n` +
      `┊・Total Pembayaran: Rp. ${product.price.toLocaleString('id-ID')}\n` +
      `╰ - - - - - - - - - - - - - - - - - - - - - ╯\n` +
      `╰➤ Refresh at ${timeStr} WIB\n\n` +
      `ID: Silakan bayar via QRIS IRVAN SINDU (scan QR yang dikirim).\n` +
      `EN: Please pay via QRIS IRVAN SINDU (scan the QR sent by the bot).\n\n` +
      `ID: Setelah bayar, kirim bukti lalu ketik *!sudahbayar*.\n` +
      `EN: After paying, send your proof and type *!sudahbayar*.`
    );

    // Kirim gambar QRIS manual
    try {
      const qrisPath = path.join(__dirname, 'qris.png');
      const media = MessageMedia.fromFilePath(qrisPath);
      await client.sendMessage(sender, media, {
        caption: 'Scan QRIS IRVAN SINDU untuk melakukan pembayaran.'
      });
    } catch (err) {
      console.error('Gagal mengirim gambar QRIS:', err.message || err);
    }

    // Kirim notifikasi ke admin jika dikonfigurasi
    if (ADMIN_PHONE) {
      const adminId = `${ADMIN_PHONE}@c.us`;
      const adminText =
        `*[NEW ORDER]*\n` +
        `Produk : [${number}] ${product.name}\n` +
        `Harga  : Rp ${product.price.toLocaleString('id-ID')}\n` +
        `Jumlah : 1\n` +
        `Total  : Rp ${product.price.toLocaleString('id-ID')}\n` +
        `User   : ${sender.replace('@c.us', '')}\n` +
        `Waktu  : ${now.toLocaleString('id-ID')}\n`;

      await client.sendMessage(adminId, adminText);
    }
  } else if (!content.startsWith('!')) {
    // Coba cocokkan nama produk ketika user mengetik nama langsung (misal: capcut, netflix)
    const nameMatchIndex = PRODUCTS.findIndex(p => p.name.toLowerCase() === content.trim());

    if (nameMatchIndex !== -1) {
      const number = nameMatchIndex + 1;
      const product = PRODUCTS[nameMatchIndex];

      if (product.name !== 'CAPCUT PRO') {
        return message.reply('Maaf, stok produk ini sedang habis. Saat ini hanya *CAPCUT PRO 35 DAY* yang tersedia.');
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour12: false });

      await message.reply(
        `*KONFIRMASI PESANAN 🛒*\n` +
        `╭ - - - - - - - - - - - - - - - - - - - - - ╮\n` +
        `┊・Produk: [${number}] ${product.name}\n` +
        `┊・Variasi: 35 HARI\n` +
        `┊・Harga satuan: Rp. ${product.price.toLocaleString('id-ID')}\n` +
        `┊・Stok tersedia: READY\n` +
        `┊ - - - - - - - - - - - - - - - - - - - - -\n` +
        `┊・Jumlah Pesanan: x1\n` +
        `┊・Total Pembayaran: Rp. ${product.price.toLocaleString('id-ID')}\n` +
        `╰ - - - - - - - - - - - - - - - - - - - - - ╯\n` +
        `╰➤ Refresh at ${timeStr} WIB\n\n` +
        `ID: Silakan bayar via QRIS IRVAN SINDU (scan QR yang dikirim).\n` +
        `EN: Please pay via QRIS IRVAN SINDU (scan the QR sent by the bot).\n\n` +
        `ID: Setelah bayar, kirim bukti lalu ketik *!sudahbayar*.\n` +
        `EN: After paying, send your proof and type *!sudahbayar*.`
      );

      try {
        const qrisPath = path.join(__dirname, 'qris.png');
        const media = MessageMedia.fromFilePath(qrisPath);
        await client.sendMessage(sender, media, {
          caption: 'Scan QRIS IRVAN SINDU untuk melakukan pembayaran.'
        });
      } catch (err) {
        console.error('Gagal mengirim gambar QRIS:', err.message || err);
      }

      if (ADMIN_PHONE) {
        const adminId = `${ADMIN_PHONE}@c.us`;
        const adminText =
          `*[NEW ORDER]*\n` +
          `Produk : [${number}] ${product.name}\n` +
          `Harga  : Rp ${product.price.toLocaleString('id-ID')}\n` +
          `Jumlah : 1\n` +
          `Total  : Rp ${product.price.toLocaleString('id-ID')}\n` +
          `User   : ${sender.replace('@c.us', '')}\n` +
          `Waktu  : ${now.toLocaleString('id-ID')}\n`;

        await client.sendMessage(adminId, adminText);
      }

      return; // sudah ditangani, jangan terus ke handler lain
    }
  } else if (content.startsWith('!beli')) {
    // Pilih salah satu produk digital berdasarkan nomor
    const parts = content.split(' ');
    const number = parseInt(parts[1] || '0', 10);

    if (!number || number < 1 || number > PRODUCTS.length) {
      return message.reply(`Nomor produk tidak valid. Ketik *!produk* untuk melihat daftar produk.`);
    }

    const product = PRODUCTS[number - 1];

    if (product.name !== 'CAPCUT PRO') {
      return message.reply('Maaf, stok produk ini sedang habis. Saat ini hanya *CAPCUT PRO 35 DAY* yang tersedia.');
    }

    const now = new Date();

    await message.reply(
      `*KONFIRMASI PESANAN 🛒*\n` +
      `╭ - - - - - - - - - - - - - - - - - - - - - ╮\n` +
      `┊・Produk: [${number}] ${product.name}\n` +
      `┊・Variasi: 35 HARI\n` +
      `┊・Harga satuan: Rp. ${product.price.toLocaleString('id-ID')}\n` +
      `┊・Stok tersedia: READY\n` +
      `┊ - - - - - - - - - - - - - - - - - - - - -\n` +
      `┊・Jumlah Pesanan: x1\n` +
      `┊・Total Pembayaran: Rp. ${product.price.toLocaleString('id-ID')}\n` +
      `╰ - - - - - - - - - - - - - - - - - - - - - ╯\n` +
      `╰➤ Refresh at ${now.toLocaleTimeString('id-ID', { hour12: false })} WIB\n\n` +
      `ID: Silakan bayar via QRIS IRVAN SINDU (scan QR yang dikirim).\n` +
      `EN: Please pay via QRIS IRVAN SINDU (scan the QR sent by the bot).\n\n` +
      `ID: Setelah bayar, kirim bukti lalu ketik *!sudahbayar*.\n` +
      `EN: After paying, send your proof and type *!sudahbayar*.`
    );

    try {
      const media = MessageMedia.fromFilePath('./qris.png');
      await client.sendMessage(sender, media, {
        caption: 'Scan QRIS IRVAN SINDU untuk melakukan pembayaran.'
      });
    } catch (err) {
      console.error('Gagal mengirim gambar QRIS:', err.message || err);
    }

    if (ADMIN_PHONE) {
      const adminId = `${ADMIN_PHONE}@c.us`;
      const adminText =
        `*[NEW ORDER]*\n` +
        `Produk : [${number}] ${product.name}\n` +
        `Harga  : Rp ${product.price.toLocaleString('id-ID')}\n` +
        `Jumlah : 1\n` +
        `Total  : Rp ${product.price.toLocaleString('id-ID')}\n` +
        `User   : ${sender.replace('@c.us', '')}\n` +
        `Waktu  : ${now.toLocaleString('id-ID')}\n`;

      await client.sendMessage(adminId, adminText);
    }
  } else if (content.startsWith('!pesan')) {
    // Handle order
    const [_, itemNumber, quantity] = content.split(' ');
    const items = [
      { name: 'Nasi Goreng', price: 25000 },
      { name: 'Mie Goreng', price: 20000 },
      { name: 'Ayam Goreng', price: 30000 },
      { name: 'Es Teh', price: 5000 },
      { name: 'Es Jeruk', price: 7000 }
    ];

    const selectedItem = items[parseInt(itemNumber) - 1];
    if (!selectedItem) {
      return message.reply('Menu tidak valid. Silakan coba lagi.');
    }

    const total = selectedItem.price * parseInt(quantity || 1);
    
    // In a real app, save this order to database
    const order = {
      userId: sender,
      items: [{
        name: selectedItem.name,
        quantity: parseInt(quantity || 1),
        price: selectedItem.price
      }],
      total: total,
      status: 'pending_payment'
    };

    // Create payment with Midtrans (if configured), otherwise dummy/manual info
    if (!snap) {
      await message.reply(
        `*Detail Pesanan*\n` +
        `====================\n` +
        `Item: ${selectedItem.name}\n` +
        `Jumlah: ${quantity || 1}\n` +
        `Total: Rp ${total.toLocaleString('id-ID')}\n\n` +
        `Saat ini pembayaran otomatis belum diaktifkan.\n` +
        `Silakan lakukan pembayaran secara manual (misalnya transfer), lalu kirim bukti ke admin.`
      );
    } else {
      try {
        const parameter = {
          transaction_details: {
            order_id: `ORDER-${Date.now()}`,
            gross_amount: order.total
          },
          credit_card: {
            secure: true
          },
          customer_details: {
            phone: sender.replace('@c.us', '')
          }
        };

        const transaction = await snap.createTransaction(parameter);
        const paymentUrl = transaction.redirect_url;
        
        await message.reply(
          `*Detail Pesanan*\n` +
          `====================\n` +
          `Item: ${selectedItem.name}\n` +
          `Jumlah: ${quantity || 1}\n` +
          `Total: Rp ${total.toLocaleString('id-ID')}\n\n` +
          `Silakan melakukan pembayaran di link berikut:\n${paymentUrl}\n\n` +
          `Setelah membayar, ketik *!konfirmasi* untuk memeriksa status pembayaran.`
        );
      } catch (error) {
        console.error('Payment error:', error);
        await message.reply('Maaf, terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
      }
    }
  } else if (content === '!konfirmasi') {
    // Check payment status
    // In a real app, check the payment status from database
    await message.reply('Pembayaran Anda sedang diproses. Kami akan mengirimkan konfirmasi segera.');
  } else if (content === '!fitur') {
    const fiturText =
      `*DAFTAR FITUR QINZ STORE BOT / FEATURE LIST*\n\n` +
      `1) *!menu*\n` +
      `   ID: Menu utama. EN: Main menu.\n` +
      `2) *!produk*\n` +
      `   ID: Lihat list produk digital (ketik angka). EN: View digital products (type number).\n` +
      `3) *!beli [nomor]*\n` +
      `   ID: Pilih produk dengan nomor. EN: Choose product by number.\n` +
      `4) Ketik angka produk (misal: 5)\n` +
      `   ID: Tampilkan konfirmasi + QRIS. EN: Show order confirmation + QRIS.\n` +
      `5) *!sudahbayar*\n` +
      `   ID: Konfirmasi ke admin bahwa kamu sudah bayar via QRIS. EN: Tell admin you have paid via QRIS.\n` +
      `6) *!tagall* (grup saja / groups only)\n` +
      `   ID: Tag semua member. EN: Mention all members.\n` +
      `7) *!bantuan*\n` +
      `   ID: Pesan bantuan singkat. EN: Short help message.\n\n` +
      `Catatan / Note: Setelah pilih produk, bot akan mengirim gambar QRIS IRVAN SINDU dan notifikasi order ke admin.`;

    await message.reply(fiturText);
  } else if (content === '!sudahbayar') {
    // User mengkonfirmasi sudah bayar via QRIS
    await message.reply(
      'ID: Terima kasih, konfirmasi pembayaran sudah kami terima. Admin akan cek dan memproses pesanan secepatnya.\n' +
      'EN: Thank you, we have received your payment confirmation. Admin will verify and process your order as soon as possible.'
    );

    if (ADMIN_PHONE) {
      const adminId = `${ADMIN_PHONE}@c.us`;
      const now = new Date();
      const adminText =
        `*[PAYMENT CONFIRM]*\n` +
        `User   : ${sender.replace('@c.us', '')}\n` +
        `Waktu  : ${now.toLocaleString('id-ID')}\n` +
        `Catatan: User ini mengirim *!sudahbayar* (klaim sudah transfer via QRIS).\n` +
        `Silakan cek bukti pembayaran yang dikirim di chat dan proses order terkait.`;

      await client.sendMessage(adminId, adminText);
    }
  } else if (content.startsWith('!kirim')) {
    // Hanya admin yang boleh pakai shortcut ini
    if (!ADMIN_PHONE || !sender.includes(ADMIN_PHONE)) {
      return message.reply('Perintah *!kirim* hanya bisa dipakai oleh admin.');
    }

    // Format: !kirim 628xxxx PRODUK data_akun
    const raw = message.body.trim();
    const parts = raw.split(/\s+/); // jaga spasi berlebih

    if (parts.length < 4) {
      return message.reply('Format salah. Contoh: *!kirim 628xxxx NETFLIX email:pass*');
    }

    const phone = parts[1].replace(/[^0-9]/g, '');
    const productName = parts[2];
    const accountData = parts.slice(3).join(' ');

    if (!phone) {
      return message.reply('Nomor tujuan tidak valid. Gunakan format angka saja, contoh: 62812xxxxxx');
    }

    const targetId = `${phone}@c.us`;

    const customerText =
      `*Pesanan ${productName.toUpperCase()} kamu sudah aktif* ✅\n` +
      `Silakan gunakan detail berikut:\n\n` +
      `${accountData}\n\n` +
      `Terima kasih sudah order di QINZ STORE.`;

    try {
      await client.sendMessage(targetId, customerText);
      await message.reply(`Pesan aktivasi untuk *${productName.toUpperCase()}* sudah dikirim ke *${phone}*.`);
    } catch (err) {
      console.error('Gagal kirim akun/kode ke customer:', err.message || err);
      await message.reply('Gagal mengirim pesan ke customer. Cek kembali nomor tujuan dan coba lagi.');
    }
  } else if (content === '!tagall') {
    // Mention semua member di grup
    const chat = await message.getChat();

    if (!chat.isGroup) {
      return message.reply('Perintah *!tagall* hanya bisa dipakai di dalam grup.');
    }

    const participants = chat.participants || [];
    if (participants.length === 0) {
      return message.reply('Tidak ada member yang bisa di-tag.');
    }

    const mentions = [];
    let text = '*TAG ALL*\\n';

    for (const p of participants) {
      const wid = p.id && p.id._serialized ? p.id._serialized : null;
      if (!wid) continue;

      mentions.push(wid);

      const userNumber = p.id.user || wid.replace('@c.us', '');
      text += `@${userNumber} `;
    }

    await chat.sendMessage(text.trim(), { mentions });
  } else if (content === '!bantuan' || content === '4') {
    const helpText = `*Bantuan*\n\n` +
      `Berikut perintah yang tersedia:\n` +
      `- !menu : Menampilkan menu utama\n` +
      `- !pesan [nomor] [jumlah] : Memesan menu\n` +
      `- !konfirmasi : Memeriksa status pembayaran\n` +
      `- !bantuan : Menampilkan pesan bantuan ini`;
    
    await message.reply(helpText);
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize WhatsApp client
client.initialize();

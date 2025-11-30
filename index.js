const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

// Inisialisasi WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Objek untuk menyimpan data pesanan
const orders = new Map();

// Generate ID unik untuk pesanan
function generateOrderId() {
    return 'ORD' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Format harga ke Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Daftar menu
const menu = {
    '1': { name: 'Nasi Goreng', price: 25000 },
    '2': { name: 'Mie Goreng', price: 20000 },
    '3': { name: 'Ayam Goreng', price: 30000 },
    '4': { name: 'Es Teh', price: 5000 },
    '5': { name: 'Es Jeruk', price: 7000 }
};

// Event ketika QR code berhasil di-scan
client.on('qr', (qr) => {
    console.log('Scan QR Code ini untuk login ke WhatsApp Web:');
    qrcode.generate(qr, { small: true });
});

// Event ketika berhasil terhubung
client.on('ready', () => {
    console.log('Bot WhatsApp siap digunakan!');
});

// Event ketika menerima pesan
client.on('message', async (message) => {
    const text = message.body.toLowerCase() || '';
    const sender = message.from;
    const order = orders.get(sender) || { step: 0 };

    try {
        if (text === '!menu') {
            // Tampilkan menu
            let menuText = '📋 *DAFTAR MENU* 📋\n\n';
            for (const [key, item] of Object.entries(menu)) {
                menuText += `${key}. ${item.name} - ${formatRupiah(item.price)}\n`;
            }
            menuText += '\nKetik nomor menu untuk memesan';
            await client.sendMessage(sender, menuText);
            orders.set(sender, { ...order, step: 1 });
        } 
        else if (order.step === 1 && menu[text]) {
            // Simpan item yang dipilih
            const selectedItem = menu[text];
            await client.sendMessage(sender, `Berapa porsi ${selectedItem.name}?`);
            orders.set(sender, { 
                ...order, 
                step: 2, 
                selectedItem: selectedItem.name,
                price: selectedItem.price
            });
        }
        else if (order.step === 2 && !isNaN(text)) {
            // Konfirmasi pesanan
            const quantity = parseInt(text);
            const total = order.price * quantity;
            await client.sendMessage(sender, 
                `📝 *Konfirmasi Pesanan*\n\n` +
                `Item: ${order.selectedItem}\n` +
                `Jumlah: ${quantity} porsi\n` +
                `Harga: ${formatRupiah(order.price)} x ${quantity} = ${formatRupiah(total)}\n\n` +
                `Ketik *ya* untuk konfirmasi atau *batal* untuk membatalkan`
            );
            orders.set(sender, { 
                ...order, 
                step: 3, 
                quantity: quantity,
                total: total
            });
        }
        else if (order.step === 3 && text === 'ya') {
            // Proses pembayaran
            const orderId = generateOrderId();
            await client.sendMessage(sender, 
                `✅ *Pesanan Diterima*\n\n` +
                `No. Pesanan: ${orderId}\n` +
                `Item: ${order.selectedItem}\n` +
                `Jumlah: ${order.quantity} porsi\n` +
                `Total: ${formatRupiah(order.total)}\n\n` +
                `Silakan lakukan pembayaran ke:\n` +
                `Bank: BCA\n` +
                `No. Rekening: 1234567890\n` +
                `A/N: Nama Toko\n\n` +
                `Setelah melakukan pembayaran, kirim bukti transfer dengan mengetik *bayar* diikuti dengan nomor pesanan.`
            );
            orders.set(sender, { 
                ...order,
                step: 4,
                orderId: orderId,
                status: 'menunggu_pembayaran'
            });
        }
        else if (text.startsWith('bayar ')) {
            // Proses konfirmasi pembayaran
            const orderId = text.split(' ')[1];
            await client.sendMessage(sender, 
                `Terima kasih telah melakukan pembayaran untuk pesanan ${orderId}.\n` +
                `Pesanan Anda sedang diproses. Admin akan segera memverifikasi pembayaran Anda.`
            );
            // Di sini Anda bisa menambahkan logika untuk mengirim notifikasi ke admin
        }
        else if (text === 'batal') {
            // Batalkan pesanan
            orders.delete(sender);
            await client.sendMessage(sender, 'Pesanan telah dibatalkan.\nKetik *menu* untuk melihat daftar menu.');
        }
        else if (text === 'help' || text === 'bantuan') {
            // Tampilkan bantuan
            await client.sendMessage(sender,
                '🤖 *BOT PESANAN OTOMATIS* 🤖\n\n' +
                'Perintah yang tersedia:\n' +
                '• *menu* - Tampilkan daftar menu\n' +
                '• *batal* - Batalkan pesanan\n' +
                '• *help* - Tampilkan bantuan ini\n\n' +
                'Ikuti petunjuk yang diberikan untuk melakukan pemesanan.'
            );
        }
    } catch (error) {
        console.error('Error:', error);
        await client.sendMessage(sender, 'Maaf, terjadi kesalahan. Silakan coba lagi.');
    }
});

// Inisialisasi server web untuk menampilkan QR code
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp Order Bot</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                h1 { color: #25D366; }
                #qrcode { margin: 20px auto; }
            </style>
        </head>
        <body>
            <h1>Scan QR Code dengan WhatsApp Web</h1>
            <div id="qrcode"></div>
            <p>Gunakan WhatsApp Web untuk scan kode di atas</p>
            <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
            <script>
                // Auto refresh halaman setiap 30 detik
                setTimeout(() => location.reload(), 30000);
                
                // Tampilkan pesan untuk scan QR code
                const qrDiv = document.getElementById('qrcode');
                qrDiv.innerHTML = '<p>Membuat QR Code...</p>';
            </script>
        </body>
        </html>
    `);
});

// Mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Inisialisasi WhatsApp client
client.initialize();

# Hono Server-Sent Events (SSE)

## 📌 Deskripsi
Proyek ini menggunakan **Hono** untuk menyediakan **Server-Sent Events (SSE)**, memungkinkan klien menerima pembaruan data secara real-time. SSE adalah teknologi berbasis HTTP yang memungkinkan server mengirim data ke klien tanpa memerlukan polling terus-menerus.

## 🚀 Instalasi & Menjalankan Server

### 1️⃣ **Clone Repository & Install Dependencies**
```sh
npm install
```

### 2️⃣ **Jalankan Server**
```sh
node server.js
```
Server akan berjalan di **http://localhost:3000**.

## 📡 SSE Endpoint
**Endpoint SSE tersedia di:**
```
GET /sse
```
Endpoint ini akan mengirimkan waktu server setiap detik kepada klien.

## 📄 Struktur Kode
### **server.js**
```javascript
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { streamSSE } from 'hono/streaming';

const app = new Hono();

// Middleware CORS
app.use('*', cors({
  origin: '*',
  methods: 'GET, OPTIONS',
  headers: 'Content-Type, Authorization',
  credentials: true,
}));

// Middleware untuk SSE Headers
app.use('/sse/*', (c, next) => {
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');
  return next();
});

// Endpoint SSE
app.get('/sse', async (c) => {
  return streamSSE(c, async (stream) => {
    let id = 0;
    while (true) {
      const message = `It is ${new Date().toISOString()}`;
      await stream.writeSSE({
        data: message,
        event: 'time-update',
        id: String(id++),
      });
      await stream.sleep(1000);
    }
  });
});

// Menjalankan server
serve({ fetch: app.fetch, port: 3000 });
```

## 🎯 Penggunaan di Frontend

### 🔹 **Menggunakan Event Spesifik (`time-update`):**
Gunakan `addEventListener` untuk menangkap event **time-update** yang dikirim dari server.

```html
<script>
    const eventSource = new EventSource('http://localhost:3000/sse');

    eventSource.addEventListener('time-update', (event) => {
        console.log('SSE event:', event.data);
        document.getElementById('output').textContent = event.data;
    });

    eventSource.onerror = function (error) {
        console.error('SSE error:', error);
        eventSource.close();
    };
</script>
```

### 🔹 **Menggunakan Global Event (`onmessage`):**
Jika server tidak mengirimkan nama event, gunakan `onmessage`.

> **Catatan:** Agar ini berfungsi, ubah server untuk menghapus `event: 'time-update'` saat mengirim SSE.

```html
<script>
    const eventSource = new EventSource('http://localhost:3000/sse');

    eventSource.onmessage = function (event) {
        console.log('SSE message:', event.data);
        document.getElementById('output').textContent = event.data;
    };

    eventSource.onerror = function (error) {
        console.error('SSE error:', error);
        eventSource.close();
    };
</script>
```

## 🔄 Perbedaan Event Spesifik vs Global Event
| Metode | Keunggulan | Kekurangan |
|--------|-----------|------------|
| `addEventListener('event-name', callback)` | Bisa menangkap event spesifik | Harus tahu nama event yang dikirim server |
| `onmessage` | Bisa menangkap semua pesan | Tidak bisa menangani banyak event berbeda |

## 📌 Kesimpulan
- Gunakan **`addEventListener('time-update', callback)`** jika server mengirim event dengan nama tertentu.
- Gunakan **`onmessage`** jika server hanya mengirim data tanpa event name.

🔥 **Sekarang kamu bisa menggunakan SSE di Hono dengan optimal!** 🚀


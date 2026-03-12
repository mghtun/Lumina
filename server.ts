import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import db from './src/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Settings
  app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post('/api/settings', (req, res) => {
    const updates = req.body;
    const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction((updates) => {
      for (const [key, value] of Object.entries(updates)) {
        updateStmt.run(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });
    transaction(updates);
    res.json({ success: true });
  });

  // Menu Categories
  app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    res.json(categories);
  });

  app.post('/api/categories', (req, res) => {
    const { name, sort_order } = req.body;
    const result = db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)').run(name, sort_order || 0);
    res.json({ id: result.lastInsertRowid });
  });

  // Menu Items
  app.get('/api/menu', (req, res) => {
    const items = db.prepare(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m 
      LEFT JOIN categories c ON m.category_id = c.id 
      ORDER BY c.sort_order ASC, m.sort_order ASC
    `).all();
    res.json(items);
  });

  app.post('/api/menu', (req, res) => {
    const { category_id, name, description, price, image_url, is_popular, sort_order } = req.body;
    const result = db.prepare(`
      INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular, sort_order) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(category_id, name, description, price, image_url, is_popular ? 1 : 0, sort_order || 0);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/menu/:id', (req, res) => {
    const { category_id, name, description, price, image_url, is_popular, sort_order } = req.body;
    db.prepare(`
      UPDATE menu_items 
      SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, is_popular = ?, sort_order = ?
      WHERE id = ?
    `).run(category_id, name, description, price, image_url, is_popular ? 1 : 0, sort_order || 0, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/menu/:id', (req, res) => {
    db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Reservations
  app.get('/api/reservations', (req, res) => {
    const reservations = db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC').all();
    res.json(reservations);
  });

  app.post('/api/reservations', (req, res) => {
    const { name, email, phone, date, time, guests, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO reservations (name, email, phone, date, time, guests, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, date, time, guests, notes);
    res.json({ id: result.lastInsertRowid, success: true });
  });

  app.put('/api/reservations/:id/status', (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Contacts
  app.get('/api/contacts', (req, res) => {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json(contacts);
  });

  app.post('/api/contacts', (req, res) => {
    const { name, email, message } = req.body;
    db.prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)').run(name, email, message);
    res.json({ success: true });
  });

  // Posts (Blog/Announcements)
  app.get('/api/posts', (req, res) => {
    const posts = db.prepare('SELECT * FROM posts ORDER BY published_at DESC').all();
    res.json(posts);
  });

  app.post('/api/posts', (req, res) => {
    const { title, content, image_url } = req.body;
    const result = db.prepare('INSERT INTO posts (title, content, image_url) VALUES (?, ?, ?)').run(title, content, image_url);
    res.json({ id: result.lastInsertRowid });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

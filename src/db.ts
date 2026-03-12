import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'restaurant.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('restaurant_name', 'Lumina');
  insertSetting.run('tagline', 'A Culinary Journey Through Light and Flavor');
  insertSetting.run('about_text', 'Lumina is a modern fine-dining experience where culinary artistry meets contemporary elegance. Our chef crafts each dish to be a masterpiece, using only the finest seasonal ingredients.');
  insertSetting.run('chef_name', 'Elena Rostova');
  insertSetting.run('chef_bio', 'With over 15 years of experience in Michelin-starred kitchens across Europe, Chef Elena brings her passion for innovative flavor combinations to Lumina.');
  insertSetting.run('address', '123 Culinary Ave, Food District, NY 10001');
  insertSetting.run('phone', '+1 (555) 123-4567');
  insertSetting.run('email', 'reservations@luminarestaurant.com');
  insertSetting.run('opening_hours', JSON.stringify([
    { day: 'Monday', hours: 'Closed' },
    { day: 'Tuesday - Thursday', hours: '5:00 PM - 10:00 PM' },
    { day: 'Friday - Saturday', hours: '5:00 PM - 11:00 PM' },
    { day: 'Sunday', hours: '4:00 PM - 9:00 PM' }
  ]));
  insertSetting.run('theme_color', '#0f172a'); // slate-900
  insertSetting.run('hero_image', 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1920&auto=format&fit=crop');
}

// Force update hero image to Myanmar background for existing databases
db.prepare("UPDATE settings SET value = 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1920&auto=format&fit=crop' WHERE key = 'hero_image'").run();

const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (categoriesCount.count === 0) {
  const insertCategory = db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)');
  const startersId = insertCategory.run('Starters', 1).lastInsertRowid;
  const mainsId = insertCategory.run('Mains', 2).lastInsertRowid;
  const dessertsId = insertCategory.run('Desserts', 3).lastInsertRowid;

  const insertMenuItem = db.prepare('INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) VALUES (?, ?, ?, ?, ?, ?)');
  insertMenuItem.run(startersId, 'Truffle Arancini', 'Crispy risotto balls with wild mushrooms and black truffle aioli.', 16.00, 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1000&auto=format&fit=crop', 1);
  insertMenuItem.run(startersId, 'Citrus Cured Salmon', 'Thinly sliced salmon, yuzu dressing, pickled radish, and micro herbs.', 18.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop', 0);
  insertMenuItem.run(mainsId, 'Pan-Seared Scallops', 'Diver scallops, cauliflower purée, crispy pancetta, and brown butter caper sauce.', 34.00, 'https://images.unsplash.com/photo-1626804475297-41609ea084eb?q=80&w=1000&auto=format&fit=crop', 1);
  insertMenuItem.run(mainsId, 'Wagyu Ribeye', '8oz Wagyu beef, roasted garlic mash, grilled asparagus, and red wine jus.', 65.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop', 1);
  insertMenuItem.run(dessertsId, 'Dark Chocolate Delice', 'Valrhona chocolate mousse, hazelnut praline, and gold leaf.', 14.00, 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=1000&auto=format&fit=crop', 1);
}

export default db;

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const JWT_SECRET = 'mercury-monitoring-secret-key'; // Gerçek projede env kullanın

app.use((req, res, next) => {
  console.log('GELEN İSTEK:', req.method, req.url);
  next();
});

app.use(cors());
app.use(bodyParser.json());

// SQLite DB bağlantısı
const db = new sqlite3.Database('./mercury.db', (err) => {
  if (err) {
    console.error('DB bağlantı hatası:', err.message);
  } else {
    console.log('SQLite veritabanına bağlanıldı.');
  }
});

// Monitörler tablosu oluştur
const createMonitorsTable = `
CREATE TABLE IF NOT EXISTS monitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT,
  interval INTEGER DEFAULT 60,
  isActive INTEGER DEFAULT 1,
  lastStatus TEXT,
  lastChecked DATETIME,
  responseTime INTEGER,
  acceptedStatusCodes TEXT
);
`;
db.run(createMonitorsTable);

// Monitörleri periyodik olarak kontrol et
setInterval(() => {
  db.all('SELECT * FROM monitors WHERE isActive=1', [], async (err, monitors) => {
    if (err) return console.error('Monitor fetch error:', err);
    for (const monitor of monitors) {
      // Eğer monitör status'ü 'paused' ise atla
      if (monitor.status === 'paused') continue;
      const start = Date.now();
      let status = 'down';
      let responseTime = null;
      try {
        const res = await fetch(monitor.url, { method: 'GET', timeout: 10000 });
        responseTime = Date.now() - start;
        let codes = [200];
        if (monitor.acceptedStatusCodes) {
          try { codes = JSON.parse(monitor.acceptedStatusCodes); } catch {}
        }
        status = codes.includes(res.status) ? 'up' : 'down';
      } catch (e) {
        status = 'down';
      }
      // INCIDENT EKLEME: Down'a yeni geçtiyse incident oluştur
      if (status === 'down' && monitor.lastStatus !== 'down') {
        db.run(
          'INSERT INTO incidents (monitorId, title, description, status, startedAt) VALUES (?, ?, ?, ?, ?)',
          [
            monitor.id,
            `Monitor Down: ${monitor.name}`,
            `Monitor ${monitor.name} is down.`,
            'investigating',
            new Date().toISOString()
          ]
        );
      }
      db.run(
        'UPDATE monitors SET lastStatus=?, status=?, lastChecked=?, responseTime=? WHERE id=?',
        [status, status, new Date().toISOString(), responseTime, monitor.id]
      );
      db.run(
        'INSERT INTO status_history (monitorId, timestamp, status, responseTime) VALUES (?, ?, ?, ?)',
        [monitor.id, new Date().toISOString(), status, responseTime]
      );
    }
  });
}, 60000); // Her 60 saniyede bir

// Monitörleri listele
app.get('/api/monitors', (req, res) => {
  db.all('SELECT * FROM monitors', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Monitör ekle
app.post('/api/monitors', (req, res) => {
  const { name, type, url, interval, acceptedStatusCodes } = req.body;
  const createdAt = new Date().toISOString();
  db.run(
    'INSERT INTO monitors (name, type, url, interval, createdAt, acceptedStatusCodes) VALUES (?, ?, ?, ?, ?, ?)',
    [name, type, url, interval, createdAt, JSON.stringify(acceptedStatusCodes || [200])],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const monitorId = this.lastID;
      // Hemen sağlık kontrolü yap
      (async () => {
        const start = Date.now();
        let status = 'down';
        let responseTime = null;
        try {
          const res = await fetch(url, { method: 'GET', timeout: 10000 });
          responseTime = Date.now() - start;
          let codes = acceptedStatusCodes || [200];
          if (typeof codes === 'string') codes = JSON.parse(codes);
          status = codes.includes(res.status) ? 'up' : 'down';
        } catch (e) {
          status = 'down';
        }
        db.run(
          'UPDATE monitors SET lastStatus=?, status=?, lastChecked=?, responseTime=? WHERE id=?',
          [status, status, new Date().toISOString(), responseTime, monitorId]
        );
        db.run(
          'INSERT INTO status_history (monitorId, timestamp, status, responseTime) VALUES (?, ?, ?, ?)',
          [monitorId, new Date().toISOString(), status, responseTime]
        );
      })();
      res.json({ id: monitorId });
    }
  );
});

// Monitör sil
app.delete('/api/monitors/:id', (req, res) => {
  db.run('DELETE FROM monitors WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Monitör güncelle
app.put('/api/monitors/:id', (req, res) => {
  console.log('==== MONITOR UPDATE ====', req.body); // Daha belirgin log
  const { name, type, url, interval, isActive, acceptedStatusCodes, status } = req.body;
  db.run(
    'UPDATE monitors SET name=?, type=?, url=?, interval=?, isActive=?, acceptedStatusCodes=?, status=? WHERE id=?',
    [name, type, url, interval, isActive, JSON.stringify(acceptedStatusCodes || [200]), status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Incident tablosu oluştur
const createIncidentsTable = `
CREATE TABLE IF NOT EXISTS incidents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitorId INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT,
  startedAt DATETIME,
  resolvedAt DATETIME
);
`;
db.run(createIncidentsTable);

// Incident'ları listele
app.get('/api/incidents', (req, res) => {
  db.all('SELECT * FROM incidents', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Incident ekle
app.post('/api/incidents', (req, res) => {
  const { monitorId, title, description, status, startedAt, resolvedAt } = req.body;
  db.run(
    'INSERT INTO incidents (monitorId, title, description, status, startedAt, resolvedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [monitorId, title, description, status, startedAt, resolvedAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Incident sil
app.delete('/api/incidents/:id', (req, res) => {
  db.run('DELETE FROM incidents WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Incident güncelle
app.put('/api/incidents/:id', (req, res) => {
  const { monitorId, title, description, status, startedAt, resolvedAt } = req.body;
  db.run(
    'UPDATE incidents SET monitorId=?, title=?, description=?, status=?, startedAt=?, resolvedAt=? WHERE id=?',
    [monitorId, title, description, status, startedAt, resolvedAt, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Status Page tablosu oluştur
const createStatusPagesTable = `
CREATE TABLE IF NOT EXISTS status_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  isPublic INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.run(createStatusPagesTable);

// Status Page'leri listele
app.get('/api/status-pages', (req, res) => {
  db.all('SELECT * FROM status_pages', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Status Page ekle
app.post('/api/status-pages', (req, res) => {
  const { name, slug, description, isPublic } = req.body;
  db.run(
    'INSERT INTO status_pages (name, slug, description, isPublic) VALUES (?, ?, ?, ?)',
    [name, slug, description, isPublic],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Status Page sil
app.delete('/api/status-pages/:id', (req, res) => {
  db.run('DELETE FROM status_pages WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Status Page güncelle
app.put('/api/status-pages/:id', (req, res) => {
  const { name, slug, description, isPublic } = req.body;
  db.run(
    'UPDATE status_pages SET name=?, slug=?, description=?, isPublic=? WHERE id=?',
    [name, slug, description, isPublic, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Notification Channels tablosu oluştur
const createNotificationChannelsTable = `
CREATE TABLE IF NOT EXISTS notification_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  config TEXT,
  isActive INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.run(createNotificationChannelsTable);

// Notification Channels'ı listele
app.get('/api/notification-channels', (req, res) => {
  db.all('SELECT * FROM notification_channels', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // config'i JSON olarak parse et
    rows.forEach(row => { if (row.config) row.config = JSON.parse(row.config); });
    res.json(rows);
  });
});

// Notification Channel ekle
app.post('/api/notification-channels', (req, res) => {
  const { type, name, config, isActive } = req.body;
  db.run(
    'INSERT INTO notification_channels (type, name, config, isActive) VALUES (?, ?, ?, ?)',
    [type, name, JSON.stringify(config), isActive],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Notification Channel sil
app.delete('/api/notification-channels/:id', (req, res) => {
  db.run('DELETE FROM notification_channels WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Notification Channel güncelle
app.put('/api/notification-channels/:id', (req, res) => {
  const { type, name, config, isActive } = req.body;
  db.run(
    'UPDATE notification_channels SET type=?, name=?, config=?, isActive=? WHERE id=?',
    [type, name, JSON.stringify(config), isActive, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Maintenance Windows tablosu oluştur
const createMaintenanceWindowsTable = `
CREATE TABLE IF NOT EXISTS maintenance_windows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitorId INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  startTime DATETIME,
  endTime DATETIME,
  isActive INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.run(createMaintenanceWindowsTable);

// Maintenance Windows'ı listele
app.get('/api/maintenance-windows', (req, res) => {
  db.all('SELECT * FROM maintenance_windows', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Maintenance Window ekle
app.post('/api/maintenance-windows', (req, res) => {
  const { monitorId, title, description, startTime, endTime, isActive } = req.body;
  db.run(
    'INSERT INTO maintenance_windows (monitorId, title, description, startTime, endTime, isActive) VALUES (?, ?, ?, ?, ?, ?)',
    [monitorId, title, description, startTime, endTime, isActive],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Maintenance Window sil
app.delete('/api/maintenance-windows/:id', (req, res) => {
  db.run('DELETE FROM maintenance_windows WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Maintenance Window güncelle
app.put('/api/maintenance-windows/:id', (req, res) => {
  const { monitorId, title, description, startTime, endTime, isActive } = req.body;
  db.run(
    'UPDATE maintenance_windows SET monitorId=?, title=?, description=?, startTime=?, endTime=?, isActive=? WHERE id=?',
    [monitorId, title, description, startTime, endTime, isActive, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Certificates tablosu oluştur
const createCertificatesTable = `
CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitorId INTEGER,
  domain TEXT NOT NULL,
  validFrom DATETIME,
  validTo DATETIME,
  issuer TEXT,
  status TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.run(createCertificatesTable);

// Certificates'ı listele
app.get('/api/certificates', (req, res) => {
  db.all('SELECT * FROM certificates', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Certificate ekle
app.post('/api/certificates', (req, res) => {
  const { monitorId, domain, validFrom, validTo, issuer, status } = req.body;
  db.run(
    'INSERT INTO certificates (monitorId, domain, validFrom, validTo, issuer, status) VALUES (?, ?, ?, ?, ?, ?)',
    [monitorId, domain, validFrom, validTo, issuer, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Certificate sil
app.delete('/api/certificates/:id', (req, res) => {
  db.run('DELETE FROM certificates WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Certificate güncelle
app.put('/api/certificates/:id', (req, res) => {
  const { monitorId, domain, validFrom, validTo, issuer, status } = req.body;
  db.run(
    'UPDATE certificates SET monitorId=?, domain=?, validFrom=?, validTo=?, issuer=?, status=? WHERE id=?',
    [monitorId, domain, validFrom, validTo, issuer, status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Status History tablosu oluştur
const createStatusHistoryTable = `
CREATE TABLE IF NOT EXISTS status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitorId INTEGER,
  timestamp DATETIME,
  status TEXT,
  responseTime INTEGER
);
`;
db.run(createStatusHistoryTable);

// Status History'yi listele
app.get('/api/status-history', (req, res) => {
  db.all('SELECT * FROM status_history', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Status History ekle
app.post('/api/status-history', (req, res) => {
  const { monitorId, timestamp, status, responseTime } = req.body;
  db.run(
    'INSERT INTO status_history (monitorId, timestamp, status, responseTime) VALUES (?, ?, ?, ?)',
    [monitorId, timestamp, status, responseTime],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Status History sil
app.delete('/api/status-history/:id', (req, res) => {
  db.run('DELETE FROM status_history WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Status History güncelle
app.put('/api/status-history/:id', (req, res) => {
  const { monitorId, timestamp, status, responseTime } = req.body;
  db.run(
    'UPDATE status_history SET monitorId=?, timestamp=?, status=?, responseTime=? WHERE id=?',
    [monitorId, timestamp, status, responseTime, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Users tablosu oluştur
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  email TEXT UNIQUE,
  isAdmin INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.run(createUsersTable);

// Kullanıcı kaydı
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const passwordHash = await bcrypt.hash(password, 10);
  db.run(
    'INSERT INTO users (username, passwordHash, email) VALUES (?, ?, ?)',
    [username, passwordHash, email],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Kullanıcı girişi
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  });
});

// JWT doğrulama middleware'i
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Kullanıcı bilgisi (me)
app.get('/api/auth/me', authMiddleware, (req, res) => {
  db.get('SELECT id, username, email, isAdmin, createdAt FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

// Kullanıcı bilgisi (profile alias)
app.get('/api/auth/profile', authMiddleware, (req, res) => {
  db.get('SELECT id, username, email, isAdmin, createdAt FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.listen(port, () => {
  console.log(`Mercury Monitoring API listening at http://localhost:${port}`);
}); 
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json());

const angularApp = new AngularNodeAppEngine();

// In-memory data store with seed data
let userProfile = {
  id: 'user-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  timezone: 'UTC',
  defaultReminderTime: '09:00',
  defaultOffsets: [0, 1, 7],
  leapYearRule: 'FEB_28',
  notificationsEnabled: true,
  channels: { push: true, email: true, sms: false },
};

const getTodayMonthDay = () => {
  const d = new Date();
  return { month: d.getMonth() + 1, day: d.getDate(), year: d.getFullYear() };
};

const today = getTodayMonthDay();

let birthdays = [
  {
    id: 'b-1',
    userId: 'user-1',
    name: 'Maya Lin',
    birthMonth: today.month,
    birthDay: today.day,
    birthYear: 1997,
    category: 'FAMILY',
    notes: 'Loves matcha green tea, ceramic handmade mugs, and indie bookstore gift cards.',
    reminderOffsets: [0, 1, 7],
    isMuted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-2',
    userId: 'user-1',
    name: 'Julian Vance',
    birthMonth: today.month,
    birthDay: (today.day + 3) > 28 ? 28 : (today.day + 3),
    birthYear: 1990,
    category: 'FRIENDS',
    notes: 'Aviation enthusiast. Prefers sci-fi novels and artisan roasted coffee beans.',
    reminderOffsets: [0, 1, 3],
    isMuted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-3',
    userId: 'user-1',
    name: 'Elena Rostova',
    birthMonth: 2,
    birthDay: 29,
    birthYear: 1988,
    category: 'COLLEAGUES',
    notes: 'Leap year baby! Executive design lead. Fond of rare botanical succulents.',
    reminderOffsets: [0, 1, 7, 14],
    isMuted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-4',
    userId: 'user-1',
    name: 'Samir Patel',
    birthMonth: (today.month % 12) + 1,
    birthDay: 15,
    birthYear: null,
    category: 'FRIENDS',
    notes: 'Enjoys acoustic vinyl records and hiking gear.',
    reminderOffsets: [0, 1],
    isMuted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-5',
    userId: 'user-1',
    name: 'Clara Oswald',
    birthMonth: ((today.month + 2) % 12) || 12,
    birthDay: 22,
    birthYear: 1995,
    category: 'FAMILY',
    notes: 'Baking masterclass enthusiast and fountain pen collector.',
    reminderOffsets: [0, 3, 7],
    isMuted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-6',
    userId: 'user-1',
    name: 'Marcus Brody',
    birthMonth: ((today.month + 5) % 12) || 12,
    birthDay: 10,
    birthYear: 1982,
    category: 'OTHER',
    notes: 'Antique map collector and vintage leather goods.',
    reminderOffsets: [0, 7],
    isMuted: false,
    createdAt: new Date().toISOString(),
  }
];

const notificationLogs = [
  {
    id: 'log-1',
    birthdayName: 'Maya Lin',
    channel: 'PUSH',
    scheduledTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'SENT',
    message: 'Birthday today! Maya Lin is turning ' + (today.year - 1997) + '.',
  },
  {
    id: 'log-2',
    birthdayName: 'Julian Vance',
    channel: 'EMAIL',
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'PENDING',
    message: 'Reminder: Julian Vance birthday in 3 days.',
  },
  {
    id: 'log-3',
    birthdayName: 'Elena Rostova',
    channel: 'PUSH',
    scheduledTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'FAILED',
    message: 'Failed to deliver push notification (network timeout). Retrying...',
  }
];

// API Routes
app.get('/api/user', (req, res) => {
  return res.json(userProfile);
});

app.put('/api/user', (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  return res.json(userProfile);
});

app.get('/api/birthdays', (req, res) => {
  return res.json(birthdays);
});

app.post('/api/birthdays', (req, res) => {
  const { name, birthMonth, birthDay, birthYear, category, notes, reminderOffsets, isMuted } = req.body;
  if (!name || !birthMonth || !birthDay) {
    return res.status(400).json({ error: 'Name, birthMonth, and birthDay are required.' });
  }

  const exactMatch = birthdays.find(
    b => b.name.toLowerCase() === name.trim().toLowerCase() && b.birthMonth === Number(birthMonth) && b.birthDay === Number(birthDay)
  );
  if (exactMatch) {
    return res.status(409).json({ error: `A birthday for ${name} on ${birthMonth}/${birthDay} already exists.` });
  }

  const newBirthday = {
    id: 'b-' + Date.now(),
    userId: 'user-1',
    name: name.trim(),
    birthMonth: Number(birthMonth),
    birthDay: Number(birthDay),
    birthYear: birthYear ? Number(birthYear) : null,
    category: category || 'FRIENDS',
    notes: notes || '',
    reminderOffsets: reminderOffsets || userProfile.defaultOffsets,
    isMuted: isMuted || false,
    createdAt: new Date().toISOString(),
  };

  birthdays.push(newBirthday);

  notificationLogs.unshift({
    id: 'log-' + Date.now(),
    birthdayName: newBirthday.name,
    channel: 'PUSH',
    scheduledTime: new Date().toISOString(),
    status: 'SENT',
    message: `Reminder scheduled for ${newBirthday.name} (${newBirthday.birthMonth}/${newBirthday.birthDay}).`,
  });

  return res.status(201).json(newBirthday);
});

app.put('/api/birthdays/:id', (req, res) => {
  const { id } = req.params;
  const index = birthdays.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Birthday not found.' });
  }

  const updated = {
    ...birthdays[index],
    ...req.body,
    id,
    userId: 'user-1',
    birthMonth: req.body.birthMonth !== undefined ? Number(req.body.birthMonth) : birthdays[index].birthMonth,
    birthDay: req.body.birthDay !== undefined ? Number(req.body.birthDay) : birthdays[index].birthDay,
    birthYear: req.body.birthYear !== undefined ? (req.body.birthYear ? Number(req.body.birthYear) : null) : birthdays[index].birthYear,
  };

  birthdays[index] = updated;
  return res.json(updated);
});

app.delete('/api/birthdays/:id', (req, res) => {
  const { id } = req.params;
  const index = birthdays.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Birthday not found.' });
  }
  const removed = birthdays.splice(index, 1)[0];
  
  notificationLogs.unshift({
    id: 'log-' + Date.now(),
    birthdayName: removed.name,
    channel: 'SYSTEM',
    scheduledTime: new Date().toISOString(),
    status: 'CANCELED',
    message: `Birthday and associated reminders for ${removed.name} were deleted and canceled.`,
  });

  return res.json({ success: true, removed });
});

app.get('/api/logs', (req, res) => {
  return res.json(notificationLogs);
});

app.post('/api/logs/simulate', (req, res) => {
  const newLog = {
    id: 'log-' + Date.now(),
    birthdayName: birthdays.length > 0 ? birthdays[Math.floor(Math.random() * birthdays.length)].name : 'General',
    channel: Math.random() > 0.5 ? 'PUSH' : 'EMAIL',
    scheduledTime: new Date().toISOString(),
    status: Math.random() > 0.15 ? 'SENT' : 'FAILED',
    message: 'Scheduler tick: Verified upcoming birthday alerts for configured channels.',
  };
  notificationLogs.unshift(newLog);
  if (notificationLogs.length > 50) notificationLogs.pop();
  return res.json(newLog);
});

app.get('/api/export', (req, res) => {
  return res.json({
    user: userProfile,
    birthdays,
    exportDate: new Date().toISOString(),
    version: '1.0'
  });
});

app.post('/api/import', (req, res) => {
  const data = req.body;
  if (data && Array.isArray(data.birthdays)) {
    birthdays = data.birthdays;
    if (data.user) {
      userProfile = { ...userProfile, ...data.user };
    }
    return res.json({ success: true, count: birthdays.length });
  }
  return res.status(400).json({ error: 'Invalid backup format.' });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

type Reminder = {
  id: string,
  title: string,
  description: string,
  dueDate: string,
  isCompleted: boolean
}

const reminders: Reminder[] = [];

app.post("/reminder", async (c) => {
  const body = await c.req.json();
  const newReminder: Reminder = body.reminder;

  if (newReminder && newReminder.id && newReminder.title && newReminder.description && newReminder.dueDate && typeof newReminder.isCompleted === 'boolean') {
    reminders.push(newReminder);
    return c.json(newReminder, 200); // 200 OK
  } else {
    return c.json({ error: 'Invalid request' }, 400); // 400 Bad Request
  }
})
app.get('/reminder/:id', async (c) => {
  const id = c.req.param('id');
  const reminder = reminders.find(r => r.id === id);

  if (reminder) {
    return c.json(reminder, 200); // 200 OK
  } else {
    return c.json({ error: 'Reminder not found' }, 404); // 404 Not Found
  }
});





serve(app);

console.log(`Server is running on http://localhost:${3000}`)

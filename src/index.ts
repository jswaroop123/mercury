import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

type Reminder = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
};

const reminders: Reminder[] = []; 

// post
app.post("/reminders", async (context) => {
  try {
    const body: Reminder = await context.req.json();

    
    if (
      !body.id ||
      !body.title ||
      !body.description ||
      !body.dueDate ||
      typeof body.isCompleted !== "boolean"
    ) {
      return context.json({ error: "Missing or invalid fields" }, 400);
    }

    reminders.push(body);
    console.log("Reminder added:", body); // Debugging log
    return context.json({ message: "Reminder created successfully", reminder: body }, 201);
  } catch (error) {
    return context.json({ error: "Invalid JSON format" }, 400);
  }
});



//by id
app.get("/reminders/:id", (context) => {
  const id = context.req.param("id");
  console.log("Searching for ID:", id); // Debugging log

  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) {
    console.log("Reminder not found for ID:", id); // Log if not found
    return context.json({ error: "Reminder not found" }, 404);
  }

  console.log("Reminder found:", reminder); // Log found reminder
  return context.json(reminder, 200);
});

app.get("/reminders", (context) => {
  if (reminders.length === 0) {
    return context.json({ error: "No reminders found" }, 404);
  }
  return context.json(reminders, 200);
});


app.patch("/reminders/:id", async (context) => {
  const id = context.req.param("id");
  const body = await context.req.json();

  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) {
    return context.json({ error: "Reminder not found" }, 404);
  }

  if (
    (body.title && typeof body.title !== "string") ||
    (body.description && typeof body.description !== "string") ||
    (body.dueDate && typeof body.dueDate !== "string") ||
    (body.isCompleted !== undefined && typeof body.isCompleted !== "boolean")
  ) {
    return context.json({ error: "Invalid field types" }, 400);
  }

  // Update fields if provided
  if (body.title) reminder.title = body.title;
  if (body.description) reminder.description = body.description;
  if (body.dueDate) reminder.dueDate = body.dueDate;
  if (body.isCompleted !== undefined) reminder.isCompleted = body.isCompleted;

  return context.json({ message: "Reminder updated successfully", reminder }, 200);
});


serve(app);
console.log("Server is running on http://localhost:3000");
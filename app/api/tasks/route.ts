import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Schema, model, models } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/daily-routine-planner';

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI, {
    dbName: 'daily-routine-planner',
  });
}

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: String, required: true },
  time: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
  category: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Task = models.Task || model('Task', taskSchema);

// GET: Fetch all tasks, or filter by userId if provided
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const filter = userId ? { userId } : {};
  const tasks = await Task.find(filter).sort({ date: 1 });
  return NextResponse.json(tasks);
}

// POST: Create a new task
export async function POST(req: NextRequest) {
  const data = await req.json();
  const task = new Task(data);
  await task.save();
  return NextResponse.json(task, { status: 201 });
}

// DELETE: Remove a task by ID (expects ?id=...)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

// PATCH: Update a task by ID (expects ?id=...)
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const data = await req.json();
  const updated = await Task.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
} 
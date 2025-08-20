import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Schema, model, models } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/daily-routine-planner';

// Connect to MongoDB
if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI, {
    dbName: 'daily-routine-planner',
  });
}

// Routine Schema
const routineSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

const Routine = models.Routine || model('Routine', routineSchema);

// GET: Fetch all routines
export async function GET() {
  const routines = await Routine.find().sort({ date: 1 });
  return NextResponse.json(routines);
}

// POST: Create a new routine
export async function POST(req: NextRequest) {
  const data = await req.json();
  const routine = new Routine(data);
  await routine.save();
  return NextResponse.json(routine, { status: 201 });
}

// DELETE: Remove a routine by ID (expects ?id=...)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await Routine.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

// PATCH: Update a routine by ID (expects ?id=...)
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const data = await req.json();
  const updated = await Routine.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
} 
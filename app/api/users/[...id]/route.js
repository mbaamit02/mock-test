import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import connectMongo from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  await connectMongo();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;
  if (id) {
    const user = await User.findById(id);
    return NextResponse.json(user || { error: 'User not found' }, { status: user ? 200 : 404 });
  }
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(request) {
  await connectMongo();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name, email, password, role } = await request.json();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }
  const user = new User({ name, email, password, role });
  await user.save();
  return NextResponse.json(user, { status: 201 });
}

export async function PUT(request, { params }) {
  await connectMongo();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;
  const { name, email, password, role } = await request.json();
  const user = await User.findByIdAndUpdate(id, { name, email, password, role }, { new: true, runValidators: true });
  return NextResponse.json(user || { error: 'User not found' }, { status: user ? 200 : 404 });
}

export async function DELETE(request, { params }) {
  await connectMongo();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;
  const user = await User.findByIdAndDelete(id);
  return NextResponse.json({ message: 'User deleted' }, { status: user ? 200 : 404 });
}
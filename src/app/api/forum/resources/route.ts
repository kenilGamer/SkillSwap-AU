import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth/[...nextauth]/options';
import { Resource } from '@/models/Post.model';
import dbConnect from '@/helpers/dbconnect';
import mongoose from 'mongoose';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await dbConnect();
  const resources = await Resource.find().populate('owner', 'name image');
  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const { title, description, link, tags } = await req.json();
  if (!title || !description || !link) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }
  const owner = (session.user as any)._id;
  try {
    const resource = await Resource.create({ title, description, link, tags, owner });
    const populatedResource = await Resource.findById(resource._id).populate('owner', 'name image');
    return NextResponse.json(populatedResource, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const { id, title, description, link, tags } = await req.json();
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid resource id' }, { status: 400 });
  }
  const resource = await Resource.findById(id);
  if (!resource) return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
  if (resource.owner.toString() !== (session.user as any)._id) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
  }
  if (title) resource.title = title;
  if (description) resource.description = description;
  if (link) resource.link = link;
  if (tags) resource.tags = tags;
  try {
    await resource.save();
    const populatedResource = await Resource.findById(resource._id).populate('owner', 'name image');
    return NextResponse.json(populatedResource);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const { id } = await req.json();
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid resource id' }, { status: 400 });
  }
  const resource = await Resource.findById(id);
  if (!resource) return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
  if (resource.owner.toString() !== (session.user as any)._id) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
  }
  try {
    await resource.deleteOne();
    return NextResponse.json({ message: 'Resource deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
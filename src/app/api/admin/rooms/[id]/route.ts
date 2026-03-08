import { NextResponse } from 'next/server';
import {
  getRoomById,
  updateRoom,
  deleteRoom,
} from '@/server/services/room.service';
import { roomSchema } from '@/server/validators/room.schema';
import { uploadImage } from '@/server/lib/cloudinary';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const room = await getRoomById(id);
    return NextResponse.json(room);
  } catch (error: any) {
    console.error('[API_ADMIN_ROOM_ID_GET]', error);
    if (error.message === 'Room not found') {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const rawData: Record<string, unknown> = {};
    if (formData.get('number')) rawData.number = formData.get('number');
    if (formData.get('category')) rawData.category = formData.get('category');
    if (formData.get('priceMonthly'))
      rawData.priceMonthly = formData.get('priceMonthly');
    if (formData.has('facilities'))
      rawData.facilities = formData.get('facilities') || undefined;
    if (formData.get('status')) rawData.status = formData.get('status');

    const imageFile = formData.get('image');
    if (imageFile instanceof File && imageFile.size > 0) {
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          imageFile.type,
        )
      ) {
        return NextResponse.json(
          {
            message: 'Format gambar tidak valid. Gunakan JPEG, PNG, atau WebP.',
          },
          { status: 400 },
        );
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: 'Ukuran gambar maksimal 5MB.' },
          { status: 400 },
        );
      }
      rawData.imageUrl = await uploadImage(imageFile, 'rooms');
    }

    const result = roomSchema.partial().safeParse(rawData);

    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Validation Error',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const room = await updateRoom(id, result.data);
    return NextResponse.json(room);
  } catch (error: any) {
    console.error('[API_ADMIN_ROOM_ID_PUT]', error);
    if (error.message === 'Room not found') {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Room number already exists' },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteRoom(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('[API_ADMIN_ROOM_ID_DELETE]', error);
    if (error.message === 'Room not found') {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

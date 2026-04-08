import { NextResponse } from 'next/server';
import { getRooms, createRoom } from '@/server/services/room.service';

export const dynamic = 'force-dynamic';
import { roomSchema } from '@/server/validators/room.schema';
import { uploadImage } from '@/server/lib/cloudinary';

export async function GET() {
  try {
    const rooms = await getRooms();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('[API_ADMIN_ROOMS_GET]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const rawData: Record<string, unknown> = {
      number: formData.get('number'),
      category: formData.get('category'),
      priceMonthly: formData.get('priceMonthly'),
      facilities: formData.get('facilities') || undefined,
      status: formData.get('status') || undefined,
    };

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

    const result = roomSchema.safeParse(rawData);

    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Validation Error',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const room = await createRoom(result.data);
    return NextResponse.json(room, { status: 201 });
  } catch (error: unknown) {
    console.error('[API_ADMIN_ROOMS_POST]', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
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

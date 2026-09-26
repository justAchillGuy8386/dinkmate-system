import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Công thức Haversine tính khoảng cách giữa 2 tọa độ (kinh độ, vĩ độ) theo kilomet
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 1. GET /api/courts: Lấy danh sách sân (hỗ trợ lọc/sắp xếp theo khoảng cách nếu có lat/lng)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius'); // Bán kính tối đa (km)

    const courts = await prisma.court.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        qr_code_value: true,
      },
    });

    // Nếu client truyền vị trí GPS của họ
    if (latParam && lngParam) {
      const userLat = parseFloat(latParam);
      const userLng = parseFloat(lngParam);
      const maxRadius = radiusParam ? parseFloat(radiusParam) : null;

      let enrichedCourts = courts.map((court) => {
        const distance = calculateHaversineDistance(
          userLat,
          userLng,
          court.latitude,
          court.longitude
        );
        return {
          ...court,
          distance_km: Math.round(distance * 10) / 10, // làm tròn 1 chữ số thập phân
        };
      });

      if (maxRadius && !isNaN(maxRadius)) {
        enrichedCourts = enrichedCourts.filter(
          (c) => c.distance_km <= maxRadius
        );
      }

      enrichedCourts.sort((a, b) => a.distance_km - b.distance_km);

      return NextResponse.json(
        {
          message: 'Lấy danh sách sân theo khoảng cách thành công!',
          data: enrichedCourts,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: 'Lấy danh sách sân thành công!',
        data: courts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi lấy danh sách sân:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

// 2. POST /api/courts: Tạo sân mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, latitude, longitude, qr_code_value } = body;

    if (!name || !address || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ tên, địa chỉ, vĩ độ và kinh độ!' },
        { status: 400 }
      );
    }

    // Nếu không truyền mã QR, tự sinh mã định danh duy nhất
    const uniqueQr =
      qr_code_value ||
      `QR-${name.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const newCourt = await prisma.court.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        qr_code_value: uniqueQr,
      },
    });

    return NextResponse.json(
      { message: 'Tạo sân đấu thành công!', data: newCourt },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Lỗi tạo sân đấu:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã QR này đã tồn tại trên một sân khác!' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}

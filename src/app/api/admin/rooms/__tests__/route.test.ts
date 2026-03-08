import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import * as roomService from '@/server/services/room.service';
import { RoomStatus } from '@prisma/client';

vi.mock('@/server/services/room.service', () => ({
  getRooms: vi.fn(),
  createRoom: vi.fn(),
}));

describe('Rooms API Root', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of rooms', async () => {
      const mockRooms = [{ id: '1', number: '101' }];
      vi.mocked(roomService.getRooms).mockResolvedValue(mockRooms as any);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockRooms);
    });

    it('should return 500 if service fails', async () => {
      vi.mocked(roomService.getRooms).mockRejectedValue(new Error('DB Error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal Server Error');
    });
  });

  describe('POST', () => {
    it('should create a room with valid data', async () => {
      const input = {
        number: '105',
        category: 'Suite',
        priceMonthly: 5000000,
        facilities: 'All',
      };
      vi.mocked(roomService.createRoom).mockResolvedValue({
        id: '5',
        ...input,
        status: RoomStatus.AVAILABLE,
      } as any);

      const fd = new FormData();
      fd.append('number', input.number);
      fd.append('category', input.category);
      fd.append('priceMonthly', String(input.priceMonthly));
      fd.append('facilities', input.facilities);

      const req = new Request('http://localhost/api/admin/rooms', {
        method: 'POST',
        body: fd,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.number).toBe('105');
    });

    it('should return 400 for invalid data', async () => {
      const fd = new FormData();
      fd.append('number', ''); // empty number fails validation

      const req = new Request('http://localhost/api/admin/rooms', {
        method: 'POST',
        body: fd,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Validation Error');
    });
  });
});

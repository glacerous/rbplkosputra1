import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PUT, DELETE } from '../route';
import * as roomService from '@/server/services/room.service';

vi.mock('@/server/services/room.service', () => ({
  getRoomById: vi.fn(),
  updateRoom: vi.fn(),
  deleteRoom: vi.fn(),
}));

describe('Room ID API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const params = Promise.resolve({ id: 'room-1' });

  describe('GET', () => {
    it('should return room if found', async () => {
      const mockRoom = { id: 'room-1', number: '101' };
      // @ts-expect-error - mocked member
      vi.mocked(roomService.getRoomById).mockResolvedValue(mockRoom);

      const response = await GET(new Request('http://localhost'), { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('room-1');
    });

    it('should return 404 if room not found', async () => {
      vi.mocked(roomService.getRoomById).mockRejectedValue(
        new Error('Room not found'),
      );

      const response = await GET(new Request('http://localhost'), { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('Room not found');
    });
  });

  describe('PUT', () => {
    it('should update room with valid data', async () => {
      const input = { category: 'Updated' };
      // @ts-expect-error - mocked member
      vi.mocked(roomService.updateRoom).mockResolvedValue({
        id: 'room-1',
        ...input,
      });

      const fd = new FormData();
      fd.append('category', input.category);

      const req = new Request('http://localhost', {
        method: 'PUT',
        body: fd,
      });

      const response = await PUT(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.category).toBe('Updated');
    });
  });

  describe('DELETE', () => {
    it('should delete room and return 204', async () => {
      // @ts-expect-error - mocked member
      vi.mocked(roomService.deleteRoom).mockResolvedValue({
        id: 'room-1',
      });

      const response = await DELETE(new Request('http://localhost'), {
        params,
      });

      expect(response.status).toBe(204);
      expect(roomService.deleteRoom).toHaveBeenCalledWith('room-1');
    });
  });
});

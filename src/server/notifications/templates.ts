/**
 * Centralized notification templates to replace hardcoded strings in services.
 */

export const NOTIFICATION_TEMPLATES = {
    PAYMENT_CONFIRMED: (roomNumber: string) => ({
        title: 'Pembayaran Dikonfirmasi',
        message: `Pembayaran Anda untuk Kamar ${roomNumber} telah dikonfirmasi.`,
    }),
    PAYMENT_REJECTED: () => ({
        title: 'Pembayaran Ditolak',
        message: 'Pembayaran Anda telah ditolak. Silakan unggah ulang bukti pembayaran.',
    }),
    NEW_PAYMENT_PROOF: () => ({
        title: 'Bukti Pembayaran Baru',
        message: 'User mengunggah bukti pembayaran baru yang perlu dikonfirmasi.',
    }),
    RESERVATION_CREATED: (roomNumber: string) => ({
        title: 'Reservasi Berhasil',
        message: `Reservasi Anda untuk Kamar ${roomNumber} berhasil dibuat. Silakan lakukan pembayaran.`,
    }),
    NEW_RESERVATION_ADMIN: (roomNumber: string) => ({
        title: 'Reservasi Baru',
        message: `Ada reservasi baru untuk Kamar ${roomNumber}.`,
    }),
    RESERVATION_CANCELLED: (roomNumber: string) => ({
        title: 'Reservasi Dibatalkan',
        message: `Reservasi Anda untuk Kamar ${roomNumber} telah dibatalkan karena melebihi batas waktu pembayaran.`,
    })
};

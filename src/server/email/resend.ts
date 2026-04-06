import { Resend } from 'resend';

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Email] RESEND_API_KEY is missing in process.env');
    return null;
  }
  return new Resend(apiKey);
}

export async function sendReservationEmail({
  to,
  customerName,
}: {
  to: string;
  customerName: string;
}) {
  const resend = getResend();
  if (!resend) return;

  try {
    console.log(`[Email] Target: ${to}`);
    const result = await resend.emails.send({
      from: 'Kos App <onboarding@resend.dev>',
      to,
      subject: 'Reservasi Berhasil',
      html: `<p>Halo ${customerName},</p><p>Reservasi Anda berhasil dibuat. Silakan segera unggah bukti pembayaran untuk konfirmasi.</p>`,
    });
    console.log('[Email] Success Result:', result);
  } catch (err) {
    console.error('[Email] Failed:', err);
  }
}

export async function sendPaymentConfirmedEmail({
  to,
  customerName,
  roomNumber,
}: {
  to: string;
  customerName: string;
  roomNumber: string;
}) {
  const resend = getResend();
  if (!resend) return;

  try {
    console.log(`[Email] Target: ${to}`);
    const result = await resend.emails.send({
      from: 'Kos App <onboarding@resend.dev>',
      to,
      subject: 'Pembayaran Dikonfirmasi',
      html: `<p>Halo ${customerName},</p><p>Pembayaran Anda untuk Kamar ${roomNumber} telah dikonfirmasi. Selamat datang!</p>`,
    });
    console.log('[Email] Success Result:', result);
  } catch (err) {
    console.error('[Email] Failed:', err);
  }
}

export async function sendPaymentRejectedEmail({
  to,
  customerName,
}: {
  to: string;
  customerName: string;
}) {
  const resend = getResend();
  if (!resend) return;

  try {
    console.log(`[Email] Target: ${to}`);
    const result = await resend.emails.send({
      from: 'Kos App <onboarding@resend.dev>',
      to,
      subject: 'Pembayaran Ditolak',
      html: `<p>Halo ${customerName},</p><p>Pembayaran Anda telah ditolak. Silakan unggah ulang bukti pembayaran yang valid.</p>`,
    });
    console.log('[Email] Success Result:', result);
  } catch (err) {
    console.error('[Email] Failed:', err);
  }
}

export async function sendComplaintStatusEmail({
  to,
  customerName,
  complaintTitle,
  newStatus,
}: {
  to: string;
  customerName: string;
  complaintTitle: string;
  newStatus: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const statusLabel =
    newStatus === 'IN_PROGRESS' ? 'sedang diproses' : 'telah diselesaikan';
  try {
    console.log(`[Email] Target: ${to}`);
    const result = await resend.emails.send({
      from: 'Kos App <onboarding@resend.dev>',
      to,
      subject: `Update Komplain: ${complaintTitle}`,
      html: `<p>Halo ${customerName},</p><p>Komplain Anda "<strong>${complaintTitle}</strong>" ${statusLabel}.</p>`,
    });
    console.log('[Email] Success Result:', result);
  } catch (err) {
    console.error('[Email] Failed:', err);
  }
}

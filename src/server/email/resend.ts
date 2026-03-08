import { Resend } from 'resend';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
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
  if (!resend) {
    console.warn(
      '[Email] RESEND_API_KEY not set, skipping sendPaymentConfirmedEmail',
    );
    return;
  }
  try {
    await resend.emails.send({
      from: 'Kos Putra <noreply@kosputra.id>',
      to,
      subject: 'Pembayaran Dikonfirmasi',
      html: `<p>Halo ${customerName},</p><p>Pembayaran Anda untuk Kamar ${roomNumber} telah dikonfirmasi. Selamat datang!</p>`,
    });
  } catch (err) {
    console.error('[Email] sendPaymentConfirmedEmail failed:', err);
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
  if (!resend) {
    console.warn(
      '[Email] RESEND_API_KEY not set, skipping sendPaymentRejectedEmail',
    );
    return;
  }
  try {
    await resend.emails.send({
      from: 'Kos Putra <noreply@kosputra.id>',
      to,
      subject: 'Pembayaran Ditolak',
      html: `<p>Halo ${customerName},</p><p>Pembayaran Anda telah ditolak. Silakan unggah ulang bukti pembayaran yang valid.</p>`,
    });
  } catch (err) {
    console.error('[Email] sendPaymentRejectedEmail failed:', err);
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
  if (!resend) {
    console.warn(
      '[Email] RESEND_API_KEY not set, skipping sendComplaintStatusEmail',
    );
    return;
  }
  const statusLabel =
    newStatus === 'IN_PROGRESS' ? 'sedang diproses' : 'telah diselesaikan';
  try {
    await resend.emails.send({
      from: 'Kos Putra <noreply@kosputra.id>',
      to,
      subject: `Update Komplain: ${complaintTitle}`,
      html: `<p>Halo ${customerName},</p><p>Komplain Anda "<strong>${complaintTitle}</strong>" ${statusLabel}.</p>`,
    });
  } catch (err) {
    console.error('[Email] sendComplaintStatusEmail failed:', err);
  }
}

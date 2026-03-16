// ─────────────────────────────────────────────────────────────
// Shared email HTML templates
// ─────────────────────────────────────────────────────────────

/** Renders either a logo <img> or a fallback initial square */
function headerBrand(name: string, logoUrl?: string | null, accentColor = '#4f46e5') {
  if (logoUrl) {
    return `
      <div style="width:72px;height:72px;border-radius:16px;overflow:hidden;display:inline-block;background:#fff;margin-bottom:12px">
        <img src="${logoUrl}" alt="${name}" width="72" height="72"
          style="width:72px;height:72px;object-fit:cover;display:block" />
      </div>
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">${name}</h1>`
  }
  return `
    <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
      <span style="color:#fff;font-size:26px;font-weight:800;line-height:1">${name[0]}</span>
    </div>
    <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">${name}</h1>`
}

export function customerEmailHtml(p: {
  businessName: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  customerName: string
  serviceName: string
  staffName: string
  date: string
  time: string
  duration: number
  price: number
  ref: string
  cancellationPolicy: string
  cancelUrl: string
  logoUrl?: string | null
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">

        <!-- Header -->
        <tr><td style="background:#4f46e5;padding:32px;text-align:center">
          ${headerBrand(p.businessName, p.logoUrl)}
        </td></tr>

        <!-- Status icon -->
        <tr><td style="padding:36px 32px 8px;text-align:center">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px">
            <tr><td style="width:64px;height:64px;background:#dcfce7;border-radius:50%;text-align:center;vertical-align:middle">
              <span style="font-size:30px;line-height:64px">&#10003;</span>
            </td></tr>
          </table>
          <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827">You&apos;re booked!</h2>
          <p style="margin:0;color:#6b7280;font-size:15px">Hi ${p.customerName}, your appointment is confirmed.</p>
        </td></tr>

        <!-- Booking card -->
        <tr><td style="padding:24px 32px">
          <table width="100%" style="background:#f9fafb;border-radius:12px;overflow:hidden">
            <tr><td style="background:#16a34a;padding:16px 20px">
              <p style="margin:0;color:#fff;font-weight:700;font-size:16px">${p.serviceName}</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px">${p.date} at ${p.time}</p>
            </td></tr>
            <tr><td style="padding:16px 20px">
              <table width="100%">
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">With</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;text-align:right">${p.staffName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Duration</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;text-align:right">${p.duration} min</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Price</td>
                  <td style="padding:6px 0;color:#4f46e5;font-size:14px;font-weight:700;text-align:right">&#8364;${p.price}</td>
                </tr>
                <tr><td colspan="2" style="padding-top:12px;border-top:1px solid #e5e7eb"></td></tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Address</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;text-align:right">${p.businessAddress}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Phone</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;text-align:right">${p.businessPhone}</td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Ref -->
        <tr><td style="padding:0 32px 24px;text-align:center">
          <p style="margin:0;color:#6b7280;font-size:13px">Booking reference</p>
          <p style="margin:4px 0 0;font-family:monospace;font-size:18px;font-weight:800;color:#4f46e5;letter-spacing:2px">${p.ref}</p>
        </td></tr>

        ${p.cancellationPolicy ? `
        <tr><td style="padding:0 32px 16px;text-align:center">
          <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6">${p.cancellationPolicy}</p>
        </td></tr>` : ''}

        <tr><td style="padding:0 32px 32px;text-align:center">
          <a href="${p.cancelUrl}"
            style="display:inline-block;border:1px solid #e5e7eb;color:#6b7280;font-size:12px;padding:8px 20px;border-radius:8px;text-decoration:none">
            Need to cancel? Click here
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center">
          <p style="margin:0;color:#d1d5db;font-size:12px">Questions? Reply to this email or call ${p.businessPhone}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function pendingCustomerEmailHtml(p: {
  businessName: string
  businessPhone: string
  customerName: string
  serviceName: string
  staffName: string
  date: string
  time: string
  duration: number
  price: number
  ref: string
  logoUrl?: string | null
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">

        <!-- Header -->
        <tr><td style="background:#4f46e5;padding:32px;text-align:center">
          ${headerBrand(p.businessName, p.logoUrl)}
        </td></tr>

        <!-- Status icon -->
        <tr><td style="padding:36px 32px 8px;text-align:center">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px">
            <tr><td style="width:64px;height:64px;background:#fef3c7;border-radius:50%;text-align:center;vertical-align:middle">
              <span style="font-size:30px;line-height:64px">&#9200;</span>
            </td></tr>
          </table>
          <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827">Request Received!</h2>
          <p style="margin:0;color:#6b7280;font-size:15px">Hi ${p.customerName}, we&apos;ve received your booking request.</p>
          <p style="margin:8px 0 0;color:#d97706;font-size:14px;font-weight:600">We&apos;ll review and confirm your appointment shortly.</p>
        </td></tr>

        <!-- Booking card -->
        <tr><td style="padding:24px 32px">
          <table width="100%" style="background:#f9fafb;border-radius:12px;overflow:hidden">
            <tr><td style="background:#d97706;padding:16px 20px">
              <p style="margin:0;color:#fff;font-weight:700;font-size:16px">${p.serviceName}</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px">${p.date} at ${p.time}</p>
            </td></tr>
            <tr><td style="padding:16px 20px">
              <table width="100%">
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">With</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;text-align:right">${p.staffName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Duration</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;text-align:right">${p.duration} min</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px">Price</td>
                  <td style="padding:6px 0;color:#4f46e5;font-size:14px;font-weight:700;text-align:right">&#8364;${p.price}</td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Ref -->
        <tr><td style="padding:0 32px 24px;text-align:center">
          <p style="margin:0;color:#6b7280;font-size:13px">Booking reference</p>
          <p style="margin:4px 0 0;font-family:monospace;font-size:18px;font-weight:800;color:#d97706;letter-spacing:2px">${p.ref}</p>
        </td></tr>

        <tr><td style="background:#fffbeb;padding:16px 32px;text-align:center">
          <p style="margin:0;color:#92400e;font-size:13px">You&apos;ll receive a confirmation email once your booking is approved.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center">
          <p style="margin:0;color:#d1d5db;font-size:12px">Questions? Call us on ${p.businessPhone}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function rejectedCustomerEmailHtml(p: {
  businessName: string
  businessPhone: string
  customerName: string
  serviceName: string
  date: string
  time: string
  logoUrl?: string | null
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">

        <!-- Header -->
        <tr><td style="background:#4f46e5;padding:32px;text-align:center">
          ${headerBrand(p.businessName, p.logoUrl)}
        </td></tr>

        <!-- Status icon -->
        <tr><td style="padding:36px 32px 8px;text-align:center">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px">
            <tr><td style="width:64px;height:64px;background:#fee2e2;border-radius:50%;text-align:center;vertical-align:middle">
              <span style="font-size:30px;line-height:64px">&#10005;</span>
            </td></tr>
          </table>
          <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827">Request Not Approved</h2>
          <p style="margin:0;color:#6b7280;font-size:15px">Hi ${p.customerName},</p>
          <p style="margin:8px 0 0;color:#6b7280;font-size:15px">Unfortunately, your booking request for <strong>${p.serviceName}</strong> on <strong>${p.date}</strong> at <strong>${p.time}</strong> could not be approved at this time.</p>
          <p style="margin:16px 0 0;color:#6b7280;font-size:14px">Please contact us on <a href="tel:${p.businessPhone}" style="color:#4f46e5">${p.businessPhone}</a> to arrange an alternative time.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 32px;margin-top:24px;text-align:center">
          <p style="margin:0;color:#d1d5db;font-size:12px">BookFlow &#8212; ${p.businessName}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function adminEmailHtml(p: {
  businessName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerNotes: string
  serviceName: string
  staffName: string
  date: string
  time: string
  duration: number
  price: number
  ref: string
  isPending?: boolean
}) {
  const headerBg = p.isPending ? '#d97706' : '#4f46e5'
  const badge = p.isPending
    ? '<span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;margin-left:8px;">PENDING APPROVAL</span>'
    : ''
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:${headerBg};padding:24px 32px">
          <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px">${p.isPending ? 'Booking request' : 'New booking'} &#8212; ${p.businessName}</p>
          <h1 style="margin:4px 0 0;color:#fff;font-size:20px;font-weight:700">&#128276; ${p.customerName} just booked${badge}</h1>
        </td></tr>
        <tr><td style="padding:24px 32px">
          <table width="100%" style="border:2px solid #e5e7eb;border-radius:12px">
            <tr><td style="background:#f9fafb;padding:12px 16px;border-radius:10px 10px 0 0">
              <p style="margin:0;font-weight:700;color:#111827">${p.serviceName}</p>
              <p style="margin:2px 0 0;color:#6b7280;font-size:13px">${p.date} at ${p.time} &middot; ${p.duration} min &middot; &#8364;${p.price}</p>
            </td></tr>
            <tr><td style="padding:16px">
              <table width="100%">
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px;width:110px">Customer</td>
                  <td style="padding:5px 0;color:#111827;font-size:14px;font-weight:600">${p.customerName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Email</td>
                  <td style="padding:5px 0;font-size:14px"><a href="mailto:${p.customerEmail}" style="color:#4f46e5">${p.customerEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Phone</td>
                  <td style="padding:5px 0;font-size:14px"><a href="tel:${p.customerPhone}" style="color:#4f46e5">${p.customerPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Staff</td>
                  <td style="padding:5px 0;color:#111827;font-size:14px">${p.staffName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Ref</td>
                  <td style="padding:5px 0;font-family:monospace;font-size:14px;font-weight:700;color:#4f46e5">${p.ref}</td>
                </tr>
                ${p.customerNotes ? `
                <tr>
                  <td style="padding:5px 0;color:#6b7280;font-size:14px">Notes</td>
                  <td style="padding:6px 10px;color:#92400e;font-size:14px;background:#fffbeb;border-radius:6px">${p.customerNotes}</td>
                </tr>` : ''}
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center">
          <p style="margin:0;color:#9ca3af;font-size:12px">BookFlow &#8212; ${p.businessName}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

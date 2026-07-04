import nodemailer from "nodemailer";
import { logger } from "./logger";

const SMTP_HOST = "smtp.163.com";
const SMTP_PORT = 465;
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? SMTP_USER;

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

function buildBarcode(): string {
  const bars = [];
  for (let i = 0; i < 48; i++) {
    const w = i % 3 === 0 ? 2 : 1;
    const h = i % 5 === 0 ? 20 : i % 2 === 0 ? 14 : 9;
    bars.push(
      `<div style="display:inline-block;width:${w}px;height:${h}px;background:rgba(0,0,0,0.35);margin-right:1px;vertical-align:bottom;"></div>`
    );
  }
  return bars.join("");
}

export async function sendMessageNotification(name: string, content: string): Promise<void> {
  const t = getTransporter();
  if (!t) {
    logger.warn("Email credentials not configured, skipping notification");
    return;
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ".");
  const timeStr = now.toTimeString().slice(0, 5);
  const datetimeStr = `${dateStr} ${timeStr}`;
  const barcode = buildBarcode();

  const rows = [
    { label: "留言人", value: name },
    { label: "留言内容", value: content.replace(/\n/g, "<br/>") },
    { label: "留言时间", value: datetimeStr },
    { label: "留言来源", value: "牧雪 Portfolio" },
  ];

  const rowsHtml = rows
    .map(
      (r) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px dashed rgba(0,0,0,0.1);
                  font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.14em;
                  color:rgba(0,0,0,0.35);text-transform:uppercase;white-space:nowrap;
                  width:80px;vertical-align:top;">
        ${r.label}
      </td>
      <td style="padding:10px 0 10px 20px;border-bottom:1px dashed rgba(0,0,0,0.1);
                  font-size:14px;color:rgba(0,0,0,0.72);line-height:1.6;vertical-align:top;">
        ${r.value}
      </td>
    </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0e0e0e;font-family:'Courier New',Courier,monospace;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e0e;padding:40px 0;">
    <tr><td align="center">

      <!-- Ticket card -->
      <table width="540" cellpadding="0" cellspacing="0"
        style="background:#f2f0ed;border-radius:3px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.6);">

        <!-- Top strip -->
        <tr>
          <td style="background:#0e0e0e;padding:10px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:8px;letter-spacing:0.22em;color:rgba(255,255,255,0.22);text-transform:uppercase;">
                  PORTFOLIO // MSG_RECEIVED // ${dateStr}
                </td>
                <td align="right" style="font-size:8px;letter-spacing:0.18em;color:#1500ff;text-transform:uppercase;">
                  ● INCOMING
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 28px 24px 28px;">

            <!-- Title block -->
            <div style="font-size:8px;letter-spacing:0.22em;color:rgba(0,0,0,0.28);text-transform:uppercase;margin-bottom:6px;">
              01 // Message_Record
            </div>
            <div style="font-size:26px;font-weight:900;color:rgba(0,0,0,0.82);
                        letter-spacing:-0.5px;line-height:1;margin-bottom:18px;">
              新留言通知
            </div>

            <!-- Dotted line -->
            <div style="border-top:1px dashed rgba(0,0,0,0.15);margin-bottom:18px;"></div>

            <!-- Data rows -->
            <table width="100%" cellpadding="0" cellspacing="0">
              ${rowsHtml}
            </table>

            <!-- Dotted line -->
            <div style="border-top:1px dashed rgba(0,0,0,0.15);margin-top:4px;margin-bottom:18px;"></div>

            <!-- Barcode -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>${barcode}</td>
                <td align="right" valign="bottom"
                  style="font-size:9px;letter-spacing:0.2em;color:rgba(0,0,0,0.2);">
                  9102 2204 MERC
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Bottom strip -->
        <tr>
          <td style="background:#0e0e0e;padding:10px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:8px;color:rgba(255,255,255,0.18);letter-spacing:0.18em;text-transform:uppercase;">
                  SYS_STATUS // ONLINE // PORTFOLIO_ACTIVE
                </td>
                <td align="right" style="font-size:8px;color:rgba(255,255,255,0.18);letter-spacing:0.18em;text-transform:uppercase;">
                  ADMIT ONE // ACCESS GRANTED
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

  try {
    await t.sendMail({
      from: `"牧雪 Portfolio" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `【新留言】来自 ${name} ${dateStr}`,
      html,
    });
    logger.info({ name }, "Email notification sent");
  } catch (err) {
    logger.error({ err }, "Failed to send email notification");
  }
}

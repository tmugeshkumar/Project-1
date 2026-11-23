/**
 * SMS OTP sender.
 *
 * In development (no SMS_API_KEY configured), the OTP is returned
 * in the API response so it can be used without a real SMS gateway.
 *
 * To add a real SMS provider (e.g. Twilio, MSG91, Fast2SMS):
 *   1. Set SMS_PROVIDER=twilio (or msg91 / fast2sms) in .env
 *   2. Add provider credentials to .env
 *   3. Implement the provider case below
 */

export interface SmsSendResult {
  sent: boolean;
  /** OTP returned only in development / simulation mode */
  devOtp?: string;
  error?: string;
}

export async function sendOtpSms(phone: string, otp: string): Promise<SmsSendResult> {
  const provider = process.env.SMS_PROVIDER;

  // ── Real SMS providers ───────────────────────────────────────────────
  if (provider === "fast2sms") {
    try {
      const apiKey = process.env.FAST2SMS_API_KEY ?? "";
      const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: phone.replace(/\D/g, "").slice(-10), // last 10 digits
        }),
      });
      const data = (await res.json()) as { return: boolean };
      return { sent: data.return };
    } catch (err) {
      console.error("[SMS] fast2sms error:", err);
      return { sent: false, error: "SMS delivery failed." };
    }
  }

  if (provider === "twilio") {
    // Add Twilio SDK integration here when credentials are available
    console.warn("[SMS] Twilio configured but not implemented — falling through to dev mode.");
  }

  // ── Development / Simulation mode ────────────────────────────────────
  console.log(`\n[OTP DEV MODE] Phone: ${phone} | OTP: ${otp}\n`);
  return { sent: true, devOtp: otp };
}

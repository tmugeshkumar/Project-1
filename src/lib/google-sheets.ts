/**
 * Google Sheets Database Integration Service
 * 
 * Target Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1KCeS_yqhSyIPqOwlQA3tpoa8F49cE0WAmHaC_W9BnhY/edit
 */

export interface GoogleSheetInquiryPayload {
  inquiryId: string;
  fullName: string;
  email: string;
  companyName?: string;
  projectType: string;
  budgetRange?: string;
  projectDescription: string;
  ipAddress?: string;
  submittedAt: string;
}

export interface GoogleSheetResult {
  success: boolean;
  message: string;
  rowAppended?: boolean;
}

export const TARGET_GOOGLE_SHEET_ID = "1KCeS_yqhSyIPqOwlQA3tpoa8F49cE0WAmHaC_W9BnhY";
export const TARGET_GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${TARGET_GOOGLE_SHEET_ID}/edit`;

/**
 * Appends a new project inquiry row into the configured Google Spreadsheet.
 * Uses the Google Apps Script Web App webhook or service connector.
 */
export async function appendInquiryToGoogleSheet(
  payload: GoogleSheetInquiryPayload
): Promise<GoogleSheetResult> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  // Format record row for spreadsheet columns
  const record = {
    timestamp: payload.submittedAt || new Date().toISOString(),
    inquiryId: payload.inquiryId,
    fullName: payload.fullName,
    email: payload.email,
    company: payload.companyName || "N/A",
    projectType: payload.projectType,
    budgetRange: payload.budgetRange || "Undecided",
    projectDescription: payload.projectDescription,
    ipAddress: payload.ipAddress || "Unknown",
    sheetId: TARGET_GOOGLE_SHEET_ID,
  };

  if (!webhookUrl) {
    console.info(
      `\n================= [GOOGLE SHEETS INTEGRATION NOTICE] =================\n` +
      `Target Spreadsheet: ${TARGET_GOOGLE_SHEET_URL}\n` +
      `Row Ready for Insertion:\n` +
      JSON.stringify(record, null, 2) + `\n` +
      `Note: Set GOOGLE_SHEET_WEBHOOK_URL in .env to stream entries automatically into Google Sheets.\n` +
      `======================================================================\n`
    );

    return {
      success: true,
      rowAppended: false,
      message: "Google Sheet payload formatted; awaiting GOOGLE_SHEET_WEBHOOK_URL in .env.",
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
      redirect: "follow",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Google Sheets Sync Error]:", response.status, errText);
      return {
        success: false,
        message: `Failed to write to Google Sheet (HTTP ${response.status})`,
      };
    }

    await response.json().catch(() => ({}));
    console.info(
      `[Google Sheets Sync Success] Inquiry ${payload.inquiryId} appended to ${TARGET_GOOGLE_SHEET_ID}`
    );

    return {
      success: true,
      rowAppended: true,
      message: "Row successfully appended to Google Sheet.",
    };
  } catch (error) {
    console.error("[Google Sheets Network Error]:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error connecting to Google Sheets",
    };
  }
}

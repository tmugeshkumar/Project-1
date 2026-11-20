/**
 * Google Apps Script for COMPANY_NAME Project Inquiries
 * 
 * Instructions to connect your Google Sheet in 60 seconds:
 * 1. Open your spreadsheet:
 *    https://docs.google.com/spreadsheets/d/1KCeS_yqhSyIPqOwlQA3tpoa8F49cE0WAmHaC_W9BnhY/edit
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file contents, and click Save (disk icon).
 * 4. Click the blue "Deploy" button at the top right > "New deployment".
 * 5. Under "Select type" (gear icon), select "Web app".
 * 6. Set:
 *    - Description: "COMPANY_NAME Inquiries API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Click "Deploy", authorize access with your Google account, and copy the "Web app URL".
 * 8. Paste that URL into your .env file:
 *    GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/AKfycbx.../exec"
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create standard column headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Inquiry ID",
        "Full Name",
        "Email",
        "Company",
        "Project Type",
        "Budget Range",
        "Project Description",
        "IP Address"
      ]);

      // Format header row style
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#2563eb");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    // Append new project discussion entry
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.inquiryId || "N/A",
      data.fullName || "",
      data.email || "",
      data.company || "N/A",
      data.projectType || "",
      data.budgetRange || "Undecided",
      data.projectDescription || "",
      data.ipAddress || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Inquiry successfully recorded in Google Sheet",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "COMPANY_NAME Inquiries Webhook is live and ready."
  })).setMimeType(ContentService.MimeType.JSON);
}

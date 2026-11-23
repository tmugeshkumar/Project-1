import fs from "fs";
import path from "path";
import { getLocalUserById, updateLocalUser } from "./local-store";

export interface ContactChangeRequest {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  currentPhone?: string | null;
  requestedPhone?: string | null;
  currentEmail?: string | null;
  requestedEmail?: string | null;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "change-requests.json");

function ensureStore(): ContactChangeRequest[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8").replace(/^\uFEFF/, "");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Change Requests Store Error]", err);
    return [];
  }
}

function writeStore(requests: ContactChangeRequest[]): void {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2), "utf8");
}

export function getAllChangeRequests(): ContactChangeRequest[] {
  return ensureStore().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUserChangeRequests(userId: string): ContactChangeRequest[] {
  return ensureStore()
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createChangeRequest(data: {
  userId: string;
  requestedPhone?: string | null;
  requestedEmail?: string | null;
  reason: string;
}): ContactChangeRequest {
  const requests = ensureStore();
  const user = getLocalUserById(data.userId);

  const newReq: ContactChangeRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId: data.userId,
    username: user?.username ?? "unknown",
    fullName: user?.fullName ?? "User",
    currentPhone: user?.phone ?? null,
    requestedPhone: data.requestedPhone ?? null,
    currentEmail: user?.email ?? null,
    requestedEmail: data.requestedEmail ?? null,
    reason: data.reason.trim(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  requests.push(newReq);
  writeStore(requests);
  return newReq;
}

export function approveChangeRequest(
  requestId: string,
  adminId: string
): { success: boolean; message: string; request?: ContactChangeRequest } {
  const requests = ensureStore();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) {
    return { success: false, message: "Request not found." };
  }

  const req = requests[idx];
  if (req.status !== "PENDING") {
    return { success: false, message: `Request is already ${req.status.toLowerCase()}.` };
  }

  // Update user in local-store
  const updates: Record<string, string> = {};
  if (req.requestedPhone) updates.phone = req.requestedPhone;
  if (req.requestedEmail) updates.email = req.requestedEmail.toLowerCase();

  const updatedUser = updateLocalUser(req.userId, updates);
  if (!updatedUser) {
    return { success: false, message: "Target user not found." };
  }

  req.status = "APPROVED";
  req.resolvedAt = new Date().toISOString();
  req.resolvedBy = adminId;
  requests[idx] = req;
  writeStore(requests);

  return { success: true, message: "Request approved and user details updated.", request: req };
}

export function rejectChangeRequest(
  requestId: string,
  adminId: string
): { success: boolean; message: string; request?: ContactChangeRequest } {
  const requests = ensureStore();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) {
    return { success: false, message: "Request not found." };
  }

  const req = requests[idx];
  if (req.status !== "PENDING") {
    return { success: false, message: `Request is already ${req.status.toLowerCase()}.` };
  }

  req.status = "REJECTED";
  req.resolvedAt = new Date().toISOString();
  req.resolvedBy = adminId;
  requests[idx] = req;
  writeStore(requests);

  return { success: true, message: "Request rejected.", request: req };
}

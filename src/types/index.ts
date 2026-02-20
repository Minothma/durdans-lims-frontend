// ─── User & Auth ───────────────────────────────────────────
export type UserRole =
  | "SMLT"
  | "PATHOLOGIST"
  | "DISPATCH_OFFICER"
  | "BRANCH_ADMIN"
  | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  branchId: string;
  avatarInitials: string;
}

// ─── Shared Enums ──────────────────────────────────────────
export type QCStatus = "PASS" | "FAIL" | "PENDING";
export type VerificationStatus = "PENDING" | "RETURNED";
export type FlagLevel = "NORMAL" | "HIGH" | "LOW" | "CRITICAL";
export type UrgencyLevel = "ROUTINE" | "STAT";
export type DeliveryMethod = "EMAIL" | "SMS" | "PRINT" | "PORTAL";
export type DeliveryStatus = "PENDING" | "DELIVERED" | "FAILED";
export type ReportStatus = "PENDING" | "DELIVERED" | "FAILED" | "PARTIAL";

// ─── Technical Verification ────────────────────────────────
export interface PendingVerificationSample {
  id: string;
  sampleId: string;
  patientName: string;
  patientId: string;
  testType: string;
  mltName: string;
  qcStatus: QCStatus;
  flag: FlagLevel;
  urgency: UrgencyLevel;
  timeElapsed: string;
  verificationStatus?: VerificationStatus;
  returnReason?: string;
  returnedBy?: string;
  returnedAt?: string;
}

export interface LabResult {
  parameter: string;
  result: string | number;
  unit: string;
  flag: FlagLevel | "—";
  referenceRange: string;
  isAbnormal: boolean;
}

export interface InstrumentBatch {
  id: string;
  name: string;
  instrumentId: string;
  department: string;
  qcStatus: "PASSED" | "PENDING";
  totalSamples: number;
  normalResults: number;
  exceptions: number;
  isSelected: boolean;
}

// ─── Clinical Authorization ────────────────────────────────
export interface ValidationSample {
  id: string;
  sampleId: string;
  patientName: string;
  patientInitials: string;
  patientAge: string;
  patientGender: string;
  patientIdNo: string;
  testType: string;
  department: string;
  status: "CRITICAL_FLAG" | "PENDING" | "ABNORMAL";
  urgency: UrgencyLevel;
  timeElapsed: string;
}

// ─── Report Dispatch ───────────────────────────────────────
export interface DispatchReport {
  id: string;
  reportId: string;
  patientName: string;
  patientId: string;
  testName: string;
  authorizedDate: string;
  authorizedTime: string;
  deliveryMethods: DeliveryMethod[];
  status: ReportStatus;
}

export interface DeliveryRecord {
  reportId: string;
  patientName: string;
  testName: string;
  methods: DeliveryMethod[];
  status: DeliveryStatus;
  dispatchedTime: string;
  deliveredTime: string | null;
}

export interface FailedDelivery {
  reportId: string;
  patientName: string;
  testName: string;
  method: DeliveryMethod;
  failureReason: string;
  failedDateTime: string;
  retryCount: number;
}
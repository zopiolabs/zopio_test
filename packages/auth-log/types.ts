export type AccessLogEntry = {
  timestamp: string;
  resource: string;
  action: string;
  context: any;
  recordId?: string;
  field?: string;
  can: boolean;
  reason?: string;
};
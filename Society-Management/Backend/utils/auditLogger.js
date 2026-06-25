import AuditLog from '../models/AuditLog.js';

export const logEvent = async ({ action, user = null, ipAddress = '', userAgent = '', status, details = '' }) => {
  try {
    await AuditLog.create({
      action,
      user,
      ipAddress,
      userAgent,
      status,
      details,
    });
  } catch (error) {
    console.error('Audit logging failed:', error.message);
  }
};

export default logEvent;

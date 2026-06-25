import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['Login', 'Logout', 'Password Change', 'Password Reset', 'User Creation', 'Failed Login Attempt'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      required: true,
      enum: ['Success', 'Failure'],
    },
    details: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;

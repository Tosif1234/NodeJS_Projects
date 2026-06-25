export const ROLES = {
  ADMIN: 'Admin',
  RESIDENT: 'Resident',
  SECURITY_STAFF: 'Security Staff',
  MAINTENANCE_STAFF: 'Maintenance Staff',
};

export const PERMISSIONS = {
  USER_VIEW_ALL: 'user:view_all',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  RESIDENT_CREATE: 'resident:create',
  RESIDENT_VIEW_ALL: 'resident:view_all',
  RESIDENT_VIEW_SELF: 'resident:view_self',
  RESIDENT_UPDATE: 'resident:update',

  VISITOR_LOG_ENTRY: 'visitor:log_entry',
  VISITOR_VIEW_ALL: 'visitor:view_all',
  VISITOR_VIEW_HOSTED: 'visitor:view_hosted',
  VISITOR_APPROVE: 'visitor:approve',

  COMPLAINT_CREATE: 'complaint:create',
  COMPLAINT_VIEW_ALL: 'complaint:view_all',
  COMPLAINT_VIEW_SELF: 'complaint:view_self',
  COMPLAINT_ASSIGN: 'complaint:assign',
  COMPLAINT_RESOLVE: 'complaint:resolve',
  COMPLAINT_DELETE: 'complaint:delete',

  BILL_CREATE: 'bill:create',
  BILL_VIEW_ALL: 'bill:view_all',
  BILL_VIEW_SELF: 'bill:view_self',
  BILL_UPDATE: 'bill:update',
  BILL_PAY: 'bill:pay',

  FACILITY_CREATE: 'facility:create',
  FACILITY_BOOK: 'facility:book',
  FACILITY_VIEW_ALL: 'facility:view_all',
  FACILITY_VIEW_SELF: 'facility:view_self',
  FACILITY_CANCEL: 'facility:cancel',
  FACILITY_APPROVE: 'facility:approve',

  NOTICE_CREATE: 'notice:create',
  NOTICE_VIEW: 'notice:view',
  NOTICE_DELETE: 'notice:delete',

  POLL_CREATE: 'poll:create',
  POLL_VOTE: 'poll:vote',
  POLL_VIEW: 'poll:view',
  POLL_DELETE: 'poll:delete',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),

    [ROLES.RESIDENT]: [
    PERMISSIONS.RESIDENT_CREATE,
    PERMISSIONS.RESIDENT_VIEW_SELF,
    PERMISSIONS.RESIDENT_UPDATE,
    PERMISSIONS.VISITOR_VIEW_HOSTED,
    PERMISSIONS.VISITOR_APPROVE,
    PERMISSIONS.COMPLAINT_CREATE,
    PERMISSIONS.COMPLAINT_VIEW_SELF,
    PERMISSIONS.BILL_VIEW_SELF,
    PERMISSIONS.BILL_PAY,
    PERMISSIONS.FACILITY_BOOK,
    PERMISSIONS.FACILITY_VIEW_SELF,
    PERMISSIONS.FACILITY_CANCEL,
    PERMISSIONS.NOTICE_VIEW,
    PERMISSIONS.POLL_VOTE,
    PERMISSIONS.POLL_VIEW,
  ],

    [ROLES.SECURITY_STAFF]: [
    PERMISSIONS.VISITOR_LOG_ENTRY,
    PERMISSIONS.VISITOR_VIEW_ALL,
    PERMISSIONS.RESIDENT_VIEW_ALL,
    PERMISSIONS.NOTICE_VIEW,
  ],

    [ROLES.MAINTENANCE_STAFF]: [
    PERMISSIONS.COMPLAINT_VIEW_ALL,
    PERMISSIONS.COMPLAINT_RESOLVE,
    PERMISSIONS.NOTICE_VIEW,
  ],
};

const ROLE_NAMES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  USER: "User",
};

const roleAliases = {
  superadmin: ROLE_NAMES.SUPER_ADMIN,
  "super admin": ROLE_NAMES.SUPER_ADMIN,
  admin: ROLE_NAMES.ADMIN,
  manager: ROLE_NAMES.MANAGER,
  staff: ROLE_NAMES.USER,
  user: ROLE_NAMES.USER,
};

const permissions = {
  "dashboard:view": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MANAGER, ROLE_NAMES.USER],
  "profile:manage": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MANAGER, ROLE_NAMES.USER],

  "users:manage": [ROLE_NAMES.SUPER_ADMIN],

  "categories:manage": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN],
  "subcategories:manage": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN],
  "extraCategories:manage": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN],

  "products:view": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MANAGER, ROLE_NAMES.USER],
  "products:create": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MANAGER],
  "products:edit": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MANAGER],
  "products:delete": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN],
  "products:trash": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN],
  "products:restore": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN],

  "orders:view": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MANAGER, ROLE_NAMES.USER],
  "orders:update": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MANAGER],
  "orders:manage": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN],

  "reports:view": [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN],
  "settings:manage": [ROLE_NAMES.SUPER_ADMIN],
  "auditLogs:view": [ROLE_NAMES.SUPER_ADMIN],
};

const normalizeRole = (role) => {
  const key = String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");

  return roleAliases[key] || ROLE_NAMES.USER;
};

const userHasPermission = (user, permission) => {
  const userRole = normalizeRole(user && user.role);

  if (userRole === ROLE_NAMES.SUPER_ADMIN) {
    return true;
  }

  return (permissions[permission] || []).includes(userRole);
};

const attachRoleHelpers = (req, res, next) => {
  res.locals.currentRole = req.user ? normalizeRole(req.user.role) : null;
  res.locals.canPermission = (permission) => userHasPermission(req.user, permission);
  next();
};

const requirePermission = (permission) => (req, res, next) => {
  if (userHasPermission(req.user, permission)) {
    return next();
  }

  req.flash("error", "You do not have permission to access that page.");
  return res.redirect("/dashboard");
};

module.exports = {
  ROLE_NAMES,
  attachRoleHelpers,
  normalizeRole,
  requirePermission,
  userHasPermission,
};

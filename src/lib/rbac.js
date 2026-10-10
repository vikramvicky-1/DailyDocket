export const DEFAULT_ADMIN_EMAIL = (
  process.env.DEFAULT_ADMIN_EMAIL || "admin@dailydocket.com"
).toLowerCase();

export const MODULE_KEYS = [
  "sales",
  "orders",
  "expenses",
  "categories",
  "userManagement",
];

export const MODULE_CONFIG = {
  sales: {
    key: "sales",
    name: "Sales",
    description: "Daily sales entries, financial breakdowns, and attachments",
    path: "/sales",
  },
  orders: {
    key: "orders",
    name: "Orders",
    description: "Customer orders, delivery dates, bills, and payments",
    path: "/orders",
  },
  expenses: {
    key: "expenses",
    name: "Expenses",
    description: "Business expenses, category categorization, and receipts",
    path: "/expenses",
  },
  categories: {
    key: "categories",
    name: "Categories",
    description: "Expense categories and subcategory taxonomies",
    path: "/manage-categories",
  },
  userManagement: {
    key: "userManagement",
    name: "User Management",
    description: "User profiles, roles, and granular RBAC permissions",
    path: "/user-management",
  },
};

/**
 * Checks if a given user object represents the protected default administrator
 */
export function isDefaultAdminUser(user) {
  if (!user) return false;
  if (user.isDefaultAdmin === true) return true;
  const email = (user.emailAddress || user.email || "").toLowerCase().trim();
  return email === DEFAULT_ADMIN_EMAIL;
}

/**
 * Returns full normalized permissions map for a user
 */
export function getUserPermissions(user) {
  if (!user) {
    return MODULE_KEYS.reduce((acc, key) => {
      acc[key] = { view: false, manage: false };
      return acc;
    }, {});
  }

  // Administrators always have full view and manage powers on everything
  if (user.role === "Administrator" || isDefaultAdminUser(user)) {
    return MODULE_KEYS.reduce((acc, key) => {
      acc[key] = { view: true, manage: true };
      return acc;
    }, {});
  }

  const rawPerms = user.permissions || {};
  const normalized = {};

  MODULE_KEYS.forEach((key) => {
    const modPerm = rawPerms[key] || {};
    const manage = Boolean(modPerm.manage);
    const view = Boolean(modPerm.view || manage); // Manage automatically implies view
    normalized[key] = { view, manage };
  });

  return normalized;
}

/**
 * Checks if a user has a specific permission (view or manage) on a module
 */
export function hasPermission(user, moduleKey, action = "view") {
  if (!user) return false;

  // Administrator or default admin always has full privileges
  if (user.role === "Administrator" || isDefaultAdminUser(user)) {
    return true;
  }

  const perms = getUserPermissions(user);
  const mod = perms[moduleKey];
  if (!mod) return false;

  if (action === "manage") {
    return Boolean(mod.manage);
  }

  return Boolean(mod.view || mod.manage);
}

/**
 * Permissions System for LYXso
 * 
 * Rolle-basert tilgangskontroll (RBAC) for hele plattformen
 */

export type Role = "owner" | "admin" | "manager" | "user";

export type Permission =
  // All access (owner only)
  | "all:*"
  
  // Bookings
  | "bookings:view"
  | "bookings:create"
  | "bookings:edit"
  | "bookings:delete"
  | "bookings:*"
  
  // Customers
  | "customers:view"
  | "customers:create"
  | "customers:edit"
  | "customers:delete"
  | "customers:*"
  
  // Vehicles
  | "vehicles:view"
  | "vehicles:create"
  | "vehicles:edit"
  | "vehicles:delete"
  | "vehicles:*"
  
  // Coating
  | "coating:view"
  | "coating:create"
  | "coating:edit"
  | "coating:delete"
  | "coating:certificate"
  | "coating:*"
  
  // Dekkhotell
  | "dekkhotell:view"
  | "dekkhotell:create"
  | "dekkhotell:edit"
  | "dekkhotell:delete"
  | "dekkhotell:checkin"
  | "dekkhotell:checkout"
  | "dekkhotell:*"
  
  // Team
  | "team:view"
  | "team:invite"
  | "team:manage"
  | "team:remove"
  | "team:*"
  
  // Settings
  | "settings:view"
  | "settings:edit"
  | "settings:billing"
  | "settings:integrations"
  | "settings:*"
  
  // Reports
  | "reports:view"
  | "reports:export"
  | "reports:*"
  
  // Marketing
  | "marketing:view"
  | "marketing:create"
  | "marketing:edit"
  | "marketing:publish"
  | "marketing:*"
  
  // Finance
  | "finance:view"
  | "finance:edit"
  | "finance:export"
  | "finance:*"
  
  // Products & Services
  | "products:view"
  | "products:create"
  | "products:edit"
  | "products:delete"
  | "products:*"
  
  // AI Features
  | "ai:use"
  | "ai:configure"
  | "ai:*"
  
  // Notifications
  | "notifications:view"
  | "notifications:send"
  | "notifications:*";

/**
 * Permissions per rolle
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ["all:*"],
  
  admin: [
    "bookings:*",
    "customers:*",
    "vehicles:*",
    "coating:*",
    "dekkhotell:*",
    "team:view",
    "team:invite",
    "team:manage",
    "settings:view",
    "settings:edit",
    "settings:integrations",
    "reports:*",
    "marketing:*",
    "finance:view",
    "finance:export",
    "products:*",
    "ai:use",
    "ai:configure",
    "notifications:*",
  ],
  
  manager: [
    "bookings:view",
    "bookings:create",
    "bookings:edit",
    "customers:view",
    "customers:create",
    "customers:edit",
    "vehicles:view",
    "vehicles:create",
    "vehicles:edit",
    "coating:view",
    "coating:create",
    "coating:certificate",
    "dekkhotell:view",
    "dekkhotell:checkin",
    "dekkhotell:checkout",
    "team:view",
    "settings:view",
    "reports:view",
    "marketing:view",
    "marketing:create",
    "finance:view",
    "products:view",
    "ai:use",
    "notifications:view",
  ],
  
  user: [
    "bookings:view",
    "customers:view",
    "vehicles:view",
    "coating:view",
    "dekkhotell:view",
    "team:view",
    "settings:view",
    "reports:view",
    "marketing:view",
    "products:view",
    "ai:use",
    "notifications:view",
  ],
};

/**
 * Sjekk om en rolle har en bestemt tillatelse
 */
export function hasPermission(
  role: Role,
  permission: Permission,
  customPermissions?: Permission[]
): boolean {
  // Owner har alltid tilgang
  if (role === "owner") {
    return true;
  }
  
  // Sjekk custom permissions først
  if (customPermissions && customPermissions.length > 0) {
    if (customPermissions.includes(permission)) {
      return true;
    }
    
    // Sjekk wildcard permissions
    const [resource] = permission.split(":");
    if (customPermissions.includes(`${resource}:*` as Permission)) {
      return true;
    }
  }
  
  // Sjekk rolle-baserte permissions
  const rolePermissions = ROLE_PERMISSIONS[role];
  
  // Direkte match
  if (rolePermissions.includes(permission)) {
    return true;
  }
  
  // Wildcard match (f.eks. bookings:* matcher bookings:view)
  const [resource] = permission.split(":");
  if (rolePermissions.includes(`${resource}:*` as Permission)) {
    return true;
  }
  
  return false;
}

/**
 * Sjekk om bruker har minst én av flere permissions
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[],
  customPermissions?: Permission[]
): boolean {
  return permissions.some((perm) =>
    hasPermission(role, perm, customPermissions)
  );
}

/**
 * Sjekk om bruker har alle gitte permissions
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[],
  customPermissions?: Permission[]
): boolean {
  return permissions.every((perm) =>
    hasPermission(role, perm, customPermissions)
  );
}

/**
 * Get alle permissions for en rolle
 */
export function getPermissions(
  role: Role,
  customPermissions?: Permission[]
): Permission[] {
  if (role === "owner") {
    return ["all:*"];
  }
  
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  
  if (customPermissions && customPermissions.length > 0) {
    return [...new Set([...rolePerms, ...customPermissions])];
  }
  
  return rolePerms;
}

/**
 * Permission beskrivelser for UI
 */
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  "all:*": "Full tilgang til alt",
  
  "bookings:view": "Se bookinger",
  "bookings:create": "Opprette bookinger",
  "bookings:edit": "Redigere bookinger",
  "bookings:delete": "Slette bookinger",
  "bookings:*": "Full tilgang til bookinger",
  
  "customers:view": "Se kunder",
  "customers:create": "Opprette kunder",
  "customers:edit": "Redigere kunder",
  "customers:delete": "Slette kunder",
  "customers:*": "Full tilgang til kunder",
  
  "vehicles:view": "Se kjøretøy",
  "vehicles:create": "Registrere kjøretøy",
  "vehicles:edit": "Redigere kjøretøy",
  "vehicles:delete": "Slette kjøretøy",
  "vehicles:*": "Full tilgang til kjøretøy",
  
  "coating:view": "Se coating-jobber",
  "coating:create": "Opprette coating-jobber",
  "coating:edit": "Redigere coating-jobber",
  "coating:delete": "Slette coating-jobber",
  "coating:certificate": "Generere sertifikater",
  "coating:*": "Full tilgang til coating",
  
  "dekkhotell:view": "Se dekkhotell",
  "dekkhotell:create": "Registrere dekk",
  "dekkhotell:edit": "Redigere dekkopplysninger",
  "dekkhotell:delete": "Slette dekkregistreringer",
  "dekkhotell:checkin": "Sjekke inn dekk",
  "dekkhotell:checkout": "Sjekke ut dekk",
  "dekkhotell:*": "Full tilgang til dekkhotell",
  
  "team:view": "Se team members",
  "team:invite": "Invitere team members",
  "team:manage": "Administrere team members",
  "team:remove": "Fjerne team members",
  "team:*": "Full tilgang til team",
  
  "settings:view": "Se innstillinger",
  "settings:edit": "Redigere innstillinger",
  "settings:billing": "Administrere fakturering",
  "settings:integrations": "Administrere integrasjoner",
  "settings:*": "Full tilgang til innstillinger",
  
  "reports:view": "Se rapporter",
  "reports:export": "Eksportere rapporter",
  "reports:*": "Full tilgang til rapporter",
  
  "marketing:view": "Se markedsføring",
  "marketing:create": "Opprette kampanjer",
  "marketing:edit": "Redigere kampanjer",
  "marketing:publish": "Publisere innhold",
  "marketing:*": "Full tilgang til markedsføring",
  
  "finance:view": "Se økonomi",
  "finance:edit": "Redigere økonomi",
  "finance:export": "Eksportere økonomidata",
  "finance:*": "Full tilgang til økonomi",
  
  "products:view": "Se produkter",
  "products:create": "Opprette produkter",
  "products:edit": "Redigere produkter",
  "products:delete": "Slette produkter",
  "products:*": "Full tilgang til produkter",
  
  "ai:use": "Bruke AI-funksjoner",
  "ai:configure": "Konfigurere AI",
  "ai:*": "Full tilgang til AI",
  
  "notifications:view": "Se notifikasjoner",
  "notifications:send": "Sende notifikasjoner",
  "notifications:*": "Full tilgang til notifikasjoner",
};

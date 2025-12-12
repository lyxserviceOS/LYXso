"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role, Permission, hasPermission, hasAnyPermission, hasAllPermissions, getPermissions } from "@/lib/permissions";

type UserPermissions = {
  role: Role;
  customPermissions: Permission[];
  orgId: string | null;
  userId: string | null;
  loading: boolean;
};

type PermissionsContextType = UserPermissions & {
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  getAllPermissions: () => Permission[];
  refresh: () => Promise<void>;
};

const PermissionsContext = createContext<PermissionsContextType | null>(null);

/**
 * Provider for permissions context
 */
export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserPermissions>({
    role: "user",
    customPermissions: [],
    orgId: null,
    userId: null,
    loading: true,
  });

  async function loadPermissions() {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      // TODO: Fetch from API - for now using mock data
      // const response = await fetch("/api/auth/permissions");
      // const data = await response.json();

      // Mock data - replace with real API call
      setState({
        role: "admin",
        customPermissions: [],
        orgId: "mock-org-id",
        userId: "mock-user-id",
        loading: false,
      });
    } catch (error) {
      console.error("Error loading permissions:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }

  useEffect(() => {
    loadPermissions();
  }, []);

  const value: PermissionsContextType = {
    ...state,
    can: (permission: Permission) =>
      hasPermission(state.role, permission, state.customPermissions),
    canAny: (permissions: Permission[]) =>
      hasAnyPermission(state.role, permissions, state.customPermissions),
    canAll: (permissions: Permission[]) =>
      hasAllPermissions(state.role, permissions, state.customPermissions),
    getAllPermissions: () =>
      getPermissions(state.role, state.customPermissions),
    refresh: loadPermissions,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

/**
 * Hook for using permissions in components
 * 
 * @example
 * const { can, canAny, role } = usePermissions();
 * 
 * if (can("bookings:create")) {
 *   // Show create button
 * }
 */
export function usePermissions() {
  const context = useContext(PermissionsContext);
  
  if (!context) {
    throw new Error("usePermissions must be used within PermissionsProvider");
  }
  
  return context;
}

/**
 * Component for conditional rendering based on permissions
 * 
 * @example
 * <Can permission="bookings:create">
 *   <button>Create Booking</button>
 * </Can>
 * 
 * <Can anyOf={["bookings:create", "bookings:edit"]}>
 *   <button>Edit or Create</button>
 * </Can>
 * 
 * <Can allOf={["bookings:edit", "customers:view"]}>
 *   <button>Special Action</button>
 * </Can>
 * 
 * <Can permission="admin:panel" fallback={<div>No access</div>}>
 *   <AdminPanel />
 * </Can>
 */
export function Can({
  permission,
  anyOf,
  allOf,
  fallback,
  children,
}: {
  permission?: Permission;
  anyOf?: Permission[];
  allOf?: Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (anyOf) {
    hasAccess = canAny(anyOf);
  } else if (allOf) {
    hasAccess = canAll(allOf);
  }

  if (!hasAccess) {
    return fallback || null;
  }

  return <>{children}</>;
}

/**
 * Higher-order component for protecting components with permissions
 * 
 * @example
 * export default withPermission(MyComponent, "bookings:create");
 * 
 * export default withPermission(
 *   MyComponent,
 *   "bookings:create",
 *   <div>No access</div>
 * );
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission | Permission[],
  fallback?: ReactNode
) {
  return function ProtectedComponent(props: P) {
    const { can, canAny } = usePermissions();

    const hasAccess = Array.isArray(permission)
      ? canAny(permission)
      : can(permission);

    if (!hasAccess) {
      return fallback || null;
    }

    return <Component {...props} />;
  };
}

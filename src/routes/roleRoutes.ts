export const ROLE_HOME_ROUTE: Record<string, string> = {
  Admin: "/",
  Manager: "/manager/dashboard",
  User: "/dashboard",
};

export const getHomeRouteByRole = (role?: string) => {
  if (!role) return "/login";
  return ROLE_HOME_ROUTE[role] || "/";
};
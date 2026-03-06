import { getHomeRouteByRole } from "../routes/roleRoutes";

export const navigateByRole = (
  role: string | null,
  navigate: (path: string) => void
) => {
  const route = getHomeRouteByRole(role || undefined);
  navigate(route);
};
import { useLocation } from "react-router"

export function useQueryString(names?: string[]): Record<string, string | null> {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const res: Record<string, string | null> = Object.create(null);
  if (names && names.length) {
    names.forEach((name) => {
      res[name] = query.get(name)
    });
  } else {
    query.forEach((value, key) => {
      res[key] = value;
    })
  }

  return res;
}

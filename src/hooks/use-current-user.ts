import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth.functions";

export const currentUserQueryKey = ["current-user"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: () => getCurrentUser(),
    staleTime: 60_000,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      qc.setQueryData(currentUserQueryKey, null);
      qc.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}

import type { ScreeningSession } from "@/types";

export function calculateScreeningTotal(
  session?: Pick<ScreeningSession, "responses">,
) {
  if (!session) return null;

  return session.responses.reduce(
    (total, response) => total + (response.score ?? 0),
    0,
  );
}

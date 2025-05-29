import { router } from "../trpc";
import { personRouter } from "./person";

export const appRouter = router({
  person: personRouter,
});

export type AppRouter = typeof appRouter;

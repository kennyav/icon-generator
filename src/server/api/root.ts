import { createTRPCRouter } from "~/server/api/trpc";
import { generateRouter } from "~/server/api/routers/generate";
import { generatePixarRouter } from "~/server/api/routers/generatePixar";
import { checkoutRouter } from "~/server/api/routers/checkout";
import { iconsRouter } from "~/server/api/routers/icons";
import { userRouter } from "~/server/api/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  generate: generateRouter,
  generatePixar: generatePixarRouter,
  checkout: checkoutRouter,
  icons: iconsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

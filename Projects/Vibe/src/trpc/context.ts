import { auth } from "@clerk/nextjs/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createTRPCContext(opts: FetchCreateContextFnOptions) {
  return {
    ...opts,
    auth: auth(),
  };
}
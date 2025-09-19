import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";
import {
  createTRPCProxyClient,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { type AppRouter } from "./routers/_app";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });

export const createClient = (headers: Headers) =>
  createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      unstable_httpBatchStreamLink({
        url: `${getBaseUrl()}/api/trpc`,
        headers() {
          return {
            ...Object.fromEntries(headers),
            "x-trpc-source": "rsc-http",
          };
        },
      }),
    ],
  });
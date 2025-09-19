import { serve } from "injest/next";
import { ingest } from "@/injest/client";
import { codeAgentFunction } from "@/injest/functions";

export const { GET, POST, PUT } = serve({
  client: ingest,
  functions: [codeAgentFunction],
});
/**
 * Dashboard data is now backed by the `workflow_insights` table.
 * See `src/lib/insights.functions.ts` for the server query.
 * This file is intentionally minimal — UI components fetch via TanStack
 * Query and split rows by `type`.
 */
export type Quote = { text: string; who: string };
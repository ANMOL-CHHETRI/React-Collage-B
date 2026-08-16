export interface PaginationParams {
  limit: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    limit: number;
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export function parsePaginationParams(query: Record<string, unknown>): PaginationParams {
  const rawLimit = Number(query.limit);
  const limit = isNaN(rawLimit) || rawLimit <= 0 ? 20 : Math.min(rawLimit, 100);
  const cursor = typeof query.cursor === "string" && query.cursor.trim() ? query.cursor.trim() : undefined;

  return { limit, cursor };
}

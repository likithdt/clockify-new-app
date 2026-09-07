import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema";

export * from "./schema";

export type DbClient = ReturnType<typeof createDbClient>;

export function createDbClient(connectionStringOrConfig?: string | PoolConfig) {
  const config: PoolConfig =
    typeof connectionStringOrConfig === "string"
      ? { connectionString: connectionStringOrConfig }
      : connectionStringOrConfig || {
          connectionString:
            process.env.DATABASE_URL ||
            "postgresql://postgres:postgres@localhost:5432/clockify",
        };

  const pool = new Pool(config);
  return drizzle(pool, { schema });
}

export const db = createDbClient();

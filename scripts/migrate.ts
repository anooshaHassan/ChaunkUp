import fs from "fs/promises";
import path from "path";
import { pool } from "../src/lib/db";

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), "db/migrations");
  const entries = await fs.readdir(migrationsDir);
  const files = entries
    .filter((name) => name.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migrations found.");
    return;
  }

  console.log(`Applying ${files.length} migration(s)...`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, "utf8");
    await pool.query(sql);
    console.log(`Applied: ${file}`);
  }
}

runMigrations()
  .then(() => {
    console.log("Migrations finished.");
    return pool.end();
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    pool.end().finally(() => process.exit(1));
  });

import * as pg from "pg";
const { Pool } = pg.default;

const pool = new Pool({
  connectionString: "postgresql://postgres:080425@localhost:5432/idcapp",
});

export { pool };
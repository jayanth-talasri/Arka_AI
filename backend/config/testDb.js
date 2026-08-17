const pool = require("./config/db");

app.get("/test-db", async (req, res) => {
    try {
        const dbInfo = await pool.query(`
            SELECT
                current_database() AS database,
                current_schema() AS schema,
                current_user AS user
        `);

        const tables = await pool.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        const users = await pool.query(`
            SELECT id, name, email, created_at
            FROM public.users
            ORDER BY id ASC
        `);

        res.json({
            status: "Database connection successful",

            database: dbInfo.rows[0],

            tables: tables.rows,

            users: users.rows
        });

    } catch (error) {

        console.error("DATABASE TEST ERROR:", error);

        res.status(500).json({
            status: "Database connection failed",
            error: error.message
        });
    }
});
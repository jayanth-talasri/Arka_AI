require("dotenv").config();

const pool = require("./db");

async function testDatabase() {

    try {

        const result = await pool.query(`
            SELECT 
                current_database() AS database,
                current_user AS user,
                NOW() AS time
        `);

        console.log("=================================");
        console.log("✅ PostgreSQL connection successful");
        console.log("Database:", result.rows[0].database);
        console.log("User:", result.rows[0].user);
        console.log("Time:", result.rows[0].time);
        console.log("=================================");

    } catch (error) {

        console.error("❌ PostgreSQL connection failed");
        console.error(error.message);

    } finally {

        await pool.end();

    }
}

testDatabase();
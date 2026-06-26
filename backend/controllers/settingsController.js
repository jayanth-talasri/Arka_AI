const pool = require("../config/db");

// Get settings
const getSettings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT location,
              solar_capacity,
              electricity_rate,
              appliance_info
       FROM user_settings
       WHERE user_id=$1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.json({
        message: "No settings found",
        settings: null
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Save or update settings
const saveSettings = async (req, res) => {
  try {

    const {
      location,
      solar_capacity,
      electricity_rate,
      appliance_info
    } = req.body;

    const existing = await pool.query(
      "SELECT * FROM user_settings WHERE user_id=$1",
      [req.user.id]
    );

    if (existing.rows.length === 0) {

      await pool.query(
        `INSERT INTO user_settings
        (user_id,location,solar_capacity,electricity_rate,appliance_info)
        VALUES($1,$2,$3,$4,$5)`,
        [
          req.user.id,
          location,
          solar_capacity,
          electricity_rate,
          appliance_info
        ]
      );

    } else {

      await pool.query(
        `UPDATE user_settings
        SET location=$1,
            solar_capacity=$2,
            electricity_rate=$3,
            appliance_info=$4,
            updated_at=CURRENT_TIMESTAMP
        WHERE user_id=$5`,
        [
          location,
          solar_capacity,
          electricity_rate,
          appliance_info,
          req.user.id
        ]
      );

    }

    res.json({
      message: "Settings saved successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  getSettings,
  saveSettings
};
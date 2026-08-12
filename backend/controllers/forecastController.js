const getForecast = async (req, res) => {
    try {

        res.json({
            success: true,
            message: "Forecast endpoint ready"
        });

    } catch (error) {

        console.error("Forecast error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch forecast"
        });
    }
};


module.exports = {
    getForecast
};
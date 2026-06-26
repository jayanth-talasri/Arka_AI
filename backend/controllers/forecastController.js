const getForecast = async (req, res) => {

    try {

        const forecast = [

            {
                time: "8 AM",
                energy: 2.4
            },

            {
                time: "10 AM",
                energy: 5.1
            },

            {
                time: "12 PM",
                energy: 8.7
            },

            {
                time: "2 PM",
                energy: 7.3
            },

            {
                time: "4 PM",
                energy: 4.2
            }

        ];

        res.status(200).json(forecast);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    getForecast
};
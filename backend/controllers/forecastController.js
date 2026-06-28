const getForecast = async (req, res) => {

    try {

        const forecast = {

            summary: {
                generation: 26.4,
                peakTime: "12 PM - 2 PM",
                savings: 58
            },

            hourlyForecast: [

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

            ],

            dailyForecast: [

                { day: "Mon", energy: 18.4 },
                { day: "Tue", energy: 20.1 },
                { day: "Wed", energy: 19.5 },
                { day: "Thu", energy: 22.0 },
                { day: "Fri", energy: 21.4 }

            ],

            weeklyForecast: [

                { week: "Week 1", energy: 140 },
                { week: "Week 2", energy: 148 },
                { week: "Week 3", energy: 152 },
                { week: "Week 4", energy: 146 }

            ]

        };

        res.status(200).json(forecast);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    getForecast
};
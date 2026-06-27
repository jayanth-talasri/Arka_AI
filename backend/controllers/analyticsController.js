const getAnalytics = async (req, res) => {
  try {

    const analytics = {

      summary: {
        todayGeneration: 18.2,
        monthlyGeneration: 542.8,
        savings: 1245,
        carbonSaved: 285
      },

      dailyForecast: [
        { time: "8 AM", energy: 2.1 },
        { time: "10 AM", energy: 5.3 },
        { time: "12 PM", energy: 8.4 },
        { time: "2 PM", energy: 7.2 },
        { time: "4 PM", energy: 4.0 }
      ],

      monthlyEnergy: [
        { month: "Jan", energy: 420 },
        { month: "Feb", energy: 480 },
        { month: "Mar", energy: 510 },
        { month: "Apr", energy: 540 },
        { month: "May", energy: 570 },
        { month: "Jun", energy: 600 }
      ]

    };

    res.status(200).json(analytics);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = {
  getAnalytics
};
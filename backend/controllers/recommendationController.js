const getRecommendations = async (req, res) => {
  try {

    const recommendations = [
      {
        id: 1,
        title: "Run Washing Machine",
        description: "Operate between 11 AM and 2 PM for maximum solar usage.",
        priority: "High"
      },
      {
        id: 2,
        title: "Charge Electric Vehicle",
        description: "Charge during peak solar generation to reduce grid usage.",
        priority: "Medium"
      },
      {
        id: 3,
        title: "Avoid Heavy Loads",
        description: "Limit appliance usage after 6 PM to reduce electricity costs.",
        priority: "Low"
      }
    ];

    res.status(200).json(recommendations);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  getRecommendations
};
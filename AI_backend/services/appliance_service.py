import numpy as np


def appliance_schedule(prediction):

    # =====================================
    # CONVERT PREDICTION TO SINGLE FLOAT
    # =====================================

    if isinstance(prediction, np.ndarray):

        if prediction.size == 0:
            prediction_value = 0.0
        else:
            prediction_value = float(
                prediction.flatten()[0]
            )

    elif isinstance(prediction, list):

        if len(prediction) == 0:
            prediction_value = 0.0
        else:
            prediction_value = float(
                prediction[0]
            )

    else:
        prediction_value = float(
            prediction
        )

    # =====================================
    # APPLIANCE RECOMMENDATIONS
    # =====================================

    if prediction_value >= 6:

        return {

            "status": "Excellent",

            "best_time":
                "10:00 AM - 3:00 PM",

            "recommended": [

                "Air Conditioner",

                "Washing Machine",

                "Water Pump",

                "Electric Vehicle Charging",

                "Dishwasher"

            ]

        }

    elif prediction_value >= 4:

        return {

            "status": "Average",

            "best_time":
                "11:00 AM - 2:00 PM",

            "recommended": [

                "Washing Machine",

                "Laptop Charging",

                "Water Pump"

            ]

        }

    else:

        return {

            "status": "Poor",

            "best_time":
                "12:00 PM",

            "recommended": [

                "Mobile Charging",

                "LED Lights"

            ]

        }
def appliance_schedule(prediction):

    if prediction >= 6:

        return {

            "status": "Excellent",

            "best_time": "10:00 AM - 3:00 PM",

            "recommended": [

                "Air Conditioner",

                "Washing Machine",

                "Water Pump",

                "Electric Vehicle Charging",

                "Dishwasher"

            ]
        }

    elif prediction >= 4:

        return {

            "status": "Average",

            "best_time": "11:00 AM - 2:00 PM",

            "recommended": [

                "Washing Machine",

                "Laptop Charging",

                "Water Pump"

            ]
        }

    else:

        return {

            "status": "Poor",

            "best_time": "12:00 PM",

            "recommended": [

                "Mobile Charging",

                "LED Lights"

            ]
        }
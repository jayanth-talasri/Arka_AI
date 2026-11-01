def appliance_schedule(average_radiation):
    radiation = float(average_radiation)
    if radiation >= 6:
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
    elif radiation >= 5:
        return {
            "status": "Good",
            "best_time": "10:00 AM - 2:00 PM",
            "recommended": [
                "Washing Machine",
                "Water Pump",
                "Laptop Charging"
            ]
        }
    elif radiation >= 4:
        return {
            "status": "Average",
            "best_time": "11:00 AM - 2:00 PM",
            "recommended": [
                "Laptop Charging",
                "Mobile Charging",
                "Water Pump"
            ]
        }
    return {
        "status": "Poor",
        "best_time": "12:00 PM - 1:00 PM",
        "recommended": [
            "Mobile Charging",
            "LED Lights"
        ]
    }
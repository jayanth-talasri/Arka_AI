def carbon_impact(prediction):

    daily_energy = prediction * 5

    yearly_energy = daily_energy * 365

    co2_saved = yearly_energy * 0.82 / 365

    trees = co2_saved / 15.7

    coal = co2_saved * 0.42

    petrol = co2_saved * 0.39

    return {

        "daily_co2_saved": round(co2_saved,2),

        "yearly_co2_saved": round(co2_saved*365,2),

        "trees_equivalent": round(trees,2),

        "coal_saved": round(coal,2),

        "petrol_saved": round(petrol,2)

    }
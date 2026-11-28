
import json
import math

from services.solar_timing_service import (
    get_solar_times,
    get_hourly_solar_profile,
    build_solar_window,
    format_minutes,
    parse_target_date
)


PERFORMANCE_RATIO = 0.80


# Estimated appliance ratings.
# These are defaults, not measured values from the user's home.
APPLIANCE_PROFILES = {
    "electric vehicle": {
        "power_kw": 3.3,
        "duration_hours": 2,
        "priority": 1
    },
    "ev charger": {
        "power_kw": 3.3,
        "duration_hours": 2,
        "priority": 1
    },
    "water heater": {
        "power_kw": 2.0,
        "duration_hours": 1,
        "priority": 2
    },
    "electric stove": {
        "power_kw": 2.0,
        "duration_hours": 1,
        "priority": 2
    },
    "oven": {
        "power_kw": 2.5,
        "duration_hours": 1,
        "priority": 2
    },
    "dishwasher": {
        "power_kw": 1.8,
        "duration_hours": 1,
        "priority": 3
    },
    "air conditioner": {
        "power_kw": 1.5,
        "duration_hours": 1,
        "priority": 3
    },
    "washing machine": {
        "power_kw": 0.8,
        "duration_hours": 1,
        "priority": 4
    },
    "water pump": {
        "power_kw": 0.75,
        "duration_hours": 1,
        "priority": 4
    },
    "microwave": {
        "power_kw": 1.2,
        "duration_hours": 1,
        "priority": 4
    },
    "ceiling fan": {
        "power_kw": 0.075,
        "duration_hours": 1,
        "priority": 5
    },
    "fan": {
        "power_kw": 0.075,
        "duration_hours": 1,
        "priority": 5
    },
    "lighting": {
        "power_kw": 0.1,
        "duration_hours": 1,
        "priority": 5
    },
    "led": {
        "power_kw": 0.05,
        "duration_hours": 1,
        "priority": 5
    },
    "laptop": {
        "power_kw": 0.065,
        "duration_hours": 1,
        "priority": 5
    },
    "mobile": {
        "power_kw": 0.02,
        "duration_hours": 1,
        "priority": 5
    },
    "phone": {
        "power_kw": 0.02,
        "duration_hours": 1,
        "priority": 5
    }
}


def parse_appliances(value):
    if not value:
        return []

    if isinstance(value, list):
        items = value
    else:
        raw = str(value).strip()

        try:
            parsed = json.loads(raw)
            items = parsed if isinstance(parsed, list) else raw.split(",")
        except (ValueError, TypeError):
            items = raw.split(",")

    result = []
    seen = set()

    for item in items:
        name = str(item).strip()

        if name and name.casefold() not in seen:
            seen.add(name.casefold())
            result.append(name)

    return result


def get_appliance_profile(name):
    normalized = name.casefold()

    for keyword, profile in APPLIANCE_PROFILES.items():
        if keyword in normalized:
            return {
                **profile,
                "estimated": False
            }

    # Unknown appliances use a conservative default.
    return {
        "power_kw": 1.0,
        "duration_hours": 1,
        "priority": 4,
        "estimated": True
    }


def get_status(radiation):
    if radiation >= 6:
        return "Excellent"

    if radiation >= 5:
        return "Good"

    if radiation >= 4:
        return "Average"

    return "Poor"


def get_candidate_windows(samples, duration_hours):
    candidates = []

    for index in range(len(samples) - duration_hours + 1):
        window = samples[index:index + duration_hours]

        # A schedule must use consecutive hourly intervals.
        consecutive = all(
            window[position + 1]["minute"]
            - window[position]["minute"] == 60
            for position in range(len(window) - 1)
        )

        if consecutive:
            candidates.append(window)

    return candidates


def schedule_one_appliance(
    appliance,
    profile,
    available_solar
):
    required_power = profile["power_kw"]
    duration = profile["duration_hours"]

    candidates = get_candidate_windows(
        available_solar,
        duration
    )

    suitable_windows = []

    for window in candidates:
        if all(
            sample["available_kw"] >= required_power
            for sample in window
        ):
            # Prefer the window with the greatest available solar power.
            score = sum(
                sample["available_kw"]
                for sample in window
            ) / duration

            suitable_windows.append((score, window))

    if not suitable_windows:
        return None

    suitable_windows.sort(
        key=lambda item: item[0],
        reverse=True
    )

    _, selected_window = suitable_windows[0]

    start = selected_window[0]["minute"]
    end = selected_window[-1]["minute"] + 60

    # Reserve the power used by this appliance.
    for sample in selected_window:
        sample["available_kw"] = round(
            max(0, sample["available_kw"] - required_power),
            3
        )

    return {
        "appliance": appliance,
        "best_time": (
            f"{format_minutes(start)} - "
            f"{format_minutes(end)}"
        ),
        "start_time": format_minutes(start),
        "end_time": format_minutes(end),
        "estimated_power_kw": round(required_power, 2),
        "duration_hours": duration,
        "estimated_energy_kwh": round(
            required_power * duration,
            2
        ),
        "status": (
            "Estimated rating"
            if profile["estimated"]
            else "Recommended"
        ),
        "rating_is_estimated": profile["estimated"]
    }


def appliance_schedule(
    average_radiation,
    appliance_info="",
    solar_capacity=1.0,
    latitude=0.0,
    longitude=0.0,
    target_date=None,
    electricity_rate=8.0
):
    capacity = float(solar_capacity)
    tariff = float(electricity_rate)

    if not math.isfinite(capacity) or capacity <= 0:
        raise ValueError("Invalid solar capacity.")

    if not math.isfinite(tariff) or tariff < 0:
        raise ValueError("Invalid electricity tariff.")

    if not target_date:
        raise ValueError("Target date is required.")

    selected_date = parse_target_date(target_date)

    selected_appliances = parse_appliances(appliance_info)

    if not selected_appliances:
        raise ValueError(
            "No appliances are configured in user settings."
        )

    solar = get_solar_times(
        latitude,
        longitude,
        selected_date
    )

    notes = []
    recommended = []
    not_recommended = []
    appliance_schedules = []

    try:
        profile = get_hourly_solar_profile(
            latitude,
            longitude,
            selected_date
        )

    except Exception as error:
        print("HOURLY SOLAR PROFILE ERROR:", str(error))

        profile = None

    if profile:
        # Open-Meteo hourly shortwave radiation is in W/m².
        # Sum of hourly averages / 1000 approximates daily kWh/m².
        radiation = profile["daily_radiation_kwh_m2"]

        available_solar = []

        for sample in profile["samples"]:
            available_kw = (
                capacity
                * (sample["radiation_wm2"] / 1000)
                * PERFORMANCE_RATIO
            )

            available_solar.append({
                "minute": sample["minute"],
                "radiation_wm2": sample["radiation_wm2"],
                "available_kw": round(available_kw, 3)
            })

        # Allocate the highest-power appliances first.
        appliance_queue = []

        for appliance in selected_appliances:
            appliance_profile = get_appliance_profile(appliance)

            appliance_queue.append({
                "name": appliance,
                "profile": appliance_profile
            })

        appliance_queue.sort(
            key=lambda item: (
                -item["profile"]["power_kw"],
                item["profile"]["priority"]
            )
        )

        for item in appliance_queue:
            appliance = item["name"]
            appliance_profile = item["profile"]

            schedule = schedule_one_appliance(
                appliance,
                appliance_profile,
                available_solar
            )

            if schedule:
                recommended.append(appliance)
                appliance_schedules.append(schedule)

                if schedule["rating_is_estimated"]:
                    notes.append(
                        f"{appliance}: Appliance power rating is "
                        "estimated. Update it with the actual rating "
                        "for more accurate scheduling."
                    )

            else:
                not_recommended.append(appliance)

                notes.append(
                    f"{appliance}: No continuous solar window "
                    "has enough available power for its estimated "
                    "operating duration on this date."
                )

        source = profile["source"]

        solar_window = build_solar_window(
            solar,
            profile
        )

    else:
        # Never invent an hourly schedule when hourly data is unavailable.
        radiation = (
            float(average_radiation)
            if average_radiation is not None
            else 0.0
        )

        if not math.isfinite(radiation) or radiation < 0:
            radiation = 0.0

        not_recommended = selected_appliances.copy()

        source = "Hourly solar data unavailable"

        solar_window = build_solar_window(solar)

        notes.append(
            "Hourly solar radiation data was unavailable for "
            "this date. Individual appliance schedules were "
            "not generated to avoid presenting estimated times "
            "as actual solar availability."
        )

    estimated_energy = (
        radiation * capacity * PERFORMANCE_RATIO
    )

    estimated_savings = estimated_energy * tariff

    if not recommended:
        notes.append(
            "No configured appliance could be scheduled using "
            "the available solar capacity. Consider grid-supported "
            "operation if an appliance is essential."
        )

    # Keep the legacy field for existing frontend compatibility.
    best_time = (
        "See individual appliance schedules"
        if appliance_schedules
        else "No suitable solar schedule available"
    )

    return {
        "status": get_status(radiation),
        "date": selected_date.isoformat(),
        "predicted_radiation": round(radiation, 3),
        "radiation_unit": "kWh/m2/day",
        "best_time": best_time,
        "solar_window": solar_window,
        "recommended": recommended,
        "not_recommended": not_recommended,
        "appliance_schedules": appliance_schedules,
        "recommendation_notes": notes,
        "estimated_energy": round(estimated_energy, 2),
        "estimated_savings": round(estimated_savings, 2),
        "solar_data_source": source
    }

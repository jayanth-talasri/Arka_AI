from datetime import datetime

def round_float(value, digits=2):
    return round(float(value), digits)

def parse_date(date_string):
    return datetime.strptime(date_string, "%Y%m%d")

def success_response(data):
    return {
        "success": True,
        "data": data
    }

def error_response(message):
    return {
        "success": False,
        "message": message
    }
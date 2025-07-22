from datetime import datetime, date, time

def date_to_datetime(start_date, end_date):
    start_datetime = datetime.combine(start_date, time(0, 0))
    end_datetime = datetime.combine(end_date, time(23, 59))

    return start_datetime, end_datetime

def datetime_to_unixtime(start_date, end_date):
    start_unixtime = int(start_date.timestamp())
    end_unixtime = int(end_date.timestamp())

    return start_unixtime, end_unixtime

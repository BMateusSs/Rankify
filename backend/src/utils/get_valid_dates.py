from datetime import datetime, date, timedelta

def first_friday(register_date):
    days_to_go_back = (register_date.weekday() - 4) % 7
    date = register_date - timedelta(days=days_to_go_back)
    return date

def date_intervals(register_date, today):
    friday = first_friday(register_date)
    weeks = []
    
    while True:
        thursday = friday + timedelta(days=6) 
        if thursday >= today:
            break
        
        weeks.append((friday, thursday))
        friday = thursday + timedelta(days=1)
        
        
    return weeks
    
if __name__ == '__main__':
    thursday = date(2025, 6, 29)
    today = date(2025, 7, 21)
    date_intervals(thursday, today)

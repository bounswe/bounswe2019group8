import re


def clear_value(s):
    s = s.strip()
    if s == "&nbsp;":
        return ""

    return s


def search_captured(pattern, s):
    res = re.search(pattern, s)

    if res is None:
        return ""

    return res.group(1)


def parse_event_data(data, date):
    events = []

    for match in re.finditer(r"<tr\s*id=\"eventRowId_(.*?)\".*?>.*?</tr>", data):
        row = match.group(0)

        event_datetime = search_captured(r"data-event-datetime=\"(.*?)\"", row).split(" ")

        events.append({
            "id": f"{match.group(1)}_{date}",
            "country": search_captured(r"\"ceFlags (.*?)\"", row),
            "time": event_datetime[1][0:5] if len(event_datetime) > 1 else "",
            "value": clear_value(search_captured(r"id=\"eventActual_\d+\">(.*?)</td>", row)),
            "predicted": clear_value(search_captured(r"id=\"eventForecast_\d+\">(.*?)</td>", row)),
            "name": search_captured(r"data-name\s*=\"(.*?)\"", row),
            "importance": search_captured(r"data-img_key=\"bull(\d)\"", row),
            "date": date
        })

    return events

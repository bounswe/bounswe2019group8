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

        events.append({
            "id": match.group(1),
            "country": search_captured(r"title=\"(.*?)\"\s+class=\"ceFlags", row),
            "time": search_captured(r"js-time\"\s*>(.*?)</td>", row),
            "value": clear_value(search_captured(r"id=\"eventActual_\d+\">(.*?)</td>", row)),
            "predicted": clear_value(search_captured(r"id=\"eventForecast_\d+\">(.*?)</td>", row)),
            "name": search_captured(r"data-name\s*=\"(.*?)\"", row),
            "importance": search_captured(r"data-img_key=\"bull(\d)\"", row),
            "date": date
        })

    return events

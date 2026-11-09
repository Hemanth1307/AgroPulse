
import requests
from datetime import datetime, timedelta, timezone

CMR_URL = "https://cmr.earthdata.nasa.gov/search/granules.json"


def get_smap_data(latitude, longitude):

    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=7)

    params = {
        "short_name": "SPL3SMP",
        "version": "009",
        "point": f"{longitude},{latitude}",
        "temporal": (
            f"{start_date.strftime('%Y-%m-%dT%H:%M:%SZ')},"
            f"{end_date.strftime('%Y-%m-%dT%H:%M:%SZ')}"
        ),
        "page_size": 3,
        "sort_key": "-start_date"
    }

    response = requests.get(
        CMR_URL,
        params=params,
        timeout=(10, 60)
    )

    response.raise_for_status()

    granules = response.json().get("feed", {}).get("entry", [])

    results = []

    for item in granules:
        results.append({
            "id": item.get("id"),
            "title": item.get("title"),
            "date": item.get("time_start"),
            "collection": "NASA SMAP SPL3SMP",
            "source": "NASA Earthdata CMR"
        })

    return {
        "success": True,
        "source": "NASA SMAP",
        "data_type": "Satellite product metadata",
        "products_found": len(results),
        "products": results,
        "resolution_note": (
            "SMAP observations have coarse spatial resolution. "
            "They must not be interpreted as 10 m farm measurements."
        )
    }

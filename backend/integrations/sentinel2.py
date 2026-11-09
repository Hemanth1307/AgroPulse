
import os
import requests
from datetime import datetime, timedelta, timezone

CATALOG_URL = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"


def get_sentinel2_data(latitude, longitude):

    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=30)

    start_time = start_date.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    end_time = end_date.strftime("%Y-%m-%dT%H:%M:%S.999Z")

    # Search within an approximate 5 km area.
    # This is a discovery area, not the exact farm boundary.
    point = (
        f"POINT({longitude} {latitude})"
    )

    params = {
        "$filter": (
            "Collection/Name eq 'SENTINEL-2' "
            "and Attributes/OData.CSC.StringAttribute/any("
            "att:att/Name eq 'productType' and "
            "att/OData.CSC.StringAttribute/Value eq 'S2MSI2A') "
            f"and ContentDate/Start gt {start_time} "
            f"and ContentDate/Start lt {end_time} "
            f"and OData.CSC.Intersects(area=geography'SRID=4326;{point}')"
        ),
        "$orderby": "ContentDate/Start desc",
        "$top": 5,
        "$expand": "Attributes"
    }

    response = requests.get(
        CATALOG_URL,
        params=params,
        timeout=30
    )

    response.raise_for_status()

    products = response.json().get("value", [])

    results = []

    for product in products:
        results.append({
            "id": product.get("Id"),
            "name": product.get("Name"),
            "date": product.get("ContentDate", {}).get("Start"),
            "collection": "Sentinel-2",
            "processing_level": "Level-2A",
            "source": "Copernicus Data Space"
        })

    return {
        "success": True,
        "source": "Copernicus Sentinel-2",
        "data_type": "Satellite product metadata",
        "products_found": len(results),
        "products": results
    }

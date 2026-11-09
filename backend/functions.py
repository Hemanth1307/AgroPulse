from database import get_db_connection


def add_farm(farmer_name, farm_name, location, latitude,
             longitude, crop_name, area_acres):

    conn = get_db_connection()

    cursor = conn.execute("""
        INSERT INTO farms (
            farmer_name, farm_name, location,
            latitude, longitude, crop_name, area_acres
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        farmer_name, farm_name, location,
        latitude, longitude, crop_name, area_acres
    ))

    farm_id = cursor.lastrowid

    conn.execute("""
        INSERT INTO irrigation_settings (farm_id)
        VALUES (?)
    """, (farm_id,))

    conn.commit()
    conn.close()

    return farm_id


def get_all_farms():
    conn = get_db_connection()

    farms = conn.execute("""
        SELECT * FROM farms
    """).fetchall()

    conn.close()

    return [dict(farm) for farm in farms]


def get_irrigation_settings(farm_id):
    conn = get_db_connection()

    settings = conn.execute("""
        SELECT * FROM irrigation_settings
        WHERE farm_id = ?
    """, (farm_id,)).fetchone()

    if not settings:
        farm = conn.execute(
            "SELECT id FROM farms WHERE id = ?", (farm_id,)
        ).fetchone()

        if farm:
            conn.execute("""
                INSERT INTO irrigation_settings (farm_id)
                VALUES (?)
            """, (farm_id,))

            conn.commit()

            settings = conn.execute("""
                SELECT * FROM irrigation_settings
                WHERE farm_id = ?
            """, (farm_id,)).fetchone()

    conn.close()

    return dict(settings) if settings else None


def update_irrigation_settings(
    farm_id, kc, moisture, emitter_flow,
    emitter_count, efficiency
):
    conn = get_db_connection()

    conn.execute("""
        UPDATE irrigation_settings
        SET kc = ?,
            root_zone_moisture = ?,
            emitter_flow = ?,
            emitter_count = ?,
            efficiency = ?
        WHERE farm_id = ?
    """, (
        kc, moisture, emitter_flow,
        emitter_count, efficiency, farm_id
    ))

    conn.commit()
    conn.close()


def record_irrigation(farm_id, action, reason):
    conn = get_db_connection()

    conn.execute("""
        INSERT INTO irrigation_history (
            farm_id, action, reason
        )
        VALUES (?, ?, ?)
    """, (farm_id, action, reason))

    conn.commit()
    conn.close()


def get_irrigation_history(farm_id):
    conn = get_db_connection()

    records = conn.execute("""
        SELECT * FROM irrigation_history
        WHERE farm_id = ?
        ORDER BY created_at DESC
        LIMIT 20
    """, (farm_id,)).fetchall()

    conn.close()

    return [dict(record) for record in records]


def set_pump_status(farm_id, status):
    conn = get_db_connection()

    conn.execute("""
        UPDATE irrigation_settings
        SET pump_on = ?
        WHERE farm_id = ?
    """, (1 if status else 0, farm_id))

    conn.commit()
    conn.close()
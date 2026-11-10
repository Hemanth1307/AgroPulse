import time
from database import get_db_connection


def add_farm(farmer_name, farm_name, location, latitude, longitude, crop_name, area_acres):
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            INSERT INTO farms (
                farmer_name, farm_name, location, latitude,
                longitude, crop_name, area_acres
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (farmer_name, farm_name, location, latitude, longitude, crop_name, area_acres))
        farm_id = cursor.lastrowid
        conn.execute("""
            INSERT OR IGNORE INTO irrigation_settings (farm_id) VALUES (?)
        """, (farm_id,))
        conn.commit()
        return farm_id
    finally:
        conn.close()


def get_all_farms():
    conn = get_db_connection()
    try:
        rows = conn.execute("SELECT * FROM farms ORDER BY id").fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_irrigation_settings(farm_id):
    conn = get_db_connection()
    try:
        row = conn.execute(
            "SELECT * FROM irrigation_settings WHERE farm_id = ?", (farm_id,)
        ).fetchone()

        if row is None:
            farm = conn.execute(
                "SELECT id FROM farms WHERE id = ?", (farm_id,)
            ).fetchone()
            if farm:
                conn.execute(
                    "INSERT OR IGNORE INTO irrigation_settings (farm_id) VALUES (?)",
                    (farm_id,)
                )
                conn.commit()
                row = conn.execute(
                    "SELECT * FROM irrigation_settings WHERE farm_id = ?",
                    (farm_id,)
                ).fetchone()

        return dict(row) if row else None
    finally:
        conn.close()


def update_irrigation_settings(farm_id, kc, moisture, emitter_flow, emitter_count, efficiency):
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            UPDATE irrigation_settings
            SET kc = ?, root_zone_moisture = ?, emitter_flow = ?,
                emitter_count = ?, efficiency = ?
            WHERE farm_id = ?
        """, (kc, moisture, emitter_flow, emitter_count, efficiency, farm_id))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def record_irrigation(farm_id, action, reason):
    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO irrigation_history (farm_id, action, reason)
            VALUES (?, ?, ?)
        """, (farm_id, action, reason))
        conn.commit()
    finally:
        conn.close()


def get_irrigation_history(farm_id):
    conn = get_db_connection()
    try:
        rows = conn.execute("""
            SELECT * FROM irrigation_history
            WHERE farm_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 30
        """, (farm_id,)).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def set_pump_status(farm_id, status):
    conn = get_db_connection()
    try:
        conn.execute("""
            UPDATE irrigation_settings SET pump_on = ?
            WHERE farm_id = ?
        """, (1 if status else 0, farm_id))
        conn.commit()
    finally:
        conn.close()


def start_irrigation_cycle(farm_id, duration_seconds, mode="automatic"):
    duration_seconds = max(1, int(duration_seconds))
    now = time.time()
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            UPDATE irrigation_settings
            SET pump_on = 1, cycle_started_at = ?,
                cycle_duration_seconds = ?, cycle_mode = ?
            WHERE farm_id = ?
        """, (now, duration_seconds, mode, farm_id))
        conn.commit()
        if cursor.rowcount == 0:
            raise ValueError("Irrigation settings were not found for this farm.")
        return now + duration_seconds
    finally:
        conn.close()


def stop_irrigation_cycle(farm_id, reason="Stopped by user", record_history=True):
    conn = get_db_connection()
    try:
        conn.execute("""
            UPDATE irrigation_settings
            SET pump_on = 0, cycle_started_at = NULL,
                cycle_duration_seconds = 0, cycle_mode = 'idle'
            WHERE farm_id = ?
        """, (farm_id,))
        conn.commit()
    finally:
        conn.close()

    if record_history:
        record_irrigation(farm_id, "OFF", reason)


def get_cycle_status(farm_id):
    conn = get_db_connection()
    try:
        row = conn.execute("""
            SELECT pump_on, cycle_started_at,
                   cycle_duration_seconds, cycle_mode
            FROM irrigation_settings
            WHERE farm_id = ?
        """, (farm_id,)).fetchone()
    finally:
        conn.close()

    if row is None:
        return None

    data = dict(row)
    remaining = 0
    if data["pump_on"] and data["cycle_started_at"] is not None:
        elapsed = time.time() - float(data["cycle_started_at"])
        remaining = max(
            0,
            int(float(data["cycle_duration_seconds"]) - elapsed)
        )

    data["pump_on"] = bool(data["pump_on"])
    data["remaining_seconds"] = remaining
    return data


def stop_expired_cycles():
    now = time.time()
    conn = get_db_connection()
    try:
        expired = conn.execute("""
            SELECT farm_id
            FROM irrigation_settings
            WHERE pump_on = 1
              AND cycle_started_at IS NOT NULL
              AND cycle_started_at + cycle_duration_seconds <= ?
        """, (now,)).fetchall()

        farm_ids = [row["farm_id"] for row in expired]

        if farm_ids:
            conn.executemany("""
                UPDATE irrigation_settings
                SET pump_on = 0, cycle_started_at = NULL,
                    cycle_duration_seconds = 0, cycle_mode = 'idle'
                WHERE farm_id = ?
            """, [(farm_id,) for farm_id in farm_ids])

            conn.executemany("""
                INSERT INTO irrigation_history (farm_id, action, reason)
                VALUES (?, 'AUTO_OFF',
                        'Automatic cycle completed; simulated pump stopped')
            """, [(farm_id,) for farm_id in farm_ids])

        conn.commit()
        return farm_ids
    finally:
        conn.close()

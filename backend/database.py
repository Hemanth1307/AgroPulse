import sqlite3

DB_NAME = "agropulse.db"


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS farms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_name TEXT NOT NULL,
            farm_name TEXT NOT NULL,
            location TEXT,
            latitude REAL,
            longitude REAL,
            crop_name TEXT,
            area_acres REAL
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS irrigation_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farm_id INTEGER NOT NULL UNIQUE,
            kc REAL DEFAULT 1.15,
            root_zone_moisture REAL DEFAULT 31,
            field_capacity REAL DEFAULT 38,
            emitter_flow REAL DEFAULT 2,
            emitter_count INTEGER DEFAULT 100,
            efficiency REAL DEFAULT 0.9,
            pump_on INTEGER DEFAULT 0,
            FOREIGN KEY (farm_id) REFERENCES farms(id)
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS irrigation_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farm_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            reason TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farm_id) REFERENCES farms(id)
        )
    """)

    conn.commit()
    conn.close()

    print("Database initialized successfully")
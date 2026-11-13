
import sqlite3

DB_NAME = "agropulse.db"


def get_db_connection():
    conn = sqlite3.connect(DB_NAME, timeout=15)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_db_connection()

    try:
        # Users table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Farms table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS farms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmer_name TEXT NOT NULL,
                farm_name TEXT NOT NULL,
                location TEXT,
                latitude REAL,
                longitude REAL,
                crop_name TEXT,
                area_acres REAL,
                user_id INTEGER REFERENCES users(id)
            )
        """)

        # Irrigation settings
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
                cycle_started_at REAL,
                cycle_duration_seconds INTEGER DEFAULT 0,
                cycle_mode TEXT DEFAULT 'idle',
                FOREIGN KEY (farm_id) REFERENCES farms(id)
            )
        """)

        # Irrigation history
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

        # Crop health records
        conn.execute("""
            CREATE TABLE IF NOT EXISTS crop_health_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farm_id INTEGER NOT NULL,
                variety TEXT,
                growth_stage TEXT,
                health_score INTEGER NOT NULL
                    CHECK (health_score BETWEEN 0 AND 100),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (farm_id) REFERENCES farms(id)
                    ON DELETE CASCADE
            )
        """)

        # Migrate existing databases safely
        farm_columns = {
            row["name"]
            for row in conn.execute("PRAGMA table_info(farms)")
        }

        if "user_id" not in farm_columns:
            conn.execute("""
                ALTER TABLE farms
                ADD COLUMN user_id INTEGER REFERENCES users(id)
            """)

        irrigation_columns = {
            row["name"]
            for row in conn.execute(
                "PRAGMA table_info(irrigation_settings)"
            )
        }

        migrations = {
            "cycle_started_at":
                "ALTER TABLE irrigation_settings ADD COLUMN cycle_started_at REAL",

            "cycle_duration_seconds":
                "ALTER TABLE irrigation_settings ADD COLUMN cycle_duration_seconds INTEGER DEFAULT 0",

            "cycle_mode":
                "ALTER TABLE irrigation_settings ADD COLUMN cycle_mode TEXT DEFAULT 'idle'",
        }

        for column, sql in migrations.items():
            if column not in irrigation_columns:
                conn.execute(sql)

        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_farms_user_id
            ON farms(user_id)
        """)

        conn.commit()
        print("Database initialized successfully")

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()

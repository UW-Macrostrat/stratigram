from datetime import datetime, timedelta
from os import environ
from sys import stdout

from dotenv import load_dotenv
from macrostrat.database import Database
from macrostrat.database.utils import wait_for_database
from macrostrat.utils import cmd, relative_path, working_directory
from typer import Typer
from subprocess import Popen

# Config loading

here = relative_path(__file__)
root = (here / "../..").resolve()
load_dotenv(root / ".env")

db_url = environ.get("STRATIFORM_DATABASE")

# App
app = Typer()


def compose(*args, **kwargs):
    with working_directory(root):
        cmd("docker compose", *args, **kwargs)


def follow_logs(container=""):
    timestamp = (datetime.now() - timedelta(seconds=1)).isoformat()
    _log_cmd = ["docker", "compose", "logs", "-f", "--since", timestamp, container]

    with working_directory(root):
        cmd(*_log_cmd)


@app.command()
def up():
    compose("up", "-d")

    compose("exec gateway nginx -s reload")

    follow_logs()


@app.command()
def sync():
    schema_dir = root / "schema"
    db = Database(db_url)

    files = list(schema_dir.glob("*.sql"))
    files.sort()
    for fn in files:
        db.exec_sql(fn)

    db.session.execute("NOTIFY pgrst, 'reload config'")

    # We need to restart the storage API to pick up configuration changes
    compose("restart storage_api")


@app.command()
def down():
    compose("down")


if __name__ == "__main__":
    app()

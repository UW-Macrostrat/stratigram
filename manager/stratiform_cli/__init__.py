from datetime import datetime, timedelta
from os import environ
from sys import stdout

from pathlib import Path
from dotenv import load_dotenv
from macrostrat.database import Database
from macrostrat.database.utils import wait_for_database
from macrostrat.utils import cmd, relative_path, working_directory
from typer import Typer
from requests import post
from rich import print
from requests.exceptions import HTTPError
import mimetypes

# Config loading

here = relative_path(__file__)
root = (here / "../..").resolve()
load_dotenv(root / ".env")

db_url = environ.get("STRATIFORM_DATABASE")
api_url = environ.get("STRATIFORM_API")

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
    compose("up", "--build", "-d")

    compose("exec gateway nginx -s reload")
    compose("kill -s SIGUSR1 api")
    compose("restart storage_api")

    follow_logs()


def add_test_data(db: Database, project_name: str, column_name: str, proj_dir: Path):

    files = list(proj_dir.glob("*.sql"))
    files.sort()
    for fn in files:
        db.exec_sql(fn)

    sql = """SELECT b.name FROM storage.buckets b
JOIN stratiform.column c ON b.column_id = c.id
JOIN stratiform.project p ON c.project_id = p.id
WHERE c.name = :column_name AND p.name = :project_name"""

    print(project_name, column_name)

    bucket_name = db.session.execute(
        sql, params=dict(column_name=column_name, project_name=project_name)
    ).scalar()
    print(bucket_name)

    images = []
    for pattern in ["*.jpg", "*.png"]:
        images.extend(list(proj_dir.glob(pattern)))

    for image in images:
        mimetype = mime_type(image.name)
        files = {"file": (image.name, image.open("rb"), mimetype)}
        uri = api_url + f"/api/storage/object/{bucket_name}/{image.name}"
        try:
            res = post(
                uri,
                files=files,
                headers={
                    "Authorization": "Bearer " + environ.get("SERVICE_KEY"),
                },
            )
            res.raise_for_status()
        except HTTPError as err:
            print(err)


@app.command(name="import-test-data")
def import_test_data():
    db = Database(db_url)

    test_data_dir = root / "test-data" / "Zebra-Nappe-Section-J"
    add_test_data(db, "Zebra Nappe", "Section J", test_data_dir)

    test_data_dir = root / "test-data" / "Moynihan-2019"
    add_test_data(db, "Windermere Supergroup", "Section G3", test_data_dir)


@app.command()
def sync():
    schema_dir = root / "schema"
    db = Database(db_url)

    files = list(schema_dir.glob("*.sql"))
    files.sort()
    for fn in files:
        db.exec_sql(fn)

    # Reload API schema cache
    compose("kill -s SIGUSR1 api")

    # We need to restart the storage API to pick up configuration changes
    compose("restart storage_api")


@app.command()
def down():
    compose("down")


if __name__ == "__main__":
    app()


def mime_type(filename):
    return mimetypes.guess_type(filename)[0] or "application/octet-stream"

from datetime import datetime
from os import environ

from dotenv import load_dotenv
from macrostrat.database import Database
from macrostrat.utils import cmd, relative_path, working_directory
from typer import Typer

here = relative_path(__file__)
root = (here / "../..").resolve()
load_dotenv(root / ".env")

app = Typer()


def compose(*args, **kwargs):
    environ["COMPOSE_PROJECT_NAME"] = "stratiform"
    dn = root / "platform"
    with working_directory(dn):
        cmd("docker compose", *args, **kwargs)


@app.command()
def up():
    compose("up", "-d")
    timestamp = datetime.now().isoformat()
    compose("logs", "-f", "--since", timestamp)


@app.command()
def sync():
    schema_dir = root / "schema"
    db = Database(environ.get("STRATIFORM_DATABASE"))

    print(schema_dir)
    files = list(schema_dir.glob("*.sql"))
    print(files)
    for fn in files:
        db.exec_sql(fn)

    db.session.execute("NOTIFY pgrst, 'reload config'")


@app.command()
def down():
    compose("down")


if __name__ == "__main__":
    app()

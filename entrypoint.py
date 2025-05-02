import time
import socket
import subprocess
import sys
import argparse
import os


def wait_for_postgres(host: str, port: int, timeout: int = 60, debug: bool = False):
    start = time.time()
    while True:
        try:
            with socket.create_connection((host, port), timeout=1):
                if debug:
                    print("✅ PostgreSQL is up!")
                return
        except OSError:
            if time.time() - start >= timeout:
                print(f"❌ Timeout after {timeout}s waiting for PostgreSQL at {host}:{port}")
                sys.exit(1)
            if debug:
                print(f"⏳ Waiting for PostgreSQL at {host}:{port}...")
            time.sleep(0.5)


def run_command(command: list[str], debug: bool = False):
    if debug:
        print(f"🔧 Running: {' '.join(command)}")
    try:
        result = subprocess.run(command, check=True, text=True, capture_output=True)
        if debug:
            print(result.stdout)
            if result.stderr:
                print("⚠️ STDERR:", result.stderr)
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {' '.join(command)}")
        print(e.stdout)
        print(e.stderr)
        sys.exit(e.returncode)


def create_superuser(debug: bool = False):
    username = os.getenv("DJANGO_SUPERUSER_USERNAME")
    email = os.getenv("DJANGO_SUPERUSER_EMAIL")
    password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

    if not all([username, email, password]):
        if debug:
            print("⚠️ Δεν ορίστηκαν μεταβλητές περιβάλλοντος για superuser. Παράλειψη δημιουργίας.")
        return

    if debug:
        print(f"👤 Δημιουργία superuser αν δεν υπάρχει ({username})")


    run_command(["python", "backend/create_superuser.py"], debug=debug)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="db")
    parser.add_argument("--port", type=int, default=5432)
    parser.add_argument("--timeout", type=int, default=60)
    parser.add_argument("--manage-path", type=str, default="backend/manage.py")
    parser.add_argument("--debug", action="store_true")
    args = parser.parse_args()

    wait_for_postgres(args.host, args.port, args.timeout, args.debug)

    run_command(["python", args.manage_path, "makemigrations"], debug=args.debug)
    run_command(["python", args.manage_path, "migrate"], debug=args.debug)
    create_superuser(debug=args.debug)
    run_command(["python", args.manage_path, "runserver", "0.0.0.0:8000"], debug=args.debug)

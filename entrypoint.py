#!/usr/bin/env python3
import time
import socket
import subprocess
import sys
import argparse
import os

def print_info(msg): print(f"\033[94m{msg}\033[0m", flush=True)
def print_success(msg): print(f"\033[92m{msg}\033[0m", flush=True)
def print_warn(msg): print(f"\033[93m{msg}\033[0m", flush=True)
def print_error(msg): print(f"\033[91m{msg}\033[0m", flush=True)

def wait_for_postgres(host: str, port: int, timeout: int = 60, debug: bool = False):
    start = time.time()
    while True:
        try:
            with socket.create_connection((host, port), timeout=1):
                if debug:
                    print_success("✅ PostgreSQL is up!")
                return
        except OSError:
            if time.time() - start >= timeout:
                print_error(f"❌ Timeout after {timeout}s waiting for PostgreSQL at {host}:{port}")
                sys.exit(1)
            if debug:
                print_info(f"⏳ Waiting for PostgreSQL at {host}:{port}...")
            time.sleep(0.5)

def run_command(command: list[str], debug: bool = False):
    if debug:
        print_info(f"🔧 Running: {' '.join(command)}")
    try:
        subprocess.run(command, check=True, text=True)
    except subprocess.CalledProcessError as e:
        print_error(f"❌ Command failed: {' '.join(command)}")
        sys.exit(e.returncode)

def create_superuser(debug: bool = False):
    username = os.getenv("DJANGO_SUPERUSER_USERNAME")
    email = os.getenv("DJANGO_SUPERUSER_EMAIL")
    password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

    if not all([username, email, password]):
        if debug:
            print_warn("⚠️ Δεν ορίστηκαν μεταβλητές περιβάλλοντος για superuser. Παράλειψη δημιουργίας.")
        return

    if debug:
        print_info(f"👤 Δημιουργία superuser αν δεν υπάρχει ({username})")

    run_command(["python", "backend/create_superuser.py"], debug=debug)

if __name__ == "__main__":
    print_info("🚀 Εκκίνηση entrypoint.py")

    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="db")
    parser.add_argument("--port", type=int, default=5432)
    parser.add_argument("--timeout", type=int, default=60)
    parser.add_argument("--manage-path", type=str, default="backend/manage.py")
    parser.add_argument("--debug", action="store_true")
    args = parser.parse_args()

    if not os.path.exists(args.manage_path):
        print_error(f"❌ Το αρχείο {args.manage_path} δεν βρέθηκε.")
        sys.exit(1)

    wait_for_postgres(args.host, args.port, args.timeout, args.debug)

    run_command(["python", args.manage_path, "makemigrations"], debug=args.debug)
    run_command(["python", args.manage_path, "migrate"], debug=args.debug)
    create_superuser(debug=args.debug)
    run_command(["python", args.manage_path, "runserver", "0.0.0.0:8000"], debug=args.debug)

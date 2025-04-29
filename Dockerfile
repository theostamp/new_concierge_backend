# Dockerfile

FROM python:3.12-slim-bullseye

WORKDIR /app

# Εγκαθιστούμε εργαλεία δικτύου
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY ./backend /app/backend
COPY entrypoint.sh /app/entrypoint.sh

WORKDIR /app/backend

RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]

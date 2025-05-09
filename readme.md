cd C:\Users\thodo\digital_concierge\frontend    

npm install next@14
npm install react@18.2.0 react-dom@18.2.0


cd frontend
Remove-Item -Recurse -Force .next
npm run build
npm run dev

<!-- προτεινόμενο flow σε production ή μέσα σε Docker. -->
npm ci
npm run build
npm run start


<!-- diagrafh olvn  -->


find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -exec rm -r {} +
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete

docker compose up -d
./scripts/reset.sh
<!-- diagrafh olvn  -->
Σβήνουμε όλα τα migration αρχεία σε κάθε app
Σε κάθε φάκελο migrations/ (εκτός __init__.py), διαγράφεις όλα τα αρχεία .py.

find . -path "*/migrations/*.py" -not -name "__init__.py" -delete



-

# Δημιουργούμε όλες τις απαραίτητες migrations
python manage.py makemigrations

# Κάνουμε migrate στη public βάση (shared apps)
python manage.py migrate
python manage.py migrate announcements

# Κάνουμε migrate στο shared schema (δηλαδή τα public tables στους tenants)
python manage.py migrate_schemas --shared

# Δημιουργούμε tenants (αν δεν υπάρχουν)

# Κάνουμε migrate όλα τα tenants (tenant-specific apps)
python manage.py migrate_schemas --tenant



python manage.py makemigrations
python manage.py migrate


# Φτιάχνουμε διαχειριστή
python manage.py createsuperuser 

npm install
npm run dev 


# Δημιουργια νεου χρηστη χειροκινητα -->
python manage.py create_tenant --name="Test Building" --schema="test" --domain="er.localhost"

# Διαγραφή Τεναντ
python manage.py delete_tenant --schema=test

# κάνει migrate ΟΛΑ τα νέα migrations μόνο μέσα στο schema ert, χωρίς να πειράξει άλλους tenants ή το public.
python manage.py migrate_tenant --schema=test

python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser

bash scripts/setup_shared.sh

docker-compose exec web python manage.py create_sample_tenant

echo "# digital_concierge" >> README.md


git init

git add .
git commit -m " ok exc-votes 1"
git branch -M main
git remote add origin https://github.com/theostamp/new_concierge_backend.git
git push -u origin main

git push --force

cd frontend
npm install
npm run build
npm run dev



docker compose exec python manage.py shell < scripts/reset_and_create_tenant.py


Get-Content scripts/reset_and_create_tenant.py | docker compose exec -T web python manage.py shell






# Διακοπή και διαγραφή όλων των containers
docker-compose down --volumes --remove-orphans

# Εάν έχεις standalone containers που δεν είναι μέρος του docker-compose
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

# Διαγραφή volumes που δεν χρησιμοποιούνται
docker volume prune -f

# Διαγραφή δικτύων που δημιουργήθηκαν από το Docker Compose
docker network prune -f
docker system prune -a --volumes

docker volume rm $(docker volume ls -q)
docker network rm $(docker network ls -q)

docker-compose down
docker-compose up --build





docker image prune -a
docker image prune -a -f
docker system prune -a --volumes

docker rm $(docker ps -aq)
docker rmi $(docker images -q)
docker volume rm $(docker volume ls -q)
docker network rm $(docker network ls -q)
docker system prune -a

docker-compose down
docker-compose up --build


python manage.py exporttree --output dev_tree.md
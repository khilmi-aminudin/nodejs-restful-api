mysql:
	docker run --name mysql-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -d mysql
runDb:
	docker start mysql-db
install:
	npm install
dbMigrate:
	npx prisma migrate dev
test:
	npm test
run:
	node src/main.js

.PHONY: test
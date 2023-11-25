mysql:
	docker run --name mysql-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -d mysql
test:
	npm test
run:
	node src/main.js
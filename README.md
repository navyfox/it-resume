# Application

Technology stack: Drupal, Symfony, MySQL, Docker.

To run the sample, follow these steps:

#### 1. Build docker container and run:

```sh
$ cd my-project
$ docker-compose build
$ docker-compose up
```

Stop container:

```sh
$ docker-compose down
```

#### 2. Install drupal(cms.it-resume.local:8080) and fill backup in the database:

```sh
$ docker-compose exec db sh
$ mysql -u user -p drupal < /dump/dump.sql
Enter password: your_password
```

Dump MySQL:

```sh
$ mysqldump -u user -p drupal > /dump/dump.sql
Enter password: your_password
```

# General

## Development

### Add a new subdomain
Use the generateSSL.sh script in order to add a new subdomain to nginx
```
$ bash generateSSL.sh --add <subdomain>.<domain>
$ bash generateSSL.sh 
```
### Managing the compose files
the entry point is located in the project root, docker-compose.yml
The docker setup is divided into many smaller compose files, this for ease of use.

compose files can be found in **compose/*.yml**

### Port and networking
To update or alter a container port update the .env file and the respective container.

Inside compose the ports are defined as: ports: "${outer:-outer}:inner".
To use .env ports set the inner outer port to the env variable.

## Usage

### Install the enviroment
When you first initialize the enviroment be sure to run:
```
docker compose up -d --build
```
After that the first run the build flag is not needed.

### To use the custom CDN
the cdn can be reached with cdn.domain.

In order to upload to the cdn use the folloing command, where path=where on the cdn you want to upload the file.
Example paths: images, css, files, js.
```
curl -F "path=images" -F "file=@/mnt/c/Users/macka/Desktop/finished.png" https://cdn.domain/upload
``

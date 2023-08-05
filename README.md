# Catgram

### Express based API for storing and retreiving cat images

### Steps to run the app

1. ```shell
   nvm use # Use node version 18 using nvm
    ``` 
2. ```shell
   npm i -g pnpm #install pnpm package manger
    ```
3. ```shell
   pnpm start # starts the app locally
    ```

### End points

All API end points and  documentation are accessible over swagger:
```shell
pnpm start # starts the app locally
```
```shell
open http://localhost:3000/api-docs/ # open Swagger documentation on Browser
```

### Authentication

Authentication middleware has been added to protect end points
`username: cat` and `password: meow` has been set up locally.

### Containerization

```shell
pnpm docker and pnpm docker-run # Builds and tags the Catgram image and runs the same. 
# Port 3030 has been exposed on local to access the same
```

### Testing

An end to end integration test has been added to test all API's:
```shell
pnpm run test
```
### UI
A small sample UI has been exposed on `localhost:3000` to test the application from UI

### Abstractions
Right now we are using a `sqlite` db to save File metadata and id and `multer` to save the file locally in `uploads` directory

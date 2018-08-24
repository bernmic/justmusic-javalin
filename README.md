# JustMusic

This project is a simple prototype of an app build with Javalin. It is a REST service which serves collections of MP3 files. It can parse ID3 tags and group songs to albums and artists.

Data is stored in maps, here in Hazelcast IMap. So it can run with multiple instances. It can serve cover and the MP3 for players. 

Frontend is a Single Page Application build with Angular 6 and Angular Material. Audio is done with Howler.js.

## Build

Frontend need to be built first. This will be done with the parent pom.xml.

### Frontend
To build the frontend, Node / NPM is required. After that the Angular-CLI needs to be installed.
>npm i -g @angular/cli

Then go to the src/main/frondend folder and execute
>npm i

>ng build --prod

This will build the frontend to the dist folder.

### REST-Service
It needs Maven 3+ to build this app. Run `mvn package` to build the project. The build artifacts will be stored in the `target/` directory.

## Run
It can be staret with
>java -jar target/justmusic-javalin-1.0-SNAPSHOT-jar-with-dependencies.jar

and called from browser with url [http://localhost:7000](http://localhost:7000).
JustMusic looks in $HOME/.jmj for its configuration. A file called *users.json* is expected there.

Example users.json:
```json
[ {
  "username" : "admin",
  "password" : "admin",
  "roles": "user,admin"
}, {
  "username" : "user",
  "password" : "user",
  "roles": "user"
} ]
```
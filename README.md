# JustMusic

This project is a simple prototype of an app build with Javalin. It is a REST service which serves collections of MP3 files. It can parse ID3 tags and group songs to albums and artists.

Data is stored in maps, here in Hazelcast IMap. So it can run with multiple instances. It can serve cover and the MP3 for players. 

Next step could be a Single Page Application build with Angular.

## Build

It needs Maven 3+ to build this app. Run `mvn package` to build the project. The build artifacts will be stored in the `target/` directory.

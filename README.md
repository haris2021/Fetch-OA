# Fetch-OA
## For running the application

1. Make sure docker is installed in your computer
2. Git clone the current repo
3. Navigate to the directory where you have cloned this project
4. Build the docker image using the command - docker build -t my-node-app .
5. Run the docker image using the command - docker run -p 3000:3000 my-node-app
6. Now server is running, using tools like Postman you can hit the desired URL like locahost:3000/receipts/process to post JSON data along with unique ID
7. Now to get points hit localhost:3000/receipts/:id/points where id is the id generated before.

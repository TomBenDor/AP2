# MaKore

## About
MaKore is a chat app, available for both Web and Android.\
The app allows users to chat with each other and send messages.\
Every user has a contact list, and he can add other users to it.

The Web API server was built with ASP.NET, React JS for the Web client and Java for the Android client.

## Features
- Dark and light themes
- Support multi-line messages (<kbd>Shift</kbd>+<kbd>Enter</kbd> to insert a new line, <kbd>Enter</kbd> to send)
- Save message drafts when switching between contacts
- Sort contacts by last message date and time
- Show password button

## Installation
clone the repository
```shell
git clone https://github.com/TomBenDor/AP2.git
cd AP2
```
Install dependencies for the react app
```shell
cd web-client
npm i
```

## Running

### Reviews page

To run the reviews server, execute the following commands:
```shell
cd reviews-website
dotnet run
```
The server will be running on http://localhost:7095/

### Web client

To run the client, execute the following commands:
```shell
cd web-client
npm start
```
The client will be running on http://localhost:3000/

### Web API

To run the Web API server, execute the following commands:
```shell
cd web-api
dotnet run
```
The web-api server will be running on http://localhost:54321/

### Android client

The android client is located in the `android-client` folder.
Shocking right?
<br>

**Enjoy!**

<img src="https://user-images.githubusercontent.com/76645845/165180661-2063cdb4-07db-4040-9720-87e7742a3181.gif" alt="Spider man having a chat" height="250">

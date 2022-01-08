# Interpreter

This component takes MQTT requests and converts them to HTTP requests to then communicate with the server and vice versa. It will listen to any messages sent through MQTT in the correct directory.

For more detailed information of the component and the whole system head over to the documentation repository by [clicking here](https://git.chalmers.se/courses/dit355/test-teams-formation/team-2/documentation).

## Setup Instructions

### Prerequisites 
To run the Interpreter you will need Node and MQTT installed on your computer.

You can install them by clicking on the according option below (you'll be redirected to a third-party web page):
- [Node](https://nodejs.org/en/download/)
- [MQTT](https://mosquitto.org/download/)

### Running

1. Launch a terminal, navigate to the interpreter folder by using the following command from the root directory. 

    `cd .\interpreter\`

2. Install the required requirements using the command: 

    `npm install`

3. You can now start the Interpreter by running the command: 

    `node index.js`

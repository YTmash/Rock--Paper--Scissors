const fs = require('fs');
const http = require('http');

// Create an HTTP server
const server = http.createServer((request, response) => {
  // Create a URL object with request.url and host name
  const url = new URL(request.url, `http://${request.headers.host}`);
  
  // Create a switch statement based on the pathname of the URL
  switch (url.pathname) {
    case '/':
      if (request.method === 'GET') {
        const name = url.searchParams.get('name');
        console.log(`User ${name} has started playing!`);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('index.html').pipe(response);
      } else if (request.method === 'POST') {
        // Handle POST request
        handlePostRequest(request, response);
      } else {
        response.writeHead(405, { 'Content-Type': 'text/html' });
        response.end('Method Not Allowed');
      }
      break;
    default:
      response.writeHead(404, { 'Content-Type': 'text/html' });
      fs.createReadStream('404.html').pipe(response);
      break;
  }
});

// Function to handle POST requests (placeholder implementation)
function handlePostRequest(request, response) {
  // Example: Respond with a simple message
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('POST request received');
}

// Start the server
server.listen(4001, () => {
  console.log(`Server is listening on: http://localhost:${server.address().port}`);
});



// TODO: Have server listen at port 4001


// Function for handling POST responses
function handlePostResponse(request, response){
  request.setEncoding('utf8');
  
  // Receive chunks on 'data' event and concatenate to body variable
  let body = '';
  request.on('data', function (chunk) {
    body += chunk;
  });
  
  // When done receiving data, select a random choice for server
  // Compare server choice with player's choice and send an appropriate message back
  request.on('end', function () {
    const choices = ['rock', 'paper', 'scissors'];
    const randomChoice = choices[Math.floor(Math.random() * 3)];

    const choice = body;

    let message;

    const tied = `Aww, we tied! I also chose ${randomChoice}.`;
    const victory = `Dang it, you won! I chose ${randomChoice}.`;
    const defeat = `Ha! You lost. I chose ${randomChoice}.`;

    if (choice === randomChoice) {
      message = tied;
    } else if (
        (choice === 'rock' && randomChoice === 'paper') ||
        (choice === 'paper' && randomChoice === 'scissors') ||
        (choice === 'scissors' && randomChoice === 'rock')
    ) {
      message = defeat;
    } else {
      message = victory;
    }
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(`You selected ${choice}. ${message}`);
  });
}
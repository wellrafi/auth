const http = require('http');
const port = process.env.PORT || 5311;
const app = require('./app')
const server = http.createServer(app)

app.set('port', port);

server.listen(port);
server.on('listening', () => {console.log('auth service running on port ' + port)});

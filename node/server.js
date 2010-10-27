var http = require('http'),
  io = require('./socket.io-node');

server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

server.listen(8888);

var socket = io.listen(server);

var lists = {}
socket.on('connection', function(client){
  client.on('message', function(d){
    var data = JSON.parse(d);
    switch(data.action){
      case "open list":
        
        lists[data.list_id] =  lists[data.list_id] || [];
        // Set the client list id
        client.list_id = data.list_id;
    }
  });
  client.on('disconnect', function(){
    var list = lists[client.list_id];

    // remove the client from the list
    list.splice(list.indexOf(client),1);
    
    // If the list is empty, remove it
    if(list.length == 0){
      delete list;
    }
  });
});

var notify = function(list_id, msg){
  var list = lists[list_id];
  var l = list.length;
  while(l--){
    client.send(JSON.stringify(msg))
  }
}

//
// Escuchar RPC, armar mensaje y mandar notify
// 


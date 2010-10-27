var http = require('http'),
  io = require('./socket.io-node'),
  jsonrpc = require('./jsonrpc/src/jsonrpc');

server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

server.listen(8888);

var socket = io.listen(server);

var lists = {}
socket.on('connection', function(client){
  client.on('message', function(d){
    console.log(d);
    var data = JSON.parse(d);
    switch(data.action){
      case "open list":
        
        lists[data.list_id] =  lists[data.list_id] || [];
        lists[data.list_id].push(client);
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
  console.log(msg);
  //client.send(JSON.stringify(msg));
  var list = lists[list_id];
  if (list)
  {
      var l = list.length;
      while(l--){
        var client = list[l];
        client.send(JSON.stringify(msg));
      }
  }
}

//
// Escuchar RPC, armar mensaje y mandar notify
//

jsonrpc.expose('notify', notify);
jsonrpc.listen(7000, 'localhost');

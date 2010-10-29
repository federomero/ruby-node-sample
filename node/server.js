var http = require('http'),
  io = require('./socket.io-node'),
  jsonrpc = require('./jsonrpc/src/jsonrpc');

var server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

server.listen(8888);

var socket = io.listen(server);

var lists = {};
socket.on('connection', function(client){
  client.on('message', function(d){
    var data = JSON.parse(d);
    switch(data.action){
      case "open list":
        lists[data.list_id] =  lists[data.list_id] || [];
        lists[data.list_id].push(client);
        client.list_id = data.list_id;
    }
  });
  client.on('disconnect', function(){
    var list = lists[client.list_id];
    if (list)
    {
      // Remove the client from the list
      list.splice(list.indexOf(client),1);
      
      // If the list is empty, delete it
      if(list.length == 0){
        delete list;
      }
    }
  });
});

var forEachClientInList = function(list_id, fn){
  return lists[list_id] && lists[list_id].map(fn) 
}

var notify = function(list_id, msg){
  console.log(msg);

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

var task_action = function(action){
  return function(task){
    console.log("------", action, task.list_id);
    forEachClientInList(task.list_id, function(client){
      client.send(JSON.stringify({action:action, task:task}));
    });
  };
}

var list_action = function(action){
  return function(list){
    console.log("------", action, list.id);
    forEachClientInList(list.id, function(client){
      client.send(JSON.stringify({action:action, list:list}));
    });
  };
}

//
// Escuchar RPC, armar mensaje y mandar notify
//

jsonrpc.expose('finish', task_action('finish'));
jsonrpc.expose('unfinish', task_action('unfinish'));
jsonrpc.expose('add', task_action('add'));
jsonrpc.expose('rename', list_action('rename'));
jsonrpc.listen(7000, 'localhost');

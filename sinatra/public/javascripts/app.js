var addTask = function(task){
  if ($("#task-" + task.id).length > 0)
    return;
  var task_html = ['<li id="task-'+task.id+'">'
                  ,'<input type="checkbox" class="task-check" ' + (task.done ? "checked=true" : "") +' />'
                  , task.name
                  ,'</li>'].join('')
  $("#tasks-"+(task.done ? "done" : "notdone")).append(task_html);
}

var markAsFinished = function(task_id){
  $("#task-"+task_id).appendTo("#tasks-done");
  $("#task-"+task_id + " .task-check").attr('checked', true);
}

var markAsUnfinished = function(task_id){
  $("#task-"+task_id).appendTo("#tasks-notdone");
  $("#task-"+task_id + " .task-check").attr('checked', false);
}

var rename = function(list){
  $("h1").html(list.name);
}

function initialize_connection(list_id)
{
  io.setPath('');
  var socket = new io.Socket(location.host.split(':')[0], {port:8888, 
    transports: ['websocket', 'server-events', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
	socket.connect();
	socket.on('message', function(data){
    data = JSON.parse(data);
    switch(data.action){
      case "finish":
        markAsFinished(data.task.id);
        break;
      case "unfinish":
        markAsUnfinished(data.task.id);
        break;
      case "add":
        addTask(data.task);
        break;
      case "rename":
        rename(data.list);
        break;
    }
	});
  socket.send(JSON.stringify({action: "open list", list_id: list_id}));
  return socket;
}

$(document).ready(function(){
  var list_id = parseInt(location.pathname.replace("/lists/", ''));
  socket = initialize_connection(list_id);

  for(var i =0; i<tasks.length; i++){
    addTask(tasks[i]);
  }  

  $("#enter-task").keyup(function(e) {
  	if(e.keyCode == 13) {
  		$.post("/lists/"+list_id+"/tasks", {task:{name: $(this).val()}}, function(data){
  		  var task = JSON.parse(data);
  		  if(task){
    		  addTask(task);  		    
  		  }
        $("#enter-task").val("");
  		});
  	}
  });
  $("#tasks-done input").live('click', function(){
    var task_id = $(this).parents('li').attr('id').split('-')[1];
    $.post("/lists/"+list_id+"/tasks/"+task_id+"/unfinish", function(data){
		  var task = JSON.parse(data);
		  if(task){
		    markAsUnfinished(task.id);
		  }
		});
  });
  $("#tasks-notdone input").live('click', function(){
    var task_id = $(this).parents('li').attr('id').split('-')[1];
    $.post("/lists/"+list_id+"/tasks/"+task_id+"/finish", function(data){
		  var task = JSON.parse(data);
		  if(task){
		    markAsFinished(task.id);
		  }
		});
  });
  $("h1").blur(function(){
    $.post("/lists/"+list_id,{list:{name: $(this).html()}}, function(data){
		  var task = JSON.parse(data);
		  if(task){
		    markAsFinished(task.id);
		  }
		});
  });
})

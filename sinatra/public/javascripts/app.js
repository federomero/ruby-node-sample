var addTask = function(task){
  var task_html = ['<li id="task-'+task.id+'">'
                  ,'<input type="checkbox" />'
                  , task.name
                  ,'</li>'].join('')
  $("#tasks-"+(task.done ? "done" : "notdone")).append(task_html);
}

var markAsFinished = function(task_id){
  $("#task-"+task_id).appendTo("#tasks-done");
}

var markAsUnfinished = function(task_id){
  $("#task-"+task_id).appendTo("#tasks-notdone");
}


function initialize_connection(list_id)
{
  var socket = new io.Socket(location.host.split(':')[0], {port:8888});
	socket.connect();
	/*socket.on('message', function(data){
		alert('got some data' + data);
	});*/
  //socket.send(JSON.stringify({action: "open list", list_id: list_id}));
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
})

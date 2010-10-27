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


$(document).ready(function(){
  
  for(var i =0; i<tasks.length; i++){
    addTask(tasks[i]);
  }
  
  var list_id = parseInt(location.pathname.replace("/lists/", ''));
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
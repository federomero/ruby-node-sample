require './database'
require './models'

DataMapper.auto_upgrade!

get '/' do
  @list = List.create
  redirect "/lists/#{@list.id}"
end

get '/lists/:id' do
  @list = List.get(params[:id])
  haml :list
end

post '/lists/:list_id/tasks' do
  @list = List.get(params[:list_id])
  @task = Task.new(params[:task])
  @task.list = @list
  if @task.save
    return @task.to_json
  else
    return "false"
  end
end

post '/lists/:list_id/tasks/:id/finish' do
  @task = Task.get(params[:id])
  @task.finish
  if @task.save
    return @task.to_json
  else
    return "false"
  end
end

post '/lists/:list_id/tasks/:id/unfinish' do
  @task = Task.get(params[:id])
  @task.unfinish
  if @task.save
    return @task.to_json
  else
    return "false"
  end
end

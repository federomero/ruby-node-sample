require 'sinatra'
require './database'
require './models'
require 'jsonrpc'

DataMapper.auto_upgrade!

JsonRPC::Client.class_eval do
  def method_missing(name, *args)
    request name, args
  end
end

svc = JsonRPC::Client.new("http://localhost:7000/")

get '/' do
  @list = List.create
  redirect "/lists/#{@list.id}"
end

get '/lists/:id' do
  @list = List.get(params[:id])
  haml :list
end

post '/lists/:id' do
  @list = List.get(params[:id])
  @list.name = params[:list][:name]
  if @list.save
    svc.rename(@list)
    return @list.to_json
  else
    return "false"
  end

end

post '/lists/:list_id/tasks' do
  @list = List.get(params[:list_id])
  @task = Task.new(params[:task])
  @task.list = @list
  if @task.save
    svc.add(@task)
    return @task.to_json
  else
    return "false"
  end
end

post '/lists/:list_id/tasks/:id/finish' do
  @task = Task.get(params[:id])
  @task.finish
  if @task.save
    svc.finish(@task)
    return @task.to_json
  else
    return "false"
  end
end

post '/lists/:list_id/tasks/:id/unfinish' do
  @task = Task.get(params[:id])
  @task.unfinish
  if @task.save
    svc.unfinish(@task)
    return @task.to_json
  else
    return "false"
  end
end

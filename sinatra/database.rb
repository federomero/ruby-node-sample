require 'dm-core'
require 'dm-validations'
require 'dm-migrations'
require 'dm-timestamps'
require 'dm-serializer'

configure :development do
  DataMapper.setup(:default, {
    :adapter  => 'mysql',
    :host     => 'localhost',
    :username => 'root' ,
    :database => 'tasks'})  
end

configure :production do
  DataMapper.setup(:default, ENV['DATABASE_URL'])  
end

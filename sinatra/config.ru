require 'rubygems'
require 'bundler'
Bundler.setup

require 'sinatra'
 
set :environment, :development
disable :run, :reload
 
require 'app'

run Sinatra::Application

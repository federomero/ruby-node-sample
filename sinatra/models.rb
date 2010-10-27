class List
  include DataMapper::Resource

  property :id,           Serial    # primary serial key
  property :name,         String
  property :created_at,   DateTime
  property :updated_at,   DateTime
  
  has n, :tasks
    
end

class Task
  include DataMapper::Resource

  property :id,           Serial    # primary serial key
  property :name,         String
  property :done,         Boolean
  property :created_at,   DateTime
  property :updated_at,   DateTime
  
  belongs_to :list
  
  def finish
    self.done = true
  end

  def unfinish
    self.done = false
  end
end


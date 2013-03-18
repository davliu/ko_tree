class Project < ActiveRecord::Base
  attr_accessible :name, :project_id
  has_many :projects

  def as_json(options = {})
    {
      id: id,
      name: name,
      projects: self.projects.collect {|n| n.as_json}
    }
  end
end

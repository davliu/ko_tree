class Project < ActiveRecord::Base
  attr_accessible :name, :project_id, :grouping
  has_many :projects
  has_one :project
  validate :parent_into_child

  def as_json(options = {})
    {
      id: id,
      name: name,
      projects: self.projects.collect {|n| n.as_json}
    }
  end

  def parent_into_child?(project_id, parent)
    if parent.blank? || parent.project_id.blank?
      return false
    elsif parent.project_id == project_id
      return true
    else
      return parent_into_child?(project_id, parent.project)
    end
  end
  
  def parent_into_child
    errors.add(:base, "A top level item can not be placed into one of its sub-items") if parent_into_child?(self.id, self.project)
  end
end

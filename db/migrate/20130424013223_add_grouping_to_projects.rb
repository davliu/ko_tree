class AddGroupingToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :grouping, :string
  end
end

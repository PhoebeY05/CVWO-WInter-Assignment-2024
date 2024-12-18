class RemoveStarredFromPosts < ActiveRecord::Migration[8.0]
  def change
    remove_column :posts, :starred, :boolean
  end
end

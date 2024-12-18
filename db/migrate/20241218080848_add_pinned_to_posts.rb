class AddPinnedToPosts < ActiveRecord::Migration[8.0]
  def change
    add_column :posts, :pinned, :integer
  end
end

class AddAuthorToComments < ActiveRecord::Migration[8.0]
  def change
    add_column :comments, :author, :string
  end
end

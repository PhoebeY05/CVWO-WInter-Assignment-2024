class CreateFields < ActiveRecord::Migration[8.0]
  def change
    create_table :fields do |t|
      t.string :username
      t.integer :post_id
      t.boolean :starred
      t.boolean :upvoted
      t.boolean :downvoted
      t.timestamps
    end
  end
end

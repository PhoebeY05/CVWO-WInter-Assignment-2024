class CreateStars < ActiveRecord::Migration[8.0]
  def change
    create_table :stars do |t|
      t.string :username
      t.string :string
      t.integer :post_id

      t.timestamps
    end
  end
end

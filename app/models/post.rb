class Post < ApplicationRecord
  has_many :comments, dependent: :delete_all
  has_many :fields, dependent: :delete_all
  validates :title, presence: true
  validates :author, presence: true
  validates :content, presence: true
end

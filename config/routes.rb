Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "posts/index"
      post "posts/create"
      get "/show/:id", to: "posts#show"
      delete "/destroy/:id", to: "posts#destroy"
      put "/update/:id", to: "posts#update"
      post "/update/:id", to: "posts#patch"

      get "/index/:id", to: "comments#index"
      post "comments/create"
      get "/comments/show/:id", to: "comments#show"
      delete "/comments/destroy/:id", to: "comments#destroy"
      put "/comments/update/:id", to: "comments#update"
      post "comments", to: "comments#all"
      get "/comments/count", to: "comments#count"

      post "users/index", to: "users#index"
      post "users/create"
      get "/users/show", to: "users#show"
      delete "/users/destroy", to: "users#destroy"

      post "/fields/index", to: "fields#index"
      post "/fields/destroy", to: "fields#destroy"
      post "/fields/create", to: "fields#create"
      get "fields/:id", to: "fields#post"

      post "search/posts", to: "search#index"
      get "search/post/:id", to: "search#post"
      get "search/comment/:id", to: "search#comment"

      post "sessions/create", to: "sessions#create"
      delete "sessions/destroy", to: "sessions#destroy"
    end
  end
  root "homepage#index"
  get "/*path" => "homepage#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end

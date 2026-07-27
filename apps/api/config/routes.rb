Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resources :pings, only: [ :index, :create ]

  post "signup" => "signups#create"
  post "login" => "sessions#create"
  post "refresh" => "sessions#refresh"
  delete "logout" => "sessions#destroy"

  resources :journeys, only: [ :index, :show ] do
    post :start, on: :member
  end
  resources :subjects, only: [ :show ]
  resources :lessons, only: [ :show ]

  # Defines the root path route ("/")
  # root "posts#index"
end

class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  include ActionController::Cookies
  after_action :set_csrf_cookie
  def fallback_index_html
    render file: "public/index.html"
  end
  private
  def set_csrf_cookie
    cookies["CSRF-TOKEN"] = {
      value: form_authenticity_token,
      secure: true
    }
  end
end

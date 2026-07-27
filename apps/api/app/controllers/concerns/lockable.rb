module Lockable
  private

  # Renders a 403 and returns true if the resource is locked for the current
  # user; callers should `return if render_unless_unlocked(resource)`.
  def render_unless_unlocked(resource)
    return false unless resource.status_for(current_user) == :locked

    render_errors("This #{resource.class.name} is locked", status: :forbidden)
    true
  end
end

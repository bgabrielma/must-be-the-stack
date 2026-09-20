# This file should ensure the existence of records required to run the
# application in every environment (production, development, test). The code
# here should be idempotent so that it can be executed at any point in every
# environment. The data can then be loaded with the bin/rails db:seed command
# (or created alongside the database with db:setup).

# The static curriculum data lives in `rails curriculum:seed` instead of here
# — it's development-only fixture content, not data every environment needs
# on `db:seed`. See lib/tasks/curriculum.rake.

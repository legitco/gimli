role :app, %w{travis@zealot.kelsin.net}
role :web, %w{travis@zealot.kelsin.net}
role :db,  %w{travis@zealot.kelsin.net}

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/home/travis/gimli-staging'

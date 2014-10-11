# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'gimli'
set :repo_url, 'git@github.com:legitco/gimli.git'
set :npm_flags, '--silent'
set :grunt_tasks, 'build'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call
# set :branch 'develop'

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/home/app/www/gimli'

# Default value for keep_releases is 5
# set :keep_releases, 5

before 'deploy:updated', 'grunt'

@echo off
echo Starting Jekyll with LOCAL theme (fast mode)...
set BUNDLE_GEMFILE=Gemfile.local
bundle install --quiet 2>nul
bundle exec jekyll serve -I --config _config.yml,_config_dev.yml

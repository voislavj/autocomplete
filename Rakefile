require 'rubygems'
require 'rake'
require "echoe"

Echoe.new('autocomplete', '1.0.0') do |p|
  p.description               = "Insert an autocomplete-search-box inside your view"
  p.url                       = "http://www.voja-jovanovic.info"
  p.author                    = "Voislav Jovanovic"
  p.email                     = "voislavj@gmail.com"
  p.ignore_pattern            = ["tmp/*", "script/*"]
  p.development_dependencies  = []
end

Dir["#{File.dirname(__FILE__)}/tasks/*.rake"].sort.each {|ext| load ext}
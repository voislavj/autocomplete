require 'rubygems'
require 'rake'
require "echoe"

Echoe.new('autocomplete', '1.0.2') do |p|
  p.description               = "Insert an autocomplete-search-box inside your view"
  p.url                       = "http://www.vojajovanovic.com"
  p.author                    = "Voislav Jovanovic"
  p.email                     = "voislavj@gmail.com"
  p.ignore_pattern            = ["tmp/*", "script/*", "pkg*"]
  p.development_dependencies  = []
end

Dir["#{File.dirname(__FILE__)}/tasks/*.rake"].sort.each {|ext| load ext}
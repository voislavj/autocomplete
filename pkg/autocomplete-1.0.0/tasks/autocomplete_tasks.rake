# desc "Explaining what the task does"
# task :autocomplete do
#   # Task goes here
# end
desc 'Update autocomplete JavaScripts and CSSs'
task :update_scripts => [] do |t|
  
  autocomplete_dir = File.expand_path(".")
  [["javascripts","autocomplete.js"], ["stylesheets","autocomplete.css"]].each do |file|
    unless File.exists?(File.join(RAILS_ROOT, "public", file[0], file[1])) 
      File.copy(File.join("assets", file[1]), File.join(RAILS_ROOT, "public", file[0], file[1]))
    end
  end
  puts "JavaScripts and CSSs updated." 
end
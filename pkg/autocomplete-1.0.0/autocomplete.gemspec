# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{autocomplete}
  s.version = "1.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.2") if s.respond_to? :required_rubygems_version=
  s.authors = ["Voislav Jovanovic"]
  s.date = %q{2010-07-22}
  s.description = %q{Insert an autocomplete-search-box inside your view}
  s.email = %q{voislavj@gmail.com}
  s.extra_rdoc_files = ["README.rdoc", "lib/autocomplete.rb", "lib/autocomplete_controller.rb", "lib/autocomplete_helper.rb", "tasks/autocomplete_tasks.rake"]
  s.files = ["MIT-LICENSE", "Manifest", "README.rdoc", "Rakefile", "assets/autocomplete-loading.gif", "assets/autocomplete.css", "assets/autocomplete.js", "init.rb", "install.rb", "lib/autocomplete.rb", "lib/autocomplete_controller.rb", "lib/autocomplete_helper.rb", "tasks/autocomplete_tasks.rake", "test/autocomplete_test.rb", "autocomplete.gemspec"]
  s.homepage = %q{http://www.voja-jovanovic.info}
  s.rdoc_options = ["--line-numbers", "--inline-source", "--title", "Autocomplete", "--main", "README.rdoc"]
  s.require_paths = ["lib"]
  s.rubyforge_project = %q{autocomplete}
  s.rubygems_version = %q{1.3.5}
  s.summary = %q{Insert an autocomplete-search-box inside your view}
  s.test_files = ["test/autocomplete_test.rb"]

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 3

    if Gem::Version.new(Gem::RubyGemsVersion) >= Gem::Version.new('1.2.0') then
    else
    end
  else
  end
end

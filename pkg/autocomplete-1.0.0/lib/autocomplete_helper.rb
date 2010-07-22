module AutocompleteHelper
  
  # generate autocomplete text-field
  def autocomplete(options={})
    return nil unless options[:model]
    
    options[:name] ||= :autocomplete_keyword
    options[:multi] ||= false;
    
    options[:multi_height] ||= 150
    options[:uuid] = _uuid
    
    options[:map][:value] ||= :id
    options[:map][:label] ||= [:name]
    options[:map][:search] ||= []
    
    #txt_name = options[:multi] ? "autocomplete-keyword-#{options[:uuid]}" : options[:name]
    txt_name = "autocomplete-keyword-#{options[:uuid]}"
    
    ret = []
    ret << javascript_include_tag("autocomplete")
    ret << stylesheet_link_tag("autocomplete")
    ret << label_tag(options[:name], options[:model].camelize)
    ret << text_field_tag(txt_name, nil, {
      :onfocus => "Autocomplete(this, " + options.to_json.to_s + ")"
    })
    
    if options[:multi]
      ret << content_tag(:div, '<a class="autocomplete-remove" href="javascript:void(0);">remove selected</a> select <a href="javascript:void(0)" class="autocomplete-select-all">all</a> / <a href="javascript:void(0)" class="autocomplete-select-none">none</a>', :class=>"autocomplete-multi-controls") 
      ret << content_tag(:div, "", :class=>"autocomplete-multi-container", :style=>"height: #{options[:multi_height]}px")
      ret << content_tag(:div, "<span class=\"length\">0</span> items", :class=>"autocomplete-multi-status")
    else
      ret << hidden_field_tag(options[:name], "")
    end
    
    return ret.join("\r\n")
  end
  
  def _uuid
    o =  [('a'..'z'),('A'..'Z'),(0..9)].map{|i| i.to_a}.flatten;  
    string  =  (0..10).map{ o[rand(o.length)]  }.join;
  end
end
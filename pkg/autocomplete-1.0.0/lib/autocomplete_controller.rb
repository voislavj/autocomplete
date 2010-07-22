class AutocompleteController < ActionController::Base
  
  def find
    params[:map] = {:value=>[:id], :label=>[:name], :search=>[:name]} unless params[:map]
    params[:limit] ||= 50
    params[:skip] ||= []
    params[:map][:search] ||= []
    params[:glue] ||= " "
    
    params[:joins] ||= []
    
    @modelname = params[:model]
    @model = params[:model].constantize
    
    params[:map][:label] = parse_table_fields(params[:map][:label])
    params[:map][:value] = parse_table_fields(params[:map][:value])
    params[:map][:search] = parse_table_fields(params[:map][:search])
    
    params[:joins].each_with_index do |v,k|
      params[:joins][k] = eval(":#{v}")
    end
    
    value = "CONCAT_WS(' ',#{params[:map][:value].join(",")})"
    label = "CONCAT_WS('#{params[:glue]}',#{params[:map][:label].join(",")})"
    search = "CONCAT_WS(' ',#{(params[:map][:label]|params[:map][:search]).join(",")})"
    
    skip = ""
    toskip = ""
    
    params[:skip].each do |s|
      toskip += ","
      unless s.to_s.match(/^\d+$/i)
        s = "'#{s}'"
      end
      toskip += s
    end
    
    toskip = toskip.gsub(/^,/, "")
    if params[:skip].length>0
      skip = "AND #{value} NOT IN(#{toskip})"
    end
    
    debug params[:joins]
    
    result = @model.find(
      :all, {
        :select => "#{value} as `value`, #{label} as `label`",
        :conditions => ["#{search} LIKE ? #{skip}", "%" + params[:keyword].gsub("%", "\%") + "%"],
        :joins => params[:joins],
        :order => "label",
        :limit => params[:limit]
      }
    );
    render :text => result.to_json
  end
  
  def debug(var, mode="w")
    File.open("D:\\voja.log", mode) {|f| f.write(var.to_yaml); f.close}
  end
  
  def parse_table_fields(arr)
    single = false
    unless arr.is_a?(Array)
      arr = [arr]
      single = true
    end
    
    arr.each_with_index do |v,k|
      puts v.inspect + " => " + v.to_s.inspect
      if v.to_s.match(/\./)
        items = v.to_s.split(".",2) 
        arr[k] = "#{items[0].constantize.table_name}.#{items[1]}"
      end
    end
    return single ? arr[0] : arr;
  end
  
end
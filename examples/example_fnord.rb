require "fnordmetric"

FnordMetric.namespace :myapp do

# numeric (delta) gauge, 1-minute tick
gauge :my_events_per_minute, 
  :tick => 1.minute.to_i, 
  :title => "My Events seen per Minute"

# on every event like { _type: 'myEvent' }
event(:MyEvent) do
  # increment the my_events_per_minute gauge by 1
  incr :my_events_per_minute 
end

# draw a timeline showing the gauges value, auto-refresh every 2s
widget 'Overview', {
  :title => "My Events per Minute",
  :type => :timeline, :plot_style => :areaspline,
  :gauges => :my_events_per_minute,  
  :include_current => true,
  :autoupdate => 2
}

# draw numeric stats readout showing the gauges value, auto-refresh every 2s
widget 'Overview', {
  :title => "MyEvents per Minute (Stats)",
  :type => :numbers,
  :gauges => :my_events_per_minute,  
  :include_current => true,
  :autoupdate => 2
}

end

FnordMetric.standalone
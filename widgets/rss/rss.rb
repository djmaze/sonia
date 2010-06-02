module Sonia
  module Widgets
    class RSS < Sonia::Widget
      def initialize(config)
        super(config)
        EventMachine::add_periodic_timer(config[:poll_time]) { fetch_data }
      end

      def initial_push
        fetch_data
      end

      private
      def fetch_data
        log_info "Polling `#{service_url}'"

        options = {}
        if config[:username]
          encoded = Base64.encode64("#{config[:username]}:#{config[:password]}")[0..-2]
          options[:head] = { "Authorization" => "Basic #{encoded}" }
        end 

        http = EventMachine::HttpRequest.new(service_url).get(options)
        http.errback { log_fatal_error(http) }
        http.callback {
          handle_fetch_data_response(http)
        }
      end

      def handle_fetch_data_response(http)
        if http.response_header.status == 200
          parse_response(http.response)
        else
          log_unsuccessful_response_body(http.response)
        end
      end

      def parse_response(response)
        @xpath = config[:xpath] || '//item'
        @xpath_title = config[:xpath_title] || "title"
        @xpath_url = config[:xpath_url] || "link"
        @xpath_url_attr = config[:xpath_url_attr]
        @xpath_pubdate = config[:xpath_pubdate] || "pubDate"
        @max_age_in_days = config[:max_age_in_days]
        
        items = Nokogiri::XML.parse(response).xpath(@xpath).map do |t| 
          pubdate = t.xpath(@xpath_pubdate).first.content
          { 
            :url => @xpath_url_attr ? t.xpath(@xpath_url).first.attributes[@xpath_url_attr].value : t.xpath(@xpath_url).first.content, 
            :title => t.xpath(@xpath_title).first.content,
            :pubdate => pubdate 
          } if @max_age_in_days.nil? or ( Date.parse(pubdate) >= (Date.today - @max_age_in_days) )
        end.compact

        log_info("RSS #{config[:name]} items: #{items}")
        push :items => items[0...config[:nitems]]
      rescue => e
        log_backtrace(e)
      end

      def service_url
        config[:url]
      end
    end
  end
end

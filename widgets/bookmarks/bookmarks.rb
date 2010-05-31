module Sonia
  module Widgets
    class Bookmarks < Sonia::Widget

      def initialize(config)
        super(config)
      end

      def initial_push

        bookmarks = []
        config[:bookmarks].each do |title|
          options = config[:bookmarks][title].to_hash
          bookmarks << options.merge(:title => title)
        end
        
        log_info("Bookmarks items: #{bookmarks.inspect}")
        push bookmarks
        
      end
    end
  end
end

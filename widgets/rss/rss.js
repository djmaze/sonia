var RSS = Class.create(Widget, {
  initialize: function($super, widget_id, config) {
    this.messages = [];
    return($super(widget_id, config));
  },

  handlePayload: function(payload) {
    this.messages = payload.items;
  },

  build: function() {
    this.contentContainer = this.buildContent();
    this.headerContainer  = this.buildHeader();
    this.iconContainer    = this.buildWidgetIcon();

    this.container.insert(this.headerContainer);
    this.container.insert(this.iconContainer);
    this.container.insert(this.contentContainer);

    this.makeDraggable();
  },

  update: function() {
    this.contentContainer.childElements().invoke('remove');
    this.messages.each(function(message){
      var date = new Date(message.pubdate);
      var klass = (((new Date()) - date) / (1000*60*60*24) ) < 1 ? 'current' : null;

      var i = new Element("p", { "class": klass }).update('<a href="' + message.url + '" target="_blank">' + message.title + '</a>');
      this.contentContainer.insert(i);
      this.contentContainer.insert(new Element('hr' ));
    }.bind(this));
  },

  buildWidgetIcon: function() {
    var icon = this.config.icon || "/images/rss/rss.png";
    var img = new Element("img", {src: icon, width: 32, height: 32, 'class': 'rss icon'});

    if(this.config.homepage)
      return(new Element('a', { 'href': this.config.homepage, 'target': '_blank', 'class': 'icon' }).update(img));
    else
      return(img);
  },

  buildHeader: function() {
    return(new Element("h2", { 'class': 'handle' }).update(this.title));
  },

  buildContent: function() {
    return(new Element("div", { 'class': "content" }));
  },
});

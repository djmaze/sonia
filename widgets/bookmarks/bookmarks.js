# Bookmarks widget
# 
# Technique was borrowed from http://www.netzgesta.de/dev/quickchoice.html. 
# Thanks to Christian Effenberger for that!
#
# 
var Bookmarks = Class.create(Widget, {
  initialize: function($super, widget_id, config) {
    this.bookmarks = {};
    return($super(widget_id, config));
  },

  handlePayload: function(payload) {
    this.bookmarks = payload;
  },

  build: function() {
    this.contentContainer = this.buildContent();
    this.headerContainer  = this.buildHeader();
    this.iconContainer    = this.buildIcon();

    this.container.insert(this.headerContainer);
    this.container.insert(this.iconContainer);
    this.container.insert(this.contentContainer);

    this.makeDraggable();
  },

  update: function() {
    this.contentContainer.childElements().invoke('remove');
    this.bookmarks.each(function(bookmark) {
      var thumb = new Element("div", { 'class': 'thumbnail' });
      var thumbnail = bookmark.thumbnail;


      var lock = new Element("div", { 'class': 'lock'});

      if(thumbnail) {
        // Thumbnail
        lock.update('<img src="' + bookmark.thumbnail + '">');
      } else {
        // iframe
        lock.update('<iframe src="' + bookmark.url + '" scrolling="no"></iframe>');
      }

      thumb.insert(lock);
      

      // link
      var a = new Element("a", { 'class': 'link', 'href': bookmark.url, 'title': bookmark.title, 'target': '_blank' }).update('<div class="title">' + bookmark.title + '</div>');
      thumb.insert(a);

      this.contentContainer.insert(thumb);

    }.bind(this));
  },

  buildContent: function() {
    var container = new Element("div", { 'class': 'content' });

    return(container);
  },

  buildIcon: function() {
    return(new Element("img", {
      src    : this.iconPath("na"),
      'class': 'bookmarks icon'
    }));
  },

  iconPath: function(code) {
    return("/images/bookmarks/star.png")
  },

  buildHeader: function() {
    return(new Element("h2", { 'class': 'handle' }).update(this.title));
  }
});

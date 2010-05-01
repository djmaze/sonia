var Twitter = Class.create(Widget, {
  initialize: function($super, widget_id, config) {
    this.messages = [];
    return($super(widget_id, config));
  },
  receive: function(payload) {
    if(this.messages.length >= this.config.nitems) {
      this.messages.shift();
    }
    this.messages.push(payload);
    this.update();
  },
  update: function() {
    this.container.childElements().invoke('remove');
    this.container.appendChild(this.buildWidgetIcon());
    this.container.appendChild(this.buildHeader());
    new Draggable(this.container, { handle: this.container.down(".handle") });
    this.messages.reverse(false).each(function(message) {
      var cont = new Element('p');
      cont.appendChild(new Element('img', { src: message.profile_image_url }));
      cont.appendChild(new Element('div', { 'class': 'author' }).update(message.user));
      cont.appendChild(document.createTextNode(message.text.replace(/http.*\w/ig,"")));
      cont.appendChild(new Element('hr' ))
      this.container.appendChild(cont);
      // new Effect.Pulsate(this.container, { pulses: 2, duration: 1 });
    }.bind(this));
  },

  buildHeader: function() {
    return(new Element("h2", { 'class': 'handle' }).update(this.title));
  },

  buildWidgetIcon: function() {
    return(new Element("img", { src: "images/twitter.png", width: 32, height: 32, className: 'twitter icon'}));
  }
});

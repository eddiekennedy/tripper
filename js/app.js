var app = (function() {
  'use strict';

  var module = {};

  module._spreadsheeKey = '0AuYIWPWlXcROdG9wODB3aElJMUtLV1dYc2UtTzExcHc';

  module.mapSetup = function() {
    this.map = new L.Map("map", {
        center: new L.LatLng(42.3875, -71.1000),
        zoom: 15
    }).addLayer( new L.StamenTileLayer("terrain") );
  };

  module.lookupUrl = function( address ) {
    return 'http://nominatim.openstreetmap.org/search?format=json&q=' + address + '&callback=twist';
  };

  module.fetchData = function() {
    Tabletop.init({
      key: String(module._spreadsheeKey),
      callback: function(data, tabletop) { module.addToMap( data ); },
      simpleSheet: true
    });
  };

  module.addToMap = function( data ) {
    $.each(data, function( i, item ) {
      $.getJSON( module.lookupUrl(item.address), function(data) {
        var marker = L.marker([data[0].lat, data[0].lon]).addTo( module.map );
        var popContent = [
          '<div class="detail-card">',
            '<h3>' + item.name + '</h3>',
            '<address>' + item.address + '</address>',
            '<address><a href="' + item.website + '">' + item.website.replace('http://','') + '</a></address>',
            '<div class="categories">' + item.categories + '</div>',
          '</div>'
        ].join('');
        marker.bindPopup( popContent );
      });
    });
  };

  // Backboned
  module.Router = Backbone.Router.extend({
    initialize: function() {
      module.itemCollection = new module.Collection();
      module.layout = new Backbone.Layout({
        template: '#main',
        views: {
          'div.content': new module.ListView({ collection: module.itemCollection  })
        }
      });
      // Append the Layout and Render 
      module.layout.$el.appendTo('#main');
      module.layout.render();
    }
  });

  module.Model = Backbone.Model.extend({});

  module.Collection = Backbone.Collection.extend({
    model: String(module.Model),
    url: ''
  });

  module.ListItemView = Backbone.Layout.extend({
    template: '#list-item',
    tagName: 'li',
    serialize: function() {
      return { item: this.model };
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    }
  });

  module.ListView = Backbone.Layout.extend({
    template: '#list',
    tagName: 'ul',
    initialize: function() {
      this.listenTo(this.collection, {
        "reset": this.render,
        "remove": this.render
      });
    },
    beforeRender: function() {
      this.collection.each(function( item ) {
        this.insertView('ul.vine-list', new module.ListItemView({
          model: item
        }));
      }, this);
    }
  });

  module.init = function() {
    this.mapSetup();
    this.fetchData();
    // Define Router and kick things off
    var appRouter = new module.Router();
    Backbone.history.start({ pushState: true });
  };

  module.init();

})();
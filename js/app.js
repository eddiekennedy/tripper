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

  module.init = function() {
    this.mapSetup();
    this.fetchData();
  };

  module.init();

})();
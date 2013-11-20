var spreadsheetKey = '0AuYIWPWlXcROdG9wODB3aElJMUtLV1dYc2UtTzExcHc';
var init = function( data ) {
  // Map Setup
  var map = new L.Map("map", {
      center: new L.LatLng(42.3875, -71.1000),
      zoom: 15
  }).addLayer( new L.StamenTileLayer("terrain") );
  // Item Loop
  $.each(data, function( i, item ) {
    var lookupLatLon = function(item) {
      return 'http://nominatim.openstreetmap.org/search?format=json&q=' + item.address + '&callback=twist';
    };
    $.getJSON(lookupLatLon(item), function(data) {
      //Add a marker to the map
      var marker = L.marker([data[0].lat, data[0].lon]).addTo( map );
      var popContent = [
        '<p>' + item.name + '</p>',
      ].join('');
      marker.bindPopup( popContent );
    });
  });
};
Tabletop.init({
  key: spreadsheetKey,
  callback: function(data, tabletop) { init(data); },
  simpleSheet: true
});
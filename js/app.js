// the openNav and closeNav is inspired from https://www.w3schools.com/howto/howto_js_sidenav.asp#
// the openNav it make menu for 250 px
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

// the closeNav is close the menu

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

var map, largeInfowindow, bounds;
var markers = [];

//this is data for Foursquare use in request
var ClientID = 'client_id=0LXRQDRBRZIL0UWECN4XTY025BQLWDYSWEEWM5QWR1O11N0G';
var ClientSecret = 'client_secret=VTZ3SFNF3HDHH5G1XKZZD45QURR2C2DPL1E4I5XZLAGA2O3I';
// this is the data
var locations = [{
    title: 'Alhamra park ',
    location: {
      lat: 25.973062,
      lng: 43.754495
    }
  },
  {
    title: 'Afran Alhatab Bakery ',
    location: {
      lat: 26.000588,
      lng: 43.731621
    }
  },
  {
    title: 'فور قايز ',
    location: {
      lat: 25.997484,
      lng: 43.727867
    }
  },
  {
    title: 'Panda',
    location: {
      lat: 25.998518,
      lng: 43.7316344
    }
  },
  {
    title: 'كودو',
    location: {
      lat: 25.998950,
      lng: 43.729622
    }
  },
  {
    title: 'دانكن دونات',
    location: {
      lat: 26.000603,
      lng: 43.731903
    }
  },
  {
    title: 'albadaya fitness',
    location: {
      lat: 25.996592,
      lng: 43.723349
    }
  }
];

// create map and set the marker
function CreateMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 25.975277,
      lng: 43.74577
    },
    zoom: 14

  });

  largeInfowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();


  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    // Get the title
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      this.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout((function() {
        this.setAnimation(null);
      }).bind(this), 800);
      populateInfoWindow(this, largeInfowindow);

    });

    bounds.extend(marker.position);
    // Push the marker to our array of markers.
    markers.push(marker);

  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

}

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;

    var respondSearch, respondPhotos, URLSearch, URLPhotos, htmlContent = '';
    //make search url

    URLSearch = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.position.lat() + ',' + marker.position.lng() + '&' + ClientID + '&' +
      ClientSecret + '&v=20180225&query=' + marker.title;

    //https://stackoverflow.com/questions/2765411/is-it-possible-to-set-asyncfalse-to-getjson-call
    // $.ajax({
    //   type:'GET',
    //   url:URLSearch,
    //   dataType:'json',
    //   async:false,
    // }).done(function(data){
    //   respondSearch = data.response.venues[0] ;
    // }).fail(function(){
    //   alert('foursquare data not download');
    // });
    // if(typeof respondSearch !== 'undefined'){
    //   htmlContent +=  '<div id="searchData"> <h3>'+respondSearch.name+'</h3><p><span>lat:'+
    //   respondSearch.location.lat+' lng:'+respondSearch.location.lng+'</span></p><p><span>country: '+respondSearch.location.country
    //   +'</span></p><p><span>categories: '+respondSearch.categories[0].pluralName+'</span></p></div>';
    // }


    //search for marker data from foursquare
    $.getJSON(URLSearch).done(function(data) {
      respondSearch = data.response.venues[0];
      //set data in html
      htmlContent += '<div id="searchData"> <h3>' + respondSearch.name + '</h3><p><span>lat:' +
        respondSearch.location.lat + ' lng:' + respondSearch.location.lng + '</span></p><p><span>country: ' + respondSearch.location.country +
        '</span></p><p><span>categories: ' + respondSearch.categories[0].pluralName + '</span></p></div>';
      // use id location to search for the place photos
      URLPhotos = 'https://api.foursquare.com/v2/venues/' + respondSearch.id + '?' + ClientID + '&' +
        ClientSecret + '&v=20180225';
      // search for ID photo and collect the data
      $.getJSON(URLPhotos).done(function(data) {
        respondPhotos = data.response.venue;
        if (respondPhotos.photos.count >= 1) {
          htmlContent += '<div id="searchPhotos"><img src=' + respondPhotos.photos.groups[0].items[2].prefix + '200x200' +
            respondPhotos.photos.groups[0].items[2].suffix + ' alt=' + respondSearch.name + '></div>'
        } else {
          htmlContent += "<div id='searchPhotos'><h4>There is no Image</h4>></div>";
        }
        infowindow.setContent(htmlContent);

      }).fail(function() {
        htmlContent += "<div id='searchPhotos'><h4>Error download Image</h4>></div>";
        infowindow.setContent(htmlContent);
      });


    }).fail(function() {
      alert('foursquare data not download');

    });
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.setMarker = null;
    });
  }
}

function googleMapsError() {
  alert("google map can not load.");
}
// this ViewModel is Temporary
// var viewModel = {
//     location:ko.observableArray(markers),
//     searchFilter:ko.observable('')
// }

//https://gist.github.com/hinchley/5973926
// make the knockout search
var viewModel = {
  markers: ko.observableArray(markers),
  location: ko.observableArray([]),
  query: ko.observable(''),

  search: function(value) {
    viewModel.location.removeAll();

    for (var i = 0; i <= viewModel.markers().length; i++) {
      if (viewModel.markers()[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        viewModel.markers()[i].setVisible(true);
        viewModel.location.push(viewModel.markers()[i]);
      } else viewModel.markers()[i].setVisible(false);
    }
  }
};

// start the program here
function start() {
  CreateMap();
  viewModel.query.subscribe(viewModel.search);
  ko.applyBindings(viewModel);
}

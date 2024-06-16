window.addEventListener('load', function () {
  checkApiStatus();

  const amenityIds = {};
  $('input[type=checkbox]').click(function () {
    updateAmenities(this, amenityIds);
  });

  loadPlaces();

  function checkApiStatus() {
    $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  }

  function updateAmenities(element, ids) {
    const id = $(element).attr('data-id');
    const name = $(element).attr('data-name');
    if ($(element).prop('checked')) {
      ids[id] = name;
    } else {
      delete ids[id];
    }
    updateAmenitiesDisplay(ids);
  }

  function updateAmenitiesDisplay(ids) {
    const amenitiesList = Object.values(ids).join(', ');
    $('div.amenities h4').html(amenitiesList || '&nbsp;');
  }

  function loadPlaces() {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({})
    }).done(function (data) {
      $('section.places').empty();
      data.forEach(place => {
        const template = generatePlaceTemplate(place);
        $('section.places').append(template);
      });
    });
  }

  function generatePlaceTemplate(place) {
    return `<article>
      <div class="title">
        <h2>${place.name}</h2>
        <div class="price_by_night">$${place.price_by_night}</div>
      </div>
      <div class="information">
        <div class="max_guest">
          <i class="fa fa-users fa-3x" aria-hidden="true"></i>
          <br />
          ${place.max_guest} Guests
        </div>
        <div class="number_rooms">
          <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
          <br />
          ${place.number_rooms} Bedrooms
        </div>
        <div class="number_bathrooms">
          <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
          <br />
          ${place.number_bathrooms} Bathroom
        </div>
      </div>
      <div class="description">
        ${place.description}
      </div>
    </article>`;
  }
});

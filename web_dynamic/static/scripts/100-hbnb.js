window.addEventListener('load', function () {
  checkApiStatus();

  const amenityIds = {};
  const stateIds = {};
  const cityIds = {};

  handleCheckboxChange('.amenities input[type=checkbox]', amenityIds);
  handleCheckboxChange('.stateCheckBox', stateIds);
  handleCheckboxChange('.cityCheckBox', cityIds);

  $('.filters button').click(function () {
    loadFilteredPlaces({ amenities: Object.keys(amenityIds), states: Object.keys(stateIds), cities: Object.keys(cityIds) });
  });

  function checkApiStatus() {
    $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  }

  function handleCheckboxChange(selector, ids) {
    $(selector).click(function () {
      const id = $(this).attr('data-id');
      if ($(this).prop('checked')) {
        ids[id] = $(this).attr('data-name');
      } else {
        delete ids[id];
      }
      updateLocationDisplay(ids);
    });
  }

  function updateLocationDisplay(ids) {
    const combinedIds = Object.values(amenityIds).concat(Object.values(stateIds), Object.values(cityIds));
    if (combinedIds.length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(combinedIds.join(', '));
    }
  }

  function loadFilteredPlaces(filters) {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify(filters)
    }).done(function (data) {
      $('section.places').empty();
      $('section.places').append('<h1>Places</h1>');
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

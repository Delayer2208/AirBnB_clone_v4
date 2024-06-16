window.addEventListener('load', function () {
  // Check API status
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  const amenityIds = {};
  const stateIds = {};
  const cityIds = {};

  function handleCheckboxChange(selector, ids) {
    $(selector).click(function () {
      const id = $(this).attr('data-id');
      if ($(this).prop('checked')) {
        ids[id] = $(this).attr('data-name');
      } else {
        delete ids[id];
      }
      const combinedIds = Object.values(amenityIds).concat(Object.values(stateIds), Object.values(cityIds));
      if (combinedIds.length === 0) {
        $(selector).closest('div').find('h4').html('&nbsp;');
      } else {
        $(selector).closest('div').find('h4').text(combinedIds.join(', '));
      }
    });
  }

  handleCheckboxChange('.amenities input[type=checkbox]', amenityIds);
  handleCheckboxChange('.stateCheckBox', stateIds);
  handleCheckboxChange('.cityCheckBox', cityIds);

  $('.filters button').click(function () {
    const filters = {
      amenities: Object.keys(amenityIds),
      states: Object.keys(stateIds),
      cities: Object.keys(cityIds)
    };
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify(filters)
    }).done(function (data) {
      $('section.places').empty();
      $('section.places').append('<h1>Places</h1>');
      for (const place of data) {
        const template = `<article>
          <div class="title">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />${place.max_guest} Guests</div>
            <div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />${place.number_rooms} Bedrooms</div>
            <div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />${place.number_bathrooms} Bathroom</div>
          </div>
          <div class="description">${place.description}</div>
          <div class="reviews">
            <h2>Reviews <span class="reviewSpan" data-id="${place.id}">show</span></h2>
            <ul></ul>
          </div>
        </article>`;
        $('section.places').append(template);
      }
      // Handle review toggling
      $('.reviewSpan').click(function () {
        const span = $(this);
        const placeId = span.attr('data-id');
        $.ajax(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`).done(function (data) {
          const ul = span.closest('.reviews').find('ul');
          if (span.text() === 'show') {
            for (const review of data) {
              ul.append(`<li>${review.text}</li>`);
            }
            span.text('hide');
          } else {
            ul.empty();
            span.text('show');
          }
        });
      });
    });
  });
});

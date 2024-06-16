window.addEventListener('load', function () {
  checkApiStatus();

  const amenityIds = {};
  $('input[type=checkbox]').click(function () {
    updateAmenities(this, amenityIds);
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
    $('div.amenities h4').html(amenitiesList || '&nbsp');
  }
});

window.addEventListener('load', function () {
  const amenityIds = {};
  
  $('input[type=checkbox]').change(function () {
    updateAmenities(this, amenityIds);
  });
  
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

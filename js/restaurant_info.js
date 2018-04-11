/* global DBHelper */

var restaurant;
var map;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(registration => {
      console.log('registration to serviceWorker complete with scope :', registration.scope);
    });
  });
}
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL().then(restaurant => {
    self.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: restaurant.latlng,
      scrollwheel: false
    });
    DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    fillBreadcrumb();
  });
};

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = () => {
  if (self.restaurant) {
    // restaurant already fetched!
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    return console.error('No restaurant id in URL');
  }
  return DBHelper.fetchRestaurantById(id).then(restaurant => self.restaurant = restaurant).then(fillRestaurantHTML).catch(error => console.error(error));
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.setAttribute('aria-label', `located at ${restaurant.address}`);

  const source = document.getElementById('restaurant-source');
  source.srcset = `${DBHelper.imageUrlForRestaurant(restaurant)}-large_x1.jpg 1x, ${DBHelper.imageUrlForRestaurant(restaurant)}-large_x2.jpg 2x`;
  source.media = '(min-width: 1000px)';

  const ndSource = document.getElementById('restaurant-ndSource');
  ndSource.srcset = `${DBHelper.imageUrlForRestaurant(restaurant)}-medium_x1.jpg 1x, ${DBHelper.imageUrlForRestaurant(restaurant)}-medium_x2.jpg 2x`;
  ndSource.media = '(min-width: 420px)';

  const thSource = document.getElementById('restaurant-thSource');
  thSource.srcset = `${DBHelper.imageUrlForRestaurant(restaurant)}-small_x2.jpg 2x, ${DBHelper.imageUrlForRestaurant(restaurant)}-small_x1.jpg 1x`;
  thSource.media = '(min-width: 320px)';

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = `${DBHelper.imageUrlForRestaurant(restaurant)}-large_x1.jpg`;
  image.setAttribute('sizes', '(max-width: 1100px) 85vw, (min-width: 1101px) 990px');
  image.alt = `${restaurant.name}'s  restaurant`;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  const labelFoodType = document.createElement('label');
  labelFoodType.innerHTML = `${restaurant.cuisine_type} food`;
  labelFoodType.setAttribute('hidden', 'hidden');
  labelFoodType.id = 'foodType';
  cuisine.parentNode.insertBefore(labelFoodType, cuisine.nextSibling);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
  return restaurant;
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    day.setAttribute('aria-label', `open on ${key}`);
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    time.setAttribute('aria-label', `${operatingHours[key]},`);
    row.appendChild(time);
    row.setAttribute('role', 'row');
    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = review => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.className = 'userName';
  name.innerHTML = review.name;
  name.setAttribute('aria-label', `${review.name},`);
  li.appendChild(name);

  const date = document.createElement('p');
  date.className = 'dateReview';
  date.innerHTML = review.date;
  date.setAttribute('aria-label', `${review.date},`);
  li.appendChild(date);

  const rating = document.createElement('p');
  let stars = document.createElement('span');
  rating.className = 'userRating';
  stars.className = 'ratingStars';
  for (let i = 0; i < review.rating; i++) {
    stars.innerHTML += '★';
  }
  stars.setAttribute('aria-label', `${review.rating} stars on 5,`);
  rating.innerHTML = 'Rating: ';
  rating.appendChild(stars);
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.className = 'userComments';
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  li.setAttribute('role', 'listitem');
  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = ` ${restaurant.name}`;
  li.className = 'fontawesome-arrow-right';
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwibWFwIiwibmF2aWdhdG9yIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInRoZW4iLCJyZWdpc3RyYXRpb24iLCJjb25zb2xlIiwibG9nIiwic2NvcGUiLCJpbml0TWFwIiwiZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCIsInNlbGYiLCJnb29nbGUiLCJtYXBzIiwiTWFwIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInpvb20iLCJjZW50ZXIiLCJsYXRsbmciLCJzY3JvbGx3aGVlbCIsIkRCSGVscGVyIiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCIsImZpbGxCcmVhZGNydW1iIiwiaWQiLCJnZXRQYXJhbWV0ZXJCeU5hbWUiLCJlcnJvciIsImZldGNoUmVzdGF1cmFudEJ5SWQiLCJmaWxsUmVzdGF1cmFudEhUTUwiLCJjYXRjaCIsIm5hbWUiLCJpbm5lckhUTUwiLCJhZGRyZXNzIiwic2V0QXR0cmlidXRlIiwic291cmNlIiwic3Jjc2V0IiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwibWVkaWEiLCJuZFNvdXJjZSIsInRoU291cmNlIiwiaW1hZ2UiLCJjbGFzc05hbWUiLCJzcmMiLCJhbHQiLCJjdWlzaW5lIiwiY3Vpc2luZV90eXBlIiwibGFiZWxGb29kVHlwZSIsImNyZWF0ZUVsZW1lbnQiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwibmV4dFNpYmxpbmciLCJvcGVyYXRpbmdfaG91cnMiLCJmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCIsImZpbGxSZXZpZXdzSFRNTCIsIm9wZXJhdGluZ0hvdXJzIiwiaG91cnMiLCJrZXkiLCJyb3ciLCJkYXkiLCJhcHBlbmRDaGlsZCIsInRpbWUiLCJyZXZpZXdzIiwiY29udGFpbmVyIiwidGl0bGUiLCJub1Jldmlld3MiLCJ1bCIsImZvckVhY2giLCJyZXZpZXciLCJjcmVhdGVSZXZpZXdIVE1MIiwibGkiLCJkYXRlIiwicmF0aW5nIiwic3RhcnMiLCJpIiwiY29tbWVudHMiLCJicmVhZGNydW1iIiwidXJsIiwibG9jYXRpb24iLCJocmVmIiwicmVwbGFjZSIsInJlZ2V4IiwiUmVnRXhwIiwicmVzdWx0cyIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLElBQUlBLFVBQUo7QUFDQSxJQUFJQyxHQUFKOztBQUVBLElBQUksbUJBQW1CQyxTQUF2QixFQUFrQztBQUNoQ0MsU0FBT0MsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsTUFBTTtBQUNwQ0YsY0FBVUcsYUFBVixDQUF3QkMsUUFBeEIsQ0FBaUMsT0FBakMsRUFBMENDLElBQTFDLENBQStDQyxnQkFBZ0I7QUFDN0RDLGNBQVFDLEdBQVIsQ0FBWSxxREFBWixFQUFtRUYsYUFBYUcsS0FBaEY7QUFDRCxLQUZEO0FBR0QsR0FKRDtBQUtEO0FBQ0Q7OztBQUdBUixPQUFPUyxPQUFQLEdBQWlCLE1BQU07QUFDckJDLDJCQUNHTixJQURILENBQ1FQLGNBQWM7QUFDbEJjLFNBQUtiLEdBQUwsR0FBVyxJQUFJYyxPQUFPQyxJQUFQLENBQVlDLEdBQWhCLENBQW9CQyxTQUFTQyxjQUFULENBQXdCLEtBQXhCLENBQXBCLEVBQW9EO0FBQzdEQyxZQUFNLEVBRHVEO0FBRTdEQyxjQUFRckIsV0FBV3NCLE1BRjBDO0FBRzdEQyxtQkFBYTtBQUhnRCxLQUFwRCxDQUFYO0FBS0FDLGFBQVNDLHNCQUFULENBQWdDWCxLQUFLZCxVQUFyQyxFQUFpRGMsS0FBS2IsR0FBdEQ7QUFDQXlCO0FBQ0QsR0FUSDtBQVVELENBWEQ7O0FBYUE7OztBQUdBLE1BQU1iLHlCQUF5QixNQUFNO0FBQ25DLE1BQUlDLEtBQUtkLFVBQVQsRUFBcUI7QUFBRTtBQUNyQjtBQUNEO0FBQ0QsUUFBTTJCLEtBQUtDLG1CQUFtQixJQUFuQixDQUFYO0FBQ0EsTUFBSSxDQUFDRCxFQUFMLEVBQVM7QUFBRTtBQUNULFdBQU9sQixR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QUwsQ0FBYSxTQUFiLEVBQXdCLE1BQXhCLENBQVA7QUFDQSxRQUFNQyxRQUFRLElBQUlDLE1BQUosQ0FBWSxPQUFNbkQsSUFBSyxtQkFBdkIsQ0FBZDtBQUFBLFFBQ0VvRCxVQUFVRixNQUFNRyxJQUFOLENBQVdQLEdBQVgsQ0FEWjtBQUVBLE1BQUksQ0FBQ00sT0FBTCxFQUNFLE9BQU8sSUFBUDtBQUNGLE1BQUksQ0FBQ0EsUUFBUSxDQUFSLENBQUwsRUFDRSxPQUFPLEVBQVA7QUFDRixTQUFPRSxtQkFBbUJGLFFBQVEsQ0FBUixFQUFXSCxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLEdBQTFCLENBQW5CLENBQVA7QUFDRCxDQVhEIiwiZmlsZSI6InJlc3RhdXJhbnRfaW5mby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBEQkhlbHBlciAqL1xuXG52YXIgcmVzdGF1cmFudDtcbnZhciBtYXA7XG5cbmlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCdzdy5qcycpLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZWdpc3RyYXRpb24gdG8gc2VydmljZVdvcmtlciBjb21wbGV0ZSB3aXRoIHNjb3BlIDonLCByZWdpc3RyYXRpb24uc2NvcGUpO1xuICAgIH0pO1xuICB9KTtcbn1cbi8qKlxuICogSW5pdGlhbGl6ZSBHb29nbGUgbWFwLCBjYWxsZWQgZnJvbSBIVE1MLlxuICovXG53aW5kb3cuaW5pdE1hcCA9ICgpID0+IHtcbiAgZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCgpXG4gICAgLnRoZW4ocmVzdGF1cmFudCA9PiB7XG4gICAgICBzZWxmLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgIHpvb206IDE2LFxuICAgICAgICBjZW50ZXI6IHJlc3RhdXJhbnQubGF0bG5nLFxuICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgREJIZWxwZXIubWFwTWFya2VyRm9yUmVzdGF1cmFudChzZWxmLnJlc3RhdXJhbnQsIHNlbGYubWFwKTtcbiAgICAgIGZpbGxCcmVhZGNydW1iKCk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEdldCBjdXJyZW50IHJlc3RhdXJhbnQgZnJvbSBwYWdlIFVSTC5cbiAqL1xuY29uc3QgZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCA9ICgpID0+IHtcbiAgaWYgKHNlbGYucmVzdGF1cmFudCkgeyAvLyByZXN0YXVyYW50IGFscmVhZHkgZmV0Y2hlZCFcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgaWQgPSBnZXRQYXJhbWV0ZXJCeU5hbWUoJ2lkJyk7XG4gIGlmICghaWQpIHsgLy8gbm8gaWQgZm91bmQgaW4gVVJMXG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ05vIHJlc3RhdXJhbnQgaWQgaW4gVVJMJyk7XG4gIH1cbiAgcmV0dXJuIERCSGVscGVyLmZldGNoUmVzdGF1cmFudEJ5SWQoaWQpXG4gICAgLnRoZW4ocmVzdGF1cmFudCA9PiBzZWxmLnJlc3RhdXJhbnQgPSByZXN0YXVyYW50KVxuICAgIC50aGVuKGZpbGxSZXN0YXVyYW50SFRNTClcbiAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcbiAqL1xuY29uc3QgZmlsbFJlc3RhdXJhbnRIVE1MID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LW5hbWUnKTtcbiAgbmFtZS5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5hbWU7XG5cbiAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWFkZHJlc3MnKTtcbiAgYWRkcmVzcy5pbm5lckhUTUwgPSByZXN0YXVyYW50LmFkZHJlc3M7XG4gIGFkZHJlc3Muc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYGxvY2F0ZWQgYXQgJHtyZXN0YXVyYW50LmFkZHJlc3N9YCk7XG5cbiAgY29uc3Qgc291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtc291cmNlJyk7XG4gIHNvdXJjZS5zcmNzZXQgPSBgJHtEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCl9LWxhcmdlX3gxLmpwZyAxeCwgJHtEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCl9LWxhcmdlX3gyLmpwZyAyeGA7XG4gIHNvdXJjZS5tZWRpYSA9ICcobWluLXdpZHRoOiAxMDAwcHgpJztcblxuICBjb25zdCBuZFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LW5kU291cmNlJyk7XG4gIG5kU291cmNlLnNyY3NldCA9IGAke0RCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KX0tbWVkaXVtX3gxLmpwZyAxeCwgJHtEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCl9LW1lZGl1bV94Mi5qcGcgMnhgO1xuICBuZFNvdXJjZS5tZWRpYSA9ICcobWluLXdpZHRoOiA0MjBweCknO1xuXG4gIGNvbnN0IHRoU291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtdGhTb3VyY2UnKTtcbiAgdGhTb3VyY2Uuc3Jjc2V0ID0gYCR7REJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpfS1zbWFsbF94Mi5qcGcgMngsICR7REJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpfS1zbWFsbF94MS5qcGcgMXhgO1xuICB0aFNvdXJjZS5tZWRpYSA9ICcobWluLXdpZHRoOiAzMjBweCknO1xuXG4gIGNvbnN0IGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaW1nJyk7XG4gIGltYWdlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50LWltZyc7XG4gIGltYWdlLnNyYyA9IGAke0RCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KX0tbGFyZ2VfeDEuanBnYDtcbiAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdzaXplcycsICcobWF4LXdpZHRoOiAxMTAwcHgpIDg1dncsIChtaW4td2lkdGg6IDExMDFweCkgOTkwcHgnKTtcbiAgaW1hZ2UuYWx0ID0gYCR7cmVzdGF1cmFudC5uYW1lfSdzICByZXN0YXVyYW50YDtcblxuICBjb25zdCBjdWlzaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtY3Vpc2luZScpO1xuICBjdWlzaW5lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuY3Vpc2luZV90eXBlO1xuICBjb25zdCBsYWJlbEZvb2RUeXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgbGFiZWxGb29kVHlwZS5pbm5lckhUTUwgPSBgJHtyZXN0YXVyYW50LmN1aXNpbmVfdHlwZX0gZm9vZGA7XG4gIGxhYmVsRm9vZFR5cGUuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gIGxhYmVsRm9vZFR5cGUuaWQgPSAnZm9vZFR5cGUnO1xuICBjdWlzaW5lLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGxhYmVsRm9vZFR5cGUsIGN1aXNpbmUubmV4dFNpYmxpbmcpO1xuXG4gIC8vIGZpbGwgb3BlcmF0aW5nIGhvdXJzXG4gIGlmIChyZXN0YXVyYW50Lm9wZXJhdGluZ19ob3Vycykge1xuICAgIGZpbGxSZXN0YXVyYW50SG91cnNIVE1MKCk7XG4gIH1cbiAgLy8gZmlsbCByZXZpZXdzXG4gIGZpbGxSZXZpZXdzSFRNTCgpO1xuICByZXR1cm4gcmVzdGF1cmFudDtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHJlc3RhdXJhbnQgb3BlcmF0aW5nIGhvdXJzIEhUTUwgdGFibGUgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuY29uc3QgZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwgPSAob3BlcmF0aW5nSG91cnMgPSBzZWxmLnJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSA9PiB7XG4gIGNvbnN0IGhvdXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaG91cnMnKTtcbiAgZm9yIChsZXQga2V5IGluIG9wZXJhdGluZ0hvdXJzKSB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblxuICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgZGF5LmlubmVySFRNTCA9IGtleTtcbiAgICBkYXkuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYG9wZW4gb24gJHtrZXl9YCk7XG4gICAgcm93LmFwcGVuZENoaWxkKGRheSk7XG5cbiAgICBjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICB0aW1lLmlubmVySFRNTCA9IG9wZXJhdGluZ0hvdXJzW2tleV07XG4gICAgdGltZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBgJHtvcGVyYXRpbmdIb3Vyc1trZXldfSxgKTtcbiAgICByb3cuYXBwZW5kQ2hpbGQodGltZSk7XG4gICAgcm93LnNldEF0dHJpYnV0ZSgncm9sZScsICdyb3cnKTtcbiAgICBob3Vycy5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIGFsbCByZXZpZXdzIEhUTUwgYW5kIGFkZCB0aGVtIHRvIHRoZSB3ZWJwYWdlLlxuICovXG5jb25zdCBmaWxsUmV2aWV3c0hUTUwgPSAocmV2aWV3cyA9IHNlbGYucmVzdGF1cmFudC5yZXZpZXdzKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWNvbnRhaW5lcicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gIHRpdGxlLmlubmVySFRNTCA9ICdSZXZpZXdzJztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICBpZiAoIXJldmlld3MpIHtcbiAgICBjb25zdCBub1Jldmlld3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbm9SZXZpZXdzLmlubmVySFRNTCA9ICdObyByZXZpZXdzIHlldCEnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChub1Jldmlld3MpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWxpc3QnKTtcbiAgcmV2aWV3cy5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgdWwuYXBwZW5kQ2hpbGQoY3JlYXRlUmV2aWV3SFRNTChyZXZpZXcpKTtcbiAgfSk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh1bCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSByZXZpZXcgSFRNTCBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlLlxuICovXG5jb25zdCBjcmVhdGVSZXZpZXdIVE1MID0gKHJldmlldykgPT4ge1xuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIG5hbWUuY2xhc3NOYW1lID0gJ3VzZXJOYW1lJztcbiAgbmFtZS5pbm5lckhUTUwgPSByZXZpZXcubmFtZTtcbiAgbmFtZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBgJHtyZXZpZXcubmFtZX0sYCk7XG4gIGxpLmFwcGVuZENoaWxkKG5hbWUpO1xuXG4gIGNvbnN0IGRhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGRhdGUuY2xhc3NOYW1lID0gJ2RhdGVSZXZpZXcnO1xuICBkYXRlLmlubmVySFRNTCA9IHJldmlldy5kYXRlO1xuICBkYXRlLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGAke3Jldmlldy5kYXRlfSxgKTtcbiAgbGkuYXBwZW5kQ2hpbGQoZGF0ZSk7XG5cbiAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBsZXQgc3RhcnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHJhdGluZy5jbGFzc05hbWUgPSAndXNlclJhdGluZyc7XG4gIHN0YXJzLmNsYXNzTmFtZSA9ICdyYXRpbmdTdGFycyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmV2aWV3LnJhdGluZzsgaSsrKSB7XG4gICAgc3RhcnMuaW5uZXJIVE1MICs9ICfimIUnO1xuICB9XG4gIHN0YXJzLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGAke3Jldmlldy5yYXRpbmd9IHN0YXJzIG9uIDUsYCk7XG4gIHJhdGluZy5pbm5lckhUTUwgPSAnUmF0aW5nOiAnO1xuICByYXRpbmcuYXBwZW5kQ2hpbGQoc3RhcnMpO1xuICBsaS5hcHBlbmRDaGlsZChyYXRpbmcpO1xuXG4gIGNvbnN0IGNvbW1lbnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb21tZW50cy5jbGFzc05hbWUgPSAndXNlckNvbW1lbnRzJztcbiAgY29tbWVudHMuaW5uZXJIVE1MID0gcmV2aWV3LmNvbW1lbnRzO1xuICBsaS5hcHBlbmRDaGlsZChjb21tZW50cyk7XG5cbiAgbGkuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2xpc3RpdGVtJyk7XG4gIHJldHVybiBsaTtcbn07XG5cbi8qKlxuICogQWRkIHJlc3RhdXJhbnQgbmFtZSB0byB0aGUgYnJlYWRjcnVtYiBuYXZpZ2F0aW9uIG1lbnVcbiAqL1xuY29uc3QgZmlsbEJyZWFkY3J1bWIgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xuICBjb25zdCBicmVhZGNydW1iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JyZWFkY3J1bWInKTtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBsaS5pbm5lckhUTUwgPSBgICR7cmVzdGF1cmFudC5uYW1lfWA7XG4gIGxpLmNsYXNzTmFtZSA9ICdmb250YXdlc29tZS1hcnJvdy1yaWdodCc7XG4gIGxpLnNldEF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50JywgJ3BhZ2UnKTtcbiAgYnJlYWRjcnVtYi5hcHBlbmRDaGlsZChsaSk7XG59O1xuXG4vKipcbiAqIEdldCBhIHBhcmFtZXRlciBieSBuYW1lIGZyb20gcGFnZSBVUkwuXG4gKi9cbmNvbnN0IGdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lLCB1cmwpID0+IHtcbiAgaWYgKCF1cmwpXG4gICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCksXG4gICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgaWYgKCFyZXN1bHRzKVxuICAgIHJldHVybiBudWxsO1xuICBpZiAoIXJlc3VsdHNbMl0pXG4gICAgcmV0dXJuICcnO1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufTsiXX0=

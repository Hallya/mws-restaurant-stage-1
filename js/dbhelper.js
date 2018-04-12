class DBHelper {

  static get DATABASE_URL() {
    const path = window.location.hostname === 'hallya.github.io' ? 'data/restaurants.json' : 'http://localhost:1337/restaurants';
    // const path = 'http://localhost:1337/restaurants';
    return path;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return fetch(DBHelper.DATABASE_URL).then(response => response.json().restaurants).catch(error => console.error(`Request failed. Returned status of ${error}`));
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id) {
    // fetch all restaurants with proper error handling.
    return fetch(DBHelper.DATABASE_URL).then(response => response.json()).then(data => {
      return data[id - 1];
    }).catch(error => console.error(`Restaurant does not exist: ${error}`));
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return DBHelper.fetchRestaurants().then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine)).catch(error => console.error(error));
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants().then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood)).catch(error => console.error(error));
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants().then(restaurants => {
      let results = restaurants;
      if (cuisine !== 'all') {
        results = restaurants.filter(r => r.cuisine_type == cuisine);
      }
      if (neighborhood !== 'all') {
        results = restaurants.filter(r => r.neighborhood == neighborhood);
      }
      return results;
    }).catch(error => console.error(error));
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods() {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants().then(restaurants => {
      // Get all neighborhoods from all restaurants
      const neighborhoods = restaurants.map(restaurant => restaurant.neighborhood);
      // Remove duplicates from neighborhoods
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
      return uniqueNeighborhoods;
    }).catch(error => console.error(error));
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines() {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants().then(restaurants => {
      // Get all cuisines from all restaurants
      const cuisines = restaurants.map(restaurant => restaurant.cuisine_type);
      // Remove duplicates from cuisines
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
      return uniqueCuisines;
    }).catch(error => console.error(error));
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return `assets/img/${restaurant.photograph}`;
  }

  /**q
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP });
    return marker;
  }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiREFUQUJBU0VfVVJMIiwicGF0aCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJmZXRjaFJlc3RhdXJhbnRzIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwicmVzdGF1cmFudHMiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImZldGNoUmVzdGF1cmFudEJ5SWQiLCJpZCIsImRhdGEiLCJmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUiLCJjdWlzaW5lIiwiZmlsdGVyIiwiciIsImN1aXNpbmVfdHlwZSIsImZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kIiwibmVpZ2hib3Job29kIiwiZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kIiwicmVzdWx0cyIsImZldGNoTmVpZ2hib3Job29kcyIsIm5laWdoYm9yaG9vZHMiLCJtYXAiLCJyZXN0YXVyYW50IiwidW5pcXVlTmVpZ2hib3Job29kcyIsInYiLCJpIiwiaW5kZXhPZiIsImZldGNoQ3Vpc2luZXMiLCJjdWlzaW5lcyIsInVuaXF1ZUN1aXNpbmVzIiwidXJsRm9yUmVzdGF1cmFudCIsImltYWdlVXJsRm9yUmVzdGF1cmFudCIsInBob3RvZ3JhcGgiLCJtYXBNYXJrZXJGb3JSZXN0YXVyYW50IiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsUUFBTixDQUFlOztBQUViLGFBQVdDLFlBQVgsR0FBMEI7QUFDeEIsVUFBTUMsT0FBT0MsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsS0FBNkIsa0JBQTdCLEdBQWtELHVCQUFsRCxHQUE0RSxtQ0FBekY7QUFDQTtBQUNBLFdBQU9ILElBQVA7QUFDRDs7QUFFRDs7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U2hCLE1BQVQsQ0FBZ0IsQ0FBQ1ksQ0FBRCxFQUFJQyxDQUFKLEtBQVVHLFNBQVNGLE9BQVQsQ0FBaUJGLENBQWpCLEtBQXVCQyxDQUFqRCxDQUF2QjtBQUNBLGFBQU9JLGNBQVA7QUFDRCxLQVBJLEVBT0Z6QixLQVBFLENBT0lDLFNBQVNDLFFBQVFELEtBQVIsQ0FBY0EsS0FBZCxDQVBiLENBQVA7QUFRRDs7QUFFRDs7O0FBR0EsU0FBT3lCLGdCQUFQLENBQXdCUixVQUF4QixFQUFvQztBQUNsQyxXQUFTLHNCQUFxQkEsV0FBV2QsRUFBRyxFQUE1QztBQUNEOztBQUVEOzs7QUFHQSxTQUFPdUIscUJBQVAsQ0FBNkJULFVBQTdCLEVBQXlDO0FBQ3ZDLFdBQVMsY0FBYUEsV0FBV1UsVUFBVyxFQUE1QztBQUNEOztBQUVEOzs7QUFHQSxTQUFPQyxzQkFBUCxDQUE4QlgsVUFBOUIsRUFBMENELEdBQTFDLEVBQStDO0FBQzdDLFVBQU1hLFNBQVMsSUFBSUMsT0FBT0MsSUFBUCxDQUFZQyxNQUFoQixDQUF1QjtBQUNwQ0MsZ0JBQVVoQixXQUFXaUIsTUFEZTtBQUVwQ0MsYUFBT2xCLFdBQVdtQixJQUZrQjtBQUdwQ0MsV0FBS2xELFNBQVNzQyxnQkFBVCxDQUEwQlIsVUFBMUIsQ0FIK0I7QUFJcENELFdBQUtBLEdBSitCO0FBS3BDc0IsaUJBQVdSLE9BQU9DLElBQVAsQ0FBWVEsU0FBWixDQUFzQkMsSUFMRyxFQUF2QixDQUFmO0FBT0EsV0FBT1gsTUFBUDtBQUNEO0FBOUhZIiwiZmlsZSI6ImRiaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgREJIZWxwZXIge1xyXG5cclxuICBzdGF0aWMgZ2V0IERBVEFCQVNFX1VSTCgpIHtcclxuICAgIGNvbnN0IHBhdGggPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09ICdoYWxseWEuZ2l0aHViLmlvJyA/ICdkYXRhL3Jlc3RhdXJhbnRzLmpzb24nIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXN0YXVyYW50cyc7XHJcbiAgICAvLyBjb25zdCBwYXRoID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXN0YXVyYW50cyc7XHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIGFsbCByZXN0YXVyYW50cy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50cygpIHtcclxuICAgIHJldHVybiBmZXRjaChEQkhlbHBlci5EQVRBQkFTRV9VUkwpXHJcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKS5yZXN0YXVyYW50cylcclxuICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoYFJlcXVlc3QgZmFpbGVkLiBSZXR1cm5lZCBzdGF0dXMgb2YgJHtlcnJvcn1gKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkKSB7XHJcbiAgICAvLyBmZXRjaCBhbGwgcmVzdGF1cmFudHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICByZXR1cm4gZmV0Y2goREJIZWxwZXIuREFUQUJBU0VfVVJMKVxyXG4gICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgIHJldHVybiBkYXRhW2lkIC0gMV07XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKGBSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0OiAke2Vycm9yfWApKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSB0eXBlIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSkge1xyXG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzICB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZ1xyXG4gICAgcmV0dXJuIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKVxyXG4gICAgICAudGhlbihyZXN0YXVyYW50cyA9PiByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeU5laWdoYm9yaG9vZChuZWlnaGJvcmhvb2QpIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgcmV0dXJuIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKVxyXG4gICAgICAudGhlbihyZXN0YXVyYW50cyA9PiByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpKVxyXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCkge1xyXG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICByZXR1cm4gREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygpXHJcbiAgICAgIC50aGVuKHJlc3RhdXJhbnRzID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzO1xyXG4gICAgICAgIGlmIChjdWlzaW5lICE9PSAnYWxsJykge1xyXG4gICAgICAgICAgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmVpZ2hib3Job29kICE9PSAnYWxsJykge1xyXG4gICAgICAgICAgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoTmVpZ2hib3Job29kcygpIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgcmV0dXJuIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKVxyXG4gICAgICAudGhlbihyZXN0YXVyYW50cyA9PiB7XHJcbiAgICAgICAgLy8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXHJcbiAgICAgICAgY29uc3QgbmVpZ2hib3Job29kcyA9IHJlc3RhdXJhbnRzLm1hcChyZXN0YXVyYW50ID0+IHJlc3RhdXJhbnQubmVpZ2hib3Job29kKTtcclxuICAgICAgICAvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIG5laWdoYm9yaG9vZHNcclxuICAgICAgICBjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PSBpKTtcclxuICAgICAgICByZXR1cm4gdW5pcXVlTmVpZ2hib3Job29kcztcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIGFsbCBjdWlzaW5lcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hDdWlzaW5lcygpIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgcmV0dXJuIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKVxyXG4gICAgICAudGhlbihyZXN0YXVyYW50cyA9PiB7XHJcbiAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKHJlc3RhdXJhbnQgPT4gcmVzdGF1cmFudC5jdWlzaW5lX3R5cGUpO1xyXG4gICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcclxuICAgICAgICBjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PSBpKTtcclxuICAgICAgICByZXR1cm4gdW5pcXVlQ3Vpc2luZXM7XHJcbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXHJcbiAgICovXHJcbiAgc3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgaW1hZ2UgVVJMLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgYXNzZXRzL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1gKTtcclxuICB9XHJcblxyXG4gIC8qKnFcclxuICAgKiBNYXAgbWFya2VyIGZvciBhIHJlc3RhdXJhbnQuXHJcbiAgICovXHJcbiAgc3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XHJcbiAgICBjb25zdCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgcG9zaXRpb246IHJlc3RhdXJhbnQubGF0bG5nLFxyXG4gICAgICB0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxyXG4gICAgICB1cmw6IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksXHJcbiAgICAgIG1hcDogbWFwLFxyXG4gICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QfVxyXG4gICAgKTtcclxuICAgIHJldHVybiBtYXJrZXI7XHJcbiAgfVxyXG59Il19

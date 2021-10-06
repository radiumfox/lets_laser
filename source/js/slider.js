const photosCarousel = document.querySelector('.photos__carousel');
const reviewsCarousel = document.querySelector('.reviews__carousel');

if(photosCarousel) {
  const glidePhotos = new Glide('.photos__carousel', {
    type: 'slider',
    startAt: 0,
    autoplay: 3000,
    focusAt: '0',
    perView: 2,

    breakpoints: {
      400: {
        perView: 1,
        focusAt: 'center',
      }
    }
  });

  glidePhotos.mount();
}

if(reviewsCarousel) {
  const glideReviews = new Glide('.reviews__carousel', {
    type: 'slider',
    focusAt: 'center',
    startAt: 0,
    perView: 1,
  });

  glideReviews.mount();
}

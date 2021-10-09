const photosCarousel = document.querySelector('.photos__carousel');

if(photosCarousel) {
  const glidePhotos = new Glide('.photos__carousel', {
    type: 'slider',
    startAt: 0,
    autoplay: 3000,
    focusAt: '0',
    perView: 2,

    breakpoints: {
      1060: {
        perView: 1,
        focusAt: 'center',
      }
    }
  });

  glidePhotos.mount();
}

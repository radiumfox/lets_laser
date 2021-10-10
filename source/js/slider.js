document.addEventListener( 'DOMContentLoaded', function() {
  if(document.querySelector('.photos__carousel')) {
    const photosCarousel = new Splide( '.photos__carousel', {
      perMove: 1,
      fixedWidth: '50%',
      type: 'loop',
      pagination: 'slider',
      arrows: false,
      autoplay: true,
      pauseOnHover: true,

      classes: {
        pagination: 'bullets',
        page: 'bullets__item',
      },

      breakpoints: {
        1060: {
          fixedWidth: '360px',
          focus: 'center',
        },

        768: {
          fixedWidth: '100%',
        },
      }
    });

    photosCarousel.mount();
    document.querySelector('.photos__carousel').classList.remove('photos__carousel--nojs');
    const photosList = document.querySelector('.photos__slides');
    photosList.classList.remove('photos__slides--nojs');
  }
});

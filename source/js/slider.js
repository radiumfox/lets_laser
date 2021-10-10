document.addEventListener( 'DOMContentLoaded', function() {
  const splide = new Splide( '.splide', {
    perMove: 1,
    fixedWidth: '50%',
    type: 'loop',
    pagination: 'slider',
    arrows: false,
    autoplay: true,
    pauseOnHover: true,

    classes: {
      pagination: 'bullets__list',
      page: 'bullet',
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
  } );
  splide.mount();
} );

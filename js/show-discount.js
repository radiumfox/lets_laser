const introTitle = document.querySelector('.intro__title');
const introBox = document.querySelector('.intro__box');

if(introBox) {
  introBox.classList.remove('intro__box--nojs');
}

if (introTitle && introBox && window.innerWidth < 768) {
  introTitle.classList.add('carousel-item');
  introTitle.classList.add('active');
  introBox.classList.add('carousel-item');
}

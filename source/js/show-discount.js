const introItem = document.querySelector('.intro__title');
const introItem2 = document.querySelector('.intro__box');
introItem2.classList.remove('intro__box--nojs');

if (window.innerWidth < 768) {
  introItem.classList.add('carousel-item');
  introItem.classList.add('active');
  introItem2.classList.add('carousel-item');
}

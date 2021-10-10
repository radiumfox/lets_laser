const pageHeaderMenu = document.querySelector('.page-header__menu');
if(pageHeaderMenu) {
  pageHeaderMenu.classList.remove('page-header__menu--nojs');
}

const faqContent = document.querySelectorAll('.faq__content');

if(faqContent) {
  faqContent.forEach(element => element.classList.add('collapse'));
}

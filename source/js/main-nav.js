const navMain = document.querySelector('.main-nav');
const pageFooter = document.querySelector('.page-footer');

const navToggle = document.querySelector('.main-nav__toggle');
if (navMain) {
  navToggle.addEventListener('click', () => {

    if (!navMain.classList.contains('main-nav--opened')) {
      navMain.classList.add('main-nav--opened');
      body.classList.add('page-body--noscroll');
    } else {
      navMain.classList.remove('main-nav--opened');
      body.classList.remove('page-body--noscroll');
    }
  });
}

const treatLinks = (link) => {
  link.addEventListener('click', (evt)=> {
    evt.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id).scrollIntoView({block: 'start', behavior: 'smooth'});
    body.classList.remove('page-body--noscroll');
    navMain.classList.remove('main-nav--opened');
  });
}

if (pageFooter) {
  const footerLinks = pageFooter.querySelectorAll('a');
  footerLinks.forEach(link => treatLinks(link));
};

if(navMain) {
  const navLinks = navMain.querySelectorAll('a');
  navLinks.forEach(link => treatLinks(link));
}

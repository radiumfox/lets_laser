const navMain = document.querySelector('.main-nav');

const navFooter = document.querySelector('.page-footer__nav-list');

const treatLinks = (link) => {
  link.removeAttribute('href');
  link.addEventListener('click', (evt)=> {
    const id = evt.target.dataset.id;
    const element = document.querySelector(`#${id}`);
    element.scrollIntoView({block: 'center', behavior: 'smooth'});
  });

}

if (navFooter) {
  const footerLinks = navFooter.querySelectorAll('a');
  footerLinks.forEach(link => treatLinks(link));
};

if(navMain) {
  const navLinks = navMain.querySelectorAll('a');
  navLinks.forEach(link => treatLinks(link));
}

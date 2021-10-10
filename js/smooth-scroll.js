const navMain = document.querySelector('.main-nav');
const pageFooter = document.querySelector('.page-footer');

const treatLinks = (link) => {
  link.addEventListener('click', (evt)=> {
    evt.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id).scrollIntoView({block: 'center', behavior: 'smooth'});
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

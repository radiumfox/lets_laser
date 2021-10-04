const navMain = document.querySelector('.main-nav');
const navLinks = navMain.querySelectorAll('a');

navLinks.forEach(link => {
  link.addEventListener('click', (evt)=> {
    const id = evt.target.dataset.id;
    const element = document.querySelector(`#${id}`);
    element.scrollIntoView({block: 'center', behavior: 'smooth'});
  });
});

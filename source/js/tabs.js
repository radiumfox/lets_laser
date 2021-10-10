const tabs = document.querySelector('.pricing__tabs');
const tabContent = document.querySelectorAll('.pricing__table');
const tabLinks = document.querySelectorAll('.pricing__tab');
let tableTitles;

if(tabLinks) {
  tabLinks.forEach(link => link.removeAttribute('href'));
}

if(tabContent) {
  tabContent.forEach(table => table.classList.remove('pricing__table--nojs'));
}

if(tabs) {
  tableTitles = document.querySelectorAll('.pricing__table-title');
  tableTitles.forEach(title => {
    title.classList.remove('pricing__table-title--nojs');
  });
  tabs.addEventListener('click', (evt)=> {
    evt.preventDefault();
    const id = evt.target.dataset.id;
    if(id) {
      tabLinks.forEach(link => {
        link.classList.remove('pricing__tab--current');
      });
      evt.target.classList.add('pricing__tab--current');

      tabContent.forEach(content => {
        content.classList.add('pricing__table--hide');
      });

      const element = document.querySelector(`#${id}`);
      element.classList.remove('pricing__table--hide');
    }
  });
}

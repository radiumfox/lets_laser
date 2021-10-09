const tabs = document.querySelector(".tabs");
const tabContent = document.querySelectorAll(".tab-content");
const tabLinks = document.querySelectorAll(".tab");

if(tabLinks) {
  tabLinks.forEach(link => link.removeAttribute('href'));
}

if(tabs) {
  tabs.addEventListener("click", (evt)=> {
    evt.preventDefault();
    const id = evt.target.dataset.id;
    if(id) {
      tabLinks.forEach(link => {
        link.classList.remove("current");
      });
      evt.target.classList.add("current");

      tabContent.forEach(content => {
        content.classList.add("hide");
      });

      const element = document.querySelector(`#${id}`);
      element.classList.remove("hide");
    }
  });
}

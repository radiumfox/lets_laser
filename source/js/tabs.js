const tabs = document.querySelector(".tabs");
const tabContent = document.querySelectorAll(".tab-content");
const tabLinks = document.querySelectorAll(".tab");

tabs.addEventListener("click", (evt)=> {
  evt.preventDefault();

  const id = evt.target.dataset.id;
  if(id) {
    tabLinks.forEach(tabLink => {
      tabLink.classList.remove("current");
    });
    evt.target.classList.add("current");

    tabContent.forEach(content => {
      content.classList.remove("current");
    });
    const element = document.getElementById(id);
    element.classList.add("current");
  }
});

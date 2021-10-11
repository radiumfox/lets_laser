const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
const successMessageTemplate = document.querySelector('#success');
const modalWindow = document.querySelector('.modal-feedback');
let successMessageContent;

//////////// feedback-form

const inputPhone = document.querySelector('#feedback-phone');
const inputName = document.querySelector('#feedback-name');
const feedbackForm = document.querySelector('.feedback__form');
const feedbackWrapper = document.querySelector('.feedback__wrapper');

// валидация поля ввода телефона

if (feedbackForm) {
  const onPhoneInput = () => {
    if(inputPhone.value){
      if (phoneRegExp.test(inputPhone.value)){
        inputPhone.setCustomValidity('');
        inputPhone.reportValidity();
      } else {
        inputPhone.setCustomValidity('В это поле нельзя вводить буквы');
        inputPhone.reportValidity();
      }
    } else {
      inputPhone.setCustomValidity('');
    }
  };

  inputPhone.addEventListener('input', onPhoneInput);
}

// сообщение об успешной отправке

if (feedbackForm && successMessageTemplate) {
  successMessageContent = successMessageTemplate.content.querySelector('.feedback__success');
  let isStorageSupport = true;
  let phoneStorage = '';

  try {
    phoneStorage = localStorage.getItem('phoneNumber');
  } catch (err) {
    isStorageSupport = false;
  }

  const removeMessage = () => {
    const successMessage = document.querySelector('.feedback__success');
    if(successMessage) {
      successMessage.remove();
    }
  }

  const showSuccessMessage = () => {
    const successMessage = successMessageContent.cloneNode(true);
    feedbackWrapper.appendChild(successMessage);
  }

  feedbackForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (isStorageSupport) {
      if(inputPhone.value) {
        localStorage.setItem('phoneNumber', inputPhone.value);
      }
    };

    showSuccessMessage();
    document.querySelector('.feedback__success-button').addEventListener('click', removeMessage);
    inputPhone.value = '';
    inputName.value = '';
  });
}

//////////// modal-feedback-form

const modalInputPhone = document.querySelector('#modal-feedback-phone');
const modalInputName = document.querySelector('#modal-feedback-name');
const modalFeedbackForm = document.querySelector('.modal-feedback__form');
const modalFeedbackWrapper = document.querySelector('.modal-feedback__wrapper');
const body = document.querySelector('.page-body');
const introSection = document.querySelector('.intro');
let introButton;

let modalButtonClose

if(modalWindow) {
  modalButtonClose = modalWindow.querySelector('.modal-feedback__button-close');
  modalButtonClose.addEventListener('click', () => {
    modalWindow.classList.remove('modal-feedback--show');
    body.classList.remove('page-body--blur');
  });
}

if(introSection) {
  introButton = introSection.querySelector('.button');
  introButton.addEventListener('click', () => {
    body.classList.add('page-body--blur');
    modalWindow.classList.add('modal-feedback--show');
  });
}

// валидация поля ввода телефона

if (modalFeedbackForm) {
  const onPhoneInput = () => {
    if(modalInputPhone.value){
      if (phoneRegExp.test(modalInputPhone.value)){
        modalInputPhone.setCustomValidity('');
        modalInputPhone.reportValidity();
      } else {
        modalInputPhone.setCustomValidity('В это поле нельзя вводить буквы');
        modalInputPhone.reportValidity();
      }
    } else {
      modalInputPhone.setCustomValidity('');
    }
  };

  modalInputPhone.addEventListener('input', onPhoneInput);
}

// сообщение об успешной отправке

if (modalFeedbackForm && successMessageTemplate) {
  successMessageContent = successMessageTemplate.content.querySelector('.feedback__success');
  let isStorageSupport = true;
  let phoneStorage = '';

  try {
    phoneStorage = localStorage.getItem('phoneNumber');
  } catch (err) {
    isStorageSupport = false;
  }

  const removeMessage = () => {
    const successMessage = document.querySelector('.feedback__success');
    if(successMessage) {
      successMessage.remove();
    }
  }

  const showSuccessMessage = () => {
    const successMessage = successMessageContent.cloneNode(true);
    modalFeedbackWrapper.appendChild(successMessage);
  }

  modalFeedbackForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (isStorageSupport) {
      if(inputPhone.value) {
        localStorage.setItem('phoneNumber', inputPhone.value);
      }
    };

    showSuccessMessage();
    document.querySelector('.feedback__success-button').addEventListener('click', removeMessage);
    document.querySelector('.button-close').addEventListener('click', removeMessage);
    inputPhone.value = '';
    inputName.value = '';
  });
}

const videoBackgrounds = document.querySelectorAll('video');

document.addEventListener('DOMContentLoaded', () => {
  videoBackgrounds.forEach(video => {
    video.setAttribute('loop', 'loop');
    video.setAttribute('autoplay', 'autoplay');
  });
});

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

const pageHeaderMenu = document.querySelector('.page-header__menu');
if(pageHeaderMenu) {
  pageHeaderMenu.classList.remove('page-header__menu--nojs');
}

const faqContent = document.querySelectorAll('.faq__content');

if(faqContent) {
  faqContent.forEach(element => element.classList.add('collapse'));
}

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

document.addEventListener( 'DOMContentLoaded', function() {
  if(document.querySelector('.photos__carousel')) {
    const photosCarousel = new Splide( '.photos__carousel', {
      perMove: 1,
      fixedWidth: '50%',
      type: 'loop',
      pagination: 'slider',
      arrows: false,
      autoplay: true,
      pauseOnHover: true,

      classes: {
        pagination: 'bullets',
        page: 'bullets__item',
      },

      breakpoints: {
        1060: {
          fixedWidth: '360px',
          focus: 'center',
        },

        768: {
          fixedWidth: '100%',
        },
      }
    });

    photosCarousel.mount();
    document.querySelector('.photos__carousel').classList.remove('photos__carousel--nojs');
    const photosList = document.querySelector('.photos__slides');
    photosList.classList.remove('photos__slides--nojs');
  }
});

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

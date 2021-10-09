const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
const successMessageTemplate = document.querySelector("#success");
let successMessageContent;

//////////// feedback-form

const inputPhone = document.querySelector("#feedback-phone");
const inputName = document.querySelector("#feedback-name");
const feedbackForm = document.querySelector(".feedback__form");
const feedbackWrapper = document.querySelector(".feedback__wrapper");

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

  inputPhone.addEventListener("input", onPhoneInput);
}

// сообщение об успешной отправке

if (successMessageTemplate) {
  successMessageContent = successMessageTemplate.content.querySelector(".feedback__success");
  let isStorageSupport = true;
  let phoneStorage = "";

  try {
    phoneStorage = localStorage.getItem("phoneNumber");
  } catch (err) {
    isStorageSupport = false;
  }

  const removeMessage = () => {
    const successMessage = document.querySelector(".feedback__success");
    if(successMessage) {
      successMessage.remove();
    }
  }

  const showSuccessMessage = () => {
    const successMessage = successMessageContent.cloneNode(true);
    feedbackWrapper.appendChild(successMessage);
  }

  feedbackForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    if (isStorageSupport) {
      if(inputPhone.value) {
        localStorage.setItem("phoneNumber", inputPhone.value);
      }
    };

    showSuccessMessage();
    document.querySelector(".feedback__success-button").addEventListener('click', removeMessage);
    inputPhone.value = '';
    inputName.value = '';
  });
}


//////////// modal-feedback-form

const modalInputPhone = document.querySelector("#modal-feedback-phone");
const modalInputName = document.querySelector("#modal-feedback-name");
const modalFeedbackForm = document.querySelector(".modal-feedback__form");
const modalFeedbackWrapper = document.querySelector(".modal-feedback__wrapper");
const body = document.querySelector('.page-body');
const introSection = document.querySelector('.intro');
let introButton;
const modalWindow = document.querySelector('.modal-feedback');
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

  modalInputPhone.addEventListener("input", onPhoneInput);
}

// сообщение об успешной отправке

if (successMessageTemplate) {
  successMessageContent = successMessageTemplate.content.querySelector(".feedback__success");
  let isStorageSupport = true;
  let phoneStorage = "";

  try {
    phoneStorage = localStorage.getItem("phoneNumber");
  } catch (err) {
    isStorageSupport = false;
  }

  const removeMessage = () => {
    const successMessage = document.querySelector(".feedback__success");
    if(successMessage) {
      successMessage.remove();
    }
  }

  const showSuccessMessage = () => {
    const successMessage = successMessageContent.cloneNode(true);
    modalFeedbackWrapper.appendChild(successMessage);
  }

  modalFeedbackForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    if (isStorageSupport) {
      if(inputPhone.value) {
        localStorage.setItem("phoneNumber", inputPhone.value);
      }
    };

    showSuccessMessage();
    document.querySelector(".feedback__success-button").addEventListener('click', removeMessage);
    inputPhone.value = '';
    inputName.value = '';
  });
}

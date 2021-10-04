const inputPhone = document.querySelector("#feedback-phone");
const feedbackSection = document.querySelector('#feedback');
const feedbackForm = feedbackSection.querySelector(".feedback__form");
const feedbackWrapper = feedbackSection.querySelector(".feedback__wrapper");
const successMessageTemplate = document.querySelector("#success").content.querySelector(".feedback__success");
const successButton = document.querySelector(".feedback__success-button");

let isStorageSupport = true;
let phoneStorage = "";

try {
  phoneStorage = localStorage.getItem("phoneNumber");
} catch (err) {
  isStorageSupport = false;
}

const removeMessage = () => {
  const successMessage = document.querySelector(".feedback__success");
  if (successMessage) {
    successMessage.remove();
  }
}

const onButtonPress = () => {
  removeMessage();
  successButton.removeEventListener("click", onButtonPress);
}

const showSuccessMessage = () => {
  const successMessage = successMessageTemplate.cloneNode(true);
  feedbackWrapper.appendChild(successMessage);
}

feedbackForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  showSuccessMessage();
  if (isStorageSupport) {
    if(inputPhone.value) {
      localStorage.setItem("phoneNumber", inputPhone.value);
    }
  };
  document.querySelector('.feedback__success-button').addEventListener('click', onButtonPress);
});

const body = document.querySelector('.page-body');
const introSection = document.querySelector('.intro');
const introButton = introSection.querySelector('.button');
const modalFeedbackWrapper = document.querySelector('.modal-feedback__wrapper');
const modalWindow = document.querySelector('#modal-window');
const modalClose = document.querySelector('#modal-close');

const modalForm = modalWindow.querySelector('.feedback__form');

const modalSuccessClose = document.querySelector('#success-close');

introButton.addEventListener('click', () => {
  body.classList.add('page-body--blur');
  modalWindow.classList.add('modal-feedback--show');
});

modalClose.addEventListener('click', () => {
  body.classList.remove('page-body--blur');
  modalWindow.classList.remove('modal-feedback--show');
});

const removeModalMessage = () => {
  const successModalMessage = modalWindow.querySelector(".feedback__success");
  if (successModalMessage) {
    successModalMessage.remove();
  }
};

const onSuccessClosePress = () => {
  removeModalMessage();
  body.classList.remove('page-body--blur');
  modalWindow.classList.remove('modal-feedback--show');
  modalSuccessClose.removeEventListener("click", onSuccessClosePress);
}

const showModalSuccessMessage = () => {
  const successMessage = successMessageTemplate.cloneNode(true);
  modalFeedbackWrapper.appendChild(successMessage);
}

modalForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  showModalSuccessMessage();
  document.querySelector('#modal-window').querySelector('#success-close').addEventListener('click', onSuccessClosePress);
  modalFeedbackWrapper.querySelector('.feedback__success-button').addEventListener('click', removeModalMessage);
});

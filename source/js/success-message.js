const inputPhone = document.querySelector("#feedback-phone");
const feedbackForm = document.querySelector(".feedback__form");
const feedbackWrapper = document.querySelector(".feedback__wrapper");
const successMessageTemplate = document.querySelector("#success").content.querySelector(".feedback__success");
const successButton = successMessageTemplate.querySelector(".feedback__success-button");

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

const onButtonPress = (evt) => {
  removeMessage();

  successButton.removeEventListener("click", onButtonPress);
}

const onPageClick = () => {
  removeMessage();
  removeEventListener("click", onPageClick);

};

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

  window.addEventListener("click", onPageClick);
  successButton.addEventListener("click", onButtonPress);
});

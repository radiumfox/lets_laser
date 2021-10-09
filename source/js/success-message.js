

// const body = document.querySelector('.page-body');
// const introSection = document.querySelector('.intro');
// let introButton;

// if(introSection) {
//   introButton = introSection.querySelector('.button');
//   introButton.addEventListener('click', () => {
//     body.classList.add('page-body--blur');
//     modalWindow.classList.add('modal-feedback--show');
//   });
// }

// const modalFeedbackWrapper = document.querySelector('.modal-feedback__wrapper');
// const modalWindow = document.querySelector('#modal-window');
// const modalClose = document.querySelector('#modal-close');
// let modalForm;

// if(modalWindow){
//   modalForm = modalWindow.querySelector('.feedback__form');
// };

// const modalSuccessClose = document.querySelector('#success-close');

// if(modalClose) {
//   modalClose.addEventListener('click', () => {
//     body.classList.remove('page-body--blur');
//     modalWindow.classList.remove('modal-feedback--show');
//   });
// }


// const removeModalMessage = () => {
//   const successModalMessage = modalWindow.querySelector(".feedback__success");
//   if (successModalMessage) {
//     successModalMessage.remove();
//   }
// };

// const onSuccessClosePress = () => {
//   removeModalMessage();
//   body.classList.remove('page-body--blur');
//   modalWindow.classList.remove('modal-feedback--show');
// }

// const showModalSuccessMessage = () => {
//   const successMessage = successMessageTemplate.cloneNode(true);
//   modalFeedbackWrapper.appendChild(successMessage);
// }

// if (modalForm) {
//   modalForm.addEventListener("submit", (evt) => {
//     evt.preventDefault();
//     showModalSuccessMessage();
//     document.querySelector('#modal-window').querySelector('#success-close').addEventListener('click', onSuccessClosePress);
//     modalFeedbackWrapper.querySelector('.feedback__success-button').addEventListener('click', removeModalMessage);
//   });
// }

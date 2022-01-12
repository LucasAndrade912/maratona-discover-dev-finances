const Modal = {
  open() {
    document
      .querySelector('.modal-overlay')
      .classList
      .add('active')
  },
  close() {
    document
    .querySelector('.modal-overlay')
    .classList
    .remove('active')
  }
}

const buttonOpenModal = document.querySelector('a.button.new')
buttonOpenModal.addEventListener('click', Modal.open)

const buttonCloseModal = document.querySelector('a.button.cancel')
buttonCloseModal.addEventListener('click', Modal.close)
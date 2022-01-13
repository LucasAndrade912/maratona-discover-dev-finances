const transactions = [
  {
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021'
  },
  {
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '24/01/2021'
  },
  {
    id: 3,
    description: 'Internet',
    amount: -150000,
    date: '26/01/2021'
  },
  {
    id: 4,
    description: 'App',
    amount: 200000,
    date: '23/01/2021'
  }
]

const Modal = {
  toggle() {
    document
    .querySelector('.modal-overlay')
    .classList
    .toggle('active')
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransition(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction) {
    const { description, amount, date } = transaction
    const CSSclass = amount > 0 ? 'income' : 'expense'

    const formattedAmount = Utils.formatCurrency(amount)

    const html = `
      <td class="description">${description}</td>
      <td class="${CSSclass}">${formattedAmount}</td>
      <td class="date">${date}</td>
      <td>
        <img src="./assets/minus.svg" alt="Remover transação">
      </td>
    `

    return html
  }
}

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, '')

    value = Number(value) / 100

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return `${signal}${value}`
  }
}

transactions.forEach(transaction => DOM.addTransition(transaction))

const buttonOpenModal = document.querySelector('a.button.new')
buttonOpenModal.addEventListener('click', Modal.toggle)

const buttonCloseModal = document.querySelector('a.button.cancel')
buttonCloseModal.addEventListener('click', Modal.toggle)
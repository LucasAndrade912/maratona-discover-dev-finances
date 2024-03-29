const Modal = {
  watch() {
    const buttonOpenModal = document.querySelector('a.button.new')
    buttonOpenModal.addEventListener('click', Modal.toggle)

    const buttonCloseModal = document.querySelector('a.button.cancel')
    buttonCloseModal.addEventListener('click', Modal.toggle)
  },

  toggle() {
    document
    .querySelector('.modal-overlay')
    .classList
    .toggle('active')
  }
}

const LocalStorage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },

  set(transactions) {
    localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions))
  }
}

const Transaction = {
  all: LocalStorage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0

    Transaction.all.forEach(({ amount }) => {
      if (amount > 0) {
        income += amount
      }
    })

    return income
  },

  expenses() {
    let expense = 0

    Transaction.all.forEach(({ amount }) => {
      if (amount < 0) {
        expense += amount
      }
    })

    return expense
  },

  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const { description, amount, date } = transaction
    const CSSclass = amount > 0 ? 'income' : 'expense'

    const formattedAmount = Utils.formatCurrency(amount)

    const html = `
      <td class="description">${description}</td>
      <td class="${CSSclass}">${formattedAmount}</td>
      <td class="date">${date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
      </td>
    `

    return html
  },

  updateBalance() {
    document
      .querySelector('#incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())

    document
      .querySelector('#expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    
    document
      .querySelector('#totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }
}

const Form = {
  description: document.querySelector('#description'),
  amount: document.querySelector('#amount'),
  date: document.querySelector('#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  submit(event) {
    event.preventDefault()
    
    try {
      Form.validateFields()
      
      const transaction = Form.formatValues()
      Transaction.add(transaction)

      Form.clearFields()
      Modal.toggle()
    } catch (error) {
      alert(error.message)
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()
    
    if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
      throw new Error('Por favor, preencha todos os campos')
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)

    return { description, amount, date }
  },

  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  watch() {
    const form = document.forms[0]
    form.addEventListener('submit', Form.submit)
  },
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
  },

  formatAmount(value) {
    return Math.round(Number(value)) * 100
  },

  formatDate(date) {
    const splittedDate = date.split('-')
    
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
}

const App = {
  init() {
    Transaction.all.forEach((transaction, index) => DOM.addTransaction(transaction, index))

    DOM.updateBalance()

    LocalStorage.set(Transaction.all)

    Modal.watch()
    Form.watch()
  },

  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
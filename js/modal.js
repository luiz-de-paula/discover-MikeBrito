const Modal = {
    open(){ //abre modal
        // adiciona a classe "active" ao modal
       document
        .querySelector('.modal-overlay')
        .classList.add('active');
    },
    close(){ //fecha o modal
        // retira a classe "active" do modal
        document
        .querySelector('.modal-overlay')
        .classList.remove('active');
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",
        JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()

    },




    incomes() {
        let income = 0;
        //pegar todas as transações
        //para cada transação
        Transaction.all.forEach(transaction => {
            // se ela for maior que 0
            if (transaction.amount > 0){
                //somar à variavel e retornar essa variavel
                income += transaction.amount;
            }
        })


        return income;
    }, 
    expenses() {
        let expense = 0;
        //pegar todas as transações
        //para cada transação
        Transaction.all.forEach(transaction => {
            // se ela for menor que 0
            if (transaction.amount < 0){
                //somar à variavel e retornar essa variavel
                expense += transaction.amount;
            }
        })


        return expense;
    },
    total() { 
        return Transaction.incomes() + Transaction.expenses()
    }
}
const DOM = {
    transactionsContainer:  document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){
       
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
        
    },

    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)

        const html = ` 
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img onclick="Transaction.remove (${index})" src="./img/minus.svg" alt="remover transação">
            </td>
        `
        return html
    },
    updateBalance() {
        document
            .getElementById('income-display')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expense-display')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('total-display')
            .innerHTML = Utils.formatCurrency(Transaction.total())

    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }

   
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100

        return value

    },
    formatDate(date){
       const splittedDate = date.split("-")
       
       return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")

        value = Number(value)/100

        value = value.toLocaleString("pt-BR", {
            style:"currency",
            currency:"BRL"
        })


       return signal + value
    }
} 

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }

    }, 
    validateFields(){
        const {description, amount,date} = Form.getValues()
        if (description.trim() === ""|| 
            amount.trim() === "" ||
            date.trim() ===""){ 
                throw new Error("por Favor, preencha todos os campos")

            }
            
    },


    formatValues(){
        let {description, amount,date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        
        return{
            description, amount, date
        }
        
    },
    saveTransaction(transaction){
        Transaction.add(transaction)
    },
    clearFields(){
        description: Form.description.value = ""
        description: Form.amount.value = ""
        description: Form.date.value = ""

    },
   
    submit(event){
        event.preventDefault()

        try{
            Form.validateFields()
            const transaction = Form.formatValues()
        // verificar se todas as requisições foram preenchidas


        // Form.formatValues()
        // // formatar os dados 

            Form.saveTransaction(transaction)
        // salvar e depois 
            Form.clearFields()
        // apagar os campos do formulario

            Modal.close() //fechar o formulario
           

        }catch (error){
            alert(error.message)
        }





        
        
    }
}


const App = {
    init() {
        Transaction.all.forEach ((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()
















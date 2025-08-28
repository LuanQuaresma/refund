// seleciona os elementos do formulario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// seleciona os elementos na lista
const expenselist = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")
    
    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value
}

form.onsubmit = (event) => {
    //Previne o comportamento padrão de recarregar a pagina
    event.preventDefault()

    // Cria um objeto com os detalhes na nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    // Chama a função que ira adicionar o item na lista
    expenseAdd(newExpense)
}

// add um novo item na lista
function expenseAdd(newExpense) {
    try {
      // Cria o elemento para adicionar o item (li) na lista (ul)
      const expenseItem = document.createElement("li")
      expenseItem.classList.add("expense")

      // Cria o icone da categoria
      const expenseIcon = document.createElement("img")
      expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
      expenseIcon.setAttribute("alt", newExpense.category_name) 

      //cria a info da despesa
      const expenseInfo = document.createElement("div")
      expenseInfo.classList.add("expense-info")

      // Cria o nome da despesa
      const expenseName = document.createElement("strong")
      expenseName.textContent = newExpense.expense

      // Cria a categoria da despesa
      const expenseCategory = document.createElement("span")
      expenseCategory.textContent = newExpense.category_name

      //adiciona nome e categoria na div das informações da despesa
      expenseInfo.append(expenseName, expenseCategory)

      // Cria o valor da despesa.
      const expenseAmount = document.createElement("span")
      expenseAmount.classList.add("expense-amount")
      expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

      // cria o icone de remover
      const removeIcon = document.createElement("img")
      removeIcon.classList.add("remove-icon")
      removeIcon.setAttribute("src", "img/remove.svg")
      removeIcon.setAttribute("alt", "remover")

      // adiciona as informações do item
      expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

      // Adiciona o Item na lista
      expenselist.append(expenseItem)

      formClear()
      // Atualiza os totais
      updateTotals()
    } catch (error) {
        alert("Não foi possivel atualizar a lista de despesas.")
        console.log(error)
    }
}

// atualiza os totais.
function updateTotals(){
    try {
      // Recupera todos os itens (li) da lista (ul)
      const items = expenselist.children
      
      
      // atualiza a quantidade de elementos da lista
      expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

      // variavel para incrementar o total.
      let total = 0

      // percorre cada item (li) da lista (ul)
      for(let item = 0; item < items.length; item++){
        const itemAmount = items[item].querySelector(".expense-amount")

        //remove caracteres nao numericos nao numericos e substitui a virgula pelo ponto.
        let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

        // converte o valor para float
        value = parseFloat(value)

        //verifica se e um numero valido
        if(isNaN(value)){
            return alert("Nao foi possivel calcular o total. o valor nao parece ser um numero")
        }

        // incrementa o valor total
        total += Number(value)
      }

      // cria a span para adicionar o R$ formatado.
      const symbolBRL = document.createElement("small")
      symbolBRL.textContent = "R$"

      //formata o valor e remove o R$ que sera exibido pela small com um sistema1
      total = formatCurrencyBRL(total).toUpperCase().replace("R$","")

      //limpa o conteudo do elemento.
      expensesTotal.innerHTML = ""

        // adiciona o simbolo da moeda e o valor total formatado. 
        expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("não foi possivel atualizar os totais")
    }
}

// evento que captura o clique no itens da lista.
expenselist.addEventListener("click", function(event) {
    
    if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense")

    item.remove()
    }


    updateTotals()
})

function formClear(){
    expense.value = "" 
    category.value = ""
    amount.value = ""

    expense.focus()
}

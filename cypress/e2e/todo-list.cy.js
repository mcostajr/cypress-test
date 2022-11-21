/// <reference types="Cypress" />

describe('Acessar o site', () => {
  it('Deveria abrir a pagina do site', () => {
    cy.visit('https://phpauloreis.github.io/todo-list-alpine-js/')
  })
})

describe('Cadastrar Tarefas', () => {
  before(() => {
    cy.visit('https://phpauloreis.github.io/todo-list-alpine-js/')
  })
  it('Deveria cadastrar uma nova tarefa', () => {
    cy.get('#todo_title').type('Tarefa 1')
    cy.get('.bg-white > .col-auto > .btn').click()

    cy.get('[x-text="todo.task"]').contains('Tarefa 1')
  })
  it('Deveria dar erro se não houver titulo para a tarefa', () => {
    cy.get('.bg-white > .col-auto > .btn').click()

    cy.on('window:alert', (str) => {
      expect(str).to.equal(`Digite um título para a tarefa!`)
    })
  })
})

describe('Deletar Tarefa', () => {
  before(() => {
    cy.visit('https://phpauloreis.github.io/todo-list-alpine-js/')

    cy.get('#todo_title').type('Tarefa Deletar')
    cy.get('.bg-white > .col-auto > .btn').click()

    cy.get('[x-text="todo.task"]').contains('Tarefa Deletar')
  })
  it.only('Deveria sumir a tarefa ao excluir', () => {
    cy.get('[x-text="todo.task"]').should('have.length', 1)

    cy.get('.text-end > .btn-danger').click()

    cy.on('window:confirm', (str) => {
      expect(str).to.equal(`Tem certeza que deseja remover?`)
    })

    cy.get('[x-text="todo.task"]').should('have.length', 0)
  })
})

describe('Listar Tarefas', () => {
  const tarefas = [
    {title: 'Tarefa 1', checked: true}, 
    {title: 'Tarefa 2', checked: false},
    {title: 'Tarefa 3', checked: false}, 
    {title: 'Tarefa 4', checked: true}, 
    {title: 'Tarefa 5', checked: false}, 
    {title: 'Tarefa 6', checked: false}, 
    {title: 'Tarefa 7', checked: true}, 
    {title: 'Tarefa 8', checked: false}, 
    {title: 'Tarefa 9', checked: false}, 
    {title: 'Tarefa 10', checked: true}, 
  ]

  before(() => {
    cy.visit('https://phpauloreis.github.io/todo-list-alpine-js/')

    for(const tarefa of tarefas) {
      cy.get('#todo_title').type(tarefa.title)
      cy.get('.bg-white > .col-auto > .btn').click()
    }

    cy.get('table > tbody > tr').each((tr, index) => {
      cy.get(tr).each((td) => {
        if(tarefas[index].checked) {
          cy.get(td).find('[type="checkbox"]').check()
        }
      })
    })

  })
  
  it('Deveria aparecer todas as tarefas', () => {
    cy.get('[x-model="filter"]').select('all')
    
    cy.get('[x-text="todo.task"]').should('have.length', tarefas.length)
  })
  it('Deveria aparecer apenas as tarefas em aberto', () => {
    cy.get('[x-model="filter"]').select('incomplete')
    
    cy.get('[x-text="todo.task"]').should('have.length', tarefas.filter(i => i.checked == false).length)
  })
  it('Deveria aparecer apenas as tarefas concluidas', () => {

    cy.get('[x-model="filter"]').select('complete')
    
    cy.get('[x-text="todo.task"]').should('have.length', tarefas.filter(i => i.checked == true).length)
  })
})
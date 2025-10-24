// Seletores do DOM
const taskList = document.querySelector('.task-list');
const taskInput = document.querySelector('.nome-task');
const addButton = document.querySelector('.adicionar-task');

// Array principal onde todas as tarefas são armazenadas (a "fonte da verdade")
let tarefas = []; 

// ----------------------------------------------------
// 1. FUNÇÕES DE ARMAZENAMENTO (localStorage)
// ----------------------------------------------------

function salvarTarefas() {
    // Salva o array atual no localStorage
    localStorage.setItem('listaDeTarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
    // Pega a string salva
    const tarefasSalvas = localStorage.getItem('listaDeTarefas'); 

    if (tarefasSalvas) {
        // Converte a string JSON de volta para o array de JS
        tarefas = JSON.parse(tarefasSalvas); 
    } else {
        // Se não houver nada salvo, inicia vazio
        tarefas = []; 
    }
    
    // Renderiza a lista na tela
    renderizarTarefas(); 
}

// ----------------------------------------------------
// 2. FUNÇÃO DE CRIAÇÃO E RENDERIZAÇÃO DE HTML
// ----------------------------------------------------

function createTaskElement(tarefaObj) {
    const li = document.createElement('li');
    
    // Anexa o ID e a classe 'completed' (para o CSS)
    li.dataset.id = tarefaObj.id;
    if (tarefaObj.concluida) {
        li.classList.add('completed');
    }

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover tarefa';
    removeButton.classList.add('remover-task');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = tarefaObj.id; // O ID é fundamental para o listener
    checkbox.checked = tarefaObj.concluida; // Define o estado inicial

    const p = document.createElement('p');
    p.textContent = tarefaObj.nome;

    li.appendChild(removeButton);
    li.appendChild(checkbox);
    li.appendChild(p);

    return li;
}

function renderizarTarefas() {
    // Limpa a lista atual do HTML
    taskList.innerHTML = '';

    // Adiciona cada tarefa do array ao HTML
    tarefas.forEach(tarefa => {
        const taskElement = createTaskElement(tarefa);
        taskList.appendChild(taskElement);
    });
}

// ----------------------------------------------------
// 3. LISTENERS DE EVENTOS
// ----------------------------------------------------

// Listener para ADICIONAR NOVA TAREFA
addButton.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    
    if (taskName) {
        // Cria um ID único (Date.now() é mais seguro que o children.length)
        const novoId = Date.now(); 
        
        const novaTarefa = { 
            nome: taskName, 
            concluida: false, 
            id: novoId 
        };

        // 1. Adiciona o novo objeto ao array principal
        tarefas.push(novaTarefa); 

        // 2. Salva o array atualizado
        salvarTarefas(); 
        
        // 3. Re-renderiza a lista (isso adiciona o novo item ao HTML)
        renderizarTarefas(); 
        
        taskInput.value = '';
    }
});

// Listener de Delegação para REMOVER ou MARCAR/DESMARCAR
taskList.addEventListener('click', (event) => {
    const target = event.target;
    const li = target.parentElement;
    const idDaTarefa = Number(li.dataset.id);

    // Lógica de REMOÇÃO
    if (target.classList.contains('remover-task')) {
        
        // Remove o item do array 'tarefas'
        tarefas = tarefas.filter(tarefa => tarefa.id !== idDaTarefa);
        
        // Salva e re-renderiza
        salvarTarefas();
        renderizarTarefas();
    }
});

taskList.addEventListener('change', (event) => {
    // Lógica de MARCAR/DESMARCAR (change é melhor para checkbox)
    if (event.target.type === 'checkbox') {
        const target = event.target;
        const taskId = Number(target.id);
        
        // 1. Encontra a tarefa no array 'tarefas'
        const tarefa = tarefas.find(t => t.id === taskId);
        
        if (tarefa) {
            // 2. ATUALIZA A PROPRIEDADE 'concluida'
            tarefa.concluida = target.checked;
            
            // Opcional: Adiciona/remove a classe CSS para riscar o texto
            target.parentElement.classList.toggle('completed', tarefa.concluida);
            
            // 3. SALVA NO LOCALSTORAGE
            salvarTarefas(); 
        }
    }
});


// ----------------------------------------------------
// 4. INICIALIZAÇÃO
// ----------------------------------------------------

// Carrega as tarefas salvas e renderiza a lista ao iniciar a página
carregarTarefas();
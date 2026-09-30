function adicionarTarefa(){

}
function exibirTarefa(){

}

let formulario=document.getElementsByTagName("form");
console.log(formulario)

formulario[0].addEventListener("submit", (e) => {
    const tarefa = {};
    tarefa.id=crypto.randomUUID();
    tarefa.titulo = document.getElementById('tarefa').value;
    tarefa.descricao = document.getElementById('descricao').value;
    tarefa.prioridade = document.getElementById('prioridade').value;
    tarefa.data = document.getElementById('data').value;
    let tarefas = localStorage.getItem("tarefas");
    if(tarefas == null){
        console.log("sem tarefas")
        let tarefaTemp = [];
        tarefaTemp.push(tarefa);
        localStorage.setItem("tarefas", JSON.stringify(tarefaTemp)); 
    }
    else{
        tarefas = JSON.parse(tarefas);
        tarefas.push(tarefa);
        localStorage.setItem("tarefas", JSON.stringify(tarefas)); 
    }
    e.preventDefault();
});
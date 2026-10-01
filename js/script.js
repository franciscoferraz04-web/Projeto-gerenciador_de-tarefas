const formulario=document.getElementsByTagName("form")[0];
const blocoFiltro=document.querySelector("#filtro");
const inputData=document.getElementById("data");
const blocoTarefa=document.querySelector("#bloco-tarefa")

let idTarefaEmEdicao=null;

function adicionarTarefa(e){
    e.preventDefault();

    if(!validarFormulario()){
        return;
    }

    const tarefa={};

    tarefa.titulo = document.getElementById('tarefa').value;
    tarefa.descricao = document.getElementById('descricao').value;
    tarefa.prioridade = document.getElementById('prioridade').value;
    tarefa.data = document.getElementById('data').value;    
    tarefa.status = document.getElementById('status').value;

    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

    //EDITAR TAREFA
    if(idTarefaEmEdicao !== null){
        const indice = tarefas.findIndex((t) => t.id === idTarefaEmEdicao);

        if(indice !== -1){
            tarefas[indice].titulo = tarefa.titulo;
            tarefas[indice].descricao=tarefa.descricao;
            tarefas[indice].prioridade=tarefa.prioridade;
            tarefas[indice].data=tarefa.data;
            tarefas[indice].status=tarefa.status;
        }
        idTarefaEmEdicao=null;

        document.getElementById("botao").textContent="Adicionar tarefa";
    }
    //NOVA TAREFA
    else{
        tarefa.id=crypto.randomUUID();

        tarefas.push(tarefa);
    }
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    formulario.reset();

    exibirTarefa();
}
function exibirTarefa(){
    blocoTarefa.innerHTML="";

    const tarefas=JSON.parse(localStorage.getItem("tarefas")) || [];

    tarefas.forEach((tarefa) => {
        const bloco = document.createElement("div");

        bloco.classList.add("tarefa");

        bloco.dataset.id=tarefa.id;

        bloco.innerHTML = `
            <details>
                <summary>
                    ${tarefa.titulo}
                </summary>
                
                <p><strong>Descrição:</strong>${tarefa.descricao}</p>
                <p><strong>Prioridade:</strong>${tarefa.prioridade}</p>
                <p><strong>Data:</strong>${tarefa.data}</p>
                <p><strong>Status:</strong>${tarefa.status}</p>
                
                <button class="editarTarefa">✏️ Editar</button>
                <button class="excluiTarefa">🗑️ Excluir</button>
            </details>
            `;
            blocoTarefa.appendChild(bloco);
    });
}

function validarFormulario(){
    const campos=[
        document.getElementById("tarefa"),
        document.getElementById("descricao"),
        document.getElementById("categoria"),
        document.getElementById("prioridade"),
        document.getElementById("data")
    ];

    let formularioValido = true;

    campos.forEach((campo) => {
        const mensagemAnterior=campo.parentElement.querySelector(".mensagemErro");
        if(mensagemAnterior){
            mensagemAnterior.remove();
        }

        campo.style.border="";

        if(campo.value.trim()===""){
            campo.style.border="2px solid red";

            const mensagem=document.createElement("small");

            mensagem.classList.add("mensagemErro");
            mensagem.textContent="Este campo é obrigatório.";
            mensagem.style.color="red";
            mensagem.style.display="block";

            campo.parentElement.appendChild(mensagem);

            formularioValido=false;
        }
        campo.addEventListener("input", function removeErro(){
            if(campo.value.trim() !== ""){
                campo.style.border="";
                const mensagem=campo.parentElement.querySelector(".mensagemErro");

                if(mensagem){
                    mensagem.remove();
                }
                campo.removeEventListener("input", removeErro);
            }
        });
    });
    return formularioValido;
}

blocoTarefa.addEventListener("click",(e)=>{
    const alvo = e.target;

    const tarefaHTML = alvo.closest(".tarefa");

    if(!tarefaHTML)return;

    const idTarefa=tarefaHTML.dataset.id;

    //EXCLUIR TAREFA
    if(alvo.classList.contains("excluiTarefa")){
        e.preventDefault();
        
        const desejaDeletar=confirm("Deseja deletar a tarefa?");
        
        if(desejaDeletar){
            let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

            tarefas = tarefas.filter((tarefa)=> tarefa.id !== idTarefa);

            localStorage.setItem("tarefas", JSON.stringify(tarefas));

            exibirTarefa();
        }
    }

    //ABRIR A TAREFA
    if(alvo.classList.contains("abrirTarefa")){
        e.preventDefault();

        const detalhes=tarefaHTML.querySelector("details");


        if(detalhes.hasAttribute("open")){
            detalhes.removeAttribute("open");
            alvo.textContent="➕";
        }else{
            detalhes.setAttribute("open","");
            alvo.textContent="➖";
        }
    }
    
    //EDITAR TAREFA
    if(alvo.classList.contains("editarTarefa")){
        e.preventDefault();

        const tarefas = JSON.parse(localStorage.getItem("tarefas"))||[];
        
        const tarefasParaEditar=tarefas.find((tarefa)=> tarefa.id === idTarefa);

        if(tarefasParaEditar){
            document.getElementById("tarefa").value=tarefasParaEditar.titulo;
            document.getElementById("descricao").value=tarefasParaEditar.descricao;
            document.getElementById("prioridade").value=tarefasParaEditar.prioridade;
            inputData.value = tarefasParaEditar.data;
            document.getElementById("status").value=tarefasParaEditar.status;

            idTarefaEmEdicao=idTarefa;
            document.getElementById("botao").textContent="Salvar alteraçôes";
            formulario.scrollIntoView({behavior: "smooth"});
        }
    }
});

formulario.addEventListener("submit",adicionarTarefa);

document.addEventListener("DOMContentLoaded",exibirTarefa);
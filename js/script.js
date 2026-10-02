const formulario=document.getElementsByTagName("form")[0];
const blocoFiltro=document.querySelector("#filtro");
const inputData=document.getElementById("data");
const blocoTarefa=document.querySelector("#bloco-tarefa");

const filtroSituacao=document.getElementById("filtroAplicacao");
const filtroCategoria=document.getElementById("filtroCategoria");

let idTarefaEmEdicao=null;

function adicionarTarefa(e){
    e.preventDefault();

    if(!validarFormulario()){
        return;
    }

    if(!validarData()){
        return;
    }

    const tarefa={};

    tarefa.titulo = document.getElementById('tarefa').value;
    tarefa.descricao = document.getElementById('descricao').value;
    tarefa.categoria= document.getElementById('categoria').value;
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
            tarefas[indice].categoria=tarefa.categoria
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

    if(tarefas.length === 0){
        blocoTarefa.innerHTML="<p style='text-align: center; color:gray;'>Nenhuma tarefa cadastrada.</p>";
        atualizarContadores();
        return;
    }

    const situacao=filtroSituacao.value;
    const categoria=filtroCategoria.value;

    const tarefasFiltradas=tarefas.filter((tarefa) =>{
        let passouSituacao=true;
        let passouCategoria=true;

        //FILTRO DE SITUAÇÃO
        if(situacao === "pendentes"){
            passouSituacao=tarefa.status !== "concluido";
        }
        if(situacao === "concluidas"){
            passouSituacao=tarefa.status === "concluido";
        }
        //FILTRO DE CATEGORIA
        if(categoria !== "todas"){
            passouCategoria=tarefa.categoria === categoria;
        }
        return passouCategoria && passouSituacao;
    });

    if(tarefasFiltradas.length === 0){
        blocoTarefa.innerHTML="<p style='text-align: center; font-weight: bold;'>Nenhuma tarefa encontrada.</p>";
        atualizarContadores();
        return;
    }

    tarefasFiltradas.forEach((tarefa) => {
        const bloco = document.createElement("div");

        bloco.classList.add("tarefa");
        bloco.dataset.id=tarefa.id;
        

        bloco.innerHTML = `
            <div class="cabecalho-tarefa">
                <span class="titulo-tarefa">
                    ${tarefa.titulo}
                </span>

                <div class="botoes-tarefa">
                    <button class="abrirTarefa">➕</button>
                    <button class="editarTarefa">✏️</button>
                    <button class="excluiTarefa">🗑️</button>
                </div>
            </div>

            <div class="detalhes-tarefa" style="display: none;">
                <p><strong>Descrição:</strong>${tarefa.descricao}</p>
                <p><strong>Categoria:</strong>${tarefa.categoria}</p>
                <p><strong>Prioridade:</strong>${tarefa.prioridade}</p>
                <p><strong>Data:</strong>${tarefa.data}</p>
                <p><strong>Status:</strong>${tarefa.status}</p>
            </div>`;
        blocoTarefa.appendChild(bloco);
    });
    atualizarContadores();
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

function atualizarContadores(){
    const tarefas=JSON.parse(localStorage.getItem("tarefas")) || [];

    const total = tarefas.length;

    const pendentes = tarefas.filter((tarefa)=> tarefa.status !== "concluido").length;

    const concluidas = tarefas.filter((tarefa)=> tarefa.status === "concluido").length;

    const contadores = document.querySelectorAll("#qtdTarefas .status-tarefa p");

    contadores[1].textContent=total;
    contadores[3].textContent=pendentes;
    contadores[5].textContent=concluidas;
}

function validarData(){
    const dataSelecioada = document.getElementById("data").value;

    if(dataSelecioada === ""){
        return true;
    }

    const hoje=new Date();
    hoje.setHours(0,0,0,0);

    const data = new Date(dataSelecioada + "T00:00:00");

    if(data < hoje){
        const campo=document.getElementById("data");

        campo.style.border="2px solid red";

        const mensagemAnterior=campo.parentElement.querySelector(".mensagemErro");

        if(mensagemAnterior){
            mensagemAnterior.remove();
        }

        const mensagem=document.createElement("small");
        mensagem.classList.add("mensagemErro");
        mensagem.textContent="A data não pode ser anterior a hoje.";
        mensagem.style.color="red";
        mensagem.style.display="block";

        campo.parentElement.appendChild(mensagem);

        return false;
    }
    return true;
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

        const detalhes=tarefaHTML.querySelector(".detalhes-tarefa");


        if(detalhes.style.display==="none"){
            detalhes.style.display="block";
            alvo.textContent="➖";
        }else{
            detalhes.style.display="none";
            alvo.textContent="➕";
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
            document.getElementById("categoria").value=tarefasParaEditar.categoria;
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

filtroSituacao.addEventListener("change", exibirTarefa);

filtroCategoria.addEventListener("change", exibirTarefa);
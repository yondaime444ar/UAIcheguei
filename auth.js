const chaveContas = "uai_cheguei_contas";
const chaveSessao = "uai_cheguei_sessao";
const senhaPadrao = "12345678";

function carregarContas() {
    return JSON.parse(localStorage.getItem(chaveContas) || "[]");
}

function salvarContas(contas) {
    localStorage.setItem(chaveContas, JSON.stringify(contas));
}

function prepararContas() {
    const contas = carregarContas();
    const exemplos = [
        { nome: "Administrador", email: "admin@uaicheguei.com", senha: senhaPadrao, tipo: "administrador" },
        { nome: "Cliente de teste", email: "cliente@uaicheguei.com", senha: senhaPadrao, tipo: "cliente" },
        { nome: "Entregador", email: "entregador@uaicheguei.com", senha: senhaPadrao, tipo: "entregador" }
    ];

    exemplos.forEach(exemplo => {
        const indice = contas.findIndex(conta => conta.email.toLowerCase() === exemplo.email);
        if (indice >= 0) {
            contas[indice] = exemplo;
        } else {
            contas.push(exemplo);
        }
    });

    salvarContas(contas);
}

function direcionarUsuario(tipo) {
    if (tipo === "administrador") {
        window.location.href = "intranet_adm.html";
    } else if (tipo === "entregador") {
        window.location.href = "intranet_entregador.html";
    } else {
        window.location.href = "principal.html";
    }
}

function entrar(evento) {
    evento.preventDefault();

    const email = document.getElementById("Email").value.trim().toLowerCase();
    const senha = document.getElementById("Senha").value;
    const conta = carregarContas().find(usuario =>
        usuario.email.toLowerCase() === email && usuario.senha === senha
    );

    if (!conta) {
        alert("E-mail ou senha incorretos.");
        return;
    }

    sessionStorage.setItem(chaveSessao, JSON.stringify({
        nome: conta.nome,
        email: conta.email,
        tipo: conta.tipo
    }));

    direcionarUsuario(conta.tipo);
}

function cadastrar(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("Email").value.trim().toLowerCase();
    const telefone = document.getElementById("telefone").value.trim();
    const nascimento = document.getElementById("data-nascimento").value;
    const contas = carregarContas();

    if (contas.some(conta => conta.email.toLowerCase() === email)) {
        alert("Já existe uma conta com este e-mail.");
        return;
    }

    contas.push({
        nome: nome,
        email: email,
        telefone: telefone,
        nascimento: nascimento,
        senha: senhaPadrao,
        tipo: "cliente"
    });

    salvarContas(contas);
    sessionStorage.setItem(chaveSessao, JSON.stringify({
        nome: nome,
        email: email,
        tipo: "cliente"
    }));

    alert("Cadastro realizado! Sua senha de demonstração é 12345678.");
    window.location.href = "principal.html";
}

function protegerPagina(tipoPermitido) {
    const sessao = JSON.parse(sessionStorage.getItem(chaveSessao) || "null");

    if (!sessao) {
        window.location.replace("index.html");
        return;
    }

    if (tipoPermitido && sessao.tipo !== tipoPermitido) {
        direcionarUsuario(sessao.tipo);
    }
}

function sair() {
    sessionStorage.removeItem(chaveSessao);
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    prepararContas();

    const formularioLogin = document.getElementById("formulario-login");
    const formularioCadastro = document.getElementById("formulario-cadastro");

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", entrar);
    }

    if (formularioCadastro) {
        formularioCadastro.addEventListener("submit", cadastrar);
    }

    if (document.body.classList.contains("store-page")) {
        protegerPagina("cliente");
    }

    if (document.body.classList.contains("owner-page")) {
        protegerPagina("administrador");
    }

    if (document.body.classList.contains("rider-page")) {
        protegerPagina("entregador");
    }

    document.querySelectorAll(".avatar").forEach(function (link) {
        link.addEventListener("click", function (evento) {
            evento.preventDefault();
            sair();
        });
    });
});
const senhaPadrao = "12345678";
const chaveContas = "uai_cheguei_contas";
const chaveSessao = "uai_cheguei_sessao";

async function gerarHash(senha) {
    const dados = new TextEncoder().encode(senha);
    const resultado = await crypto.subtle.digest("SHA-256", dados);
    return Array.from(new Uint8Array(resultado)).map(valor => valor.toString(16).padStart(2, "0")).join("");
}

function carregarContas() {
    return JSON.parse(localStorage.getItem(chaveContas) || "[]");
}

function salvarContas(contas) {
    localStorage.setItem(chaveContas, JSON.stringify(contas));
}

async function prepararContas() {
    const contas = carregarContas();
    const hash = await gerarHash(senhaPadrao);
    const padrao = [
        { nome: "Administrador", email: "admin@uaicheguei.com", tipo: "administrador", senha: hash },
        { nome: "Cliente de teste", email: "cliente@uaicheguei.com", tipo: "cliente", senha: hash },
        { nome: "Entregador", email: "entregador@uaicheguei.com", tipo: "entregador", senha: hash }
    ];

    padrao.forEach(conta => {
        if (!contas.some(item => item.email.toLowerCase() === conta.email)) {
            contas.push(conta);
        }
    });

    salvarContas(contas);
}

function abrirPainel(tipo) {
    if (tipo === "administrador") {
        window.location.href = "intranet_adm.html";
    } else if (tipo === "entregador") {
        window.location.href = "intranet_entregador.html";
    } else {
        window.location.href = "principal.html";
    }
}

async function entrar(evento) {
    evento.preventDefault();
    const email = document.getElementById("Email").value.trim().toLowerCase();
    const senha = document.getElementById("Senha").value;
    const hash = await gerarHash(senha);
    const conta = carregarContas().find(item => item.email.toLowerCase() === email && item.senha === hash);

    if (!conta) {
        alert("E-mail ou senha incorretos.");
        return;
    }

    sessionStorage.setItem(chaveSessao, JSON.stringify({
        nome: conta.nome,
        email: conta.email,
        tipo: conta.tipo
    }));

    abrirPainel(conta.tipo);
}

async function cadastrar(evento) {
    evento.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("Email").value.trim().toLowerCase();
    const contas = carregarContas();

    if (contas.some(conta => conta.email.toLowerCase() === email)) {
        alert("Já existe uma conta cadastrada com este e-mail.");
        return;
    }

    contas.push({
        nome,
        email,
        telefone: document.getElementById("telefone").value.trim(),
        nascimento: document.getElementById("data-nascimento").value,
        tipo: "cliente",
        senha: await gerarHash(senhaPadrao)
    });

    salvarContas(contas);
    sessionStorage.setItem(chaveSessao, JSON.stringify({ nome, email, tipo: "cliente" }));
    alert("Conta criada! A senha padrão é 12345678.");
    window.location.href = "principal.html";
}

function protegerPagina(tipo) {
    let sessao;

    try {
        sessao = JSON.parse(sessionStorage.getItem(chaveSessao) || "null");
    } catch {
        sessao = null;
    }

    if (!sessao) {
        window.location.replace("index.html");
        return;
    }

    if (tipo && sessao.tipo !== tipo) {
        abrirPainel(sessao.tipo);
    }
}

function sair() {
    sessionStorage.removeItem(chaveSessao);
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
    await prepararContas();

    const formularioLogin = document.querySelector(".login-page form");
    const formularioCadastro = document.querySelector(".register-page form");

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", entrar);
    }

    if (formularioCadastro) {
        const senha = document.getElementById("Senha");
        const confirmacao = document.getElementById("ConfirmarSenha");

        if (senha) {
            senha.value = senhaPadrao;
            senha.readOnly = true;
        }

        if (confirmacao) {
            confirmacao.value = senhaPadrao;
            confirmacao.readOnly = true;
        }

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

    document.querySelectorAll(".avatar").forEach(link => {
        link.addEventListener("click", evento => {
            evento.preventDefault();
            sair();
        });
    });
});
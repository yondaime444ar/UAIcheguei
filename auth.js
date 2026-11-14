const chaveContas = "uai_cheguei_contas";
const chaveSessao = "uai_cheguei_sessao";
const senhaPadrao = "12345678";

function carregarContas() {
    try {
        const contas = JSON.parse(localStorage.getItem(chaveContas) || "[]");
        return Array.isArray(contas) ? contas : [];
    } catch (erro) {
        return [];
    }
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

    exemplos.forEach(function(exemplo) {
        const indice = contas.findIndex(function(conta) {
            return conta.email && conta.email.toLowerCase() === exemplo.email;
        });

        if (indice >= 0) {
            contas[indice] = exemplo;
        } else {
            contas.push(exemplo);
        }
    });

    salvarContas(contas);
}

function direcionarUsuario(tipo) {
    let pagina = "principal.html";

    if (tipo === "administrador") {
        pagina = "intranet_adm.html";
    } else if (tipo === "entregador") {
        pagina = "intranet_entregador.html";
    }

    window.location.assign(new URL(pagina, window.location.href).href);
}

function entrar(evento) {
    if (evento) evento.preventDefault();

    try {
        prepararContas();

        const campoEmail = document.getElementById("Email");
        const campoSenha = document.getElementById("Senha");

        if (!campoEmail || !campoSenha) {
            alert("Não foi possível localizar os campos de login.");
            return false;
        }

        const email = campoEmail.value.trim().toLowerCase();
        const senha = campoSenha.value;

        const conta = carregarContas().find(function(usuario) {
            return usuario.email && usuario.email.toLowerCase() === email && usuario.senha === senha;
        });

        if (!conta) {
            alert("E-mail ou senha incorretos.");
            return false;
        }

        sessionStorage.setItem(chaveSessao, JSON.stringify({
            nome: conta.nome,
            email: conta.email,
            tipo: conta.tipo
        }));

        direcionarUsuario(conta.tipo);
    } catch (erro) {
        alert("Não foi possível realizar o login. Tente atualizar a página.");
        console.error("Erro no login:", erro);
    }

    return false;
}

function cadastrar(evento) {
    if (evento) evento.preventDefault();

    try {
        prepararContas();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("Email").value.trim().toLowerCase();
        const telefone = document.getElementById("telefone").value.trim();
        const nascimento = document.getElementById("data-nascimento").value;
        const contas = carregarContas();

        if (contas.some(function(conta) {
            return conta.email && conta.email.toLowerCase() === email;
        })) {
            alert("Já existe uma conta com este e-mail.");
            return false;
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
        window.location.assign(new URL("principal.html", window.location.href).href);
    } catch (erro) {
        alert("Não foi possível concluir o cadastro.");
        console.error("Erro no cadastro:", erro);
    }

    return false;
}

function protegerPagina(tipoPermitido) {
    const sessao = JSON.parse(sessionStorage.getItem(chaveSessao) || "null");

    if (!sessao) {
        window.location.replace(new URL("index.html", window.location.href).href);
        return;
    }

    if (tipoPermitido && sessao.tipo !== tipoPermitido) {
        direcionarUsuario(sessao.tipo);
    }
}

function sair() {
    sessionStorage.removeItem(chaveSessao);
    window.location.assign(new URL("index.html", window.location.href).href);
}

document.addEventListener("DOMContentLoaded", function() {
    prepararContas();

    if (document.body.classList.contains("store-page")) {
        protegerPagina("cliente");
    }

    if (document.body.classList.contains("owner-page")) {
        protegerPagina("administrador");
    }

    if (document.body.classList.contains("rider-page")) {
        protegerPagina("entregador");
    }

    document.querySelectorAll(".avatar").forEach(function(link) {
        link.addEventListener("click", function(evento) {
            evento.preventDefault();
            sair();
        });
    });
});

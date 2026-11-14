function entrar(event) {
    event.preventDefault();

    const email = document.getElementById("Email").value.trim().toLowerCase();
    const senha = document.getElementById("Senha").value;
    const mensagem = document.getElementById("mensagem");

    if (!email || !senha) {
        mensagem.textContent = "Informe seu e-mail e sua senha.";
        return;
    }

    const contas = JSON.parse(localStorage.getItem("uai-contas") || "[]");
    const conta = contas.find(item => item.email === email && item.senha === senha);

    if (conta) {
        window.location.assign("./principal.html");
    } else if (email === "cliente@gmail.com" && senha === "123456") {
        window.location.assign("./principal.html");
    } else if (email === "dono@gmail.com" && senha === "123456") {
        window.location.assign("./intranet_adm.html");
    } else if (email === "entregador@gmail.com" && senha === "123456") {
        window.location.assign("./intranet_entregador.html");
    } else {
        mensagem.textContent = "E-mail ou senha incorretos.";
    }
}

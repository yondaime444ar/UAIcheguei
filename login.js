function entrar(event) {
            event.preventDefault();

            const cpf = document.getElementById("CPF").value.replace(/\D/g, "");
            const email = document.getElementById("Email").value.trim().toLowerCase();
            const senha = document.getElementById("Senha").value;
            const confirmarSenha = document.getElementById("ConfirmarSenha").value;
            const mensagem = document.getElementById("mensagem");

            if (!cpf || !email || !senha || !confirmarSenha) {
                mensagem.textContent = "Preencha CPF, e-mail, senha e confirmação da senha.";
                return;
            }

            if (senha !== confirmarSenha) {
                mensagem.textContent = "A senha e a confirmação precisam ser iguais.";
                return;
            }

            if (cpf === "12345678900" && email === "cliente@gmail.com" && senha === "123456") {
                window.location.assign("./principal.html");
            } else if (cpf === "98765432100" && email === "dono@gmail.com" && senha === "123456") {
                window.location.assign("./intranet_adm.html");
            } else if (cpf === "11122233344" && email === "entregador@gmail.com" && senha === "123456") {
                window.location.assign("./intranet_entregador.html");
            } else {
                mensagem.textContent = "Dados incorretos. Para o entregador, confira CPF 11122233344, e-mail entregador@gmail.com e senha e confirmação 123456.";
            }
        }
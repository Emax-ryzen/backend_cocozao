const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// COLOQUE O WEBHOOK DO DISCORD NAS VARIÁVEIS DE AMBIENTE
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1552868105112391741/5nMuSsLpnbjvrxsf4i1ra8uA-w39Zn_cAYdYm3Z7dtsKdmcietg9WB94zuvoH8jXqLqb"
    process.env.DISCORD_WEBHOOK_URL;

app.use(express.json());


// Permite que o GitHub Pages converse com o backend
app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


app.get("/", (req, res) => {

    res.send("Backend do site funcionando!");
});


app.post("/cadastro", async (req, res) => {

    try {

        const {
            nome,
            email,
            idade
        } = req.body;


        if (!nome || !email || !idade) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Preencha todos os campos."
            });
        }


        if (!DISCORD_WEBHOOK_URL) {

            return res.status(500).json({
                sucesso: false,
                mensagem: "Webhook do Discord não configurado."
            });
        }


        const dadosDiscord = {

            username: "Bot de Cadastro",

            embeds: [

                {
                    title: "📝 Novo cadastro",

                    color: 5793266,

                    fields: [

                        {
                            name: "👤 Nome",
                            value: String(nome),
                            inline: true
                        },

                        {
                            name: "📧 E-mail",
                            value: String(email),
                            inline: true
                        },

                        {
                            name: "🎂 Idade",
                            value: String(idade),
                            inline: true
                        }

                    ],

                    timestamp:
                        new Date().toISOString()
                }

            ]
        };


        const respostaDiscord =
            await fetch(
                DISCORD_WEBHOOK_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            dadosDiscord
                        )
                }
            );


        if (!respostaDiscord.ok) {

            console.error(
                "Discord:",
                respostaDiscord.status
            );

            return res.status(500).json({
                sucesso: false,
                mensagem:
                    "O Discord recusou o envio."
            });
        }


        res.json({

            sucesso: true,

            mensagem:
                "Cadastro realizado com sucesso!"

        });


    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            sucesso: false,

            mensagem:
                "Erro interno no servidor."

        });
    }

});


app.listen(PORT, () => {

    console.log(
        `Backend funcionando na porta ${PORT}`
    );

});
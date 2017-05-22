(() => {
    'use strict';
    const express = require('express');
    const bodyParser = require('body-parser');

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.listen(port);
    console.log('API rodando na porta ' + port);

    app.route('/')
        .get((req, res) => {
            res.send({ message: 'Api rodando =)' }).end();
        })
        .post((req, res) => {
            try {
                // Cria o Blob Service
                var blobSvc = azure.createBlobService('CONNECTION STRING');

                // Define o nome do arquivo a ser gerado
                // É interessante gerar sempre um nome único, utilizando Guid por exemplo
                var filename = 'meuarquivo.jpg';

                // Recupera a imagem base64 que veio no corpo da requisição
                var rawdata = req.body.image;

                // Separa a string em conteúdo/tipo de dado
                var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

                // Obtém o tipo da imagem
                var type = matches[1];

                // Transforma a string em um buffer
                var buffer = new Buffer(matches[2], 'base64');

                // Salva a imagem
                await blobSvc.createBlockBlobFromText('MEUCONTAINER', filename, buffer, { contentType: type }, function (error, result, response) {
                    if (error) {
                        console.log(error);
                    }
                });

                // Retorna sucesso
                res.status(200).send({ image: 'https://MEUSTORAGEACCOUNT.blob.core.windows.net/MEUCONTAINER/' + filename });
            } catch (e) {
                res.status(500).send({ message: 'Falha ao processar sua requisição' });
            }
        });
})();
(() => {
    'use strict';
    const azure = require('azure-storage');
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
        .post(async (req, res) => {
            try {
                // Cria o Blob Service
                var blobSvc = azure.createBlobService('CONNECTION_STRING');

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
                await blobSvc.createBlockBlobFromText('CONTAINER', filename, buffer, { contentType: type }, function (error, result, response) {
                    if (error) {
                        console.log(error);
                    }
                });

                // Retorna sucesso
                res.status(200).send({ image: 'https://STORAGE.blob.core.windows.net/CONTAINER/' + filename });
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'Falha ao processar sua requisição' });
            }
        });
})();
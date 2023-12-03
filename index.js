const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')

const app = express ()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended :true}))
app.use(cors())

const getComputadores = (request, response) => {
    pool.query('SELECT * FROM computadores', (error, results) =>{
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addComputadores = (request, response) => {
    const { placa_mae, processador, memoria, fonte, ssd } = request.body

    pool.query(
        'INSERT INTO computadores (placa_mae, processador, memoria, fonte, ssd) VALUES ($1, $2, $3, $4, $5)',
        [placa_mae, processador, memoria, fonte, ssd],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json ({ status: 'success', message: 'Computador adicionado com sucesso'})
        }
    )
}

const updateComputadores = (request, response) => {
    const { id, placa_mae, processador, memoria, fonte, ssd } = request.body

    pool.query(
        'UPDATE computadores set placa_mae = $1, processador = $2, memoria = $3, fonte = $4, ssd = $5 where id = $6',
        [placa_mae, processador, memoria, fonte, ssd, id],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json ({ status: 'success', message: 'Computador alterado com sucesso'})
        }
    )
}

const deleteComputadores = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'DELETE from computadores where id=$1',
        [id],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json ({ status: 'success', message: 'Computador deletado com sucesso'})
        }
    )
}

const getComputadoresPorID = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM computadores where id = $1', [id], (error, results) =>{
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

app
    .route('/computadores')
    .get(getComputadores)
    .post(addComputadores)
    .put(updateComputadores)
app
    .route('/computadores/:id')
    .get(getComputadoresPorID)
    .delete(deleteComputadores)    

const getUsuarios = (request, response) => {
    pool.query('SELECT * FROM usuarios', (error, results) =>{
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
    
    const addUsuarios = async (request, response) => {
        try {
            const { nome, computador_id } = request.body;
            const results = await pool.query(
                'INSERT INTO usuarios (nome, computador_id) VALUES ($1, $2) RETURNING nome, computador_id',
                [nome, computador_id]
            );
            const usuarioinserido = results.rows[0];
            return response.status(200).json({
                status: 'success',
                message: 'Usuario criado',
                objeto: usuarioinserido
            });
        } catch (err) {
            return response.status(400).json({
                status: 'error',
                message: 'Erro ao inserir o usuario: ' + err
            });
        }
    };
    
    
    const updateUsuarios = (request, response) => {
        const { id, nome, computador_id } = request.body;
    
        // Certifique-se de que computador_id seja um número inteiro válido
        const parsedComputadorId = computador_id !== '' ? parseInt(computador_id, 10) : null;
    
        pool.query(
            'UPDATE usuarios SET nome = $1, computador_id = $2 WHERE id = $3',
            [nome, parsedComputadorId, id],
            (error) => {
                if (error) {
                    throw error;
                }
                response.status(201).json({ status: 'success', message: 'Usuario alterado com sucesso' });
            }
        );
    };
    
    const deleteUsuarios = (request, response) => {
        const id = parseInt(request.params.id)
    
        pool.query(
            'DELETE from usuarios where id=$1',
            [id],
            (error) => {
                if (error) {
                    throw error
                }
                response.status(201).json ({ status: 'success', message: 'Usuario deletado com sucesso'})
            }
        )
    }

    const getUsuariosPorID = (request, response) => {
        const id = parseInt(request.params.id)
        pool.query('SELECT * FROM usuarios where id = $1', [id], (error, results) =>{
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }
    
    app
        .route('/usuarios')
        .get(getUsuarios)
        .post(addUsuarios)
        .put(updateUsuarios)
    app
        .route('/usuarios/:id')
        .get(getUsuariosPorID)
        .delete(deleteUsuarios)


app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor rodando a API')
})
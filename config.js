const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

let pool = null;

if (isProduction){
    pool = new Pool({
        connectionString : process.env.DATABASE_URL 
    })
} else {
    pool = new Pool({
        user : 'postgres',
        host : 'localhost',
        database : 'cadastro_pcs',
        password : 'postgres',
        port : 5432
    })
}

module.exports = { pool }; 

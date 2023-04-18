const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '2468',
    database: 'softjobs',
    allowExitOnIdle: true
})

const nuevoUsuario = async (email, password, rol, lenguaje) => {
    const consulta = 'INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)'
    const passwordEncriptado = bcrypt.hashSync(password)
    const values = [email, passwordEncriptado, rol, lenguaje]
    await pool.query(consulta, values)
}

const accesoUsuario = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptado } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptado)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}

const datosUsuario = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const values = [email]
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    if (!rowCount) {
        throw { code: 404, message: "Usuario no registrado" }
    }
    delete usuario.password
    return usuario
}

module.exports = { nuevoUsuario, accesoUsuario, datosUsuario }
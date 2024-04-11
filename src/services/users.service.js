const knex = require("../db")

const getUserByEmail = async ({ email }) => {
    const user = await knex("usuarios").where({ email: email }).first()

    return user

}
const getUserById = async ({ id }) => {
    const user = await knex("usuarios").where({ id: id }).first()

    return user
}


module.exports = {
    getUserByEmail,
    getUserById
}

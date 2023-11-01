import Joi from "joi";

const createRole = Joi.object({
    name: Joi.string().max(20).required(),
    display_name: Joi.string().max(20).required()
})
const getRole = Joi.string().max(100).required();

const updateRole = Joi.object({
    display_name: Joi.string().max(20).required()
})

export {
    createRole,
    getRole,
    updateRole
}
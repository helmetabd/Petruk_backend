import Joi from "joi";

const positionAndDivisionValidation = Joi.object({
    name: Joi.string().max(150).required()
})
const getDivPosValidation = Joi.string().max(100).required();

export {
    positionAndDivisionValidation,
    getDivPosValidation
}
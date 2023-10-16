import Joi from "joi";

const positionDivisionValidationTemplate = Joi.object({
    name: Joi.string().max(150).required()
})
const getDivPosTempValidation = Joi.string().max(100).required();

export {
    positionDivisionValidationTemplate,
    getDivPosTempValidation
}
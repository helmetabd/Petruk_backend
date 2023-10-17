import Joi from "joi";

const positionDivisionTemplateTestValidation = Joi.object({
    name: Joi.string().max(150).required()
})
const getDivPosTempTestValidation = Joi.string().max(100).required();

export {
    positionDivisionTemplateTestValidation,
    getDivPosTempTestValidation
}
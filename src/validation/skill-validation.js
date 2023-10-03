import Joi from "joi";

const skillValidation = Joi.object({
    skill: Joi.array().items(
        Joi.object({
            name: Joi.string().max(100).required()
        })
    ).has(Joi.object({
        name: Joi.string().max(100).required()
    }))
});
const getSkillValidation = Joi.string().max(100).required();

export {
    skillValidation,
    getSkillValidation
}
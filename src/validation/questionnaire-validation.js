import Joi from "joi";

const createQuestionnaireValidation = Joi.object({
    questionnaire: Joi.array().items(
        Joi.object({
            question: Joi.string().max(255).required()
        })
    ).has(Joi.object({
        question: Joi.string().max(255).required()
    })),
});

const getQuestionnaireValidation = Joi.string().max(100).required();

const updateQuestionnaireValidation = Joi.object({
    name: Joi.string().max(150).required(),
    questionnaire: Joi.array().items(
        Joi.object({
            question: Joi.string().max(255).required()
        })
    ).has(Joi.object({
        question: Joi.string().max(255).required()
    })),
})

export {
    createQuestionnaireValidation,
    getQuestionnaireValidation,
    updateQuestionnaireValidation
}
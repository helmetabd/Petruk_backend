import Joi from "joi";

const createQuestionnaireValidation = Joi.object({
    questionnaire: Joi.array().items(
        Joi.object({
            question: Joi.string().max(255).required(),
            type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
        })
    ).has(Joi.object({
        question: Joi.string().max(255).required(),
        type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
    })),
});

const getQuestionnaireValidation = Joi.string().max(100).required();

const updateQuestionnaireValidation = Joi.object({
    name: Joi.string().max(150).required(),
    questionnaire: Joi.array().items(
        Joi.object({
            question: Joi.string().max(255).required(),
            type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
        })
    ).has(Joi.object({
        question: Joi.string().max(255).required(),
        type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
    })),
})

export {
    createQuestionnaireValidation,
    getQuestionnaireValidation,
    updateQuestionnaireValidation
}
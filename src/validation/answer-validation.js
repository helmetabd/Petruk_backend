import Joi from "joi";

const createAnswerValidation = Joi.object({
    answer: Joi.array().items(
        Joi.object({
            value: Joi.string().max(255).required()
        })
    ).has(Joi.object({
        value: Joi.string().max(255).required()
    }))
});

const answerValidation = Joi.object({
    answer: Joi.array().items(
        Joi.object({
            questionId: Joi.number().integer().positive(),
            value: Joi.string().max(255).required()
        })
    ).has(Joi.object({
        questionId: Joi.number().integer().positive(),
        value: Joi.string().max(255).required()
    }))
});

const responseValidation = Joi.object({
    response: Joi.array().items(
        Joi.object({
            questionnaireId: Joi.number().integer().positive(),
            value: Joi.string().max(255).required()
        })
    ).has(Joi.object({
        questionnaireId: Joi.number().integer().positive(),
        value: Joi.string().max(255).required()
    }))
});

const getAnswerValidation = Joi.string().max(100).required();

export {
    createAnswerValidation,
    answerValidation,
    getAnswerValidation,
    responseValidation
}
import Joi from "joi";

const createQuestionsValidation = Joi.object({
    questions: Joi.array().items(
        Joi.object({
            question: Joi.string().max(255).required(),
            type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
        })
    ).has(Joi.object({
        question: Joi.string().max(255).required(),
        type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
    })),
});

const getQuestionsValidation = Joi.string().max(100).required();

const updateQuestionsValidation = Joi.object({
    name: Joi.string().max(150).required(),
    questions: Joi.array().items(
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
    createQuestionsValidation,
    getQuestionsValidation,
    updateQuestionsValidation
}
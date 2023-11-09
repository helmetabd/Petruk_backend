import Joi from "joi";

const createQuestionnaireValidation = Joi.object({
    questionnaire: Joi.array().items(
        Joi.object({
            question: Joi.string().max(255).required(),
            type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
            options: Joi.array().items(
                Joi.object({
                    option: Joi.string().max(255).required()
                })
            ).when('type', {
                is: 'Option',
                then: Joi.required(),
                otherwise: Joi.optional()
            })
        })
    ).has(Joi.object({
        question: Joi.string().max(255).required(),
        type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
        options: Joi.array().items(
            Joi.object({
                option: Joi.string().max(255).required()
            })
        ).when('type', {
            is: 'Option',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
    })),
});

const getQuestionnaireValidation = Joi.string().max(100).required();

const updateQuestionnaireValidation = Joi.object({
    name: Joi.string().max(150).required(),
    questionnaire: Joi.array().items(
        Joi.object({
            question: Joi.string().max(255).required(),
            type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
            options: Joi.array().items(
                Joi.object({
                    option: Joi.string().max(255).required()
                })
            ).when('type', {
                is: 'Option',
                then: Joi.required(),
                otherwise: Joi.optional()
            })
        })
    ).has(Joi.object({
        question: Joi.string().max(255).required(),
        type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
        options: Joi.array().items(
            Joi.object({
                option: Joi.string().max(255).required()
            })
        ).when('type', {
            is: 'Option',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
    })),
})

const updateOptionValidation = Joi.object({
    question: Joi.string().max(255).required(),
    type: Joi.valid('LongText', 'Text', 'Number', 'Option').required(),
    options: Joi.array().items(
        Joi.object({
            option: Joi.string().max(255).required()
        })
    ).has(Joi.object({
        option: Joi.string().max(255).required()
    }))
})

export {
    createQuestionnaireValidation,
    getQuestionnaireValidation,
    updateQuestionnaireValidation,
    updateOptionValidation
}
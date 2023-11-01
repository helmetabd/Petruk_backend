import Joi from "joi";

const createQuestionsValidation = Joi.object({
    questions: Joi.array().items(
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
            }).max(4)
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
        }).max(4)
    })),
});

const getQuestionsValidation = Joi.string().max(100).required();

const updateQuestionsValidation = Joi.object({
    name: Joi.string().max(150).required(),
    questions: Joi.array().items(
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
    createQuestionsValidation,
    getQuestionsValidation,
    updateQuestionsValidation,
    updateOptionValidation
}
import Joi from "joi";

const createApplicantValidation = Joi.object({
    application_date: Joi.date(),
    status: Joi.valid('Submitted', 'Hold', 'Placed', 'Interview').required(),
    description: Joi.array().items(
        Joi.object({
            option: Joi.string().max(255).required()
        })
    ).when('status', {
        is: 'Hold',
        then: Joi.required(),
        otherwise: Joi.optional()
    })
})

const getApplicantValidation = Joi.string().max(100).required();

const updateApplicantValidation = Joi.object({
    status: Joi.valid('Hold', 'Placed', 'Interview').required(),
    description: Joi.array().items(
        Joi.object({
            option: Joi.string().max(255).required()
        })
    ).when('status', {
        is: 'Hold',
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    interview_date: Joi.when('status', {
        is: 'Interview',
        then: Joi.date().required(),
        otherwise: Joi.date().optional()
    }),
    placed_date: Joi.when('status', {
        is: 'Placed',
        then: Joi.date().required(),
        otherwise: Joi.date().optional()
    })
})

export {
    createApplicantValidation,
    getApplicantValidation,
    updateApplicantValidation
}
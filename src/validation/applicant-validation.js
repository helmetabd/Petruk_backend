import Joi from "joi";

const createApplicantValidation = Joi.object({
    application_date: Joi.date(),
    status: Joi.valid('Submitted').required(),
})

const getApplicantValidation = Joi.string().max(100).required();

const updateApplicantValidation = Joi.object({
    status: Joi.valid('Hold', 'Placed', 'Interview').required(),
    description: Joi.when('status', {
        not: 'Placed',
        then: Joi.string().max(255).required(),
        otherwise: Joi.string().max(255).optional()
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
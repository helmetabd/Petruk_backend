import Joi from "joi";

const createApplicantValidation = Joi.object({
    application_date: Joi.date(),
    status: Joi.valid('Submitted'),
    recomendation: Joi.array().items(
        Joi.object({
            name: Joi.string().max(100).required(),
            phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
            job: Joi.string().max(150).required(),
            status: Joi.string().max(30).required(),
        })
    ).has(Joi.object({
        name: Joi.string().max(100).required(),
        phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
        job: Joi.string().max(150).required(),
        status: Joi.string().max(30).required(),
    })).optional()
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
import Joi from "joi";

const createEducationValidation = Joi.object({
    instance_name: Joi.string().max(255).required(),
    education_level: Joi.string().max(50).required(),
    major: Joi.string().max(255).required(),
    gpa: Joi.number().precision(2),
    enrollment_year: Joi.date(),
    graduation_year: Joi.date()
});

const getEducationValidation = Joi.string().max(100).required();

const updateEducationValidation = Joi.object({
    instance_name: Joi.string().max(255).required(),
    education_level: Joi.string().max(50).required(),
    major: Joi.string().max(255).required(),
    gpa: Joi.number().precision(2),
    enrollment_year: Joi.date(),
    graduation_year: Joi.date()
})

export {
    createEducationValidation,
    getEducationValidation,
    updateEducationValidation
}
import Joi from "joi";

const createExperienceValidation = Joi.object({
    instance_name: Joi.string().max(255).required(),
    position: Joi.string().max(100).required(),
    start_work: Joi.date(),
    end_work: Joi.date()
});

const getExperienceValidation = Joi.string().max(100).required();

const updateExperienceValidation = Joi.object({
    instance_name: Joi.string().max(255).required(),
    position: Joi.string().max(100).required(),
    start_work: Joi.date(),
    end_work: Joi.date()
})

export {
    createExperienceValidation,
    getExperienceValidation,
    updateExperienceValidation
}
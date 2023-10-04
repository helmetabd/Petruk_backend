import Joi from "joi";

const createExperienceValidation = Joi.object({
    instance_name: Joi.string().max(255).required(),
    position: Joi.string().max(100).required(),
    start_work: Joi.date().required(),
    end_work: Joi.date().required()
});

const getExperienceValidation = Joi.string().max(100).required();

const updateExperienceValidation = Joi.object({
    instance_name: Joi.string().max(255).required(),
    position: Joi.string().max(100).required(),
    start_work: Joi.date().required(),
    end_work: Joi.date().required()
})

export {
    createExperienceValidation,
    getExperienceValidation,
    updateExperienceValidation
}
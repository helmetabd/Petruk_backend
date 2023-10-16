import Joi from "joi";

const createExperienceValidation = Joi.object({
    experience: Joi.array().items(
        Joi.object({
            instance_name: Joi.string().max(255).required(),
            position: Joi.string().max(100).required(),
            reason: Joi.string().max(255).required(),
            salary: Joi.number().integer().positive().required(),
            start_work: Joi.date().required(),
            end_work: Joi.date().required()
        })
    ).has(Joi.object({
        instance_name: Joi.string().max(255).required(),
        position: Joi.string().max(100).required(),
        reason: Joi.string().max(255).required(),
        salary: Joi.number().integer().positive().required(),
        start_work: Joi.date().required(),
        end_work: Joi.date().required()
    }))
});

const getExperienceValidation = Joi.string().max(100).required();

const updateExperienceValidation = Joi.object({
    instance_name: Joi.string().max(255).required(),
    position: Joi.string().max(100).required(),
    reason: Joi.string().max(255).required(),
    salary: Joi.number().integer().positive().required(),
    start_work: Joi.date().required(),
    end_work: Joi.date().required()
})

export {
    createExperienceValidation,
    getExperienceValidation,
    updateExperienceValidation
}
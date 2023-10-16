import Joi from "joi";

const createJobValidation = Joi.object({
    salary: Joi.number().integer().positive().required(),
    details: Joi.string().required(),
    needs: Joi.number().integer().positive().required(),
    skill: Joi.array().items(
        Joi.object({
            name: Joi.string().max(100).required()
        })
    ).has(Joi.object({
        name: Joi.string().max(100).required()
    })),
    template: Joi.string().max(150).required(),
    // questionnaire: Joi.array().items(
    //     Joi.object({
    //         question: Joi.string().max(255).required()
    //     })
    // ).has(Joi.object({
    //     question: Joi.string().max(255).required()
    // })),
    position: Joi.string().max(150).required(),
    division: Joi.string().max(150).required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
});

const getJobValidation = Joi.string().max(100).required();

const updateJobValidation = Joi.object({
    salary: Joi.number().integer().positive().required(),
    details: Joi.string().required(),
    needs: Joi.number().integer().positive().required(),
    skill: Joi.array().items(
        Joi.object({
            name: Joi.string().max(100).required()
        })
    ).has(Joi.object({
        name: Joi.string().max(100).required()
    })),
    template: Joi.string().max(150).required(),
    // questionnaire: Joi.array().items(
    //     Joi.object({
    //         question: Joi.string().max(255).required()
    //     })
    // ).has(Joi.object({
    //     question: Joi.string().max(255).required()
    // })),
    updated_at: Joi.date()
})

export {
    createJobValidation,
    getJobValidation,
    updateJobValidation
}
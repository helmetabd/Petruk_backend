import Joi from "joi";

const courseValidation = Joi.object({
    course: Joi.array().items(
        Joi.object({
            instance_name: Joi.string().max(255).required(),
            type: Joi.string().max(255).required(),
            qualification: Joi.string().max(10).required(),
            start_course: Joi.date().required(),
            end_course: Joi.date().required()
        })
    ).has(Joi.object({
        instance_name: Joi.string().max(255).required(),
        type: Joi.string().max(255).required(),
        qualification: Joi.string().max(10).required(),
        start_course: Joi.date().required(),
        end_course: Joi.date().required()
    }))
});

const getCourseValidation = Joi.string().max(100).required();

const updateCourseValidation = Joi.object({
    instance_name: Joi.string().max(255).required(),
    type: Joi.string().max(255).required(),
    qualification: Joi.string().max(10).required(),
    start_course: Joi.date().required(),
    end_course: Joi.date().required()
})

export {
    courseValidation,
    getCourseValidation,
    updateCourseValidation
}
import Joi from "joi";

const profileValidation = Joi.object({
    birthday: Joi.date().required(),
    address: Joi.string().max(255).required(),
    // image: Joi.string().max(255).required(),
    image: Joi.any(),
    about: Joi.string().required()
});

const getProfileValidation = Joi.string().max(100).required();

const updateProfileValidation = Joi.object({
    address: Joi.string().max(255).required(),
    image: Joi.any(),
    about: Joi.string().required()
})

export {
    profileValidation,
    getProfileValidation,
    updateProfileValidation
}
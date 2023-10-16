import Joi from "joi";

const profileValidation = Joi.object({
    birthday: Joi.date().required(),
    birthplace: Joi.string().max(100).required(),
    gender: Joi.valid('Male', 'Female').required(),
    religion: Joi.string().max(50).required(),
    address_domisili: Joi.string().max(255).required(),
    address_ktp: Joi.string().max(255).required(),
    // image: Joi.string().max(255).required(),
    image: Joi.any(),
    about: Joi.string().required()
});

const getProfileValidation = Joi.string().max(100).required();

const updateProfileValidation = Joi.object({
    religion: Joi.string().max(50).required(),
    address_domisili: Joi.string().max(255).required(),
    image: Joi.any(),
    about: Joi.string().required()
})

export {
    profileValidation,
    getProfileValidation,
    updateProfileValidation
}
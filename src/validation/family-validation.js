import Joi from "joi";

const familyValidation = Joi.object({
    family: Joi.array().items(
        Joi.object({
            name: Joi.string().max(100).required(),
            status: Joi.string().max(30).required(),
            address: Joi.string().max(255).required(),
            work: Joi.string().max(100).required(),
            phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
        })
    ).has(Joi.object({
        name: Joi.string().max(100).required(),
        status: Joi.string().max(30).required(),
        address: Joi.string().max(255).required(),
        work: Joi.string().max(100).required(),
        phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
    }))
});

const getFamilyValidation = Joi.string().max(100).required();

const updateFamilyValidation = Joi.object({
    name: Joi.string().max(100).required(),
    status: Joi.string().max(30).required(),
    address: Joi.string().max(255).required(),
    work: Joi.string().max(100).required(),
    phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
});

export {
    familyValidation,
    getFamilyValidation,
    updateFamilyValidation
}
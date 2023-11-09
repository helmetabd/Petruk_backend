import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required(),
    nickname: Joi.string().max(100).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).max(200).required(),
    phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
});
const createSuperValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required(),
    nickname: Joi.string().max(100).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).max(200).required(),
    role: Joi.string().valid('USER', 'ADMIN', 'SUPER').default('USER').required(),
    phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
});
const createAdminValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required(),
    nickname: Joi.string().max(100).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).max(200).required(),
    role: Joi.string().valid('USER', 'ADMIN').default('USER').required(),
    phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
});

const loginUserValidation = Joi.object({
    // username: [
    //     Joi.string().max(100).required(),
    //     Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).max(200).required(),
    // ],
    username: Joi.alternatives().try(
        Joi.string().max(100),
        Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).max(200),
    ).required(),
    password: Joi.string().max(100).required(),
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    name: Joi.string().max(100).required(),
    nickname: Joi.string().max(100).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).max(200).required(),
    phone: Joi.string().regex(/^([0-9]){8,12}[0-9]$/).messages({ 'string.pattern.base': `Phone number must have 9 digits and maximum 13 digits` }).required(),
    updated_at: Joi.date()
})

const requestPasswordValidation = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).max(200).required(),
})

const resetPasswordValidation = Joi.object({
    userId: Joi.number().integer().positive().required(),
    password: Joi.string().max(100).required(),
    token: Joi.string().max(255).required()
})

const verifyAccountValidation = Joi.object({
    userId: Joi.number().integer().positive().required(),
    email: Joi.string().max(255).required()
})

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
    createAdminValidation,
    createSuperValidation,
    requestPasswordValidation,
    resetPasswordValidation,
    verifyAccountValidation
}
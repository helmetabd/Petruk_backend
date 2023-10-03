import Joi from "joi";

const expectationValidation = Joi.object({
    salary_expectation: Joi.number().integer().positive().required()
})
const getExpectationValidation = Joi.string().max(100).required();

export {
    expectationValidation,
    getExpectationValidation
}
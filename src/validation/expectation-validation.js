import Joi from "joi";

const expectationValidation = Joi.object({
    salary_expectation: Joi.string().max(10).required()
})
const getExpectationValidation = Joi.string().max(100).required();

export {
    expectationValidation,
    getExpectationValidation
}
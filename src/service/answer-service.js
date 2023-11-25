import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { answerValidation, getAnswerValidation, responseValidation } from "../validation/answer-validation.js";

const create = async (request, option) => {
    const cookies = request.cookies;
    if (!cookies?.refreshToken) {
        throw new ResponseError(204, "No content!");
    };
    const refreshTkn = cookies.refreshToken;
    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
    });

    if (!user) {
        throw new ResponseError(204, "No content!");
    };

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    if (option === "answer") {
        const userAnswer = validate(answerValidation, request.body);

        return prismaClient.applicant.update({
            where: {
                id: parseInt(request.params.id)
            },
            data: {
                answer: {
                    create: userAnswer.answer.map((tag) => {
                        return {
                            questionId: tag.questionId,
                            value: tag.value
                        }
                    })
                },
                application_date: updated
            },
            select: {
                id: true,
                user: {
                    select: {
                        name: true,
                        username: true
                    }
                },
                response: true,
                answer: true,
                application_date: true
            }
        });
    } else if (option === "response") {
        const userAnswer = validate(responseValidation, request.body);

        return prismaClient.applicant.update({
            where: {
                id: parseInt(request.params.id)
            },
            data: {
                response: {
                    create: userAnswer.response.map((tag) => {
                        return {
                            questionnaireId: tag.questionnaireId,
                            value: tag.value
                        }
                    })
                },
                application_date: updated
            },
            select: {
                id: true,
                user: {
                    select: {
                        name: true,
                        username: true
                    }
                },
                response: true,
                answer: true,
                application_date: true
            }
        });
    }
}

const get = async (username) => {
    const validateUser = validate(getAnswerValidation, username);

    const user = await prismaClient.user.findFirst({
        where: {
            username: validateUser
        },
        select: {
            id: true,
            role: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    if (user.role.name === "USER") {
        const answer = await prismaClient.answer.findMany({
            where: {
                users: {
                    some: {
                        id: user.id
                    }
                }
            },
            select: {
                id: true,
                name: true,
            }
        });

        if (!answer) {
            throw new ResponseError(404, "user is not found");
        }

        return answer;

    } else if (user.role.name === "ADMIN") {
        const answer = await prismaClient.answer.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        if (!answer) {
            throw new ResponseError(404, "user is not found");
        }

        return answer;
    }
}

export default {
    create,
    get
}
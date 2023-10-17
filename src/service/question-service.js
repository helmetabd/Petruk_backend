import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createQuestionsValidation, getQuestionsValidation, updateQuestionsValidation } from "../validation/question-validation.js";
import { validate } from "../validation/validation.js"

const create = async (request) => {
    const cookies = request.cookies;
    if (!cookies?.refreshToken) {
        throw new ResponseError(204, "No content!");
    };
    const refreshTkn = cookies.refreshToken;
    // console.log(refreshTkn);
    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    const testQuestions = validate(createQuestionsValidation, request.body);

    // tempplateQuestionnaire.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.test.update({
        where: {
            id: parseInt(request.params.id)
        },
        data: {
            questionTest: {
                connectOrCreate: testQuestions.questions.map((tag) => {
                    return {
                        where: { question: tag.question },
                        create: {
                            question: tag.question,
                            type: tag.type
                        }
                    };
                })
            }
        },
        select: {
            name: true,
            questionTest: {
                select: {
                    question: true,
                    type: true
                }
            },
            job: {
                select: {
                    position: {
                        select: {
                            name: true
                        }
                    },
                    division: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
}

const get = async (request) => {
    const validateUser = validate(getQuestionsValidation, request.user);

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

    // if (user.role === "USER") {
    //     const skill = await prismaClient.skill.findMany({
    //         where: {
    //             users: {
    //                 some: {
    //                     id: user.id
    //                 }
    //             }
    //         },
    //         select: {
    //             id: true,
    //             name: true,
    //         }
    //     });

    //     if (!skill) {
    //         throw new ResponseError(404, "user is not found");
    //     }

    //     return skill;

    // } else if (user.role === "ADMIN") {
    //     const skill = await prismaClient.skill.findMany({
    //         select: {
    //             id: true,
    //             name: true,
    //         }
    //     });

    //     if (!skill) {
    //         throw new ResponseError(404, "user is not found");
    //     }

    //     return skill;
    // }

    const test = await prismaClient.test.findUnique({
        where: {
            id: parseInt(request.params.id)
        },
        select: {
            name: true,
            questionTest: {
                select: {
                    question: true,
                    type: true
                }
            },
            job: {
                select: {
                    position: {
                        select: {
                            name: true
                        }
                    },
                    division: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    if (!test) {
        throw new ResponseError(404, "test is not found");
    }

    return test;
}

const update = async (request) => {
    const cookies = request.cookies;
    if (!cookies?.refreshToken) {
        throw new ResponseError(204, "No content!");
    };
    const refreshTkn = cookies.refreshToken;
    // console.log(refreshTkn);
    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    const updatedTest = validate(updateQuestionsValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.test.update({
        where: {
            id: parseInt(request.params.id)
        },
        data: {
            name: updatedTest.name,
            questionTest: {
                connectOrCreate: updatedTest.questions.map((tag) => {
                    return {
                        where: { question: tag.question },
                        create: {
                            question: tag.question,
                            type: tag.type
                        }
                    };
                })
            }
        },
        select: {
            name: true,
            questionTest: {
                select: {
                    question: true,
                    type: true
                }
            },
            job: {
                select: {
                    position: {
                        select: {
                            name: true
                        }
                    },
                    division: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
}

const remove = async (request) => {
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

    const questionInTest = await prismaClient.test.count({
        where: {
            questionTest: {
                some: {
                    id: parseInt(request.params.id)
                }
            }
        }
    })

    if (questionInTest > 1) {
        return prismaClient.test.update({
            where: {
                id: parseInt(request.params.test),
            },
            data: {
                questionTest: {
                    disconnect: {
                        id: parseInt(request.params.id)
                    },
                }
            }
        });
    } else if (questionInTest === 1) {
        return prismaClient.test_Question.delete({
            where: {
                id: parseInt(request.params.id)
            }
        })
    }
}

// const testQuestionRemove = async (request) => {
//     const cookies = request.cookies;
//     if (!cookies?.refreshToken) {
//         throw new ResponseError(204, "No content!");
//     };
//     const refreshTkn = cookies.refreshToken;
//     const user = await prismaClient.user.findFirst({
//         where: {
//             token: refreshTkn,
//         },
//     });
//     if (!user) {
//         throw new ResponseError(204, "No content!");
//     };

//     return prismaClient.test.update({
//         where: {
//             id: parseInt(request.params.id),
//         },
//         data: {
//             questionnaire: {
//                 disconnect: {
//                     id: parseInt(request.params.questionnaire)
//                 },
//             }
//         }
//     });
// }

export default {
    create,
    get,
    update,
    remove,
    // testQuestionRemove
}
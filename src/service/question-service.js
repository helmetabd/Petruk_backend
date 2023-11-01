import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createQuestionsValidation, getQuestionsValidation, updateOptionValidation, updateQuestionsValidation } from "../validation/question-validation.js";
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
    // console.log(testQuestions)

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
                            type: tag.type,
                            options: {
                                connectOrCreate: tag.options?.map((tags) => {
                                    return {
                                        where: { option: tags.option },
                                        create: { option: tags.option }
                                    }
                                })
                            }
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
                    type: true,
                    options: true
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
                    id: true,
                    question: true,
                    type: true,
                    options: true
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
                            type: tag.type,
                            options: {
                                connectOrCreate: tag.options?.map((tags) => {
                                    return {
                                        where: { option: tags.option },
                                        create: { option: tags.option }
                                    }
                                })
                            }
                        }
                    };
                }),
            }
        },
        select: {
            name: true,
            questionTest: {
                select: {
                    question: true,
                    type: true,
                    options: true
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

const questionOptionsUpdate = async (request) => {
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
    const updatedQuestion = validate(updateOptionValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // console.log(request.params)
    return prismaClient.test_Question.upsert({
        where: {
            test: {
                some: {
                    id: parseInt(request.params.id)
                }
            },
            question: updatedQuestion.question
        },
        create: {
            test: {
                connect: {
                    id: parseInt(request.params.id)
                }
            },
            question: updatedQuestion.question,
            type: updatedQuestion.type,
            options: {
                connectOrCreate: updatedQuestion.options.map((tag) => {
                    return {
                        where: { option: tag.option },
                        create: { option: tag.option }
                    }
                }),
            }
        },
        update: {
            question: updatedQuestion.question,
            type: updatedQuestion.type,
            options: {
                connectOrCreate: updatedQuestion.options.map((tag) => {
                    return {
                        where: { option: tag.option },
                        create: { option: tag.option }
                    }
                }),
            }
        },
        // include: {
        //     test: true
        // },
        select: {
            test: {
                select: {
                    name: true,
                    questionTest: {
                        select: {
                            question: true,
                            type: true,
                            options: true
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
            }
        }
    });
}

const questionOptionsRemove = async (request) => {
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

    return prismaClient.test_Question.update({
        where: {
            id: parseInt(request.params.id),
        },
        data: {
            options: {
                disconnect: {
                    id: parseInt(request.params.option),
                },
            }
        }
    });
}

export default {
    create,
    get,
    update,
    remove,
    questionOptionsRemove,
    questionOptionsUpdate
}
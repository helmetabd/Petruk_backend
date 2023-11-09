import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createQuestionnaireValidation, getQuestionnaireValidation, updateOptionValidation, updateQuestionnaireValidation } from "../validation/questionnaire-validation.js";
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
    const templateQuestionnaire = validate(createQuestionnaireValidation, request.body);

    // tempplateQuestionnaire.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.template.update({
        where: {
            id: parseInt(request.params.id)
        },
        data: {
            questionnaire: {
                connectOrCreate: templateQuestionnaire.questionnaire.map((tag) => {
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
            questionnaire: {
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
    const validateUser = validate(getQuestionnaireValidation, request.user);

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

    const template = await prismaClient.template.findUnique({
        where: {
            id: parseInt(request.params.id)
        },
        select: {
            name: true,
            questionnaire: {
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

    if (!template) {
        throw new ResponseError(404, "template is not found");
    }

    return template;
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
    const updatedTemplate = validate(updateQuestionnaireValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.template.update({
        where: {
            id: parseInt(request.params.id)
        },
        data: {
            name: updatedTemplate.name,
            questionnaire: {
                connectOrCreate: updatedTemplate.questionnaire.map((tag) => {
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
            questionnaire: {
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

    const questionnarieInTemplate = await prismaClient.template.count({
        where: {
            questionnaire: {
                some: {
                    id: parseInt(request.params.id)
                }
            }
        }
    })

    if (questionnarieInTemplate > 1) {
        return prismaClient.template.update({
            where: {
                id: parseInt(request.params.template),
            },
            data: {
                questionnaire: {
                    disconnect: {
                        id: parseInt(request.params.id)
                    },
                }
            }
        });
    } else if (questionnarieInTemplate === 1) {
        return prismaClient.questionnaire.delete({
            where: {
                id: parseInt(request.params.id)
            }
        })
    }
}

const questionnaireOptionsUpdate = async (request) => {
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
    return prismaClient.questionnaire.upsert({
        where: {
            template: {
                some: {
                    id: parseInt(request.params.template)
                }
            },
            question: updatedQuestion.question
        },
        create: {
            template: {
                connect: {
                    id: parseInt(request.params.template)
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
            template: {
                select: {
                    name: true,
                    questionnaire: {
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

const questionnaireOptionsRemove = async (request) => {
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

    return prismaClient.questionnaire.update({
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
    questionnaireOptionsUpdate,
    questionnaireOptionsRemove
}
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import { getProfileValidation, profileValidation, updateProfileValidation } from "../validation/profile-validation.js";

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

    if (!request.file) {
        throw new ResponseError(422, "Image doesn't exist!");
    }

    // console.log(request.file.path);

    const userProfile = validate(profileValidation, request.body);

    userProfile.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    const getAge = (birthDate) => {
        return Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e+10)
    };

    userProfile.age = getAge(userProfile.birthday);

    userProfile.image = request.file.path;

    // console.log(userProfile);

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    });

    return prismaClient.profile.create({
        data: userProfile,
        select: {
            address_domisili: true,
            address_ktp: true,
            birthplace: true,
            gender: true,
            religion: true,
            age: true,
            birthday: true,
            image: true,
            about: true,
            users: {
                select: {
                    name: true,
                    nickname: true,
                    email: true,
                }
            }
        }
    })
}

const get = async (username) => {
    const validateUser = validate(getProfileValidation, username);

    const user = await prismaClient.user.findFirst({
        where: {
            username: validateUser
        },
        select: {
            id: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    const profile = await prismaClient.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            username: true,
            name: true,
            nickname: true,
            email: true,
            phone: true,
            profile: {
                select: {
                    address_domisili: true,
                    address_ktp: true,
                    birthplace: true,
                    gender: true,
                    religion: true,
                    age: true,
                    birthday: true,
                    image: true,
                    about: true,
                }
            },
            education: {
                select: {
                    instance_name: true,
                    education_level: true,
                    major: true,
                    gpa: true,
                    enrollment_year: true,
                    graduation_year: true,
                }
            },
            experience: {
                select: {
                    instance_name: true,
                    position: true,
                    start_work: true,
                    end_work: true,
                }
            },
            skills: {
                where: {
                    users: {
                        some: {
                            id: user.id
                        }
                    }
                },
                select: {
                    name: true
                }
            },
            family: {
                select: {
                    name: true,
                    status: true,
                    address: true,
                    phone: true,
                }
            },
            course: {
                where: {
                    users: {
                        id: user.id
                    }
                },
                select: {
                    instance_name: true,
                    type: true,
                    qualification: true,
                    start_course: true,
                    end_course: true
                }
            }
        }
    });

    if (!profile) {
        throw new ResponseError(404, "user is not found");
    }

    return profile;
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
    const updateProfile = validate(updateProfileValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    })

    await prismaClient.profile.update({
        where: {
            userId: user.id
        },
        data: updateProfile
    })
    return prismaClient.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            username: true,
            name: true,
            nickname: true,
            email: true,
            phone: true,
            profile: {
                select: {
                    address_domisili: true,
                    address_ktp: true,
                    birthplace: true,
                    gender: true,
                    religion: true,
                    age: true,
                    birthday: true,
                    image: true,
                    about: true,
                }
            },
            education: {
                select: {
                    instance_name: true,
                    education_level: true,
                    major: true,
                    gpa: true,
                    enrollment_year: true,
                    graduation_year: true,
                }
            },
            experience: {
                select: {
                    instance_name: true,
                    position: true,
                    start_work: true,
                    end_work: true,
                }
            },
            skills: {
                where: {
                    users: {
                        some: {
                            id: user.id
                        }
                    }
                },
                select: {
                    name: true
                }
            },
            family: {
                select: {
                    name: true,
                    status: true,
                    address: true,
                    phone: true,
                }
            },
            course: {
                where: {
                    users: {
                        id: user.id
                    }
                },
                select: {
                    instance_name: true,
                    type: true,
                    qualification: true,
                    start_course: true,
                    end_course: true
                }
            }
        }
    });
}

export default {
    create,
    get,
    update,
}
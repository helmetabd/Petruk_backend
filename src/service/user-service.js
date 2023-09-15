import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { registerUserValidation } from "../validation/user-validation";
import { validate } from "../validation/validation"
import { bcrypt } from "bcrypt"

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const isUserExist = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (isUserExist === 1) {
        throw new ResponseError(400, "Username is already Exist");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    })

}

export default {
    register
}
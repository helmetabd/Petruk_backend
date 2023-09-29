import supertest from "supertest";
import { web } from "../src/application/web"
import { prismaClient } from "../src/application/database";

describe('POST /api/users', function () {

    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: "hilmi"
            }
        })
    })

    let data = {
        username: "hilmi",
        password: "password",
        name: "Hilmi Abdurrahim",
        email: "hilmi@test.com",
        role: "ADMIN"
    };

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "hilmi",
                password: "password",
                name: "Hilmi Abdurrahim",
                email: "hilmi@test.com",
                role: "ADMIN"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeUndefined();
        expect(result.body.data.username).toBe("hilmi");
        expect(result.body.data.name).toBe("Hilmi Abdurrahim");
        expect(result.body.data.email).toBe("hilmi@test.com");
        expect(result.body.data.role).toBe("ADMIN");
        expect(result.body.data.pasword).toBeUndefined();
    });
});
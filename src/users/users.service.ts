import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>
    ) {}

    async createAccount({
        email, 
        password, 
        role
    }: CreateAccountInput): Promise<[boolean, string?]> {
        try {
            const exists = await this.users.findOne({where: {email}});
            if (exists) {
                return [false, 'There is a user with that email already'];
            }
            await this.users.save(this.users.create({email, password, role}));
            return [true];
        } catch(e) {
            return [false, "Couldn't create account"];
        }
    }

    async login({
        email, 
        password
    }: LoginInput): Promise<{ok: boolean, error?: string, token?: string}> {
        try {
            const user = await this.users.findOne({where: {email}});
            if (!user) {
                return {
                    ok: false,
                    error: "User not found",
                };
            }
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect) {
                return {
                    ok: false,
                    error: "Wrong password",
                };
            }
            return {
                ok: true,
                token: "success",
            }
        } catch(error) {
            return {
                ok: false,
                error
            };
        }
    }
}
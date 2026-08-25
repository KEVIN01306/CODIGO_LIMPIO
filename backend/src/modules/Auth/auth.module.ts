import { PrismaClient } from "@prisma/client";
import { PrismaAuthRespository } from "./infrastructure/prisma-auth.repository.js";
import { Argon2HashProvider } from "../../shared/infrastructure/argon2-hash.provider.js";
import JwtProvider from "./domain/jwt.provider.js";
import { LoginUseCase } from "./application/login.usecase.js";
import { AuthController } from "./presentation/auth.controller.js";
import { RefreshTokenUseCase } from "./application/refresh-token.usecase.js";
import { GetProfileUseCase } from "./application/get-profile.usecase.js";




const prisma = new PrismaClient();

const authRepository = new PrismaAuthRespository(prisma);
const hashProvider = new Argon2HashProvider();
const jwtProvider = new JwtProvider();


const loginUseCase = new LoginUseCase(authRepository, jwtProvider, hashProvider)
const refreshTokenUseCase = new RefreshTokenUseCase(authRepository,jwtProvider )
const getProfileUseCase = new GetProfileUseCase(authRepository)

export const authController = new AuthController(
    loginUseCase,
    refreshTokenUseCase,
    getProfileUseCase
);
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as argon2 from 'argon2'
import { generate } from 'otp-generator'
import { MailService } from 'src/mail/mail.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly mailService: MailService,
        private readonly prisma: PrismaService
    ) { }

    private readonly logger = new Logger(UserService.name)

    async register(registerUserDto: RegisterUserDto) {

        //Check's if the user already exists
        const user = await this.prisma.user.findUnique({
            where: { email: registerUserDto.email }
        })
        if (user) {
            throw new ConflictException('Esse Email já está em uso')
        }

        // Hash user password
        const passwdHash = await argon2.hash(registerUserDto.passwd, { type: argon2.argon2id })

        // Generate verification code
        const otp = generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        })

        // Try to store user data in KV, the data lives for 15 minutes
        try {
            await this.cacheManager.set(
                otp,
                {
                    name: registerUserDto.name,
                    email: registerUserDto.email,
                    passwd: passwdHash
                },
                1000 * 60 * 15
            );
        } catch (err) {
            this.logger.error(`Cache storage failed: ${err}`)
            throw new InternalServerErrorException(
                'Incapaz de salvar dados'
            )
        };

        // Try send a email to the user with the otp
        try {
            await this.mailService.sendAccountVerification({ mail: registerUserDto.email, otp: otp })
        } catch (err) {
            this.logger.error(`Failed to send Email: ${err}`)
            throw new ServiceUnavailableException(
                'Incapaz de enviar E-mail de verificação, tente novamente em breve',
            );
        }

        return { message: 'Registro completo, verifique o seu E-mail!' };
    }

    async confirmMail(otp: string) {

        // try pull user from KV
        let registerUserDto: RegisterUserDto;

        try {
            registerUserDto = await this.cacheManager.get<RegisterUserDto>(otp)
        } catch (err) {
            this.logger.error(`Cache error: ${err}`);
            throw new InternalServerErrorException(
                'Incapaz de verificar usuário, tente novamente em breve',
            );
        }

        if (!registerUserDto) {
            throw new NotFoundException('Usuário não encontrado, tente registrar-se novamente');
        }

        // FINALLY register the new user in DB
        try {
            await this.prisma.user.create({ data: registerUserDto })
        } catch (error) {
            throw new ConflictException(
                'Desculpe, alguém já verificou esse E-mail',
            );
        }


        return { message: 'Usuário verificado com sucesso!' };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            omit: {
                passwd: true
            },
            where: {
                id: id
            }
        })
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return user;
    }

    async changePassReq(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: email }
        })
        if (!user) {
            throw new NotFoundException('Usuário não encontrado')
        }

        const otp = generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        })

        try {
            await this.cacheManager.set(
                otp,
                { email: email },
                1000 * 60 * 15
            );
        } catch (err) {
            this.logger.error(`Cache storage failed: ${err}`)
            throw new InternalServerErrorException(
                'Incapaz de salvar dados'
            )
        };

        try {
            await this.mailService.sendPasswordChange({ mail: email, otp: otp })
        } catch (err) {
            this.logger.error(`Failed to send Email: ${err}`)
            throw new ServiceUnavailableException(
                'Incapaz de enviar E-mail de verificação, tente novamente em breve',
            );
        }

        return { message: 'Verifique o seu E-mail!' };
    }

    async changePass(otp: string, newPasswd: string) {
        let userData: { email: string };

        try {
            userData = await this.cacheManager.get<{ email: string }>(otp)
        } catch (err) {
            this.logger.error(`Cache error: ${err}`);
            throw new InternalServerErrorException(
                'Incapaz de verificar usuário, tente novamente em breve',
            );
        }

        if (!userData) {
            throw new NotFoundException('Usuário não encontrado, tente registrar-se novamente');
        }

        if (!newPasswd || typeof newPasswd !== 'string') {
            throw new BadRequestException('A nova senha é obrigatória e deve ser uma string.');
        }

        const passwdHash = await argon2.hash(newPasswd, { type: argon2.argon2id });


        try {
            await this.prisma.user.update({
                where: { email: userData.email },
                data: { passwd: passwdHash }
            })
        } catch (error) {
            throw new ConflictException(
                'Desculpe, alguém já verificou esse E-mail',
            );
        }


        return { message: 'Senha alterada com sucesso!' };
    }


    async editUserInfo(editUserDto: EditUserDto, userId: string) {
        const user = await this.findOne(userId)

        if (editUserDto.name != user.name) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { name: editUserDto.name }
            })
        }
        if (editUserDto.email != user.email) {

        }
        if (editUserDto.passwd) {
            const passwdHash = await argon2.hash(editUserDto.passwd, {
                type: argon2.argon2id
            })

            await this.prisma.user.update({
                where: { id: userId },
                data: { passwd: passwdHash }
            })
        }
    }
}

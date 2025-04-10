import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConflictException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as argon2 from 'argon2'
import { generate } from 'otp-generator'
import { MailService } from 'src/mail/mail.service';

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
        'Failed to store user data temporalily'
      )
    };

    // Try send a email to the user with the otp
    try {
      await this.mailService.sendAccountVerification({ mail: registerUserDto.email, otp: otp })
    } catch (err) {
      this.logger.error(`Failoed to send Email: ${err}`)
      throw new ServiceUnavailableException(
        'Unable to send verification email. Please try again later',
      );
    }

    return { message: 'Email sent successfully! it will expire in 15 minutes' };
  }

  async confirmMail(otp: string) {

    // try pull user from KV
    let registerUserDto: RegisterUserDto;

    try {
      registerUserDto = await this.cacheManager.get<RegisterUserDto>(otp)
    } catch (err) {
      this.logger.error(`Cache error: ${err}`);
      throw new InternalServerErrorException(
        'Unable to verify user',
      );
    }

    if (!registerUserDto) {
      throw new NotFoundException('User not founded, try to register again');
    }

    // FINALLY register the new user in DB
    try {
      await this.prisma.user.create({ data: registerUserDto })
    } catch (error) {
      throw new ConflictException(
        'Sorry this email has already been verified',
      );
    }


    return { message: 'User verified successfully' };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } })
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

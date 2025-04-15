import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { LoginUserDto } from './dto/login-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginUserDto.email } })
    if (!user) {
      throw new NotFoundException('E-mail não registrado')
    }

    if (!await argon2.verify(user.passwd, loginUserDto.passwd)) {
      throw new UnauthorizedException('Senha incorreta')
    }

    const payload = { sub: user.id, username: user.name }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}

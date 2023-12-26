import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../common/utils/passwordHasher';
import { SignUpDto } from './dto/signup.dto';
import _ from 'underscore';
import { HttpService } from '@nestjs/axios';
import { constants } from 'src/common/utils/constants';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserEmailDto } from './dto/user-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private mailService: MailService,
  ) {}

  async signUp(signupDto: SignUpDto) {
    const userData = await this.prisma.user.findUnique({
      where: {
        email: signupDto.email,
      },
    });

    if (userData) {
      throw new ForbiddenException('User is already registered');
    }

    const hashedPassword = await hashPassword(signupDto.password);
    await this.prisma.user.create({
      data: {
        email: signupDto.email,
        phone: signupDto.phone,
        password: hashedPassword,
        profile: {
          create: {
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
          },
        },
      },
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.isBanned) {
      throw new HttpException('User is banned', HttpStatus.BAD_REQUEST);
    }

    const validPassword = await verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async verifyCaptcha(token: string) {
    const response = this.httpService.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        secret: constants.recaptchaSecret,
        response: token,
      },
    );

    if (!response) {
      throw new HttpException('Error verifying token', HttpStatus.BAD_REQUEST);
    }
  }

  async getResetPasswordEmail(userEmailDto: UserEmailDto) {
    const confirmationToken = uuidv4();
    const user = await this.prisma.user
      .update({
        where: {
          email: userEmailDto.email,
        },
        data: {
          confirmationToken,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new ForbiddenException('User with this email doesn`t exist');
          }
        }
        throw error;
      });

    await this.mailService.sendResetPasswordConfirmation(
      user.email,
      confirmationToken,
    );
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const hashedPassword = await hashPassword(resetPasswordDto.password);
    await this.prisma.user.update({
      where: { confirmationToken: token },
      data: {
        password: hashedPassword,
        confirmationToken: null,
      },
    });
  }

  async checkConfirmationToken(token: string): Promise<void> {
    const userData = await this.prisma.user.findUnique({
      where: {
        confirmationToken: token,
      },
    });
    if (!userData) {
      throw new BadRequestException('Confirmation token is not correct');
    }
  }
}

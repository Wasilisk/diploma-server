import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../common/utils/passwordHasher';
import { generateOTP } from 'src/common/utils/codeGenerator';
import { getExpiry, isTokenExpired } from 'src/common/utils/dateTimeUtility';
import { sendSMS } from 'src/common/utils/twilio';
import { SignUpDto } from './dto/signup.dto';
import _ from 'underscore';
import { HttpService } from '@nestjs/axios';
import { constants } from 'src/common/utils/constants';
import { RateLimiterService } from 'src/rate-limiter/rate-limiter.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private rateLimiterService: RateLimiterService,
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

    signupDto.password = await hashPassword(signupDto.password);
    const user = await this.prisma.user.create({
      data: _.omit(signupDto, 'confirm'),
    });
    return _.omit(user, 'password', 'confirm');
  }

  async login(req: Request) {
    const { body: loginDto, ip, url } = req;
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    await this.rateLimiterService.recordRequest(ip, url);
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
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

    if (!user.twoFA) {
      const payload = {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        sub: user.id,
      };

      return {
        success: true,
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    const otp = generateOTP(6);
    const otpPayload: Prisma.OtpUncheckedCreateInput = {
      userId: user.id,
      code: otp,
      useCase: 'LOGIN',
      expiresAt: getExpiry(),
    };
    await this.prisma.otp.create({
      data: otpPayload,
    });
    await sendSMS(
      user.phone,
      `Use this code ${otp} to finalize login on your account`,
    );
    return { success: true };
  }

  async verifyLogin(req: Request) {
    const {
      body: { token },
    } = req;
    const otpRecord = await this.prisma.otp.findFirst({
      where: { code: token, useCase: 'LOGIN' },
    });
    if (!otpRecord) {
      throw new HttpException('Invalid OTP', HttpStatus.NOT_FOUND);
    }
    const isExpired = isTokenExpired(otpRecord.expiresAt);
    if (isExpired) {
      throw new HttpException('Expired token', HttpStatus.NOT_FOUND);
    }
    const user = await this.prisma.user.findUnique({
      where: { id: otpRecord.userId },
    });

    if (!user) {
      throw new HttpException('Invalid OTP', HttpStatus.NOT_FOUND);
    }
    const payload = {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      sub: user.id,
    };
    return {
      success: true,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyCaptcha(req: Request) {
    const {
      body: { token },
    } = req;

    const response = await this.httpService.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        secret: constants.recaptchaSecret,
        response: token,
      },
    );

    if (!response) {
      throw new HttpException('Error verifying token', HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
    };
  }
}

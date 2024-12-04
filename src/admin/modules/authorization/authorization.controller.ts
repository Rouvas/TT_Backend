import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { AuthorizationService } from './services/authorization.service';
import { ResetDto } from './dto/reset.dto';
import { CompleteResetDto } from './dto/complete-reset.dto';

@Controller('admin/authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('login')
  loginUser(
    @Req() req: Request,
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ) {
    return this.authorizationService.loginUser(req, loginDto, res);
  }

  @Post('reset')
  resetPassword(
    @Req() req: Request,
    @Body() resetDto: ResetDto,
    @Res() res: Response,
  ) {
    return this.authorizationService.resetPassword(req, resetDto, res);
  }

  @Post('reset/complete')
  completeResetPassword(
    @Req() req: Request,
    @Body() completeResetDto: CompleteResetDto,
    @Res() res: Response,
  ) {
    return this.authorizationService.completeResetPassword(
      req,
      completeResetDto,
      res,
    );
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Home')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Get home page' })
  @ApiResponse({ status: 200, description: 'Home page' })
  getHello(): string {
    const message = this.appService.getHomePageMsg();
    const apiDocsLink = this.appService.getApiDocsLink();
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Intra API</title>
          <link rel="icon" type="image/x-icon" href="/public/favicon.ico">
        </head>
        <body>
          <h1>${message}</h1>
          <h2>API Documentation is available on: <a href="${apiDocsLink}">${apiDocsLink}</a></h2>
        </body>
      </html>
    `;
  }
}

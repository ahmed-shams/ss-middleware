import { Controller, Get, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import * as jsforce from 'jsforce';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ description: 'Welcome to Excolo' })
  @Get()
  getHello(@Request() req): string {

    var oauth2 = new jsforce.OAuth2({
      // you can change loginUrl to connect to sandbox or prerelease env.
      loginUrl: `https://hearstnp--test.sandbox.my.salesforce.com/`,
      clientId: '3MVG9MU2nFE8vlsjkhELwI24ucSuWGZGut_.RNMJUmYTYwWY7GiMMygc2AjnEiwwATxruTZ5g2rufPg_TShkn',
      clientSecret: 'BC9FE1671D8A6D93C543BE3B577B0040C3AE24C6F21AA04BF79D84C8B3E5AECB',
      redirectUri: 'http://localhost:8080/',

    });
    const conn = new jsforce.Connection({ oauth2: oauth2 });
    conn.authorize(req.query.code, function (err, userInfo) {
      if (err) {
        return console.error(err);
      }
      console.log(conn.accessToken, conn.instanceUrl, 'userinfo: ' + userInfo.id); // access token via oauth2

      conn.query('SELECT Id FROM Lead', undefined, (err, ress) => {
        if (err) { return console.error(err); }
        console.log(ress);
      });
    });
    console.log(req.query.code);
    return req.query.code;
  }
}

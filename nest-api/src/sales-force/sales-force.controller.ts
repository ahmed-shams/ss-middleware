import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res } from '@nestjs/common';
import { SalesForceService } from './sales-force.service';
import * as jsforce from 'jsforce';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(('sales-force'))
@Controller('sales-force')
export class SalesForceController {
  constructor(private readonly salesForceService: SalesForceService) { }



  @Get()
  async findAll(@Res() res) {


    var oauth2 = new jsforce.OAuth2({
      // you can change loginUrl to connect to sandbox or prerelease env.
      loginUrl : `https://hearstnp--test.sandbox.my.salesforce.com/`,
      clientId: '3MVG9MU2nFE8vlsjkhELwI24ucSuWGZGut_.RNMJUmYTYwWY7GiMMygc2AjnEiwwATxruTZ5g2rufPg_TShkn',
      clientSecret: 'BC9FE1671D8A6D93C543BE3B577B0040C3AE24C6F21AA04BF79D84C8B3E5AECB',
      redirectUri: 'http://localhost:8080/',
    });

    return res.redirect(oauth2.getAuthorizationUrl({}))


    var conn = new jsforce.Connection({
     oauth2
    });

    const result = await  conn.login('secondstreet@hearst.com.test', `R28f34m4s00D52000000JQ0m%21AQ8AQKTXzb.4vAh7qV_8Iv3IdA5_7zevnA8Vccoe0s_sDPkeJcpckQQKAcswsGlWSstGNNHd9n5dS0il.EF3vkiRQUyzVBre`, function(err, userInfo) {
      if (err) { return console.error(err); }
      // Now you can get the access token and instance URL information.
      // Save them to establish connection next time.
      console.log(conn.accessToken);
      console.log(conn.instanceUrl);
      // logged in user property
      console.log("User ID: " + userInfo.id);
      console.log("Org ID: " + userInfo.organizationId);
      // ...
    });

    // console.log(result);

    // return conn.login('secondstreet@hearst.com.test',
    //   'R28f34m4', (err, token) => {

    //     if (err) {
    //       throw err;
    //     }

    //   })

  }
}

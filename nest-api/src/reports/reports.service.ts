import { Injectable } from '@nestjs/common';
import { parse, NODE_STREAM_INPUT } from 'papaparse'
import fetch from 'node-fetch';
import { HttpService } from '@nestjs/axios';
import { report } from 'process';
import * as fs from 'fs'

import * as stream from 'stream';
import { promisify } from 'util';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ReportsService {

    constructor(private readonly httpService: HttpService) {

    }

    SecondStreetApiExamples = {

        partnerApiKey: '31651524',
        token: null,
        authUrl: "https://api.secondstreetapp.com/sessions",
        organizationsUrl: "https://api.secondstreetapp.com/organizations",
        organizationPromotionsUrl: "https://api.secondstreetapp.com/organization_promotions",
        reportsUrl: "https://api.secondstreetapp.com/reports",
        matchupsUrl: "https://api.secondstreetapp.com/matchups",
    }

    async downloadFile(fileUrl: string, outputLocationPath: string): Promise<any> {
        const writer = fs.createWriteStream(outputLocationPath);
        const finished = promisify(stream.finished);
        return this.httpService.axiosRef({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
        }).then(async response => {
            response.data.pipe(writer);
            return await finished(writer);
        });
    }

    async getWinnersReport(
        organizationId,
        promotionId,
        organizationPromotionId) {

        const token = await this.postAuth();
        let response, responseJson;

        try {
            const url = `${this.SecondStreetApiExamples.reportsUrl}?organizationId=${organizationId}&organizationPromotionId=${organizationPromotionId}`;
            response = await fetch(url, {
                method: 'POST',
                body: `{"reports": [ { "report_type_id": 8 ,"matchup_id": 3058437, "field_id":0,  "organization_promotion_id": ${organizationPromotionId} } ] }`,//7 is winners report, 2999951 = "Gallery" matchup
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': this.SecondStreetApiExamples.partnerApiKey,
                    'Authorization': token.sessions[0].access_token,
                    'X-Organization-Id': organizationId, //2053 = times union
                    'X-Organization-Promotion-Id': organizationPromotionId, //746881 = best holiday lights in upstate new york
                    'X-Promotion-Id': promotionId,//promotionid for best holiday lights
                }
            });

            responseJson = await response.json();
          
            return responseJson;

        } catch (e) {
            console.log("Error downloading report: ", e);
            throw e;
        }


    };

    async parseWinnerReport(url) {
        console.log(url);
        // await this.downloadFile(url, 'myfile.csv');
        // console.log('Downloaded sucssfully');
        // return;
        return new Promise<void>(async (resolve, reject) => {
            const parseStream = parse(NODE_STREAM_INPUT, {
                header: true,
                skipEmptyLines: true,
                step: function (results, parser) {
                    console.log("Row data:", results.data);
                    console.log("Row errors:", results.errors);
                }
            });

            const { data: res } = await firstValueFrom(
                this.httpService.get(url, { responseType: 'stream' }),
            );

            const dataStream = res.pipe(parseStream);

            const data = [];

            parseStream.on('data', (chunk) => {

                console.log('DAAATA: ', chunk)
                data.push(chunk);
            });

            dataStream.on('finish', () => {
                console.log(data);
                console.log(data.length);
                resolve();
            });

            // return parse(url, {
            //     download: true,
            //     header: true,
            //     skipEmptyLines: true,
            //     step: function (results, parser) {
            //         console.log("Row data:", results.data);
            //         console.log("Row errors:", results.errors);
            //     },
            //     complete: function () {
            //         return resolve();
            //     }
            // })

        });


    }

    async postAuth() {

        let response, responseJson;

        try {
            response = await fetch(this.SecondStreetApiExamples.authUrl, {
                method: 'POST',
                body: process.env.authData,
                headers: { 'Content-Type': 'application/json', 'X-Api-Key': process.env.partnerApiKey },
            });

            responseJson = await response.json();

        } catch (e) {
            console.log("Error getting token");
            console.log(e);
        }

        return responseJson;
    }
}

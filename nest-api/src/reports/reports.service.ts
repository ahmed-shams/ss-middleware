import { Injectable } from '@nestjs/common';
import  {parse} from 'papaparse'
import fetch from 'node-fetch';
import { HttpService } from '@nestjs/axios';
import { report } from 'process';

@Injectable()
export class ReportsService {

    constructor(private readonly httpService: HttpService){

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
            console.log('second result ', responseJson );
            let result = await this.parseWinnerReport(responseJson.reports[0].file_url);
            return result;

        } catch (e) {
            console.log("Error downloading report: ", e);
            throw e;
        }

       
    };

    async parseWinnerReport(url) {
        console.log(url);
        return new Promise(async (resolve, reject) => {

            const csvResponse = await  this.httpService.axiosRef.get(url, { responseType: 'blob'})
            await parse(csvResponse.data, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => { 
                   return resolve(results.data)
                }
            })
           
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

/*jshint esversion: 6 */
/* jshint ignore:start */

import fetch from 'node-fetch';
import dotenv from "dotenv";
import * as parse from 'csv-parse';
import https from 'https'

dotenv.config();
const SecondStreetApiExamples = {

  partnerApiKey: 31651524,
  token: null,
  authUrl: "https://api.secondstreetapp.com/sessions",
  organizationsUrl: "https://api.secondstreetapp.com/organizations",
  organizationPromotionsUrl: "https://api.secondstreetapp.com/organization_promotions",
  reportsUrl: "https://api.secondstreetapp.com/reports",
  matchupsUrl: "https://api.secondstreetapp.com/matchups",

  //organization ID identifies a specific account in Second Street’s platform.
  //promotion ID identifies a specific promotion within an account in Second Street’s platform.
  //organization promotion ID identifies a specific instance of a promotion within an account in Second Street’s platform
  //you can get the promotion id from https://api.secondstreetapp.com/organization_promotions/{organization_promotion_id}

  getOrganizationPromotions: async function () {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");

    let response, responseJson;

    try {
      //746881 = best holiday lights in upstate new york
      response = await fetch(SecondStreetApiExamples.organizationPromotionsUrl + "/" + 746881, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.partnerApiKey,
          'Authorization': SecondStreetApiExamples.token.sessions[0].access_token,
          'X-Organization-Id': 2053, //2053 = times union
        }
      });

      responseJson = await response.json();

    } catch (e) {
      console.log("Error getting promotions");
      console.log(e);
    }

    return responseJson;
  },
  getOrganizations: async function () {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");

    let response, responseJson;

    try {
      response = await fetch(SecondStreetApiExamples.organizationsUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': process.env.partnerApiKey, 'Authorization': SecondStreetApiExamples.token.sessions[0].access_token },
      });

      responseJson = await response.json();

    } catch (e) {
      console.log("Error Getting Organizations");
      console.log(e);
    }

    return responseJson;
  },

  postAuth: async function () {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");

    let response, responseJson;

    try {
      response = await fetch(SecondStreetApiExamples.authUrl, {
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
  },

  start: async function () {
    SecondStreetApiExamples.token = await SecondStreetApiExamples.postAuth();
    // SecondStreetApiExamples.organizations = await SecondStreetApiExamples.getOrganizations();
    SecondStreetApiExamples.contests = await SecondStreetApiExamples.getOrganizationPromotions();
    console.log("SecondStreetApiExamples", JSON.stringify(SecondStreetApiExamples, null, 2));
  },

  getWinnersReport: async function (organizationId,
    promotionId,
    organizationPromotionId) {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");
    let response, responseJson;

    try {
      response = await fetch(`${SecondStreetApiExamples.reportsUrl}?organizationId=${organizationId}&organizationPromotionId=${organizationPromotionId}`, {
        method: 'POST',
        body: `{"reports": [ { "report_type_id": 8 ,"matchup_id": 3058437, "field_id":0,  "organization_promotion_id": ${organizationPromotionId} } ] }`,//7 is winners report, 2999951 = "Gallery" matchup
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': SecondStreetApiExamples.partnerApiKey,
          'Authorization': SecondStreetApiExamples.token.sessions[0].access_token,
          'X-Organization-Id': organizationId, //2053 = times union
          'X-Organization-Promotion-Id': organizationPromotionId, //746881 = best holiday lights in upstate new york
          'X-Promotion-Id': promotionId,//promotionid for best holiday lights
        }
      });

      responseJson = await response.json();

    } catch (e) {
      console.log("Error downloading report");
      console.log(e);
    }

    console.log(responseJson);
    let result = await  this.parseWinnerReport(responseJson.reports[0].file_url);
    console.log(json.stringify(result));
    return responseJson;
  },

  async parseWinnerReport(url){
    let records = [];
    return new Promise(()=>{
      
      https.get(url,(csvResponse) => {
        csvResponse.pipe(parse.parse({columns:true, delimiter: ',',escape: '"', ltrim: true, rtrim: true, relax_quotes:true }))
        .on('data',(row) => {
          Object.keys(row).forEach(key => {
            if (key.startsWith('"')) {
              row[key.replaceAll(`"`, '')] = row[key];
              delete row[key];
            }
          });
          records.push(row);
         })
         .on('error',(e)=>{
           console.log(e);
         })
         .on('end',() => {
            console.log('file read successfully')
            console.log(records);
            return Promise.resolve(records);    
          })
        }).end();
    })
   
  }
}

await SecondStreetApiExamples.start();
await SecondStreetApiExamples.getWinnersReport(2053, 623764, 746881);

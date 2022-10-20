/*jshint esversion: 6 */
/* jshint ignore:start */

import fetch from 'node-fetch';

const SecondStreetApiExamples = {

  token: null,
  authUrl: "https://api.secondstreetapp.com/sessions",
  organizationsUrl: "https://api.secondstreetapp.com/organizations",
  organizationPromotionsUrl: "https://api.secondstreetapp.com/organization_promotions",
  reportsUrl: "https://api.secondstreetapp.com/reports",
  matchupsUrl : "https://api.secondstreetapp.com/matchups",
  partnerApiKey: 31651524,
  authData : {"sessions":[{"username":"ted.metzger@hearst.com","password":"2ndSt=Ace"}]},


  //organization ID identifies a specific account in Second Street’s platform.
  //promotion ID identifies a specific promotion within an account in Second Street’s platform.
  //organization promotion ID identifies a specific instance of a promotion within an account in Second Street’s platform
  //you can get the promotion id from https://api.secondstreetapp.com/organization_promotions/{organization_promotion_id}

  getOrganizationPromotions: async function(){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");
    
    let response, responseJson;

    try {
      //746881 = best holiday lights in upstate new york
      response = await fetch(SecondStreetApiExamples.organizationPromotionsUrl + "/" + 746881,{
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'X-Api-Key':SecondStreetApiExamples.partnerApiKey, 
          'Authorization': SecondStreetApiExamples.token.sessions[0].access_token, 
          'X-Organization-Id': 2053, //2053 = times union
      }});

      responseJson = await response.json();

    }catch(e){
      console.log("Error posting to wordpress");
      console.log(e);
    } 
    
    return responseJson;
  },

  //a matchup is a round of voting
  getMatchups: async function(){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");
    
    let response, responseJson;

    try {
      response = await fetch(SecondStreetApiExamples.matchupsUrl, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          'X-Api-Key':SecondStreetApiExamples.partnerApiKey, 
          'Authorization': SecondStreetApiExamples.token.sessions[0].access_token, 
          'X-Organization-Id': 2053, //2053 = times union
          'X-Organization-Promotion-Id': 746881, //746881 = best holiday lights in upstate new york
          'X-Promotion-Id': 623764,//promotionid for best holiday lights
      }});

      responseJson = await response.json();

    }catch(e){
      console.log("Error posting to wordpress");
      console.log(e);
    } 
    
    return responseJson;
  },

  getWinnersReport: async function(){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");
    
    let response, responseJson;

    try {
      response = await fetch(SecondStreetApiExamples.reportsUrl, {
        method: 'POST',
        body:    '{"reports": [ { "report_type_id": 8 ,"matchup_id": 3058437, "field_id":0,  "organization_promotion_id": 746881 } ] }',//7 is winners report, 2999951 = "Gallery" matchup
        headers: { 
          'Content-Type': 'application/json',
          'X-Api-Key':SecondStreetApiExamples.partnerApiKey, 
          'Authorization': SecondStreetApiExamples.token.sessions[0].access_token, 
          'X-Organization-Id': 2053, //2053 = times union
          'X-Organization-Promotion-Id': 746881, //746881 = best holiday lights in upstate new york
          'X-Promotion-Id': 623764,//promotionid for best holiday lights
      }});

      responseJson = await response.json();

    }catch(e){
      console.log("Error posting to wordpress");
      console.log(e);
    } 
    
    return responseJson;
  },

  getOrganizations: async function(){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");
    
    let response, responseJson;

    try {
      response = await fetch(SecondStreetApiExamples.organizationsUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json','X-Api-Key':SecondStreetApiExamples.partnerApiKey, 'Authorization': SecondStreetApiExamples.token.sessions[0].access_token},
      });

      responseJson = await response.json();

    }catch(e){
      console.log("Error posting to wordpress");
      console.log(e);
    } 
    
    return responseJson;
  },

  postAuth : async function(){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("TODO: remove process.env.NODE_TLS_REJECT_UNAUTHORIZED");

    let response, responseJson;

    try {
      response = await fetch(SecondStreetApiExamples.authUrl, {
        method: 'POST',
        body:    JSON.stringify(SecondStreetApiExamples.authData),
        headers: { 'Content-Type': 'application/json','X-Api-Key':SecondStreetApiExamples.partnerApiKey},
      });

      responseJson = await response.json();

    }catch(e){
      console.log("Error posting to wordpress");
      console.log(e);
    } 
    
    return responseJson;
  },

  start: async function (){
    SecondStreetApiExamples.token = await SecondStreetApiExamples.postAuth();
    SecondStreetApiExamples.organizations = await SecondStreetApiExamples.getOrganizations();
    console.log("SecondStreetApiExamples",JSON.stringify(SecondStreetApiExamples));
    //let holidayLightsPromotion = await SecondStreetApiExamples.getOrganizationPromotions();
    //console.log("holidayLightsPromotion",holidayLightsPromotion);

    //let matchups = await SecondStreetApiExamples.getMatchups();
    //console.log("matchups",matchups);

    // let holidayLightsReport = await SecondStreetApiExamples.getWinnersReport();
   
    // console.log("holidayLightsReport",holidayLightsReport);

  }



}

await SecondStreetApiExamples.start();

SecondStreetApiExamples.getWinnersReport();

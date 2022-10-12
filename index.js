/*jshint esversion: 6 */
/* jshint ignore:start */

import fetch from 'node-fetch';
import dotenv from "dotenv";

dotenv.config();
const SecondStreetApiExamples = {

  token: null,
  authUrl: "https://api.secondstreetapp.com/sessions",
  organizationsUrl: "https://api.secondstreetapp.com/organizations",
  organizationPromotionsUrl: "https://api.secondstreetapp.com/organization_promotions",
  reportsUrl: "https://api.secondstreetapp.com/reports",
  matchupsUrl : "https://api.secondstreetapp.com/matchups",
  
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
          'X-Api-Key':process.env.partnerApiKey, 
          'Authorization': SecondStreetApiExamples.token.sessions[0].access_token, 
          'X-Organization-Id': 2053, //2053 = times union
      }});

      responseJson = await response.json();

    }catch(e){
      console.log("Error getting promotions");
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
        headers: { 'Content-Type': 'application/json','X-Api-Key':process.env.partnerApiKey, 'Authorization': SecondStreetApiExamples.token.sessions[0].access_token},
      });

      responseJson = await response.json();

    }catch(e){
      console.log("Error Getting Organizations");      
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
        body:    process.env.authData,
        headers: { 'Content-Type': 'application/json','X-Api-Key':process.env.partnerApiKey},
      });

      responseJson = await response.json();

    }catch(e){
      console.log("Error getting token");
      console.log(e);
    } 
    
    return responseJson;
  },

  start: async function (){
    console.log(process.env.authData);
    SecondStreetApiExamples.token = await SecondStreetApiExamples.postAuth();
    // SecondStreetApiExamples.organizations = await SecondStreetApiExamples.getOrganizations();
    SecondStreetApiExamples.contests = await SecondStreetApiExamples.getOrganizationPromotions();
    console.log("SecondStreetApiExamples",JSON.stringify(SecondStreetApiExamples, null, 2));
  }
}

SecondStreetApiExamples.start();

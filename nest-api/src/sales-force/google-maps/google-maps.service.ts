import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { placeDetailsDTO } from '../dto/place-details.dto';
import { textSearchDTO } from '../dto/text-search.dto';

enum GOOGLE_MAP_API {
    TEXT_SEARCH = 'https://maps.googleapis.com/maps/api/place/textsearch/json',
    DETAIL = 'https://maps.googleapis.com/maps/api/place/details/json'
    
}

@Injectable()
export class GoogleMapsService {
    private readonly API_KEY: string;
     

    constructor(private readonly httpService: HttpService){

        this.API_KEY = process.env.GOOGLE_API_KEY;

    }

    textSearch(businessName: string): Promise<textSearchDTO> {
        return this.httpService.axiosRef.get(
            `${GOOGLE_MAP_API.TEXT_SEARCH}?query=${businessName} in USA&key=${this.API_KEY}`)
            .then((response) => {
                const googleResults = response.data.results;
                let matchedPlace:textSearchDTO;
                if (Array.isArray(googleResults) && googleResults.length) {
                    if (googleResults.length > 1) {
                        let {place_id: placeId } = googleResults.find(x => x.name === businessName)
                        matchedPlace = {
                            placeId
                        }
                    }
                    else
                    matchedPlace = { placeId : googleResults[0].place_id}
                }
                return matchedPlace;
            })
    }

    async placeDetails(placeId: string): Promise<placeDetailsDTO> {
      
        return this.httpService.axiosRef.get(
            `${GOOGLE_MAP_API.DETAIL}?place_id=${placeId}&key=${this.API_KEY}`)
            .then((response) => {
                const details = response.data.result;
                 return {
                     phoneNumber: details.formatted_phone_number,
                     website: details.website,
                     address: details.formatted_address
                 }
            })
    }


}

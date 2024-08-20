
import {injectable} from "inversify";

@injectable()
export class HttpAdapter {

	 async request(url: string, init?: any):Promise<any> {
		 console.log("request to", url)
		try {
			const response = await fetch(url, init);
			return await response.json();
		} catch (error) {
			console.log(error);
			return null
		}

	}
}


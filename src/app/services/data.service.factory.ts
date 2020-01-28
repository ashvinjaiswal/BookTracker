import { LoggerService} from "./logger.service";
import { DataService } from "./data.service";

export function dataServiceFactory(logger: LoggerService){

  let dataService:DataService = new DataService(logger);
  logger.log('creating new data service using factory function');
  return dataService;
}

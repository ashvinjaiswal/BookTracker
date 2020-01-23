import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { Reader } from 'app/models/reader';
import { allReaders, allBooks } from 'app/data';
import { Book } from 'app/models/book';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private loggerService:LoggerService) { }

  getAllReader():Reader[]{
    return allReaders;
  }

  getReaderById(id: number):Reader{
    return allReaders.find(reader => reader.readerID === id);
  }

  getAllBooks():Book[]{
    return allBooks;
  }

  getBookByID(id:number){
    return allBooks.find(book => book.bookID === id);
  }
}

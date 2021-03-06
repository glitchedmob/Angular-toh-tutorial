import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Hero } from './hero';

@Injectable()
export class HeroService {

	private heroesUrl = 'api/heroes';

	private httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) { }

	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);

			this.log(`${operation} failed: ${error.message}`);

			return of(result as T);
		};
	}

	getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(heroes => this.log(`Fetched heroes`)),
				catchError(this.handleError('getHeroes', []))
			);
	}

	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;

		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`Fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}

	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
			tap(_ => this.log(`Updated hero id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		);
	}

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
			tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		);
	}

	deleteHero(hero: Hero | number): Observable<Hero> {
		const id = typeof hero === 'number' ? hero : hero.id;
		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete<Hero>(url, this.httpOptions).pipe(
			tap(_ => this.log(`Deleted hero id=${id}`)),
			catchError(this.handleError<Hero>('deletedHero'))
		);
	}

	searchHeroes(term: string): Observable<Hero[]> {
		if(!term.trim()) {
			return of([]);
		}

		return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
			tap(_ => this.log(`Found heroes matching "${term}"`)),
			catchError(this.handleError<Hero[]>('searchHeroes', []))
		);
	}

}

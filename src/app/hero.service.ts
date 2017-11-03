import { Injectable } from '@angular/core';

import { Hero } from './hero';
import { heroesList } from './mock-heroes';

@Injectable()
export class HeroService {
	getHeroes(): Promise<Hero[]> {
		return Promise.resolve(heroesList);
	}

	getHeroesSlowly(): Promise<Hero[]> {
		return new Promise(resolve => {
			// Simulate server latency with 2 second delay
			setTimeout(() => resolve(this.getHeroes()), 2000);
		});
	}
}
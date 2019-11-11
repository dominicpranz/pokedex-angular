import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  baseUrl = 'https://pokeapi.co/api/v2/';

  constructor(
    private http: HttpClient
  ) { }

  // generic get request function
  request(path: string): Observable<any> {
    if (!path.includes(this.baseUrl)) path = this.baseUrl + path;
    return this.http.get(path, httpOptions);
  }

  // get all pokemon in order
  getAllPokemon(offset?: number, limit?: number) {
    return this.request(`pokemon?offset=${offset}&limit=${limit}`);
  }

  // starting with 1
  getPokemonById(id: number) {
    if (id <= 0) throw new Error('Pokemon ID can\'t be 0 or below.');
    let pokemonInfo = this.getAllPokemon(id - 1, 1);
    console.log(pokemonInfo); // TODO: some flatmap stuff maybe???
    /*return pokemonInfo.subscribe(result => {
      console.log(result);
      return this.request(result.results[0].url).toPromise();
    });
    /*let x = pokemonInfo.subscribe(result => {
      console.log(result);
      return this.request(result.results[0].url);
    });
    console.log(1);
    console.log(x);*/
  }

}

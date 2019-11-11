import { PokeapiService } from '../services/pokeapi.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// a less complex model for pokemon data than the results from api queries
export class Pokedata {
  name: string;
  id: number;
  private _apiEndpoint?: string;
  types?: Array<string> = [];
  weight?: number;
  height?: number;
  stats?: {
    speed: number;
    specialDefense: number;
    specialAttack: number;
    defense: number;
    attack: number;
    hp: number;
  } = {
      speed: 0,
      specialDefense: 0,
      specialAttack: 0,
      defense: 0,
      attack: 0,
      hp: 0,
    };
  flavorTextEntries?: Array<any>;
  randomflavorText?: string;
  alreadyUpdated?: boolean = false;
  language?: string = 'en';
  finishedLoading?: boolean = false;

  constructor(
    private pokeapiService?: PokeapiService,
  ) { }

  // getters and setters
  get apiEndpoint(): string {
    return this._apiEndpoint;
  }
  set apiEndpoint(apiEndpoint: string) {
    this._apiEndpoint = apiEndpoint;
    // also get the id or name from this and set it
    let regex = /pokemon\/(\w*?)\/?$/gi; // get last part from the api endpoint
    let found: any = regex.exec(apiEndpoint);
    if (found) { // is null or an array with the results
      let result = found[1];
      if (isNaN(result)) {
        this.name = result;
      } else {
        this.id = Number(result);
      }
    }
  }

  updateData(id?: number): void {
    if (!isNaN(id)) this.id = id;
    this.pokeapiService.request('pokemon/' + this.id).subscribe((apidata) => {
      this.apidataToPokedata(apidata);

      this.pokeapiService.request('pokemon-species/' + this.id).subscribe((apidata) => {
        this.flavorTextEntries = apidata.flavor_text_entries;
        this.setRandomFlavorText();
        this.finishedLoading = true;
      });
    });
  }

  setRandomFlavorText() {
    if (!this.flavorTextEntries) return '';
    let flavorTexts: Array<string> = [];
    this.flavorTextEntries.forEach((entry) => {
      if (entry.language.name === this.language) {
        flavorTexts.push(entry.flavor_text);
      }
    });
    this.randomflavorText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
    this.randomflavorText = this.randomflavorText.replace(/\s/gi, ' '); // replace wierd whitespace that sometimes comes from the api (looks like an arrow up)
  }

  // match pokedata with the result from api query /pokemon/x
  apidataToPokedata(apidata: any): Pokedata {
    this.id = apidata.id;
    this.name = apidata.name;
    this.weight = apidata.weight;
    this.height = apidata.height;

    apidata.types.forEach((element) => {
      this.types[element.slot] = element.type.name;
    });

    apidata.stats.forEach((element) => {
      switch (element.stat.name) {
        case 'speed': this.stats.speed = element.base_stat;
        case 'special-defense': this.stats.specialDefense = element.base_stat;
        case 'special-attack': this.stats.specialAttack = element.base_stat;
        case 'defense': this.stats.defense = element.base_stat;
        case 'attack': this.stats.attack = element.base_stat;
        case 'hp': this.stats.hp = element.base_stat;
      }
    });

    return this;
  }

}

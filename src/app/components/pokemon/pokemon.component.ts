import { Component, OnInit, HostListener } from '@angular/core';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { Pokedata } from 'src/app/models/Pokedata';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {
  language: string = 'en';
  pokelist: Array<Pokedata> = [];

  constructor(
    private pokeapiService: PokeapiService,
  ) { }

  ngOnInit() {

    this.addToPokelist(10);

  }

  addToPokelist(count: number) {
    this.pokeapiService.request('pokemon?limit=' + count + '&offset=' + this.pokelist.length).subscribe((list) => {

      list.results.forEach((element) => {
        let pokedata: Pokedata = new Pokedata(this.pokeapiService);
        pokedata.apiEndpoint = element.url;
        pokedata.name = element.name;
        this.pokelist.push(pokedata);
      });

    });
  }

  cardClick(matExpansionPanelReference, pokedata: Pokedata) {
    matExpansionPanelReference.toggle(); // other way to do it: x.expanded = !x.expanded
    if (!pokedata.alreadyUpdated) {
      pokedata.alreadyUpdated = true;
      pokedata.updateData();
    }
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached()) {
      // console.log('bottom reached');
      this.addToPokelist(10);
    }
  }

  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
  }

}

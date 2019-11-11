import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/pages/about/about.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { QuizComponent } from './components/pages/quiz/quiz.component';

const routes: Routes = [
  { path: '', component: PokemonComponent },
  { path: 'about', component: AboutComponent },
  { path: 'quiz', component: QuizComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

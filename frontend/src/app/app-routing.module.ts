import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { ListaJogosComponent } from './components/lista-jogos/lista-jogos.component';
import { FazerApostaComponent } from './components/fazer-aposta/fazer-aposta.component';
import { HistoricoApostasComponent } from './components/historico-apostas/historico-apostas.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'jogos', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'jogos', component: ListaJogosComponent },
  { path: 'apostas/nova/:jogoId', component: FazerApostaComponent, canActivate: [AuthGuard] },
  { path: 'apostas/historico', component: HistoricoApostasComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'jogos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent }   from './components/user.component/user.component';
import { AdminComponent }  from './components/admin.component/admin.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'user',  component: UserComponent,
    canActivate: [AuthGuard], data: { roles: ['User', 'Admin'] } },
  { path: 'admin', component: AdminComponent,
    canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
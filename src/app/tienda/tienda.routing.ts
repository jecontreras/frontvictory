import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TiendaComponent } from './tienda/tienda.component';
import { ProductosComponent } from './productos/productos.component';
import { MainsComponent } from './main/mains.component';
import { ProductosViewComponent } from './producto-view/producto-view.component';
import { ContactoComponent } from './contacto/contacto.component';


const routes: Routes = [
      {
        path: '',
        component: MainsComponent,
        children: [
          {
            path: '',
            component: TiendaComponent
          },
          {
            path: 'inicio',
            component: TiendaComponent
          },
          {
            path: 'productos',
            component: ProductosComponent
          },
          {
            path: 'productosView/:id',
            component: ProductosViewComponent
          },
          {
            path: 'contacto',
            component: ContactoComponent
          },
        ]
      },
      // {
      //   path: '**',
      //   redirectTo: '',
      //   pathMatch: 'full'
      // },
      
      /*{
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaRoutingModule { }

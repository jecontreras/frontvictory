import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { CartAction, BuscadorAction } from 'src/app/redux/app.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  showFiller = false;
  public mobileQuery: any;
  breakpoint: number;
  private _mobileQueryListener: () => void;
  urlwhat:string;
  data:any = {};
  listCart: any = [];
  events: string[] = [];
  opened:boolean;
  dataUser:any = {};
  rolUser:any = {};
  userId:any;
  buscador:string;
  tiendaInfo:any = {};

  constructor(
    public media: MediaMatcher,
    public changeDetectorRef: ChangeDetectorRef,
    private _store: Store<CART>,
    private Router: Router
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.listCart = store.cart || [];
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      this.tiendaInfo = store.configuracion || {};
      this.submitChat();
    });
  }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 290px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // tslint:disable-next-line:no-unused-expression
    this.mobileQuery.ds;
  }
  deleteCart(idx:any, item:any){
    this.listCart.splice(idx, 1);
    let accion = new CartAction(item, 'delete');
    this._store.dispatch(accion);
  }

  submitChat(){
    let texto:string;
    this.data.total = 0;
    for(let row of this.listCart){
      texto+= ` productos: ${ row.titulo } codigo: ${ row.codigo } foto: ${ row.foto } cantidad: ${ row.cantidad } color ${ row.color || 'default'}`;
      this.data.total+= row.costoTotal || 0;
    }
    //console.log(this.dataUser, this.userId)
    if(this.userId.id){
      this.urlwhat = `https://wa.me/${ this.userId.usu_indicativo || 57 }${ this.userId.usu_telefono || 3148487506 }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en comprar los siguientes ${texto}`
    }else{
      this.urlwhat = `https://wa.me/573148487506?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en comprar los siguientes ${texto}`
    }
  }

  buscarArticulo(){
    let data:any = {
      search: this.buscador
    };

    let accion = new BuscadorAction( data, 'post');
    this._store.dispatch( accion );
    this.Router.navigate( ['/tienda/productos'] );
  }

}

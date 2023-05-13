import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { NgImageSliderComponent } from 'ng-image-slider';
import { CART } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  id:string;
  data:any = {};
  listGaleria = [];
  urlFoto:string = "";
  form:any = {
    checkEnvio: true
  };
  urlWhatsapp: string = "";
  timeot= {
    hora: 0,
    minuto: 15,
    milesegundo: 15
  };
  tiendaInfo:any = {};
  imageObject:any = [
    {
      image: "./assets/imagenes/1920x700.png",
      thumbImage: "./assets/imagenes/1920x700.png",
      alt: '',
      check: true,
      id: 1,
      title: ""
    }
  ]
  @ViewChild('nav', {static: true}) ds: NgImageSliderComponent;
  sliderWidth: Number = 500;
  sliderImageWidth: Number = 60;
  sliderImageHeight: Number = 60;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = false;
  sliderAutoSlide: Number = 0;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;

  constructor(
    private activate: ActivatedRoute,
    private _producto: ProductoService,
    public _tools: ToolsService,
    private _ventas: VentasService,
    private _store: Store<CART>,
  ) {
    this.configTime();
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.tiendaInfo = store.configuracion || {};
    });
  }

  ngOnInit(): void {
    this.id = ( this.activate.snapshot.paramMap.get('id') );
    this.getArticulos();
  }

  getArticulos(){
    this.imageObject = [];
    this._producto.get( { where: { id: this.id } } ).subscribe(( res:any )=>{
      this.data = res.data[0] || {}
      this.urlFoto = this.data.foto;
      for( let row of this.data.listColor ){
        if( row.galeriaList)for( let key of row.galeriaList ) this.listGaleria.push( { ... key, name: row.talla } );
      }
      if( this.data.galeria ) for( let key of this.data.galeria ) this.listGaleria.push( { ...key, foto:key.pri_imagen  } );
      if( this.data.listaGaleria ) for( let key of this.data.listaGaleria ) this.listGaleria.push( { ...key, foto:key.foto  } );
      for( let row of this.listGaleria ) this.imageObject.push( {
        image: row.foto,
        thumbImage: row.foto,
        alt: '',
        check: true,
        id: row.id,
        title: ""
      });
      console.log("***27", this.data, "*******", this.listGaleria, this.imageObject )
    });
  }

  handleSubmit(){
    let validate:any = this.validador();
    if( !validate ) return false;
    /*this.urlWhatsapp = `https://api.whatsapp.com/send?phone=573156027551&amp;text=${ encodeURIComponent(`Hola estoy interesado en los tenis
      nombre: ${ this.form.nombre }
      celular: ${ this.form.celular }
      direccion: ${ this.form.direccion }
      ciudad: ${ this.form.ciudad }
      foto: ${ this.urlFoto }
      cantidad: 1,
      Talla: ${ this.form.talla }
      Total a pagar ${ this.data.pro_uni_venta }
      envio: Gratis
      ENVÍO DE 4 -8 DÍAS HÁBILES GRATIS
    `) } `;
    window.open( this.urlWhatsapp );*/
    this.urlWhatsapp = `https://wa.me/573156027551?text=${encodeURIComponent(`
          DATOS DE CONFIRMACIÓN DE COMPRA:
          Nombre: ${ this.form.nombre }
          Celular: ${ this.form.celular }
          Direccion: ${ this.form.direccion }
          Ciudad: ${ this.form.ciudad }
          Foto: ${ this.urlFoto }
          Cantidad: 1
          Talla: ${ this.form.talla }
          Color: ${ this.form.color }
          Total a pagar: ${ this.data.pro_uni_venta } (PAGO CONTRA ENTREGA)
          Envío de 4 -8 días hábiles 
      EN ESPERA DE LA GUÍA DE DESPACHO.
    `)}`;
    console.log(this.urlWhatsapp);
    window.open(this.urlWhatsapp);
    let formsData:any = {
      "ven_tipo": "whatsapp",
      "usu_clave_int": 1,
      "ven_usu_creacion": "joseeduar147@gmail.com",
      "ven_fecha_venta": moment().format("DD/MM/YYYY"),
      "cob_num_cedula_cliente": this.form.celular,
      "ven_nombre_cliente": this.form.nombre,
      "ven_telefono_cliente": this.form.celular,
      "ven_ciudad": this.form.ciudad,
      "ven_barrio": this.form.direccion,
      "ven_direccion_cliente": this.form.direccion,
      "ven_cantidad": 1,
      "ven_tallas": this.form.talla,
      "ven_precio": this.data.pro_uni_venta,
      "ven_total": this.data.pro_uni_venta || 0,
      "ven_ganancias": 0,
      "ven_observacion": "ok la talla es " + this.form.talla + " y el color " + this.form.color,
      "nombreProducto": "ok la talla es " + this.form.talla + " y el color " + this.form.color,
      "ven_estado": 0,
      "create": moment().format("DD/MM/YYYY"),
      "apartamento": '',
      "departamento":'',
      "ven_imagen_producto": this.data.foto
    };

    this._ventas.create( formsData ).subscribe(( res:any )=>{
      this._tools.presentToast("Exitoso Tu pedido esta en proceso. un accesor se pondra en contacto contigo!");
    },( error:any )=> { } );

  }
  handleColor(){
    console.log("***", this.data, this.form)
    this.urlFoto = ( this.data.listColor.find( item => item.talla == this.form.color ) ).foto;
  }
  validador(){
    if( !this.form.nombre ) { this._tools.tooast( { title: "Error falta el nombre ", icon: "error"}); return false; }
    if( !this.form.celular ) { this._tools.tooast( { title: "Error falta el celular ( whatsapp)", icon: "error"}); return false; }
    if( !this.form.direccion ) { this._tools.tooast( { title: "Error falta la direccion ", icon: "error"}); return false; }
    if( !this.form.ciudad  ) { this._tools.tooast( { title: "Error falta la ciudad ", icon: "error"}); return false; }
    if( !this.form.talla ) { this._tools.tooast( { title: "Error falta la talla ", icon: "error"}); return false; }
    if( !this.form.color ) { this._tools.tooast( { title: "Error falta el color ", icon: "error"}); return false; }
    return true;
  }

  handleNewPhoto( row ){
    this.urlFoto = row.foto;
  }

  configTime(){
    let minuto = 15;
    let milegundo = 15;
    setInterval(()=>{
      if( minuto === 0 ) return false;
      milegundo--;
      if(milegundo == 0 ) {
        minuto--;
        milegundo = 60;
      }
      this.timeot.hora = 0;
      this.timeot.minuto = minuto;
      this.timeot.milesegundo = milegundo;
    }, 1000 );
  }

  imageOnClick(obj:any) {
    console.log("***173", obj)
    console.log("***", this.imageObject[obj])
    this.urlFoto = this.imageObject[obj].image;
  }

  arrowOnClick(event) {
      // console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
      // console.log('popup arrow click', event);
  }

  prevImageClick() {
      this.ds.prev();
  }

  nextImageClick() {
      this.ds.next();
  }



}

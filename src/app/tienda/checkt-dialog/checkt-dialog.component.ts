import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';

@Component({
  selector: 'app-checkt-dialog',
  templateUrl: './checkt-dialog.component.html',
  styleUrls: ['./checkt-dialog.component.scss']
})
export class ChecktDialogComponent implements OnInit {
  data:any = {};
  disabled:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChecktDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService,
    private _ventas: VentasService
  ) { }

  ngOnInit(): void {
    console.log( this.datas );
    this.datas = this.datas.datos || {};
    this.data.talla = this.datas.talla;
  }

  async finalizando(){
    if( this.disabled ) return false;
    this.disabled = true;
    let data:any = {
      "ven_tipo": "whatsapp",
      "usu_clave_int": 1,
      "ven_usu_creacion": "joseeduar147@gmail.com",
      "ven_fecha_venta": moment().format("DD/MM/YYYY"),
      "cob_num_cedula_cliente": "0",
      "ven_nombre_cliente": this.data.nombre,
      "ven_telefono_cliente": this.data.telefono,
      "ven_ciudad": this.data.ciudad,
      "ven_barrio": this.data.barrio,
      "ven_direccion_cliente": this.data.direccion,
      "ven_cantidad": this.datas.cantidadAd || 1,
      "ven_tallas": "0",
      "ven_precio": this.datas.pro_uni_venta,
      "ven_total": this.datas.costo || 0,
      "ven_ganancias": 0,
      "prv_observacion": "ok la talla es " + this.data.talla,
      "ven_estado": 0,
      "create": moment().format("DD/MM/YYYY"),
      "apartamento": this.data.apartamento || '',
      "departamento": this.data.departamento || '',
      "ven_imagen_producto": this.datas.foto
    };
    await this.nexCompra( data );
    this.disabled = false;
    this._tools.presentToast("Exitoso Tu pedido esta en proceso. un accesor se pondra en contacto contigo!");
    setTimeout(()=>this._tools.tooast( { title: "Tu pedido esta siendo procesado "}) ,3000);

    let mensaje: string = ``;
    mensaje = `https://wa.me/573156027551?text=${encodeURIComponent(`
      Hola Servicio al cliente, como esta, saludo cordial,
      para confirmar adquiere este producto
      Nombre de cliente: ${ this.data.nombre }
      *celular:*${ this.data.telefono }
      Ciudad: ${ this.data.ciudad }
      ${ this.data.barrio } 
      Dirección: ${ this.data.direccion }
      ${ this.datas.pro_nombre }

      TOTAL FACTURA ${( this.data.costo || 0).toLocaleString(1)}
      🤝Gracias por su atención y quedo pendiente para recibir por este medio la imagen de la guía de despacho`)}`;
    console.log(mensaje);
    window.open(mensaje);
    this.data = {};
    this.dialogRef.close('creo');

  }

  validador(){
    if( !this.data.nombre ) { this._tools.tooast( { title: "Error falta el nombre ", icon: "error"}); return false; }
    if( !this.data.telefono ) { this._tools.tooast( { title: "Error falta el telefono", icon: "error"}); return false; }
    if( !this.data.direccion ) { this._tools.tooast( { title: "Error falta la direccion ", icon: "error"}); return false; }
    if( this.data.ciudad  ) { this._tools.tooast( { title: "Error falta la ciudad ", icon: "error"}); return false; }
    if( !this.data.barrio ) { this._tools.tooast( { title: "Error falta el barrio ", icon: "error"}); return false; }
    if( !this.data.talla ) { this._tools.tooast( { title: "Error falta la talla ", icon: "error"}); return false; }
    return true;
  }

  async nexCompra( data:any ){
    return new Promise( resolve =>{
      this._ventas.create( data ).subscribe(( res:any )=>{
        resolve( true );
      },( error:any )=> {
        //this._tools.presentToast("Error de servidor")
        resolve( false );
      });
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

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

  constructor(
    private activate: ActivatedRoute,
    private _producto: ProductoService,
    public _tools: ToolsService
  ) { }

  ngOnInit(): void {
    this.id = ( this.activate.snapshot.paramMap.get('id') );
    this.getArticulos();
  }

  getArticulos(){
    this._producto.get( { where: { id: this.id } } ).subscribe(( res:any )=>{
      this.data = res.data[0] || {}
      this.urlFoto = this.data.foto;
      for( let row of this.data.listColor ){
        for( let key of row.galeriaList ) this.listGaleria.push( { ... key, name: row.talla } );
      }
      console.log("***27", this.data, "*******", this.listGaleria )
    });
  }

  handleSubmit(){
    this.urlWhatsapp = `https://api.whatsapp.com/send?phone=573156027551&amp;text=Hola%2C%20estoy%20interesado%20en%20los%20tenis%20NIKE%2C%20
      Talla: ${ this.form.talla }
      foto: ${ this.urlFoto }
      cantidad: 1,
      nombre: ${ this.form.nombre }
      celular: ${ this.form.talla }
      direccion: ${ this.form.direccion }
      ciudad: ${ this.form.ciudad }
      envio: Gratis
    `;
    window.open( this.urlWhatsapp );
  }

  handleNewPhoto( row ){
    this.urlFoto = row.foto;
  }

}

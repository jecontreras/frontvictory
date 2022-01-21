import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  
  loading:any;

  constructor(
    private snackBar: MatSnackBar
  ) { }
 
  async presentToast(mensaje:string, type='completado') {
    this.snackBar.open(mensaje, type, {duration: 5000});
  }

  openSnack(message: string, type: string, config: any) {
    if (config) {
      this.snackBar.open(message, type, config);
    } else {
      this.snackBar.open(message, type, {duration: 5000});
    }
  }
  basic(text:string){
    Swal.fire(text)
  }
  basicIcons(text:any){
    Swal.fire(
      text.header,
      text.subheader,
      text.icon || 'question'
    );
  }
  error(text:any){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: text.mensaje,
      footer: text.footer || '<a href>Why do I have this issue?</a>'
    });
  }
  tooast(text:any){
    Swal.fire({
      position: text.position || 'top-end',
      icon: text.icon || 'success',
      title: text.title || 'Your work has been saved',
      showConfirmButton: text.show || false,
      timer: 1500
    });
  }
  confirm(text:any){
    return Swal.fire({
      title: text.title || 'Are you sure?',
      text:  text.detalle || "You won't be able to revert this!",
      icon:  text.icon || 'warning',
      showCancelButton: true,
      confirmButtonColor: text.confirColor || '#3085d6',
      cancelButtonColor: text.cancelColor || '#d33',
      confirmButtonText: text.confir || 'Yes, delete it!'
    });
  }
  ProcessTime(text:any){
    let timerInterval
    Swal.fire({
      title:  text.title || 'Auto close alert!',
      html: 'I will close in <b></b> milliseconds.',
      timer: text.tiempo || 3000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
          }
        }, 1000)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }

  monedaChange( cif = 3, dec = 2, valor:any ){
    // tomamos el valor que tiene el input
    //  console.log(valor, cif, dec)
     if( !valor ) return 0;
    let inputNum = valor;
    // Lo convertimos en texto
    inputNum = inputNum.toString()
    // separamos en un array los valores antes y después del punto
    inputNum = inputNum.split('.')
    // evaluamos si existen decimales
    if (!inputNum[1]) {
        inputNum[1] = '00'
    }

    let separados
    // se calcula la longitud de la cadena
    if (inputNum[0].length > cif) {
        let uno = inputNum[0].length % cif
        if (uno === 0) {
            separados = []
        } else {
            separados = [inputNum[0].substring(0, uno)]
        }
        let numero:number = Number(inputNum[0].length);
        let posiciones = Number(numero / cif)
        for (let i = 0; i < posiciones; i++) {
            let pos = ((i * cif) + uno)
            // console.log(uno, pos)
            if(inputNum[0] == "") continue;
            separados.push(inputNum[0].substring(pos, (pos + 3)))
        }
    } else {
        separados = [inputNum[0]]
    }
    separados = separados.filter( (row:any)=> row != "");
    return '$' + separados.join("."); //+ ',' + inputNum[1];
  }
  


}

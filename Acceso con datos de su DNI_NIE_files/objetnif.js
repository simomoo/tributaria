/* ObjectNif_old: Comprobaciones que dejan de ser válidas el 01/01/2009 */

function ObjectNIF_old(nif) {
  this.value = nif;
  this.descripcion = '';
  this.error = '';
  this.personalidad = '';
  this.extranjero = false;
  this.PRV__validar();
}

ObjectNIF_old.prototype = {
  esPersonaFisica: function() {
    var primeraLetra = this.value.substr(0,1).toUpperCase();
    
    return this.personalidad == 'F';
  },
  
  esPersonaJuridica: function() {
    return this.personalidad == 'J';
  },
  
  estaBienFormado: function() {
    return this.error == '';
  },
  
  esValido: function() {
    return this.error == '';
  },
  
  error: function() {
    return this.error;
  },
  
  descripcion: function() {
    return this.descripcion;
  },
  
  esNacional: function() {
    return !this.extranjero;
  },
  
  esExtranjero: function() {
    return this.extranjero;
  },
  
  PRV__validar: function() {
    var pLetra = this.value.substr(0,1).toUpperCase();
    var num = this.value.substr(1,7);
    var dc = this.value.substr(8,1).toUpperCase();
    var tipo = '';
    
    /* NOTA: 05/03/2008 (JFGLEZ)
       se han añadido las letras 'J', 'R', 'U', 'V' y 'W' pero no se conocen los digitos de control válidos para estos nuevos tipos
       de momento para estos no se controla el digito de control
    */
    if (pLetra == 'A' || pLetra == 'B' || pLetra == 'C' || pLetra == 'D' || pLetra == 'E'  || pLetra == 'N'
      || pLetra == 'F' || pLetra == 'G' || pLetra == 'H' || pLetra == 'P' || pLetra == 'Q' || pLetra == 'S'
      || pLetra == 'J' || pLetra == 'R' || pLetra == 'U' || pLetra == 'V' || pLetra == 'W') {
      /* se trata de una persona juridica */
      this.personalidad = 'J';
      this.descripcion = "Entidad jurídica";
      if ((pLetra == 'A' || pLetra == 'B' || pLetra == 'C' || pLetra == 'D' || pLetra == 'E' || pLetra == 'F' || pLetra == 'G' || pLetra == 'H')
        && (dc >= '0' && dc <= '9')) {
        this.descripcion += ' nacional';
        tipo = 'N';
      }
      else if ((pLetra == 'A' || pLetra == 'B' || pLetra == 'C' || pLetra == 'D' || pLetra == 'E' || pLetra == 'F' || pLetra == 'G' || pLetra == 'N') &&
               (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' extranjera (no residentes)';
        this.extranjero = true;
        tipo = 'E'
      }
      else if ((pLetra == 'P' ) && 
        (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' (corporacion local)';
        tipo = 'E';
      }
      else if ((pLetra == 'Q') &&
        (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' (organismo de la administración o congregación religiosa)';
        tipo = 'E';
      }
      else if ((pLetra == 'S') &&
        (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' (organo del estado)';
        tipo = 'E';
      }
      else if (pLetra == 'J') {
        this.descripcion += ' (sociedad civil con o sin personalidad jurídica)';
        tipo = 'N'
      }
      else if (pLetra == 'R') {
        this.descripcion += ' (congregación o institución religiosa)';
        tipo = 'E'
      }
      else if (pLetra == 'U') {
        this.descripcion += ' (unión temporal de empresas (UTE))';
        tipo = 'E'
      }
      else if (pLetra == 'V') {
        this.descripcion += ' (tipo no definido)';
        tipo = 'E';
      }
      else if (pLetra == 'W') {
        this.descripcion += ' (establecimientos permanenetes de entidades no residentes)';
        tipo = 'E'
      }
      else {
        this.descripcion = '';
        this.error = 'nif de entidad jurídica mal formado';
      }
      if (!this.PRV__validarDCPJ(pLetra,num,dc,tipo)) {
        this.descripcion = '';
        this.error = 'digito de control incorrecto';
      }
    }
    else if((pLetra >= '0' && pLetra <= '9') || pLetra == 'K' || pLetra == 'L' 
      || pLetra == 'M' || pLetra == 'N' || pLetra == 'X') {
      /* se trata de una persona física */
      this.personalidad = 'F';
      this.descripcion = 'Persona física';
      if (dc >= 'A' && dc <= 'Z' && dc != 'I' && dc != 'O' && dc != 'U') {
        if (pLetra >= '0' && pLetra <= '9') {
          this.descripcion += ' española con DNI';
          if (!this.PRV__validarDCPF(this.value.substr(0,8),dc)) {
            this.error = 'Digito de control incorrecto';
          }
        }
        else if (pLetra == 'K' || pLetra == 'L' || pLetra == 'X' || pLetra == 'M') {
          switch(pLetra) {
            case 'K': 
              this.descripcion += ' española con DNI menor de 14 años';break;
            case 'L':
              this.descripcion += ' española sin DNI no residente';break;
            case 'X':
              this.descripcion += ' extranjera residente en españa';
              this.extranjero = true;
              break;
            case 'M':
              this.descripcion += ' extranjera no residente en españa';
              this.extranjero = true;
              break;
          }
          if (!this.PRV__validarDCPF(this.value.substr(1,7),dc)) {
            this.error = 'Digito de control incorrecto';
          }
        }
        else {
          this.descripcion = '';
          this.error = 'Digito de control incorrecto';
        }
      }
      else {
        this.error = 'Dígito de control incorrecto';
      }
    }
    else {
      this.error = 'Primer carácter incorrecto';
    }
    
  },
  
  PRV__compact: function(n) {
  var s = '' + n;
  var i = 0;
  var total = 0;
  var p = 0;
  
    for(i = 0;i < s.length;i++) {
      p = parseInt(s.substr(i,1),10);
      total += p;
    }
    return total;
  },
  
  PRV__validarDCPJ: function(l,num,dc,tipo) {
  var i = 0;
  var R1 = 0;
  var R2 = 0;
  var R = 0;
  var letra = ['A','B','C','D','E','F','G','H','I','J'];
  var dc_calculado = '';
  
    for(i = 1;i < num.length;i = i+2) {
      p = parseInt(num.substr(i,1),10);
      R1 += p;
    }
    for(i=0;i < num.length;i = i+2) {
      p = parseInt(num.substr(i,1),10) 
      p = p * 2;
      if (p > 9) 
        R2 += this.PRV__compact(p);
      else
        R2 += p;
      
    }
    R = R1 + R2;
    i = 10 - (R % 10);
    if (tipo == 'E') {
      dc_calculado = letra[i - 1];
    }
    else {
			if (i == 10) i = 0;
      dc_calculado = ''+i;
    }
    return dc == dc_calculado;
    
  },
  
  PRV__validarDCPF: function(num,dc) {
  var n = parseInt(num,10);
  var r = n % 23;
  var letras = ['T','R','W','A','G','M','Y','F','P','D','X','B','N','J','Z','S','Q','V','H','L','C','K','E'];
  
    return letras[r] == dc
  }
}

/* ObjectNIF:
* comprobaciones obligatorias a partir del 01/01/2009, aunque se pueden utilizar desde el 01/07/2008
*  a la par que con las antiguas
*/
function ObjectNIF(nif) {
  this.value = nif;
  this.descripcion = '';
  this.error = '';
  this.personalidad = '';
  this.extranjero = false;
  this.PRV__validar();
}

ObjectNIF.prototype = {
  esPersonaFisica: function() {
    var primeraLetra = this.value.substr(0,1).toUpperCase();
    
    return this.personalidad == 'F';
  },
  
  esPersonaJuridica: function() {
    return this.personalidad == 'J';
  },
  
  esEmpresarial: function() {
    var pLetra = this.value.substr(0,1).toUpperCase();
    var dc = this.value.substr(8,1).toUpperCase();
    
      return this.esValido() && (pLetra == 'A' || pLetra == 'B') && (dc >= '0' && dc <= '9');  
  },
  
  estaBienFormado: function() {
    return this.error == '';
  },
  
  esValido: function() {
    return this.error == '';
  },
  
  error: function() {
    return this.error;
  },
  
  descripcion: function() {
    return this.descripcion;
  },
  
  esNacional: function() {
    return !this.extranjero;
  },
  
  esExtranjero: function() {
    return this.extranjero;
  },
  
  PRV__validar: function() {
    var pLetra = this.value.substr(0,1).toUpperCase();
    var num = this.value.substr(1,7);
    var dc = this.value.substr(8,1).toUpperCase();
    var tipo = '';
    
    /* NOTA: 05/03/2008 (JFGLEZ)
       se han añadido las letras 'J', 'R', 'U', 'V' y 'W' pero no se conocen los digitos de control válidos para estos nuevos tipos
       de momento para estos no se controla el digito de control
    */
    if (pLetra == 'A' || pLetra == 'B' || pLetra == 'C' || pLetra == 'D' || pLetra == 'E'  || pLetra == 'N'
      || pLetra == 'F' || pLetra == 'G' || pLetra == 'H' || pLetra == 'P' || pLetra == 'Q' || pLetra == 'S'
      || pLetra == 'J' || pLetra == 'R' || pLetra == 'U' || pLetra == 'V' || pLetra == 'W') {
      /* se trata de una persona juridica */
      this.personalidad = 'J';
      this.descripcion = "Entidad jurídica";
      if ((pLetra == 'A' || pLetra == 'B' || pLetra == 'C' || pLetra == 'D' || pLetra == 'E' || pLetra == 'F' || pLetra == 'G' || pLetra == 'H' || pLetra == 'J' ||
      	pLetra == 'U' || pLetra == 'V')
        && (dc >= '0' && dc <= '9')) {
        this.descripcion += ' nacional';
        tipo = 'N';
      }
      else if ((pLetra == 'W' || pLetra == 'N') &&
               (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' extranjera (no residentes)';
        this.extranjero = true;
        tipo = 'E'
      }
      else if ((pLetra == 'P' ) && 
        (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' (corporacion local)';
        tipo = 'E';
      }
      else if ((pLetra == 'Q') &&
        (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' (organismo de la administración o congregación religiosa)';
        tipo = 'E';
      }
      else if ((pLetra == 'S') &&
        (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' (organo del estado)';
        tipo = 'E';
      }
      else if (pLetra == 'J') {
        this.descripcion += ' (sociedad civil con o sin personalidad jurídica)';
        tipo = 'N'
      }
      else if ((pLetra == 'R') &&
        (dc == 'A' || dc == 'B' || dc == 'C' || dc == 'D' || dc == 'E' || dc == 'F' || dc == 'G' || dc == 'H' || dc == 'I' || dc == 'J')) {
        this.descripcion += ' (congregación o institución religiosa)';
        tipo = 'E'
      }
      else if (pLetra == 'U') {
        this.descripcion += ' (unión temporal de empresas (UTE))';
        tipo = 'N'
      }
      else if (pLetra == 'V') {
        this.descripcion += ' (tipo no definido)';
        tipo = 'N';
      }
      else if (pLetra == 'N') {
      	this.descripcion += ' (Entidad jurídica extranjera ant. 1998)';
      	tipo = 'E';
      }
      else if (pLetra == 'W') {
        this.descripcion += ' (establecimientos permanenetes de entidades no residentes)';
        tipo = 'E'
      }
      else {
        this.descripcion = '';
        this.error = 'nif de entidad jurídica mal formado';
      }
      if (!this.PRV__validarDCPJ(pLetra,num,dc,tipo)) {
        this.descripcion = '';
        this.error = 'digito de control incorrecto';
      }
    }
    else if((pLetra >= '0' && pLetra <= '9') || pLetra == 'K' || pLetra == 'L' 
      || pLetra == 'M' || pLetra == 'N' || pLetra == 'X' || pLetra == 'Y' || pLetra == 'Z' ) {
      /* se trata de una persona física */
      this.personalidad = 'F';
      this.descripcion = 'Persona física';
      if (dc >= 'A' && dc <= 'Z' && dc != 'I' && dc != 'O' && dc != 'U') {
        if (pLetra >= '0' && pLetra <= '9') {
          this.descripcion += ' española con DNI';
          if (!this.PRV__validarDCPF(this.value.substr(0,8),dc)) {
            this.error = 'Digito de control incorrecto';
          }
        }
        else if (pLetra == 'K' || pLetra == 'L' || pLetra == 'M') {
          switch(pLetra) {
            case 'K': 
              this.descripcion += ' española con DNI menor de 14 años';break;
            case 'L':
              this.descripcion += ' española sin DNI no residente';break;
            case 'M':
              this.descripcion += ' extranjera no residente en españa';
              this.extranjero = true;
              break;
          }
          if (!this.PRV__validarDCPF(this.value.substr(1,7),dc)) {
            this.error = 'Digito de control incorrecto';
          }
        }
        else if (pLetra == 'X' || pLetra == 'Y' || pLetra == 'Z') {
          var num = '';
          switch(pLetra) {
            case 'X':
              num = '0'+this.value.substr(1,7);
              break;
            case 'Y':
              num = '1'+this.value.substr(1,7);
              break;
            case 'Z':
              num = '2'+this.value.substr(1,7);
              break;
          }
          this.descripcion += ' extranjera con NIE';
          this.extranjero = true;
          if (!this.PRV__validarDCPF(num,dc)) {
            this.error = 'Digito de control incorrecto';
          }
        }
        else {
          this.descripcion = '';
          this.error = 'Digito de control incorrecto';
        }
      }
      else {
        this.error = 'Dígito de control incorrecto';
      }
    }
    else {
      this.error = 'Primer carácter incorrecto';
    }
    
  },
  
  PRV__compact: function(n) {
  var s = '' + n;
  var i = 0;
  var total = 0;
  var p = 0;
  
    for(i = 0;i < s.length;i++) {
      p = parseInt(s.substr(i,1),10);
      total += p;
    }
    return total;
  },
  
  PRV__validarDCPJ: function(l,num,dc,tipo) {
  var i = 0;
  var R1 = 0;
  var R2 = 0;
  var R = 0;
  var letra = ['A','B','C','D','E','F','G','H','I','J'];
  var dc_calculado = '';
  
    for(i = 1;i < num.length;i = i+2) {
      p = parseInt(num.substr(i,1),10);
      R1 += p;
    }
    for(i=0;i < num.length;i = i+2) {
      p = parseInt(num.substr(i,1),10) 
      p = p * 2;
      if (p > 9) 
        R2 += this.PRV__compact(p);
      else
        R2 += p;
      
    }
    R = R1 + R2;
    i = 10 - (R % 10);
    if (tipo == 'E') {
      dc_calculado = letra[i - 1];
    }
    else {
			if (i == 10) i = 0;
      dc_calculado = ''+i;
    }
    return dc == dc_calculado;
    
  },
  
  PRV__validarDCPF: function(num,dc) {
  var n = parseInt(num,10);
  var r = n % 23;
  var letras = ['T','R','W','A','G','M','Y','F','P','D','X','B','N','J','Z','S','Q','V','H','L','C','K','E'];
  
    return letras[r] == dc
  }
}

function todayAsString() {
var today = new Date();
var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
var days = ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14',
    '15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];

    return (""+today.getFullYear()+months[today.getMonth()] + days[today.getDate()]);
}
/* $NIF:
*  ATENCION: A partir del 01/01/2009 dejar solo con "return new ObjectNIF(nif);"
 */
function $NIF(nif) { 
  nuevo = new ObjectNIF(nif);
  anterior = new ObjectNIF_old(nif);
  if (todayAsString() < '20090101') {
      if (!nuevo.esValido() && !anterior.esValido()) return nuevo;
      if (!nuevo.esValido() && anterior.esValido()) return anterior;
      if (nuevo.esValido() && !anterior.esValido()) return nuevo;
      if (nuevo.esValido() && anterior.esValido()) return nuevo;
  }
  return nuevo;
}
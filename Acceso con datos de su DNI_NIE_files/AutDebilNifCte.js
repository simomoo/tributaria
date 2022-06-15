function validarNif() {
	jQuery('#errorNif').html('');
	var nif = String('000000000' + jQuery('#NIF')[0].value).slice(-9)
			.toUpperCase();
	var oNif = $NIF(nif);
	if (oNif.esValido() && oNif.esPersonaFisica()) {
		document.getElementById('SOPORTE').value = '';
		document.getElementById('FECHA').value = '';
		var letra = nif[0];
		jQuery('#ayudaFechaValidez_oculta').removeClass('oculto');
		jQuery('#ayudaFechaExpedicion_oculta').removeClass('oculto');
		jQuery('#ayudaSoporteTarjetaExtranjero_oculta').removeClass('oculto');
		jQuery('#ayudaSoportePermisoResidencia_oculta').removeClass('oculto');
		jQuery('#ayudaSoporteCiudadanoUE_oculta').removeClass('oculto');
		jQuery('#ayudaFechaValidez_mostrada').addClass('oculto');
		jQuery('#ayudaFechaExpedicion_mostrada').addClass('oculto');
		jQuery('#ayudaSoporteTarjetaExtranjero_mostrada').addClass('oculto');
		jQuery('#ayudaSoportePermisoResidencia_mostrada').addClass('oculto');
		jQuery('#ayudaSoporteCiudadanoUE_mostrada').addClass('oculto');
		if (oNif.esNacional()) {
			if ((letra == 'K') || (letra == 'L') || sospechoAzul) {
				// K Menor
				// L Español residente en Extranjero
				// sospechoAzul Puede que sea un DNI antiguo (gente que se va al extranjero y no ha renovado nunca)
				jQuery('#textoFechaNacimiento').removeClass('oculto');
				jQuery('#textoFechaExpedicion').addClass('oculto');
				jQuery('#textoFechaValidez').addClass('oculto');
				jQuery('#ayudaFechaValidez_oculta').addClass('oculto');
				jQuery('#ayudaFechaExpedicion_oculta').addClass('oculto');
				// Quito la sospecha por si intentan meter otro NIF
				sospechoAzul = false;
			} else {
				jQuery('#textoFechaNacimiento').addClass('oculto');
				jQuery('#textoFechaExpedicion').addClass('oculto');
				jQuery('#textoFechaValidez').removeClass('oculto');
			}
			jQuery('#capaDatosContrasteDNI').removeClass('oculto');
			jQuery('#capaDatosContrasteNIE').addClass('oculto');
			jQuery('#capaDatosContrasteDNI2').removeClass('oculto');
			jQuery('#capaDatosContrasteNIE2').addClass('oculto');
			jQuery('#capaBotones').removeClass('oculto');
			jQuery('#NIF')[0].value = nif;
		} else if (oNif.esExtranjero()) {
			if ((letra == 'M') || nieFecha) {
				// M Extranjero residente en España
				// nieFecha Extranjeros que meten mal el soporte y se les da otra oportunidad con fecha para emitir menos llamadas al SVDI
				jQuery('#textoFechaNacimiento').removeClass('oculto');
				jQuery('#textoFechaExpedicion').addClass('oculto');
				jQuery('#textoFechaValidez').addClass('oculto');
				jQuery('#ayudaFechaValidez_oculta').addClass('oculto');
				jQuery('#ayudaFechaExpedicion_oculta').addClass('oculto');
				jQuery('#capaDatosContrasteDNI').removeClass('oculto');
				jQuery('#capaDatosContrasteNIE').addClass('oculto');
				jQuery('#capaDatosContrasteDNI2').removeClass('oculto');
				jQuery('#capaDatosContrasteNIE2').addClass('oculto');
				jQuery('#capaBotones').removeClass('oculto');
				jQuery('#NIF')[0].value = nif;
				nieFecha = false;
			} else {
				jQuery('#capaDatosContrasteDNI').addClass('oculto');
				jQuery('#capaDatosContrasteNIE').removeClass('oculto');
				jQuery('#capaDatosContrasteDNI2').addClass('oculto');
				jQuery('#capaDatosContrasteNIE2').removeClass('oculto');
				jQuery('#capaBotones').removeClass('oculto');
				jQuery('#NIF')[0].value = nif;
			}
		} else {
			jQuery('#capaDatosContrasteDNI').addClass('oculto');
			jQuery('#capaDatosContrasteNIE').addClass('oculto');
			jQuery('#capaDatosContrasteDNI2').addClass('oculto');
			jQuery('#capaDatosContrasteNIE2').addClass('oculto');
			jQuery('#capaBotones').addClass('oculto');
		}
	} else {
		comprobarFinNif(jQuery('#NIF')[0].value, oNif.esPersonaJuridica());
		jQuery('#capaDatosContrasteDNI').addClass('oculto');
		jQuery('#capaDatosContrasteNIE').addClass('oculto');
		jQuery('#capaDatosContrasteDNI2').addClass('oculto');
		jQuery('#capaDatosContrasteNIE2').addClass('oculto');
		jQuery('#capaBotones').addClass('oculto');
	}
}
function comprobarFinNif(nif, esJuridica) {
	if (nif != '') {
		var tam = nif.length;
		if ((tam == 1) && isNaN(nif[0])) {
			var primera = nif[0].toUpperCase();
			if ((primera != 'K') && (primera != 'L') && (primera != 'M')
					&& (primera != 'X') && (primera != 'Y') && (primera != 'Z')) {
				jQuery('#errorNif').html('NIF no permitido');
			}
		} else if ((tam == 9) || ((tam > 1) && isNaN(nif[tam - 1]))) {
			if (esJuridica) {
				if (enlaceCertificado) {
					jQuery('#errorNif').html('Si es Persona Jurídica, debe acceder con su certificado electrónico pulsando el enlace que se muestra a continuación');
				} else {
					jQuery('#errorNif').html('Debe indicar un NIF de Persona Física');
				}
			} else {
				jQuery('#errorNif').html('Introduzca un DNI/NIE correcto');
			}
		}
	}
}
function submitFormulario() {
	if (fechaValida(document.getElementById('FECHA').value)) {
		jQuery('#formAutenticaDebil').submit();
	} else if ((document.getElementById('FECHA').value == '') && document.getElementById('SOPORTE').value != '') {
		jQuery('#formAutenticaDebil').submit();
	}
}

function fechaValida(fecha) {
	jQuery('#errorFecha').remove();
//	let	dma = /^(\d{2})[\/|-](\d{2})[\/|-](\d{4})$/.exec(fecha);
//	let d, m, a;
	
	var	dma = /^(\d{2})[\/|-](\d{2})[\/|-](\d{4})$/.exec(fecha);
	var d, m, a;
	// Compruebo si la fecha está en formato DD/MM/AAAA o DD-MM-AAAA
	if (!dma) {
		var amd = /^(\d{4})[\/|-](\d{2})[\/|-](\d{2})$/.exec(fecha);
		// Compruebo si la fecha está en formato AAAA/MM/DD o AAAA-MM-DD
		if (!amd) {
			// No pasa el filtro de fecha válida
			jQuery('#liFecha').append('<span id="errorFecha" class="rojo">Formato de fecha incorrecto. El formato correcto es: dd-mm-aaaa.</span>');
			return false;
		} else {
			// Obtengo día, mes y año
			d = parseInt(amd[3], 10);
			m = parseInt(amd[2], 10);
			a = parseInt(amd[1], 10);
		}
	} else {
		// Obtengo día, mes y año
		d = parseInt(dma[1], 10);
		m = parseInt(dma[2], 10);
		a = parseInt(dma[3], 10);
	}
	// Validar manualmente
	if (!a || !m || (m > 12) || !d) {
		// No pasa el filtro de fecha válida
		jQuery('#liFecha').append('<span id="errorFecha" class="rojo">Fecha ilógica</span>');
		return false;
	}
	var diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	// Si es bisiesto, febrero tiene 29
	if ((m == 2) && ((a % 4 == 0) && (a % 100 != 0)) || (a % 400 == 0)) {
		diasPorMes[1] = 29;
	}
	// Que no tenga más días de los permitidos en el mes
	if (d > diasPorMes[m - 1]) {
		// No pasa el filtro de fecha válida
		jQuery('#liFecha').append('<span id="errorFecha" class="rojo">Fecha ilógica</span>');
		return false;
	}
	// Filtro DNIs permanentes 
	if ((d == 1) && (m == 1) && (a == 9999)) {
		// No pasa el filtro de fecha válida
		jQuery('#liFecha').append('<span id="errorFecha" class="rojo">Se trata de un DNI de tipo <strong>Permamente</strong> y debe introducir la <strong>Fecha de Expedición</strong></span>');
		return false;
	}
	// Fecha válida
	return true;
}
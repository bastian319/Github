(function(){
  const FORM_KEY = 'form_registros_csv';
  const HEADER = ['Nombre','Correo','Telefono','Edad'];

  function initCSV() {
    if (!localStorage.getItem(FORM_KEY)) {
      localStorage.setItem(FORM_KEY, HEADER.join(',') + '\n');
    }
  }

  function escapeCSV(value) {
    if (value == null) return '';
    const s = String(value).replace(/"/g, '""');
    return '"' + s + '"';
  }

  function appendRecord(values) {
    const csv = localStorage.getItem(FORM_KEY) || HEADER.join(',') + '\n';
    const row = values.map(escapeCSV).join(',') + '\n';
    localStorage.setItem(FORM_KEY, csv + row);
    return csv + row;
  }

  function downloadCSV(filename) {
    const csv = localStorage.getItem(FORM_KEY) || HEADER.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function setError(fieldId, message) {
    const el = document.querySelector(`small.error[data-for="${fieldId}"]`);
    if (el) el.textContent = message || '';
  }

  function clearErrors() {
    document.querySelectorAll('small.error').forEach(e => e.textContent = '');
  }

  function validate(form) {
    clearErrors();
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const telefono = form.telefono.value.trim();
    const edad = form.edad.value.trim();
    let ok = true;

    
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(nombre)) {
      setError('nombre', 'Ingrese un nombre válido (solo letras y espacios).');
      ok = false;
    }

    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Ingrese un correo con formato válido.');
      ok = false;
    }

    
    if (!/^[0-9+()\-\s]{7,20}$/.test(telefono)) {
      setError('telefono', 'Ingrese un teléfono válido (solo números y caracteres + - ()).');
      ok = false;
    }

    
    const edadNum = parseInt(edad, 10);
    if (!/^[0-9]{1,3}$/.test(edad) || isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
      setError('edad', 'Ingrese una edad válida (1-120).');
      ok = false;
    }

    return { ok, values: [nombre, email, telefono, edad] };
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCSV();
    const form = document.getElementById('registroForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = validate(form);
      if (!res.ok) {
        alert('Datos inválidos. El formulario se reinicia para volver a intentarlo.');
        form.reset();
        clearErrors();
        return;
      }

      
      appendRecord(res.values);
    
      downloadCSV('form_registros.csv');

    
      alert('formulario enviado');

      
      form.reset();
    });
  });
})();

/* Interactividad del sitio KOKU. Cada bloque solo se activa si existe en la página. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  /* ============ INICIO: paralaje del hero ============ */
  var hero = $('hero');
  if (hero && $('par1') && $('par2')) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width - 0.5;
      var my = (e.clientY - r.top) / r.height - 0.5;
      $('par1').style.transform = 'translate(' + (-mx * 22).toFixed(1) + 'px,' + (-my * 16).toFixed(1) + 'px)';
      $('par2').style.transform = 'translate(' + (mx * 30).toFixed(1) + 'px,' + (my * 20).toFixed(1) + 'px)';
    });
  }

  /* ============ INICIO: encuentra tu momento ============ */
  if ($('momentos-botones')) {
    var MOMENTOS = [
      { id: 'clases', label: 'Entre clases', titulo: 'Entre clase y clase.', texto: 'Tienes un hueco entre clases. Con 250 ml de agua caliente y cinco minutos de reposo, tu pausa se prepara sola mientras te acomodas.' },
      { id: 'oficina', label: 'En la oficina', titulo: 'En tu escritorio.', texto: 'Se acerca la hora de comer y la agenda no ayuda. Tu KOKU cabe en un escritorio: agua caliente, tapa y cinco minutos para ti.' },
      { id: 'noche', label: 'Estudiando hasta tarde', titulo: 'Entre apuntes y entregas.', texto: 'Una pausa ayuda a bajar el ritmo. Prepara tu KOKU, date cinco minutos y vuelve a tus pendientes con otra energía.' },
      { id: 'casa', label: 'En casa', titulo: 'Sin ganas de cocinar.', texto: 'Abre, agrega agua caliente y espera cinco minutos. Sabor teriyaki sin complicaciones, sin ensuciar media cocina.' }
    ];
    var actual = 'clases';
    var cont = $('momentos-botones');
    var panel = $('momento-panel');
    var pintaMomento = function () {
      cont.innerHTML = MOMENTOS.map(function (m) {
        var on = m.id === actual;
        return '<button type="button" class="btn ' + (on ? 'btn-oro' : 'btn-linea-claro') + '" data-m="' + m.id + '" aria-pressed="' + on + '">' + m.label + '</button>';
      }).join('');
      var m = MOMENTOS.filter(function (x) { return x.id === actual; })[0];
      panel.innerHTML = '<div class="card entra" style="max-width:760px;margin:40px auto 0;text-align:center">' +
        '<svg class="ic" style="margin:0 auto 16px" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="26" r="16"/><path d="M24 17v9l6 4"/><path d="M19 5h10"/></svg>' +
        '<h3>' + m.titulo + '</h3><p style="font-size:18px">' + m.texto + '</p>' +
        '<div class="btns fila-centro"><a class="btn btn-oro" href="como-preparar.html#temporizador">Ver cómo preparar</a></div></div>';
    };
    cont.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-m]');
      if (b) { actual = b.getAttribute('data-m'); pintaMomento(); }
    });
    pintaMomento();
  }

  /* ============ INICIO: pasos de preparación ============ */
  if ($('pasos')) {
    var TXT = ['abre tu envase KOKU y prepáralo.', 'vierte 250 ml de agua caliente en el envase.', 'tapa el envase y deja reposar cinco minutos.', 'mezcla todo muy bien y disfruta tu momento KOKU.'];
    var FOTOS_PASO = ['img/Designer (5) 1.png', 'img/Designer (4).png', 'img/Designer (5) 3.png', 'img/Designer (5) 4.png'];
    var ALT_PASO = ['Envase KOKU con la tapa abierta sobre la barra de una cocina', 'Agua caliente cayendo desde una tetera sobre el arroz dentro del envase KOKU', 'Envase KOKU tapado, reposando sobre la barra de una cocina', 'Cuchara levantando arroz teriyaki KOKU ya preparado'];
    var paso = 1;
    var botones = document.querySelectorAll('#pasos .paso-btn');
    var pintaPaso = function () {
      for (var i = 0; i < botones.length; i++) {
        var on = i + 1 === paso;
        botones[i].classList.toggle('act', on);
        botones[i].setAttribute('aria-pressed', on ? 'true' : 'false');
      }
      $('barra').style.width = paso * 25 + '%';
      $('barra').parentNode.setAttribute('aria-valuenow', paso * 25);
      $('paso-foto').src = FOTOS_PASO[paso - 1];
      $('paso-foto').alt = ALT_PASO[paso - 1];
      $('paso-info').textContent = 'Paso ' + paso + ' de 4 · ' + TXT[paso - 1];
    };
    for (var i = 0; i < botones.length; i++) {
      (function (n) { botones[n].addEventListener('click', function () { paso = n + 1; pintaPaso(); }); })(i);
    }
    $('paso-prev').addEventListener('click', function () { paso = paso === 1 ? 4 : paso - 1; pintaPaso(); });
    $('paso-next').addEventListener('click', function () { paso = paso === 4 ? 1 : paso + 1; pintaPaso(); });
  }

  /* ============ CÓMO PREPARAR: temporizador ============ */
  /* ============ CÓMO PREPARAR: temporizador ============ */
if ($('t-alterna') && $('t-reinicia') && $('t-tiempo') &&
    $('t-anillo') && $('t-estado') && $('reloj')) {

  var TOTAL = 180;
  var left = TOTAL;
  var corre = false;
  var reloj = $('reloj');
  var intervalo = null;

  var pintaT = function () {
    var m = Math.floor(left / 60);
    var s = left % 60;
    var fin = left === 0;

    $('t-tiempo').textContent =
      m + ':' + (s < 10 ? '0' : '') + s;

    $('t-anillo').style.strokeDashoffset =
      (603.2 * (1 - left / TOTAL)).toFixed(1);

    $('t-estado').textContent =
      fin ? '¡Listo! Mezcla y disfruta' :
      corre ? 'Reposando' :
      left === TOTAL ? 'Listo para iniciar' :
      'En pausa';

    $('t-alterna').textContent =
      corre ? 'Pausar' :
      fin ? 'Volver a empezar' :
      left === TOTAL ? 'Iniciar' :
      'Continuar';

    reloj.classList.toggle('fin', fin);
  };

  var detener = function () {
    if (intervalo !== null) {
      clearInterval(intervalo);
      intervalo = null;
    }
  };

  var iniciar = function () {
    detener();

    intervalo = setInterval(function () {
      if (!corre) return;

      left--;

      if (left <= 0) {
        left = 0;
        corre = false;
        detener();
      }

      pintaT();

    }, 1000);
  };

  $('t-alterna').addEventListener('click', function () {

    if (left === 0) {
      left = TOTAL;
      corre = true;
    } else {
      corre = !corre;
    }

    if (corre) {
      iniciar();
    } else {
      detener();
    }

    pintaT();
  });

  $('t-reinicia').addEventListener('click', function () {
    detener();

    left = TOTAL;
    corre = false;

    pintaT();
  });

  pintaT();
}

  /* ============ CONTACTO: formulario ============ */
  var form = $('form-contacto');
  if (form) {
    /* Para que el formulario envíe mensajes de verdad, crea un formulario en un servicio como Formspree
       (formspree.io) y pega aquí su dirección, por ejemplo: 'https://formspree.io/f/xxxxxxx'.
       Mientras esté vacío, la página avisa honestamente que el mensaje NO se envió. */
    var ENDPOINT = '';
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var aviso = $('aviso');
    var muestraAviso = function (titulo, texto) {
      $('aviso-titulo').textContent = titulo;
      $('aviso-texto').textContent = texto;
      aviso.hidden = false;
      form.hidden = true;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = {
        nombre: form.nombre.value.trim(), correo: form.correo.value.trim(),
        asunto: form.asunto.value.trim(), mensaje: form.mensaje.value.trim()
      };
      var mal = {
        nombre: d.nombre.length < 2, correo: !ok.test(d.correo),
        asunto: d.asunto.length < 2, mensaje: d.mensaje.length < 5
      };
      var hayError = false;
      Object.keys(mal).forEach(function (k) {
        var campo = form[k].closest('.campo');
        campo.classList.toggle('mal', mal[k]);
        campo.querySelector('.err').hidden = !mal[k];
        form[k].setAttribute('aria-invalid', mal[k] ? 'true' : 'false');
        if (mal[k]) hayError = true;
      });
      if (hayError) { form.querySelector('.mal input, .mal textarea').focus(); return; }
      if (!ENDPOINT) {
        muestraAviso('Tu mensaje está listo, pero no se envió.', 'Revisamos tus datos y están completos. Sin embargo, el formulario aún no está conectado a un servicio de envío, así que tu mensaje no salió de esta página. Intenta de nuevo más adelante.');
        return;
      }
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) {
          if (r.ok) { form.reset(); muestraAviso('¡Mensaje enviado!', 'Gracias por escribirnos. Leeremos tu mensaje con gusto.'); }
          else { muestraAviso('No pudimos enviar tu mensaje.', 'Algo falló al enviarlo. Revisa tu conexión e inténtalo de nuevo.'); }
        })
        .catch(function () { muestraAviso('No pudimos enviar tu mensaje.', 'Algo falló al enviarlo. Revisa tu conexión e inténtalo de nuevo.'); });
    });
    $('aviso-editar').addEventListener('click', function () { aviso.hidden = true; form.hidden = false; });
  }

  /* ============ BLOG ============ */
  if ($('vista-lista')) {
    var CATS = { uni: 'Vida universitaria', food: 'Comida y sabor', rutina: 'Rutina diaria', koku: 'Momentos KOKU' };
    var NOTA = 'Tip: tu KOKU ya trae salsa teriyaki, así que prueba antes de agregar más sal o salsa.';
    var ARTICLES = [
      { id: 1, cat: 'uni', title: 'Cómo aprovechar al máximo tus descansos de estudio.', desc: 'Pequeñas pausas pueden ayudarte a equilibrar mejor el estudio con tu rutina diaria.', paras: [
        'Entre lecturas, proyectos y exámenes, es fácil pensar que descansar es perder el tiempo. En realidad, una pausa bien pensada puede ser parte de tu forma de estudiar y no una interrupción.',
        'Una buena idea es decidir antes de empezar cuánto durará tu descanso y qué harás en él. Levantarte de la silla, tomar agua, estirarte o caminar un poco te ayuda a separar un bloque de estudio del siguiente. Intenta alejar el celular de tu lugar de estudio para que la pausa realmente sea una pausa.',
        'También puedes aprovechar ese rato para comer algo con calma, sin abrir apuntes ni contestar mensajes. Cuando el descanso tiene un inicio y un final claros, es más fácil volver a concentrarte.',
        'La próxima vez que termines un bloque de estudio, regálate unos minutos solo para ti. Después, retoma tus pendientes con la mente más despejada.'] },
      { id: 2, cat: 'rutina', title: '5 consejos para organizar tu semana ocupada.', desc: 'Ideas sencillas para ayudarte a organizar tu agenda y hacer espacio para lo que importa.', paras: [
        'Una semana ocupada se siente más ligera cuando sabes qué viene. Estas cinco ideas te pueden ayudar a ordenarla sin complicarte.',
        '1. Dedica diez minutos al inicio de la semana para ver todo lo que tienes: clases, juntas, entregas y compromisos. Tenerlo a la vista evita sorpresas.',
        '2. Elige tus tres pendientes más importantes de cada día. Si logras esos, el día ya cuenta.',
        '3. Agrupa tareas parecidas. Responder mensajes, hacer pagos o lavar ropa se vuelve más rápido cuando lo haces todo de una vez.',
        '4. Agenda tus pausas igual que agendas todo lo demás. Un espacio reservado para comer y descansar es más difícil de saltarse.',
        '5. Deja un margen libre. Los imprevistos siempre llegan, y un poco de espacio en tu agenda ayuda a que no se desordene todo.',
        'Ajusta estas ideas a tu ritmo: lo importante es que tu semana te deje espacio para las cosas que realmente te importan.'] },
      { id: 3, cat: 'food', title: 'Por qué el teriyaki es un sabor tan querido.', desc: 'Descubre el perfil de sabor de una de las combinaciones más reconocidas de la cocina de inspiración asiática.', paras: [
        'El teriyaki es de esos sabores que se reconocen al primer bocado: dulce, salado y con un toque profundo que invita a querer más.',
        'Su secreto está en el equilibrio. La soya aporta el fondo salado, el azúcar redondea y suaviza, y el vinagre le da un contraste que mantiene el sabor vivo. Las especias terminan de darle carácter. Es una combinación sencilla, pero muy completa.',
        'Ese equilibrio es justo lo que lo hace tan versátil y fácil de disfrutar: combina de forma natural con el arroz, con verduras y con muchos otros ingredientes, y se siente familiar incluso si lo pruebas por primera vez.',
        'En KOKU, la salsa teriyaki lleva agua, soya, azúcar, vinagre, sal y especias, y se acompaña de arroz, zanahoria, cebolla y ajonjolí. Un sabor con carácter, listo en cinco minutos.'] },
      { id: 4, cat: 'koku', title: 'Cinco minutos para ti.', desc: 'A veces, lo mejor de un día ocupado es encontrar un momento para bajar el ritmo.', paras: [
        'Hay días en los que todo parece urgente. Llegas de una clase a otra, de una junta a una tarea, y cuando te das cuenta ya pasó la hora de comer.',
        'En KOKU creemos que cinco minutos pueden cambiar el ritmo de un día. Son los mismos cinco minutos que tarda en reposar tu arroz: agregas agua caliente, tapas y esperas.',
        'Mientras tanto, no tienes que hacer nada más. Puedes mirar por la ventana, respirar, escribirle a alguien que quieres o simplemente quedarte en silencio. Cuando el tiempo termina, tu comida está lista y tú también un poco más tranquilo.',
        'Esa es la idea detrás de nuestra pausa de cinco minutos: convertir un momento cotidiano en un pequeño respiro con sabor. Rápido. Rico. Koku.'] },
      { id: 5, cat: 'uni', title: 'Vida estudiantil: entre clases, proyectos y entregas.', desc: 'Una mirada al ritmo diario de los estudiantes universitarios y la importancia de encontrar tiempo para ti.', paras: [
        'La vida universitaria rara vez es tranquila. Entre clases, trabajos en equipo, proyectos y fechas de entrega, el día se llena rápido.',
        'Muchos estudiantes aprenden a moverse entre horarios cambiantes, traslados, tareas y actividades personales. Encontrar un equilibrio no siempre es fácil, pero pequeños hábitos ayudan: organizar tus pendientes, pedir apoyo cuando lo necesitas y cuidar tus momentos de descanso.',
        'Entre una actividad y otra, una pausa para comer con calma puede marcar la diferencia. No necesita ser larga ni complicada; solo tiene que ser tuya.',
        'Si hoy estás entre clases y entregas, recuerda que hacer una pausa también es parte del camino.'] },
      { id: 6, cat: 'food', title: 'Comidas rápidas para días ocupados.', desc: 'Explora ideas prácticas de comida para los días en que tu agenda deja poco espacio para descansos largos.', paras: [
        'Hay días en los que cocinar simplemente no cabe en la agenda. Para esos momentos, vale la pena tener a la mano opciones que sean prácticas y con sabor.',
        'Una buena opción rápida cumple tres cosas: se prepara en pocos pasos, no requiere mucho equipo y se disfruta en cualquier lugar, ya sea un escritorio, una biblioteca o tu departamento.',
        'Tener a la mano comida individual y fácil de preparar te ayuda a no saltarte tus comidas cuando el día se complica. Planear con anticipación qué vas a comer en tus días más ocupados también te quita una preocupación de encima.',
        'KOKU nació justo para esos días: agua caliente, cinco minutos de reposo y un arroz teriyaki listo para disfrutar.'] }
    ];
    var RECETAS = [
      { id: 101, title: 'Bowl KOKU con huevo estrellado.', desc: 'Mientras tu arroz reposa, prepara un huevo y súmalo a tu tazón.', paras: ['Una idea sencilla para darle un toque extra a tu KOKU mientras esperas tus cinco minutos.'],
        ing: ['1 envase de arroz KOKU teriyaki (100 g)', '250 ml de agua caliente', '1 huevo', '1 cucharadita de aceite', 'Cebollín picado, al gusto (opcional)'],
        steps: ['Prepara tu KOKU: abre el envase, agrega 250 ml de agua caliente, tapa y deja reposar cinco minutos.', 'Mientras tanto, calienta el aceite en una sartén y cocina el huevo como más te guste.', 'Mezcla tu arroz y coloca el huevo encima.', 'Termina con cebollín picado y disfruta tu pausa.'] },
      { id: 102, title: 'KOKU fresco con aguacate y pepino.', desc: 'Un toque fresco y cremoso para acompañar tu arroz teriyaki.', paras: ['Si quieres algo fresco junto a tu arroz caliente, esta combinación se arma en lo que tu KOKU reposa.'],
        ing: ['1 envase de arroz KOKU teriyaki (100 g)', '250 ml de agua caliente', '½ aguacate', '½ pepino', 'Unas gotas de limón (opcional)'],
        steps: ['Prepara tu KOKU: agrega 250 ml de agua caliente, tapa y deja reposar cinco minutos.', 'Mientras tanto, corta el aguacate y el pepino en cubos.', 'Mezcla tu arroz y acomoda encima el aguacate y el pepino.', 'Si quieres, agrega unas gotas de limón y disfruta.'] },
      { id: 103, title: 'Arroz KOKU con elote y cebollín.', desc: 'Granos de elote y cebollín para un bowl con más textura.', paras: ['Una combinación sencilla que le da color y textura a tu tazón, sin complicarte la pausa.'],
        ing: ['1 envase de arroz KOKU teriyaki (100 g)', '250 ml de agua caliente', '½ taza de granos de elote cocidos', 'Cebollín picado, al gusto'],
        steps: ['Prepara tu KOKU: agrega 250 ml de agua caliente, tapa y deja reposar cinco minutos.', 'Mientras tanto, calienta los granos de elote.', 'Mezcla tu arroz e incorpora el elote.', 'Termina con cebollín picado y disfruta tu momento KOKU.'] }
    ];
    var IMG_ART = { 1: 'blog img 1.png', 2: 'blog img 4.png', 3: 'blog img 3.png', 4: 'blog img 2.png', 5: 'blog img 5.png', 6: 'blog im.png' };
    var IMG_REC = { 101: 'CON HUEVO.png', 102: 'PEPINO Y AGUACATE.png', 103: 'ELOTE Y CEBOLLIN.png' };
    var IC_REC = '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M8 22h32a16 16 0 0 1-16 16h0A16 16 0 0 1 8 22z"/><path d="M16 42h16"/><path d="M18 8c-2 3 2 4 0 8M26 6c-2 3 2 4 0 8M34 8c-2 3 2 4 0 8"/></svg>';
    var IC_ART = '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="10" width="32" height="28" rx="3"/><path d="M8 28l9-8 8 7 6-5 9 8"/></svg>';
    var cat = 'all', q = '';

    $('lista-recetas').innerHTML = RECETAS.map(function (r) {
      return '<article class="post" style="flex:1 1 320px"><a class="foto r32" href="#receta-' + r.id + '" tabindex="-1" aria-hidden="true"><img src="img/' + IMG_REC[r.id] + '" alt="" width="1536" height="1024" loading="lazy"></a>' +
        '<div class="cuerpo"><span class="cat">Receta con KOKU</span><h3>' + r.title + '</h3><p>' + r.desc + '</p>' +
        '<a class="btn btn-azul" href="#receta-' + r.id + '" aria-label="Ver receta: ' + r.title + '">Ver receta</a></div></article>';
    }).join('');

    var pintaLista = function () {
      var f = [['all', 'Todos']].concat(Object.keys(CATS).map(function (k) { return [k, CATS[k]]; }));
      $('filtros').innerHTML = f.map(function (x) {
        var on = cat === x[0];
        return '<button type="button" class="btn ' + (on ? 'btn-azul' : 'btn-linea') + '" style="min-height:44px" data-cat="' + x[0] + '" aria-pressed="' + on + '">' + x[1] + '</button>';
      }).join('');
      var t = q.trim().toLowerCase();
      var sel = ARTICLES.filter(function (a) {
        return (cat === 'all' || a.cat === cat) && (!t || (a.title + ' ' + a.desc).toLowerCase().indexOf(t) >= 0);
      });
      $('lista-posts').innerHTML = sel.map(function (a) {
        return '<article class="post" style="flex:1 1 320px"><a class="foto r32" href="#articulo-' + a.id + '" tabindex="-1" aria-hidden="true"><img src="img/' + IMG_ART[a.id] + '" alt="" width="1072" height="714" loading="lazy"></a>' +
          '<div class="cuerpo"><span class="cat">' + CATS[a.cat] + '</span><h3>' + a.title + '</h3><p>' + a.desc + '</p>' +
          '<a class="btn btn-azul" href="#articulo-' + a.id + '" aria-label="Leer más: ' + a.title + '">Leer más</a></div></article>';
      }).join('');
      $('sin-resultados').hidden = sel.length > 0;
    };
    $('filtros').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cat]');
      if (b) { cat = b.getAttribute('data-cat'); pintaLista(); }
    });
    $('q').addEventListener('input', function (e) { q = e.target.value; pintaLista(); });

    var ruta = function () {
      var m = /^#(articulo|receta)-(\d+)$/.exec(location.hash);
      var id = m ? parseInt(m[2], 10) : 0;
      var esRec = !!m && m[1] === 'receta';
      var item = (esRec ? RECETAS : ARTICLES).filter(function (a) { return a.id === id; })[0];
      if (!item) {
        $('vista-articulo').hidden = true;
        $('vista-lista').hidden = false;
        document.title = 'Blog | El Diario KOKU';
        return;
      }
      $('vista-lista').hidden = true;
      $('vista-articulo').hidden = false;
      $('art-cat').textContent = esRec ? 'Receta con KOKU' : CATS[item.cat];
      $('art-titulo').textContent = item.title;
      $('art-desc').textContent = item.desc;
      $('art-cuerpo').innerHTML = item.paras.map(function (p) { return '<p>' + p + '</p>'; }).join('');
      $('art-img').src = 'img/' + (esRec ? IMG_REC[id] : IMG_ART[id]);
      $('art-receta').hidden = !esRec;
      if (esRec) {
        $('art-ing').innerHTML = item.ing.map(function (i) { return '<li>' + i + '</li>'; }).join('');
        $('art-pasos').innerHTML = item.steps.map(function (s, n) { return '<li><span class="n">' + (n + 1) + '</span><span>' + s + '</span></li>'; }).join('');
        $('art-nota').textContent = NOTA;
      }
      document.title = item.title.replace(/\.$/, '') + ' | KOKU';
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', ruta);
    pintaLista();
    ruta();
  }
})();

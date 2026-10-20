# Mi panel · Building in Public (versión lila)

Panel personal para convertir lo que alguien aprende o decide en posts de LinkedIn, ver cuántos ha generado y entender de qué habla, qué le cuesta y a quién le llega su contenido. Tono lila, pensado para una sola persona.

## Qué incluye
- **Panel**: saludo, un **📌 Preguntas guía** (qué problema enfrentas, cómo lo solucionaste en pasos, herramientas, resultado, qué te sorprendió, qué sigue; tocar una la añade al texto) que queda fijo junto al generador, meta semanal (barra de progreso), posts generados este mes/semana, el generador (escribir, dictar o subir audio) y un **calendario del mes que cuenta cuántos posts se generaron cada día** (más oscuro = más) y marca los programados.
- **Calendario**: planificación de publicaciones (mes y semana, arrastrar y soltar).
- **Posts**: borrador → editado → publicado, con versiones anteriores del hook/texto y botón *Guardar en calendario*.
- **Mi memoria → Resumen**: *Temas que tocas*, *Dificultades que atraviesas*, *Herramientas que usas*, *Tecnicismos y métricas*, *Para qué escribes* (objetivo de cada post) y el **medidor de público**: reparto en % entre sus avatares, con un selector para ver cómo cambia por tema u objetivo.
- **Mi memoria → Perfil y ajustes**: perfil, voz, públicos (avatares), notas, ejemplos aprobados, exportar/importar.

El análisis (temas, dificultades, herramientas, tecnicismos, objetivo y reparto de público) lo devuelve la IA **al generar cada post**, sin llamadas extra. Para posts anteriores existe el botón **Analizar mis posts** (1 uso por cada 6 posts).

> **El medidor de público es una estimación** según el contenido de cada post. No mide a quién llegó realmente en LinkedIn.

## Celular
El panel es responsive: en pantallas chicas la navegación pasa a una **barra inferior**, las preguntas guía van antes del generador (plegables) y los gráficos y tablas se adaptan al ancho. Se probó sin desbordes horizontales en 375 px de ancho.

## Cómo funciona (arquitectura)
Página estática (GitHub Pages) + el **mismo servidor** del proyecto base (Google Apps Script + Google Sheets). Aquí no hay claves ni datos: la página solo habla con la URL de `js/config.js`. Los datos de la persona viven en su fila del Sheet, asociados a su correo.

El login pide **correo + código** y solo admite cuentas manuales (`solo: 'manual'`): nadie puede registrarse solo ni entrar con una cuenta de prueba.

## Puesta en marcha
1. **Servidor:** necesita la versión del backend con el modo `solo = manual` (proyecto base, `apps-script/Code.gs`). Pégala en Apps Script y publica **Nueva versión** (la URL no cambia).
2. **Usuaria:** en la pestaña **Usuarios** del Sheet, añade su correo, nombre, `activo = SI`, `limite_diario` (p. ej. 20), un `codigo` y deja `origen` vacío.
3. **Memoria inicial:** entra al panel con su correo y código → *Mi memoria → Perfil y ajustes → Importar respaldo* → `private/panel-seed.json` (se genera con `node private/build-seed.js`; está ignorado por git). Importar sube todo a su cuenta.
4. **Publicar:** crea un repo vacío en GitHub, súbelo y activa Pages (*Settings → Pages → Deploy from a branch → `main` / root*).

## Privacidad
Este repo **no contiene datos personales ni claves** (`private/` y `.env` están en `.gitignore`). Los datos viven en el Sheet, que debe estar **sin compartir**.

## Desarrollo
- `node tools/serve.js` → http://localhost:5173 (la página). Para probar sin Google, usa el backend simulado del proyecto base: `node apps-script/test/dev-backend.js` (puerto 8787) y apunta temporalmente `js/config.js` a `http://localhost:8787`.
- `js/knowledge.js` es generado desde `skill/` (`node tools/build-knowledge.js`).
- Estructura: `index.html` · `css/styles.css` (tema lila) · `js/app.js` (vistas y estado) · `js/insights.js` (análisis y gráficos SVG, sin librerías) · `js/ai.js` (prompt) · `js/api.js` · `js/config.js` · `skill/` · `private/` (no se sube).

## Gráficos
Los colores de los públicos son una paleta categórica validada para daltonismo en pares adyacentes (violeta, rosa, azul, naranja, aguamarina). Los % siempre se muestran escritos (en la barra y en la tabla), no solo con color.

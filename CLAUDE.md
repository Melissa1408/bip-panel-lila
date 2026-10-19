# Mi panel · Building in Public (lila)

Web estática (vanilla JS, sin build) para una persona concreta. Comparte backend (Apps Script + Sheet) con el proyecto base (repo Building-in-public); ver `README.md`.

## Reglas
- **Cero datos personales ni claves en el repo.** La memoria y los posts viven en el Sheet; `private/` y `.env` están en `.gitignore`. No poner el nombre real de la persona en archivos versionados (solo viene del servidor).
- El login usa `solo: 'manual'` y rechaza cuentas de prueba. No quitarlo: evita que el panel sea una puerta de entrada a pruebas gratis.
- `SKEY` (`bipl.session`) es distinta a la del proyecto base: ambos pueden vivir bajo el mismo `github.io` y no deben pisarse la sesión.
- El análisis (`p.analisis`) llega en la misma respuesta de generación; `js/insights.js` solo agrega. Los % de público son **estimaciones** y así deben rotularse siempre.
- Gráficos: SVG propio, sin librerías. Color categórico en orden fijo (`INS.PALETA`, validada con el script de dataviz); siempre con etiqueta numérica visible y tabla. Un solo eje, sin gráficos de pastel.
- Tema lila único (claro). Cambios visuales en `css/styles.css` (variables en `:root`).
- Publicación en LinkedIn manual (copiar y pegar). UI en español.
- Si cambias el backend (`Code.gs`), el cambio vive en el proyecto base: corre allí `node apps-script/test/test.js` y publica nueva versión de la Web App.
- Mejoras genéricas del proyecto base (generación, versiones, calendario) no se propagan solas: portarlas a mano.

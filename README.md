# Universo Ocarina

**Cinco mundos. Un territorio.** Un espacio público de Ocarina Producciones para descubrir producciones audiovisuales, sonido, proyectos digitales, investigaciones y memoria territorial.

Universo Ocarina nace en San Patricio del Chañar, Patagonia. Reúne cinco puertas temáticas bajo una identidad común y prioriza una experiencia sencilla, visual y adaptable a celulares, tabletas y computadoras.

## Las cinco puertas

1. **Audiovisual** — videos, documentales, entrevistas y fotografía.
2. **Radio y sonido** — señal online, programas y producciones sonoras.
3. **Tecnología y proyectos digitales** — sitios, herramientas y experiencias interactivas.
4. **Escritos e investigaciones** — documentos, crónicas, ideas e investigaciones.
5. **Cultura, territorio y memoria** — personas, lugares, naturaleza, patrimonio e historias locales.

## Estructura

- `index.html`: portada, navegación, cinco puertas, cierre institucional y presentación del fundador.
- `assets/css/style.css`: estilos base y adaptación responsive.
- `assets/css/visitor-premium.css`: dirección visual de la experiencia pública.
- `assets/js/app.js`: navegación, búsqueda, colecciones y reproducción integrada.
- `data/catalogo.json`: catálogo público de obras y proyectos.
- `assets/images/`: ilustraciones de puertas y portadas de proyectos.

## Catálogo público

El catálogo se administra desde `data/catalogo.json`. Cada elemento debe contar con:

- Identificador único y título descriptivo.
- Tipo de contenido y una o más categorías.
- Resumen breve, claro y verificable.
- Enlace público válido cuando corresponda.
- Autoría, procedencia y créditos confirmados cuando estén disponibles.
- Estado editorial y visibilidad.

Solo se muestran los elementos que tengan simultáneamente `status: "published"` y `visibility: "public"`.

Una pieza puede pertenecer a varias puertas sin duplicarse. No se deben inventar títulos, fechas, autorías, datos ni procedencias. Los registros cuyo título original no esté confirmado deben identificarse como registros pendientes, no presentarse como obras con nombre confirmado.

## Criterios de publicación

- Publicar únicamente materiales propios o autorizados.
- Conservar autorías, créditos y procedencias.
- Diferenciar obras terminadas, proyectos en desarrollo y materiales pendientes de revisión.
- Mantener fuera del repositorio público contraseñas, datos privados, originales inéditos y credenciales.
- No mostrar enlaces a repositorios internos en la experiencia destinada a visitantes.
- Revisar periódicamente enlaces, reproducción multimedia, textos y permisos.
- No agregar librerías innecesarias ni exigir cuentas a quienes visitan el sitio.

## Tecnología

Sitio estático en HTML, CSS y JavaScript. El catálogo se carga como JSON; no requiere una base de datos ni registro de visitantes. La navegación principal conserva una alternativa básica si el catálogo no logra cargarse.

## Publicación

La existencia del repositorio no garantiza por sí sola que GitHub Pages esté habilitado. La URL pública y el estado de publicación deben verificarse en la configuración de Pages del repositorio antes de anunciar el sitio.

## Créditos

Universo Ocarina · Ocarina Producciones · Fundador: Elías Martínez.

# Guía operativa para incorporar contenido

Esta guía permite mantener el catálogo consistente aunque crezca durante años.

## Flujo editorial recomendado

1. **Recibir:** registrar el material en el inventario de trabajo privado.
2. **Identificar:** confirmar título, tipo, autoría, colaboradores y fecha cuando se conozcan.
3. **Verificar:** abrir el enlace original, revisar que funcione y comprobar que puede publicarse.
4. **Clasificar:** asignar una categoría principal y, si corresponde, categorías relacionadas.
5. **Describir:** redactar un resumen claro de una o dos frases; no usar textos promocionales vacíos.
6. **Preparar imagen:** elegir una miniatura legible y autorizada; usar texto alternativo si en el futuro se muestra en la ficha.
7. **Revisar:** validar datos, enlaces, ortografía, permisos y privacidad.
8. **Publicar:** añadir la ficha a `data/catalogo.json` con `status: "published"` y `visibility: "public"`.
9. **Control posterior:** abrir el enlace desde móvil y escritorio y registrar la fecha de revisión.

## Reglas de identificación

- Usar IDs únicos y estables: `oca-av-001` para audiovisual, `oca-rs-001` para radio/sonido, `oca-td-001` para tecnología, `oca-ei-001` para escritos/investigaciones y `oca-ct-001` para territorio/memoria.
- No reciclar un ID, aunque una obra se retire.
- Si una obra corresponde a varias categorías, incluir varios valores en `categories` dentro de una única ficha.
- No completar datos desconocidos por intuición. Dejar vacío o fuera del registro hasta verificarlos.
- Distinguir fecha de creación de fecha de publicación en la descripción editorial cuando ambas importen.
- El título visible debe ser entendible fuera de contexto.

## Estados editoriales

- `draft`: registro incompleto o recién recibido.
- `review`: esperando verificación de datos, derechos o enlace.
- `published`: revisado y aprobado para mostrarse públicamente.
- `archived`: retirado de la muestra activa; conservar registro en el archivo de trabajo.

El portal solo presenta fichas con `status: "published"` y `visibility: "public"`.

## Categorías y tipos

Las cinco puertas son permanentes. El campo `type` describe el formato de una pieza; `categories` describe de qué sección o secciones forma parte. No crear una puerta nueva solo porque aparece un formato nuevo.

## Privacidad y derechos

No incluir en el repositorio público: contraseñas, claves API, datos personales privados, teléfonos particulares sin permiso, documentos internos, material inédito no autorizado, imágenes de terceros sin autorización suficiente ni información de menores que pueda identificarlos.

Un enlace público no significa automáticamente que el contenido pueda reutilizarse. Respetar licencias, atribuciones y permisos. Si la autorización no está clara, no publicar hasta resolverla.

## Revisión de calidad antes de publicar

- [ ] El título es claro y correcto.
- [ ] La descripción es breve y fiel al material.
- [ ] La categoría está bien asignada.
- [ ] Autoría y colaboradores están confirmados o señalados como desconocidos en el inventario privado.
- [ ] El enlace abre y corresponde a esa obra.
- [ ] Hay permiso para publicar los datos, la imagen y el material.
- [ ] No se filtra información privada.
- [ ] La ficha funciona en móvil y escritorio.
- [ ] La obra no está duplicada.
- [ ] Se registra cuándo fue revisada.

## Alcance de esta guía

Esta guía documenta un proceso manual. No implica que exista todavía un panel privado, un inicio de sesión ni validación automática en el sitio. Esas funciones se evaluarán por separado, solo si aportan valor y sin introducir una falsa seguridad en una web estática.

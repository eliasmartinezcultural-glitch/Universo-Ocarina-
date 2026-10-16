# Universo Ocarina

Archivo vivo de creación, comunicación, tecnología y territorio.

## Estado actual

Primera base estructural. La portada contiene cinco puertas permanentes y un catálogo público inicialmente vacío. No se han incorporado obras reales en esta etapa.

## Las cinco categorías

1. **Audiovisual** — documentales, videos, entrevistas, cortometrajes y fotografía en movimiento.
2. **Radio y sonido** — radio online, programas, entrevistas y producciones sonoras.
3. **Tecnología y proyectos digitales** — páginas web, aplicaciones, videojuegos, mapas y herramientas.
4. **Escritos e investigaciones** — textos, documentos, informes, ensayos e investigaciones.
5. **Cultura, territorio y memoria** — historias locales, personas, lugares, patrimonio, fotografías y memoria regional.

## Arquitectura

- `index.html`: estructura y contenido visible de la portada.
- `assets/css/style.css`: presentación adaptable para celular, tableta y escritorio.
- `assets/js/app.js`: navegación de categorías, búsqueda y representación del catálogo.
- `data/catalogo.json`: datos públicos estructurados. Se agregan obras aquí, no editando a mano cada tarjeta de la portada.

## Modelo de cada obra

Cuando se incorpore contenido, cada ficha deberá tener un identificador estable y, según corresponda:

- `id`: identificador único (ejemplo: `oca-av-001`).
- `title`: título visible.
- `type`: tipo de pieza (video, documental, radio, sitio web, juego, texto, fotografía, documento, etc.).
- `categories`: una o más categorías de las cinco puertas.
- `summary`: descripción breve.
- `url`: enlace público al original o a la obra.
- `thumbnail`: ruta de una imagen de portada si existe.
- `date`: fecha de creación o publicación, si se conoce.
- `author` y `collaborators`: autoría y colaboración confirmadas.
- `tags`: términos para la búsqueda.
- `status`: estado editorial; solo `published` se muestra en el portal.
- `visibility`: `public` para material autorizado a publicarse.

Ejemplo de ficha para incorporar más adelante:

```json
{
  "id": "oca-av-001",
  "title": "Título confirmado de la obra",
  "type": "documental",
  "categories": ["audiovisual", "territorio"],
  "summary": "Descripción breve revisada.",
  "url": "https://ejemplo.com/obra",
  "thumbnail": "",
  "date": "",
  "author": "Elías Martínez",
  "collaborators": [],
  "tags": ["territorio", "memoria"],
  "status": "published",
  "visibility": "public"
}
```

El ejemplo es una plantilla, no una obra real ni un enlace válido para publicar.

## Reglas importantes

- Una obra tiene una ficha principal; puede relacionarse con varias categorías mediante `categories`. No duplicar fichas solo porque una pieza corresponda a más de un tema.
- Publicar únicamente obras revisadas y con permiso para mostrarse.
- No guardar contraseñas, credenciales, datos privados, originales inéditos ni información sensible en este repositorio público.
- No confundir “terminado” con “publicado”. El inventario de trabajo y los materiales privados deben mantenerse fuera del catálogo público.
- Enlaces externos se abren en una pestaña nueva desde las fichas.
- El sitio no requiere bibliotecas de JavaScript, base de datos, servidor propio ni cuenta del visitante.
- Las categorías principales son estables. Se amplían los tipos y etiquetas antes de inventar una nueva puerta.
- Revisar periódicamente los enlaces rotos, las autorías, las fechas y los permisos.

## Publicación

El repositorio está preparado como sitio estático. Para que la web se publique en GitHub Pages, hay que confirmar la configuración de Pages en los ajustes del repositorio. Crear estos archivos por sí solo no garantiza que la web ya esté publicada.

## Próximas fases

1. Revisar la portada en celular, tableta y escritorio.
2. Confirmar la publicación de GitHub Pages.
3. Elegir y verificar las primeras obras.
4. Cargar las fichas iniciales en `data/catalogo.json`.
5. Mantener el archivo privado de trabajo separado del catálogo público.

**Créditos:** estructura inicial de Universo Ocarina · Elías Martínez.
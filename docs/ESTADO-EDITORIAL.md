# Estado editorial del contenido

El catálogo distingue entre el material registrado y el material visible en el sitio.

| Estado | Uso | ¿Se muestra en la web? |
|---|---|---|
| `draft` | Ficha iniciada, todavía sin datos suficientes | No |
| `review` | Enlace recibido; faltan título, contexto, permisos o revisión | No |
| `published` | Ficha revisada y aprobada | Solo si `visibility` es `public` |
| `archived` | Pieza retirada de la muestra activa | No |

## Primer lote audiovisual y sonoro

- **COLONIA RADIANTE** (`oca-rs-001`): registrada como radio pública de Ocarina Producciones. La señal configurada es `https://stream.zeno.fm/amfjjcz4tlgtv`. El registro no garantiza por sí solo que el servicio esté transmitiendo o que el navegador pueda reproducirlo; debe probarse en la página publicada.
- **Video 1** (`oca-av-001`): `https://www.youtube.com/watch?v=TJ6ebkYpm_k`. Pendiente de confirmar el título y el contenido.
- **Video 2** (`oca-av-002`): `https://www.youtube.com/watch?v=ruDP0Ur2wZ0`. Pendiente de confirmar el título y el contenido.

Los videos permanecen en estado `review`; no aparecen como obras publicadas. No completar título, autoría, fecha o descripción por inferencia. Tras identificar cada video, actualizar su ficha y cambiar a `published` solo después de revisar el enlace y el texto.

## Validación automática

El flujo de GitHub Actions comprueba JSON válido, categorías permanentes, IDs únicos, campos básicos, estados editoriales, direcciones y presencia del código de reproducción. No verifica derechos de publicación, no garantiza que una URL externa siga activa y no sustituye una prueba real en móvil y escritorio.

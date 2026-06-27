# Red Anti-Social

Backend para la red social **UnaHur Anti-Social Net** desarrollado con Node.js, Express, MongoDB y Redis.

## Descripción

Este proyecto implementa un backend que permite manejar usuarios, posts, imágenes, comentarios y tags en una API REST que modela el backend de una red social minimalista.

- CRUD de usuarios, posts, comentarios, tags e imágenes de post.
- Documentación Swagger disponible en `/docs`.

## Tecnologías

| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución |
| Express 5 | Framework HTTP |
| MongoDB/Mongoose | Base de datos |
| Redis | Caché de consultas |
| Joi | Validación de schemas |
| Swagger UI | Documentación de la API |
| Docker/Docker Compose | Contenedores para MongoDB, Mongo Express y Redis |

## Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las variables necesarias:

```env
PORT=3000
COMMENT_MAX_AGE_MONTHS=6
MONGO_URI=mongodb://admin:admin1234@localhost:27017/tienda?authSource=admin
REDIS_URL=redis://localhost:6379
```

- `PORT` | Puerto en el que corre el servidor
- `COMMENT_MAX_AGE_MONTHS` | Cantidad de meses para ocultar comentarios antiguos al obtener posts
- `MONGO_URI` | URI de conexión a MongoDB
- `REDIS_URL` | URI de conexión a Redis

## Requisitos previos

- Node.js 18+
- Docker y Docker Compose (para MongoDB y Redis)

## Pasos para la ejecución

Clonar el repositorio:
   ```bash
   git clone <url-repositorio>
   cd anti-social-documental-tp-cabos-sueltos
   ```

Instalar dependencias:
   ```bash
   npm install
   ```

Levantar los servicios de base de datos con Docker:
   ```bash
   docker compose up -d
   ```   

Configurar el archivo `.env` con los valores correspondientes.

Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

El servidor estará disponible en `http://localhost:3000`.

## Docker

El `docker-compose.yml` levanta tres servicios:

| Servicio | Puerto | Descripción |
|---|---|---|
| MongoDB | `27017` | Base de datos |
| Mongo Express | `8081` | Interfaz para administrar MongoDB |
| Redis | `6379` | Caché para las consultas |

Para iniciar todos los servicios:
```bash
docker compose up -d
```

Para detenerlos:
```bash
docker compose down
```

Los datos de MongoDB y Redis se persisten en volúmenes locales (`./mongo_data` y `./redis_data`).

## Documentación

La documentación de la API esta hecha en Swagger se puede visualizar:

- `http://localhost:3000/docs` 

*(3000 es el puerto por defecto, en caso de cambiarlo, cambia la url)*

Los archivos YAML de Swagger están ubicados en `docs/` y se cargan desde `helpers/swagger.js`.

En la carpera `colecciones` se encuentran los archivos JSON para realizar la pruebas en Postman.

## Endpoints de la API

### Usuarios — `/usuarios`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/usuarios` | Obtener todos los usuarios |
| GET | `/usuarios/:id` | Obtener un usuario por ID |
| GET | `/usuarios/:id/posts` | Obtener todos los posts de un usuario |
| POST | `/usuarios` | Crear un nuevo usuario |
| PUT | `/usuarios/:id` | Actualizar un usuario |
| DELETE | `/usuarios/:id` | Eliminar un usuario |
| POST | `/usuarios/:id/follow` | Seguir a un usuario |
| POST | `/usuarios/:id/unfollow` | Dejar de seguir a un usuario |

### Posts — `/posts`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/posts` | Obtener todos los posts |
| GET | `/posts/:id` | Obtener un post por ID |
| POST | `/posts` | Crear un nuevo post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post  |
| GET | `/posts/:id/imagenes` | Obtener imágenes de un post |
| POST | `/posts/:id/imagenes` | Agregar una imagen a un post |
| DELETE | `/posts/:id/imagenes/:imageId` | Eliminar una imagen de un post |
| GET | `/posts/:id/comentarios` | Obtener los comentarios de un post por ID |
| POST | `/posts/:id/upload/imagenes` | Subir una imagen al servidor y asociarla a un post |

### Comentarios — `/comentarios`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/comentarios` | Obtener todos los comentarios |
| GET | `/comentarios/:id` | Obtener un comentario por ID |
| POST | `/comentarios` | Crear un comentario |
| PUT | `/comentarios/:id` | Actualizar un comentario |
| DELETE | `/comentarios/:id` | Eliminar un comentario |

### Tags — `/tags`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/tags` | Obtener todos los tags |
| POST | `/tags` | Crear un nuevo tag |
| GET | `/tags/:id/posts` | Obtener todos los posts de un tag |
| POST | `/tags/:id/posts/:postId` | Asignar un tag a un post |
| GET    | `/tags/:id` | Obtener un tag por ID |
| PUT    | `/tags/:id` | Actualizar un tag |
| DELETE | `/tags/:id` | Eliminar un tag |

###

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/r_d7sOXe)
# UnaHur - Red Anti-Social - 2026 - C1

Se solicita el modelado y desarrollo de un sistema backend para una red social llamada **“UnaHur Anti-Social Net”**, inspirada en plataformas populares que permiten a los usuarios realizar publicaciones y recibir comentarios sobre las mismas.

![Imagen](./assets/ANTI-SOCIALNET.jpeg)

# Contexto del Proyecto

En una primera reunión con los sponsors del proyecto, se definieron los siguientes requerimientos para el desarrollo de un **MVP (Producto Mínimo Viable)**:

- El sistema debe permitir que un usuario registrado realice una publicación (post), incluyendo **obligatoriamente una descripción**. De forma opcional, se podrán asociar **una o más imágenes** a dicha publicación.

- Las publicaciones pueden recibir **comentarios** por parte de otros usuarios.

- Las publicaciones pueden estar asociadas a **etiquetas (tags)**. Una misma etiqueta puede estar vinculada a múltiples publicaciones.

- Es importante que los **comentarios más antiguos que X meses** (valor configurable mediante variables de entorno, por ejemplo, 6 meses) **no se muestren** en la visualización de los posteos.

####

# Entidades y Reglas de Negocio

Los sponsors definieron los siguientes nombres y descripciones para las entidades:

- **User**: Representa a los usuarios registrados en el sistema. El campo `nickName` debe ser **único** y funcionará como identificador principal del usuario.

- **Post**: Publicación realizada por un usuario en una fecha determinada que contiene el texto que desea publicar. Puede tener **cero o más imágenes** asociadas. Debe contemplarse la posibilidad de **agregar o eliminar imágenes** posteriormente.

- **Post_Images**: Entidad que registra las imágenes asociadas a los posts. Para el MVP, solo se requiere almacenar la **URL de la imagen alojada**.

- **Comment**: Comentario que un usuario puede realizar sobre una publicación. Incluye la fecha en la que fue realizado y una indicación de si está **visible o no**, dependiendo de la configuración (X meses).

- **Tag**: Etiqueta que puede ser asignada a un post. Una etiqueta puede estar asociada a **muchos posts**, y un post puede tener **múltiples etiquetas**.

# Requerimientos Técnicos

1. **Modelado de Datos**

   - Diseñar el modelo documental que represtente todas las entidades definidas por los sponsor del proyecto. Queda a su criterio si usan relaciones embebidas o relaciones referenciadas a otros documentos.

### Ejemplo referenciadas

![referenciadas](./assets/Referenciada.png)

2. **Desarrollo del Backend**

   - Crear los **endpoints CRUD** necesarios para cada entidad.

   - Implementar las rutas necesarias para gestionar las relaciones entre entidades (por ejemplo: asociar imágenes a un post, etiquetas a una publicación, etc.).

   - Desarrollar las validaciones necesarias para asegurar la integridad de los datos (schemas, validaciones de integridad referencial).

   - Desarrollar las funciones controladoras con una única responsabiliad evitando realizar comprobaciones innecesarias en esta parte del código.

3. **Configuración y Portabilidad**

   - La configuración de las variables del motor deben ser por configuración e instalación de dependencias adecuadas.

   - El sistema debe permitir configurar el **puerto de ejecución y variables de entorno** fácilmente.

4. **Documentación**

   - Generar la documentación de la API utilizando **Swagger (formato YAML)**, incluyendo todos los endpoints definidos.

5. **Colecciones de Prueba**

   - Entregar las colecciones necesarias para realizar pruebas (por ejemplo, colecciones de Postman o archivos JSON de ejemplo).

# Bonus

- Hace el upload de las imganes que se asocian a un POST que lo guarden en una carpeta de imagenes dentro del servidor web.
- ¿Cómo modelarías que un usuario pueda "seguir" a otros usuarios, y a su vez ser seguido por muchos? Followers
- Con la información de los post no varia muy seguido que estrategias podrian utilizar la que la información no sea constantemente consultada desde la base de datos.

# genios-test

# Introducción:

Este documento describe los pasos para instalar y ejecutar un proyecto con dos partes: un front-end y un back-end, ambos utilizando Docker.

# Requisitos:

Docker instalado en tu sistema: https://www.docker.com/get-started
Un editor de código como Visual Studio Code/Jetbrains/Sublime Text
Node.js instalado para el proyecto front-end (opcional)
Pasos:

## 1. Instalar Docker:

Sigue las instrucciones en la página oficial de Docker para instalar Docker en tu sistema operativo.

## 2. Clonar el proyecto:

https://github.com/GaboDevelop/genios-test

## Construir las imágenes:

### Back-end:
cd genios_backend
docker build -t genios_back .

### Front-end:
cd frontend
docker build -t genios_front .
## 4. Ejecutar los contenedores:

### Back-end:
docker run -p 8000:8000 genios_back
### Front-end:
docker run -p 3000:3000 genios_front

## 5. Acceder a las aplicaciones:

### Back-end:
Acceder al back-end en http://localhost:8000.

### Front-end (opcional):
Acceder al front-end en http://localhost:3000.

### Consideraciones adicionales:

Puedes utilizar Docker Compose para definir un entorno de desarrollo con varios contenedores.
Puedes utilizar herramientas de monitoreo como Docker Swarm para observar el estado de tus contenedores.
Recursos adicionales:

Documentación de Docker: https://docs.docker.com/
Tutoriales de Docker para Django: [[se quitó una URL no válida]]([se quitó una URL no válida])
Tutoriales de Docker para React: [[se quitó una URL no válida]]([se quitó una URL no válida])
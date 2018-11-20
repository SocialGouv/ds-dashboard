# ds-dashboard

Tableau de bord pour [ds-collector](https://github.com/SocialGouv/ds-collector).

## Usage

Editer `./public/config.json` pour configurer le dashboard.

Copier/Customiser `./public/index.html.sample` en `./public/index.html`.

`yarn start` pour lancer l'environnement de dev.

## Docker

Le fichier `config.json` peut également être modifié au runtime :

```sh
docker build . -t ds-dashboard

docker run --rm \
    -v $PWD/public/config.json:/app/config.json \
    -v $PWD/logs:/var/log/nginx \
    -p 80:80 \
    ds-dashboard
```

# ds-dashboard

Tableau de bord pour [ds-collector](https://github.com/SocialGouv/ds-collector).

## Usage

Editer `./public/config.json` pour configurer le dashboard.

Ce fichier peut également être modifié au runtime :

```sh
docker build . -t ds-dashboard

docker run --rm \
    -v $PWD/public/config.json:/app/config.json \
    -v $PWD/logs:/var/log/nginx \
    -p 80:80 \
    ds-dashboard
```

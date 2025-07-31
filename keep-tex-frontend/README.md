# Keep-Tex Frontend (React)

Ce projet est l'interface client développée avec React.js pour l'application Keep-Tex. Il a été créé avec [Create React App](https://github.com/facebook/create-react-app).

## Configuration pour le développement collaboratif

Ce frontend est conçu pour communiquer avec un backend commun accessible par plusieurs développeurs travaillant sur des machines différentes dans le même réseau local.

### Configuration de l'URL de l'API

Pour que le frontend puisse communiquer avec le backend, vous devez configurer l'URL de l'API dans le fichier `.env` :

```
REACT_APP_API_URL=http://ADRESSE_IP_DU_BACKEND:5000/api
```

Remplacez `ADRESSE_IP_DU_BACKEND` par l'adresse IP locale de la machine qui exécute le serveur backend.

### Comment trouver l'adresse IP du backend ?

#### Si vous exécutez aussi le backend

Le serveur backend affiche automatiquement les adresses IP disponibles au démarrage. Utilisez l'une de ces adresses.

#### Si le backend est exécuté par un autre développeur

Demandez à votre collègue qui exécute le backend de vous communiquer l'adresse IP de sa machine.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Vérification de la connexion avec le backend

Pour vérifier que votre frontend communique correctement avec le backend :

1. Démarrez le frontend avec `npm start`
2. Ouvrez l'application dans votre navigateur
3. Ouvrez les outils de développement (F12) et vérifiez l'onglet "Network"
4. Vérifiez que les requêtes vers l'API (commençant par l'URL configurée dans `.env`) reçoivent des réponses 200 OK

## Dépannage

### Erreurs CORS

Si vous voyez des erreurs CORS dans la console du navigateur, vérifiez que :

1. Le backend est bien configuré pour accepter les requêtes de toutes les origines
2. L'URL de l'API dans `.env` est correcte (y compris le protocole http://)

### Erreurs de connexion refusée

Si vous voyez des erreurs de type "Connection refused" :

1. Vérifiez que le serveur backend est en cours d'exécution
2. Vérifiez que l'adresse IP dans `.env` est correcte
3. Assurez-vous que les deux machines sont sur le même réseau
4. Vérifiez que le pare-feu autorise les connexions sur le port 5000

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

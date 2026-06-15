# Guide Technique — Comprendre le Module Authentification (e-joutia)

Ce document explique, **étape par étape et en termes simples**, comment le
PROJET 1 a été construit, ce que fait chaque outil utilisé, et **pourquoi**
ces choix ont été faits. L'objectif est que tu puisses relire ce guide plus
tard et comprendre/réexpliquer le code sans difficulté.

---

## 1. Vue d'ensemble

Le module est composé de 4 grandes parties qui collaborent ensemble :

1. **Les écrans** (`src/screens`) : ce que l'utilisateur voit et avec quoi il
   interagit (formulaires, profil...).
2. **Les composants réutilisables** (`src/components`) : petits "blocs Lego"
   utilisés sur plusieurs écrans (bouton, champ de formulaire, étoiles...).
3. **La navigation** (`src/navigation`) : organise les écrans en piles
   ("stacks") et décide laquelle afficher.
4. **Le contexte d'authentification** (`src/context/AuthContext.js`) : le
   "cerveau" qui sait si l'utilisateur est connecté, et qui lit/écrit la
   session dans le stockage local du téléphone.

Avant de plonger dans le code, voici les définitions des outils principaux.

---

## 2. Concepts clés expliqués simplement

### 2.1 React Native & Expo

**React Native** permet d'écrire une application mobile (Android + iOS) en
JavaScript/React, avec de "vrais" composants natifs (pas une page web dans
une fenêtre).

**Expo** est un ensemble d'outils autour de React Native qui simplifie
énormément le démarrage : pas besoin d'installer Android Studio ou Xcode pour
commencer, tu peux tester ton application directement sur ton téléphone avec
l'application **Expo Go**, en scannant un QR code.

### 2.2 Stack Navigation (React Navigation)

Imagine une **pile d'assiettes** : chaque nouvel écran est posé "au-dessus"
du précédent. Quand tu appuies sur "Retour", l'écran du dessus est retiré et
tu retombes sur celui d'en dessous. C'est exactement ce que fait une **Stack
Navigation**.

Dans ce projet, on utilise `@react-navigation/native-stack`, qui crée une
pile d'écrans en utilisant les vrais composants natifs de navigation
d'Android/iOS (transitions fluides, performances optimales).

On utilise **deux piles séparées** :

- `AuthNavigator` → écrans **Login** et **Register** (utilisateur non connecté)
- `AppNavigator` → écrans **Home** et **Profile** (utilisateur connecté)

Et un `RootNavigator` qui choisit **automatiquement** laquelle des deux
afficher, selon que l'utilisateur est connecté ou non.

### 2.3 Formik

Gérer un formulaire "à la main" en React Native demande beaucoup de code
répétitif : il faut un `useState` pour chaque champ, une fonction
`onChangeText` pour chacun, gérer les erreurs, l'état "en cours d'envoi"...

**Formik** est une bibliothèque qui prend en charge tout cela pour toi. Tu lui
donnes :

- `initialValues` : les valeurs de départ du formulaire ;
- `validationSchema` : les règles de validation (fournies par **Yup**, voir
  ci-dessous) ;
- `onSubmit` : la fonction appelée quand le formulaire est valide et soumis.

Et Formik te redonne, via une fonction "render props", tout ce qu'il faut
pour afficher le formulaire : `values` (valeurs actuelles), `errors`
(messages d'erreur), `touched` (champs déjà visités par l'utilisateur),
`handleChange`, `handleBlur`, `handleSubmit`, `isSubmitting`.

### 2.4 Yup

**Yup** est une bibliothèque qui permet de décrire des **règles de
validation** sous forme d'objet, de façon déclarative (on décrit *ce qu'on
veut*, pas *comment le vérifier*).

Exemple simple :

```js
Yup.string().email('Adresse email invalide').required("L'email est requis")
```

Cela veut dire : "cette valeur doit être une chaîne de caractères, au format
email, et elle est obligatoire". Si la règle n'est pas respectée, Yup renvoie
le message d'erreur indiqué.

Formik utilise automatiquement ce schéma Yup pour valider le formulaire
**en temps réel**, à chaque frappe ou à chaque fois qu'un champ perd le focus.

### 2.5 AsyncStorage

**AsyncStorage** est une petite base de données **clé → valeur**, stockée
directement sur l'appareil de l'utilisateur, qui **persiste même si
l'application est fermée puis rouverte**.

C'est l'équivalent, en React Native, du `localStorage` que l'on utilise sur
le web. On l'utilise ici pour stocker :

- la **session active** (qui est actuellement connecté) ;
- une petite **liste d'utilisateurs inscrits**, qui simule une base de
  données côté serveur (voir section 3.7).

Toutes les opérations (`getItem`, `setItem`, `removeItem`) sont
**asynchrones** (elles renvoient une `Promise`), car elles touchent au
système de fichiers du téléphone — d'où le mot-clé `await` partout dans
`AuthContext.js`.

### 2.6 Context API (React)

Le `user` connecté doit être connu par **plusieurs écrans** à la fois
(Home, Profile, et indirectement le `RootNavigator`). Plutôt que de passer
cette information en "props" de composant en composant (ce qu'on appelle le
*prop drilling*), on utilise la **Context API** native de React :

- `createContext()` crée une "boîte" partagée ;
- `<AuthProvider>` place les données (`user`, `isLoading`, et les fonctions
  `login`/`register`/`logout`) dans cette boîte, pour toute l'application ;
- `useAuth()` (un hook personnalisé) permet à **n'importe quel écran** de
  lire ou modifier ces données, sans aucune prop à transmettre.

---

## 3. Tutoriel pas à pas : comment le projet a été construit

### Étape 1 — Initialisation du projet Expo

```bash
npx create-expo-app@latest e-joutia --template blank
cd e-joutia
npm install
```

Le template `blank` génère un projet minimal en JavaScript avec un seul
fichier `App.js`.

### Étape 2 — Installation des dépendances spécifiques

```bash
npx expo install @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context \
  @react-native-async-storage/async-storage formik yup @expo/vector-icons
```

> `npx expo install` (au lieu de `npm install`) choisit automatiquement la
> **version compatible** de chaque bibliothèque avec la version d'Expo
> utilisée — très important en React Native, où les versions natives doivent
> correspondre.

### Étape 3 — La palette de couleurs (`src/theme/colors.js`)

```js
const colors = {
  primary: '#D9764A',     // terracotta - boutons, liens, titres
  secondary: '#1F8A70',   // vert - confiance / succès
  background: '#F8F5F0',
  surface: '#FFFFFF',
  text: '#2D2A26',
  textMuted: '#8A8581',
  border: '#E5E0DA',
  error: '#D64545',
  star: '#F5A623',
  badgeBackground: '#EAF6F2',
  badgeText: '#1F8A70',
};
export default colors;
```

**Pourquoi ?** Centraliser les couleurs dans un seul fichier permet de garder
une **cohérence visuelle** sur toute l'app, et de changer le thème en un seul
endroit si besoin (par exemple pour un futur mode sombre).

### Étape 4 — Les schémas de validation (`src/validation/schemas.js`)

```js
export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Adresse email invalide').required("L'email est requis"),
  password: Yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
});
```

Pour `registerSchema`, on ajoute :

- `username` : minimum 3 caractères, requis ;
- `city` : requis ;
- `confirmPassword` : doit être **identique** à `password`, grâce à
  `Yup.ref('password')` qui permet à une règle de "regarder" la valeur d'un
  autre champ du même formulaire.

### Étape 5 — Les données fictives (`src/data/mockProfile.js`)

Ce fichier contient :

- `TRUST_BADGES` : la liste des badges de confiance (`Profil vérifié`,
  `Répond rapidement`), chacun avec un nom d'icône Ionicons ;
- `MOCK_REVIEWS` : un tableau de 4 avis fictifs (auteur, avatar, note,
  commentaire, date) ;
- `getAverageRating(reviews)` : une petite fonction qui calcule la moyenne
  des notes (`somme des notes / nombre d'avis`).

**Pourquoi des données "mock" (fictives) ?** Le cahier des charges du PROJET 1
demande explicitement une "liste de commentaires fictifs". Cela permet de
construire et tester toute l'interface du profil **sans dépendre d'une API**,
qui sera ajoutée dans un projet ultérieur.

### Étape 6 — Les composants réutilisables (`src/components`)

#### `FormField.js`

Un champ de formulaire générique qui affiche un `label`, un `TextInput`, et
— si le champ a été "touché" et contient une erreur — un message rouge en
dessous :

```js
const hasError = Boolean(touched && error);
...
<TextInput style={[styles.input, hasError && styles.inputError]} {...textInputProps} />
{hasError ? <Text style={styles.errorText}>{error}</Text> : null}
```

Il reçoit directement `value`, `onChangeText`, `onBlur`, `error` et `touched`
— c'est-à-dire exactement ce que Formik fournit pour chaque champ. C'est ce
qui permet la **validation en temps réel** : dès que l'utilisateur quitte un
champ invalide (`touched` devient `true`), le message d'erreur apparaît.

#### `PrimaryButton.js`

Bouton réutilisable avec deux variantes (`filled` / `outline`) et un état
`loading` qui affiche un `ActivityIndicator` (utile pendant l'appel à
`login`/`register`, qui sont asynchrones).

#### `StarRating.js`

Affiche une note sur 5 sous forme d'étoiles :

```js
for (let i = 1; i <= 5; i += 1) {
  let iconName = 'star-outline';        // étoile vide
  if (rating >= i) iconName = 'star';            // étoile pleine
  else if (rating >= i - 0.5) iconName = 'star-half'; // demi-étoile
  ...
}
```

Pour une note de `4.6`, on obtient : 4 étoiles pleines, puis pour `i = 5`,
`4.6 >= 4.5` → une **demi-étoile**.

#### `TrustBadge.js`

Petit badge "pilule" (icône + texte) utilisé pour "Profil vérifié" et "Répond
rapidement".

#### `ReviewCard.js`

Carte d'avis : avatar, nom de l'auteur, date, étoiles (via `StarRating`) et
commentaire. Utilisée dans une liste (`FlatList`) sur l'écran Profil.

### Étape 7 — Le cœur du module : `AuthContext.js`

C'est le fichier le plus important. Il fait trois choses :

**a) Au démarrage, restaurer la session (persistance) :**

```js
useEffect(() => {
  const restoreSession = async () => {
    const sessionJson = await AsyncStorage.getItem(SESSION_KEY);
    if (sessionJson) setUser(JSON.parse(sessionJson));
    setIsLoading(false);
  };
  restoreSession();
}, []);
```

Tant que `isLoading` est `true`, le `RootNavigator` affiche un simple
indicateur de chargement (spinner). Dès que la lecture d'AsyncStorage est
terminée, on sait si l'utilisateur était déjà connecté ou non.

**b) `register(values)` — inscription :**

```js
const newUser = { username, email, city, registeredAt: new Date().toISOString() };
await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers)); // "BDD" locale
await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser));    // session active
setUser(newUser);
```

**c) `login(values)` — connexion :**

```js
const existingUser = users.find((u) => u.email === email) || { /* profil générique */ };
await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(existingUser));
setUser(existingUser);
```

**d) `logout()` — déconnexion :**

```js
await AsyncStorage.removeItem(SESSION_KEY);
setUser(null);
```

Dès que `setUser(...)` est appelé (avec un utilisateur ou avec `null`), **tous
les composants qui utilisent `useAuth()` sont automatiquement mis à jour** —
y compris le `RootNavigator`, qui changera alors de stack.

### Étape 8 — Les écrans Login et Register

Les deux écrans suivent la même structure avec Formik :

```jsx
<Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={loginSchema}
  onSubmit={handleLogin}
>
  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
    <View>
      <FormField
        label="Email"
        value={values.email}
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        error={errors.email}
        touched={touched.email}
      />
      ...
      <PrimaryButton title="Se connecter" onPress={handleSubmit} loading={isSubmitting} />
    </View>
  )}
</Formik>
```

`handleLogin` appelle simplement `await login(values)` depuis `useAuth()`.

**Point important : aucune navigation manuelle n'est nécessaire.** Une fois
`login`/`register` terminé, `user` n'est plus `null` dans `AuthContext` →
le `RootNavigator` se re-rend automatiquement et affiche `AppNavigator`.
C'est le "switch automatique" demandé par le cahier des charges.

### Étape 9 — Les écrans Home et Profile

`HomeScreen` est volontairement minimal : il affiche un message de bienvenue
(`user.username` récupéré via `useAuth()`) et deux boutons : "Voir mon profil"
et "Se déconnecter".

`ProfileScreen` utilise une **`FlatList`** dont les données sont
`MOCK_REVIEWS`, et dont l'en-tête (`ListHeaderComponent`) affiche :

- l'avatar (généré dynamiquement via
  `https://i.pravatar.cc/300?u=${user.email}` — chaque email donne toujours
  le même avatar, ce qui simule une "vraie" photo de profil) ;
- le nom, la ville et la date d'inscription (`user.registeredAt`, formatée en
  français avec `toLocaleDateString('fr-FR', ...)`) ;
- les badges de confiance (`TrustBadge`) ;
- la note moyenne (`StarRating` + `getAverageRating(MOCK_REVIEWS)`).

Chaque élément de la liste est ensuite affiché avec `ReviewCard`.

### Étape 10 — La navigation (`RootNavigator`, `AuthNavigator`, `AppNavigator`)

```jsx
export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <SpinnerScreen />;

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
```

C'est l'unique endroit où se trouve la logique de "switch automatique". Le
reste de la navigation (`AuthNavigator`, `AppNavigator`) est une déclaration
classique de `createNativeStackNavigator()` avec ses écrans :

```jsx
// AuthNavigator.js
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Register" component={RegisterScreen} />
</Stack.Navigator>

// AppNavigator.js
<Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.primary }, ... }}>
  <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'e-joutia' }} />
  <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil public' }} />
</Stack.Navigator>
```

### Étape 11 — Assemblage final (`App.js`)

```jsx
export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </AuthProvider>
  );
}
```

`AuthProvider` doit englober `RootNavigator`, car ce dernier (et tous les
écrans à l'intérieur) ont besoin d'accéder à `useAuth()`.

---

## 4. Pourquoi ces choix architecturaux ?

| Choix | Pourquoi |
|---|---|
| **Expo** plutôt que React Native CLI "nu" | Démarrage immédiat, test sur téléphone via Expo Go sans installer Android Studio/Xcode — idéal pour un projet étudiant qui doit avancer vite. |
| **Context API** plutôt que Redux Toolkit | L'état à partager (utilisateur connecté + 3 fonctions) est petit et simple. Redux apporterait de la complexité inutile pour ce module — il sera plus pertinent au PROJET 2 (catalogue + filtres), comme indiqué dans le cahier des charges global. |
| **Native Stack** plutôt que Stack "JS" classique | Utilise les vraies transitions natives d'Android/iOS → meilleures performances et rendu plus fluide, pour un coût d'apprentissage identique. |
| **AsyncStorage** | C'est exactement l'outil demandé par le cahier des charges pour la persistance de session. (Pour des données réellement sensibles comme un vrai token JWT en production, on utiliserait plutôt `expo-secure-store`, qui chiffre les données — bonne piste d'amélioration future.) |
| **"Mini base de données" locale (`USERS_KEY`)** | Permet de simuler un cycle complet inscription → connexion → profil persistant **sans backend**, tout en gardant le code prêt à être branché sur une vraie API plus tard (il suffira de remplacer le contenu de `register`/`login` par des appels `fetch`/`axios`). |
| **Formik + Yup** | Évite d'écrire un `useState` par champ et une fonction de validation manuelle pour chaque règle. Le schéma Yup est lisible, réutilisable, et se branche nativement sur Formik via `validationSchema`. |
| **Composants séparés (`src/components`)** | Évite la duplication de style entre Login/Register/Profile, et prépare le terrain pour les projets suivants (ex: `PrimaryButton` et `StarRating` seront réutilisés pour les fiches produits). |

---

## 5. Comment lancer le projet

### Prérequis

- [Node.js](https://nodejs.org/) installé (version 18 ou plus récente)
- L'application **Expo Go** installée sur un smartphone Android ou iOS
  (disponible sur le Play Store / App Store), **ou** un émulateur
  Android/iOS configuré sur l'ordinateur

### Lancement

```bash
cd e-joutia
npm install        # installe les dépendances (déjà fait lors de la création)
npx expo start     # démarre le serveur de développement Expo
```

Un QR code s'affiche dans le terminal :

- **Android** : ouvrir l'app **Expo Go** et scanner le QR code.
- **iOS** : scanner le QR code avec l'appareil photo natif, qui propose
  d'ouvrir l'app dans Expo Go.
- **Web** (aperçu rapide dans le navigateur) : `npm run web`.

---

## 6. Scénario de test manuel (pour vérifier que tout fonctionne)

1. Au premier lancement, l'application affiche l'écran **Connexion** (aucune
   session enregistrée).
2. Appuyer sur "Créer un compte" → remplir le formulaire d'inscription :
   - tester un email invalide (ex: `test@`) → un message d'erreur rouge doit
     apparaître dès qu'on quitte le champ ;
   - tester un mot de passe de moins de 6 caractères → message d'erreur ;
   - tester deux mots de passe différents dans "Confirmer le mot de passe" →
     message d'erreur ;
   - corriger tous les champs et appuyer sur "S'inscrire".
3. L'application bascule **automatiquement** vers l'écran **Home** (aucun
   `navigation.navigate` n'a été appelé manuellement).
4. Appuyer sur "Voir mon profil public" → vérifier l'affichage de l'avatar,
   du nom, de la ville, de la date d'inscription, des badges et des avis.
5. Revenir en arrière puis appuyer sur "Se déconnecter" → retour automatique
   à l'écran **Connexion**.
6. Se reconnecter avec **le même email** utilisé à l'inscription → le profil
   affiché est **identique** (la "base" locale a retrouvé l'utilisateur).
7. Fermer complètement l'application puis la rouvrir → l'utilisateur reste
   connecté et arrive directement sur **Home**, ce qui prouve que la session
   est bien **persistée** via AsyncStorage.

---

## 7. Pistes d'amélioration (liens avec les projets suivants)

- **PROJET 4** (Formulaire de publication) pourra permettre à l'utilisateur
  de choisir une vraie photo de profil via `expo-image-picker`, remplaçant
  l'avatar généré automatiquement.
- Remplacer le mini "backend local" (`USERS_KEY` dans AsyncStorage) par de
  vrais appels API avec gestion de token JWT, stocké via `expo-secure-store`.
- Sur l'écran Profil, afficher dynamiquement les annonces publiées par
  l'utilisateur (lien avec les **PROJETS 2 et 4**).
- Ajouter une vraie gestion des erreurs réseau (ex: message "Email déjà
  utilisé" si l'inscription échoue côté serveur).

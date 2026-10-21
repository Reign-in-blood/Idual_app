# GitHub Releases et mises à jour Android

## Publication d'une version de test

Depuis le terminal PowerShell **déjà placé dans `Idual_app/android`** :

```powershell
git pull origin master
npm --prefix .. run android:sync
.\gradlew.bat assembleDebug
gh release create v0.3.0 ".\app\build\outputs\apk\debug\app-debug.apk#iDual-Remote-v0.3.0.apk" --title "iDual Remote v0.3.0" --notes "Correction des paramètres, thèmes Dark/Light, FR/EN/ES et retour haptique." --prerelease
```

Toujours augmenter `android/app/build.gradle` : `versionCode` doit croître entre les mises à jour ; `versionName` doit refléter la version GitHub. Aligner également `package.json` pour le suivi. Ne pas réutiliser un tag existant pour une nouvelle APK.

### Signature

Les APK produites par `assembleDebug` utilisent la clé de débogage locale. **Elle n'est pas une clé pérenne de distribution**. Deux APK signées par des certificats différents ne peuvent généralement pas s'installer l'une par-dessus l'autre. Utiliser le même ordinateur et son magasin de clés de débogage peut suffire provisoirement pour les tests personnels. 

Avant une diffusion plus large, générer une clé de signature **release** dédiée, la conserver dans un endroit sûr (hors dépôt public), configurer une compilation release signée et transmettre le certificat aux mainteneurs. Lors du passage de la version debug à une clé release différente, les testeurs devront généralement désinstaller l'application de test avant d'installer la nouvelle.

## Système d'alerte sur les mises à jour — à développer

1. Lors de l'ouverture de l'app, et seulement si la fonctionnalité est activée, consulter `https://api.github.com/repos/Reign-in-blood/Idual_app/releases`.
2. Les premières versions sont des **pre-releases** : la route `/releases/latest` ne les renvoie pas ; filtrer et comparer les versions sans se fier seulement à la date.
3. Comparer à la version installée, idéalement récupérée via une API native Capacitor.
4. Si une version supérieure est disponible avec un actif `.apk`, présenter un message discret : « Nouvelle version disponible » + bouton vers **l'URL de la Release GitHub**.
5. L'utilisateur télécharge, puis confirme l'installation via Android. **Pas d'installation silencieuse ni d'auto-update de code natif**.
6. Le contrôle IR doit continuer de fonctionner entièrement sans réseau ; proposer la désactivation de la recherche de mise à jour.

Si le projet est distribué via Google Play dans l'avenir, la méthode de mise à jour devra respecter les règles de la boutique.

## Références

- https://developer.android.com/studio/publish/versioning
- https://developer.android.com/studio/publish/app-signing
- https://github.com/Reign-in-blood/Idual_app/releases

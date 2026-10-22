# Distribution APK et mises à jour GitHub

## Version actuelle

Prochaine publication prévue : **v0.4.0** (Android `versionCode 3`, `versionName 0.4.0`). La compilation et la publication de l'APK sont effectuées sur le PC Windows du mainteneur.

## Publication depuis PowerShell dans `Idual_app/android`

Le terminal doit utiliser le JDK 21 installé localement ; autrement Gradle 8.11.1 échoue sous Java 25.

```powershell
git pull origin master
$env:JAVA_HOME = (Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -Filter "jdk-21*" | Select-Object -First 1).FullName
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
npm --prefix .. run android:sync
.\gradlew.bat assembleDebug
gh release create v0.4.0 ".\app\build\outputs\apk\debug\app-debug.apk#iDual-Remote-v0.4.0.apk" --title "iDual Remote v0.4.0" --notes "Recherche automatique des mises à jour GitHub, contrôle manuel et préférences." --prerelease
```

Lancer la publication seulement après **BUILD SUCCESSFUL**. Ne jamais réutiliser un tag/version pour publier une APK différente.

## Système de mise à jour de l'application

- Dès le lancement (et au retour au premier plan), l'application **vérifie automatiquement** GitHub si l'option est activée.
- Cache local : au plus un appel à l'API GitHub toutes les **24 heures** par appareil, sauf commande manuelle.
- Source : `https://api.github.com/repos/Reign-in-blood/Idual_app/releases?per_page=50`. Cette liste inclut les **préversions** contrairement à `/releases/latest`.
- Les Releases sans fichier `.apk`, les brouillons et les tags qui ne sont pas au format `vMAJOR.MINOR.PATCH` sont ignorés.
- Les versions sont comparées numériquement. `src/updates.ts` lit `version` du `package.json`, intégré dans le build. **Le mainteneur doit synchroniser les versions** avant chaque compilation.
- Lorsqu'une version plus récente existe, un bandeau non bloquant propose **Voir et télécharger**, qui ouvre la page GitHub de la Release. Les versions ignorées avec « Plus tard » ne déclenchent plus de bandeau jusqu'à une nouvelle Release ou une vérification manuelle.
- L'option automatique peut être désactivée ; un bouton dans les paramètres déclenche la recherche à la demande.
- Les erreurs réseau n'affectent pas les commandes IR.
- **Pas de téléchargement ni d'installation en arrière-plan** et aucune installation silencieuse. L'utilisateur sélectionne l'APK sur GitHub et confirme l'installation via Android.
- Pas de service Android en arrière-plan : la recherche a lieu pendant l'utilisation de l'application, pas lorsque celle-ci est entièrement fermée.
- Une recherche de mise à jour établit une connexion à GitHub, ce qui est indiqué dans les mentions de confidentialité.

## Signature

Les APK de débogage (`assembleDebug`) utilisent la clé de débogage de la machine. Tant que la clé est la même et que `versionCode` ne diminue pas, l'installation par-dessus la version existante doit être possible. Une nouvelle clé de signature entraînera le refus de la mise à jour directe.

Avant diffusion publique pérenne, utiliser une **clé de signature release dédiée et sauvegardée**, jamais committée. Si les utilisateurs ont installé des versions debug signées avec une autre clé, une désinstallation peut être nécessaire.

## Validation prévue

1. `npm run build` et `assembleDebug` doivent réussir.
2. Le menu affiche l'option automatique cochée par défaut et le bouton « Rechercher maintenant ».
3. Comme `v0.4.0` n'est pas encore publiée, la recherche doit signaler « Application à jour » lors du premier test après publication de la v0.4.0.
4. Publier ensuite `v0.5.0` avec une APK et un `versionCode` plus élevé ; vérifier que `v0.4.0` propose la mise à jour et que GitHub s'ouvre bien sur le téléphone.
5. Vérifier FR, EN, ES, Dark/Light, « Plus tard », stockage des préférences, mise hors ligne, et fonctionnement IR.

Références officielles : https://docs.github.com/en/rest/releases/releases ; https://developer.android.com/google/play/app-updates ; https://developer.android.com/studio/publish/app-signing

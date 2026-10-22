# iDual Remote

Application Android hors ligne de contrôle infrarouge des éclairages **Jedi Lighting / iDual RC II**. Interface HTML/CSS/TypeScript (Vite), enveloppe native Android (Capacitor), pont Android `ConsumerIrManager`.

**État : socle initial.** Les 26 codes ont été testés avec succès dans irplus sur le téléphone du propriétaire. Leur émission par *notre* application Android reste à tester : API native, séquence des bits, fréquence et compatibilité de l'appareil.

## Démarrer

Prérequis : Node.js 22+, npm, Android Studio et SDK Android pour l'APK.

```bash
npm install
npm run dev
npm run build
npm install @capacitor/android
npx cap add android
npm run android:sync
```

Le navigateur permet de prévisualiser l'interface, **mais n'émet pas d'IR**. Pour l'APK, voir [docs/ANDROID.md](docs/ANDROID.md) pour installer et enregistrer le pont Java local avant compilation.

## Documents

- [Codes IR validés via irplus](docs/ir/idual-rc-ii.irplus.xml) (26 commandes)
- [Protocole et liens techniques](docs/IR_PROTOCOL.md)
- [Intégration Android](docs/ANDROID.md)
- [Photographies et matériel](docs/HARDWARE.md)
- [Roadmap](TODO.md) dont ESP32 à plus long terme

Projet indépendant, non affilié à Jedi Lighting / iDual. Aucun logo officiel incorporé.

## Vérification des mises à jour GitHub

Depuis v0.4.0, l'application recherche automatiquement les nouvelles APK GitHub au lancement et lorsqu'elle revient au premier plan, au maximum une fois toutes les 24 h. Le menu permet de désactiver la recherche et de la lancer manuellement. Les préversions GitHub sont incluses. L'utilisateur doit télécharger et approuver l'installation : Android ne permet pas à cette application une mise à jour silencieuse. La télécommande IR reste utilisable hors ligne.

Compilation sur Windows, depuis le dossier `android` :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ..\scripts\build-android.ps1
```

Voir [docs/RELEASES.md](docs/RELEASES.md) et [les Releases](https://github.com/Reign-in-blood/Idual_app/releases).

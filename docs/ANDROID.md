# Build Android et émission IR

Pré-requis: Node.js 22+, npm, Android Studio + SDK; smartphone possédant un émetteur IR compatible avec l'API `ConsumerIrManager`.

1. `npm install`
2. `npm install @capacitor/android@^7`
3. `npx cap add android`
4. Copier `native/android/ConsumerIrPlugin.java` vers `android/app/src/main/java/com/reigninblood/idualremote/ConsumerIrPlugin.java`.
5. Remplacer le `MainActivity.java` généré par `native/android/MainActivity.example.java` (renommé `MainActivity.java`) ou enregistrer simplement le plugin dans l'activité existante.
6. Ajouter `<uses-permission android:name="android.permission.TRANSMIT_IR" />` dans `android/app/src/main/AndroidManifest.xml`, sous la balise `<manifest>`, hors `<application>`.
7. `npm run android:sync`, puis `npm run android:open`; compiler dans Android Studio.

La permission TRANSMIT_IR est une permission normale, sans demande runtime. Le téléphone peut accepter les codes dans irplus sans nécessairement les exposer à toutes les applications: vérifier `hasIrEmitter()`. Aucun envoi n'est possible dans Chrome/PWA pure.

**Point de test :** les codes XML sont de type WINLIRC_NEC1. La couche native génère actuellement une trame NEC standard à partir des 32 bits affichés, MSB d'abord. Si ON/OFF ne répond pas, comparer les impulsions irplus et adapter l'encodage / l'ordre des bits plutôt que changer les codes de référence.

Références : https://developer.android.com/reference/android/hardware/ConsumerIrManager ; https://capacitorjs.com/docs/android

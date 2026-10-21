# Historique du développement — iDual Remote

> Journal des grandes étapes du projet, du concept initial à la première APK fonctionnelle.  
> Période : 20–21 octobre 2026.  
> Dépôt : https://github.com/Reign-in-blood/Idual_app

## 1. Besoin initial : moderniser des lampes existantes

- Installation de plusieurs lampes LED **iDual / Jedi Lighting**, commandées par des télécommandes d'origine vieillissantes ; la marque n'est plus une solution pérenne pour remplacer le matériel.
- Télécommandes utilisant trois piles AAA, boutons souples usés et contacts de clavier parfois inutilisables.
- Sur la télécommande la plus abîmée, la membrane avait été enlevée ; un simple fil métallique reliant certains points du PCB déclenchait encore les commandes.
- Objectif : **conserver les lampes**, les commander depuis un téléphone et, à terme, programmer des allumages/extinctions.

## 2. Première idée : un ESP32 raccordé à une télécommande

- Projet initial : raccorder les contacts de la télécommande à un **ESP32 Wi-Fi**, qui simulerait électroniquement l'appui sur les boutons.
- Inspection visuelle des deux faces du PCB ; identification de pistes communes, de contacts en peigne et de petits trous accessibles déjà utilisés avec le fil.
- Envisagé : interrupteurs électroniques isolés pour reproduire les courts contacts, sans appliquer directement les niveaux GPIO aux pistes.
- **Cette solution a été mise en attente** après découverte d'une méthode beaucoup moins invasive.

## 3. Découverte : la télécommande transmet en infrarouge

- Le démontage a montré **trois LED IR** en tête de télécommande, la LED centrale étant entourée d'une gaine opaque.
- Hypothèse de fonctionnement : émission large via les LED latérales, faisceau resserré via la LED centrale et le sélecteur de la télécommande. Hypothèse non confirmée électriquement.
- Une photographie au smartphone pendant un appui a montré l'émission IR.
- Nouveau plan : **reproduire directement les codes infrarouges**, sans souder de fils à la télécommande ni modifier les lampes.

## 4. Recherche des codes et documentation

Des recherches communautaires ont permis de retrouver le protocole et une table de **26 commandes iDual RC II** :

- [irplus — discussion « Code for iDual LED light »](https://github.com/irplus-remote/irplus-codes.github.io/issues/435)
- [openHAB / Tasmota — émissions infrarouges iDual](https://community.openhab.org/t/solved-ir-send-with-tasmota-mqtt-binding-v2-5/64419)
- [Home Assistant / ESPHome — codes iDual Jedi](https://community.home-assistant.io/t/ir-codes-web-ressources-conflict-with-esphome/530687)
- [Notice commerciale iDual/Jedi (PDF Castorama)](https://media.castorama.fr/is/content/Castorama/3663602908043_prd_frpdf)

Caractéristiques de travail :

- Format d'origine du profil : **WINLIRC_NEC1 / NEC-compatible**, trames de 32 bits.
- Préfixe représenté par `0x407F`.
- Porteuse **d'environ 38 kHz**, valeur déduite des exemples disponibles ; elle n'a pas été mesurée directement sur l'exemplaire.
- Codes de référence conservés dans [`docs/ir/idual-rc-ii.irplus.xml`](ir/idual-rc-ii.irplus.xml) et [`src/ir/codes.ts`](../src/ir/codes.ts).

Important : toutes ces caractéristiques ne constituent pas une documentation constructeur complète. La preuve décisive a été le test physique sur l'installation.

## 5. Validation avec irplus sur téléphone

- Installation de l'application Android **irplus**.
- Création d'un profil XML importable regroupant les **26 commandes** publiées.
- Importation du profil dans irplus.
- **Résultat : toutes les commandes ont fonctionné sur les véritables lampes**, notamment marche/arrêt, couleurs, blancs, luminosité et ambiances.

Cette étape a démontré qu'un téléphone équipé d'un émetteur IR compatible pouvait remplacer la télécommande, sans nouvel équipement ESP32.

## 6. Changement de priorité : application Android personnelle

- Décision : reporter l'ESP32 et créer d'abord une application **iDual Remote** dédiée.
- Une **PWA pure** ne peut normalement pas accéder directement à l'émetteur IR du téléphone via les API web.
- Architecture adoptée : **Vite + TypeScript + CSS** pour l'interface, **Capacitor** pour l'APK, puis module Android Java appelant **`ConsumerIrManager`** pour l'émission des commandes.
- Interface initiale : télécommande sombre tactile avec boutons ON/OFF, luminosité, couleurs et ambiances.
- Projet GitHub initialisé : [Reign-in-blood/Idual_app](https://github.com/Reign-in-blood/Idual_app).
- Création de `AGENTS.md` (conventions), `TODO.md` (roadmap), documentation IR/Android, profil irplus, code TypeScript et pont natif Android.

## 7. Première compilation et résolution des obstacles

Sur Windows, à partir du terminal d'Android Studio :

1. `npm install`, compilation Vite et synchronisation Capacitor : **réussies**.
2. Installation d'Android Studio, puis exécution de `npm run android:prepare` pour intégrer `ConsumerIrPlugin` : **réussie**.
3. Premier `gradlew assembleDebug` : échec **Unsupported class file major version 69** — le terminal utilisait Java 25 avec Gradle 8.11.1.
4. Installation de **Eclipse Temurin JDK 21** avec `winget` ; Gradle a ensuite indiqué **Launcher JVM 21**.
5. Erreur suivante : **SDK location not found** ; résolution par configuration locale du chemin Android SDK (`android/local.properties`).
6. Nouvelle exécution de `assembleDebug` : **BUILD SUCCESSFUL**, 85 tâches exécutées.

APK générée localement : `android/app/build/outputs/apk/debug/app-debug.apk`.

Les réglages Java et Android SDK concernent l'environnement de développement, pas le protocole IR.

## 8. GitHub et installation sur téléphone

- Code poussé sur la branche `master`.
- Publication de l'APK via une **GitHub Release** afin de la récupérer depuis le téléphone, sans versionner les binaires compilés dans Git.
- Installation de la première APK Android sur le téléphone.
- **Résultat final communiqué le 21 octobre 2026 : toutes les fonctionnalités testées dans notre propre application fonctionnent**, y compris l'émission infrarouge ; le propriétaire a confirmé que l'ensemble des commandes répondait.

Cette validation pratique concerne le téléphone et les lampes effectivement utilisés pour le test ; elle ne garantit pas la compatibilité avec tous les modèles Android ou toutes les variantes iDual.

## 9. État du projet à la fin de cette première session

**Acquis :**

- Protocole IR réutilisable et 26 commandes testées.
- Fonctionnement confirmé dans irplus **et** dans notre première APK.
- Application Android hors ligne, sans serveur ni Wi-Fi requis pour la transmission IR.
- Environnement de compilation fonctionnel sous Windows avec Java 21 + Android SDK.
- Dépôt et consignes de développement en place.

**À améliorer dans les prochaines sessions :**

- Reproduire plus fidèlement l'esthétique et la disposition de la télécommande iDual.
- Améliorer l'ergonomie tactile, les états et les animations.
- Vérifier les appuis longs, la répétition de commande et la gestion des différents formats d'écran.
- Consolider la génération des APK, leur versionnement et la publication des Releases.
- Ajouter éventuellement favoris et raccourcis, sans perdre les 26 commandes validées.

**Projet ultérieur volontairement reporté :**

- **ESP32 Wi-Fi + LED IR** pour commander les lampes sans téléphone et gérer des horaires/scénarios ; cf. [`TODO.md`](../TODO.md).
- L'injection directe d'un signal derrière le récepteur IR d'une lampe a été évoquée, mais exigerait une analyse des circuits et de leur isolation secteur.

---

## Points de vigilance pour la suite

- Ne pas réécrire les codes IR validés sur simple supposition.
- Privilégier des essais sur appareil physique ; une compilation réussie seule ne confirme pas la transmission.
- Maintenir une distinction entre PWA (interface web) et APK avec pont IR natif.
- Après une modification sur GitHub, donner systématiquement la commande simple `git pull origin master` conformément à `AGENTS.md`.

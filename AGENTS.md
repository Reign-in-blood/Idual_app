# AGENTS.md — iDual Remote

## Objectif
Application Android native/hybride hors ligne pour piloter des ampoules iDual RC II en IR depuis un téléphone compatible, avec une UI tactile inspirée de la télécommande. Priorité immédiate : **Android + IR natif**. ESP32 est explicitement reporté.

## Architecture
- Vite + TypeScript + CSS sans framework UI lourd.
- Capacitor pour l'APK Android; le navigateur web ne peut pas émettre d'IR.
- Pont Java Android: `native/android/ConsumerIrPlugin.java` et `ConsumerIrManager`.
- `src/ir/codes.ts`: source structurée des 26 commandes. Référence indépendante: `docs/ir/idual-rc-ii.irplus.xml`.
- `src/ir/transmitter.ts`: API de transmission isolée de l'UI.
- `src/main.ts` et `src/style.css`: maquette de la télécommande.

## Règles
1. Préserver la compatibilité avec le matériel iDual validée dans irplus; ne jamais inventer de codes IR.
2. Un bouton = un identifiant stable + trame documentée; synchroniser les modifications avec XML.
3. Ne jamais prétendre que la web app émet des IR : seules les builds Android avec pont natif le peuvent.
4. Aucune permission réseau requise pour le contrôle; stockage et fonctionnement local par défaut.
5. Préférer modifications ciblées et faible nombre de dépendances.
6. Ne pas committer `node_modules`, `dist`, Android SDK, clés de signature ou données personnelles.
7. Après chaque évolution, tester `npm run build`; tester IR sur un appareil physique et noter résultats.
8. Photos utilisateur: droits d'usage personnels; ne pas publier publiquement sans validation explicite.
9. Après chaque modification publiée sur GitHub, toujours fournir à l'utilisateur une commande Git simple, directement copiable-collable, pour récupérer les changements dans son clone local. Par défaut : `git pull origin master`. Ne pas imposer d'étapes inutiles ni de commandes destructrices ; si une action supplémentaire est indispensable, l'expliquer et donner les commandes exactes.
10. Pour chaque nouvelle APK, augmenter `versionCode` et harmoniser `versionName`, `package.json` et `package-lock.json`. Les GitHub Releases peuvent être des préversions ; les mises à jour sont détectées dans `src/updates.ts`.
11. Les recherches de mises à jour peuvent utiliser Internet, mais doivent rester désactivables ; n'envoyer aucune commande IR ni préférence à GitHub. Jamais d'installation APK silencieuse. Tester le lien de téléchargement et la signature sur téléphone.

## Attention protocole
NEC/NEC1 avec préfixe `407F`, trame 32 bits; fréquence d'environ 38 kHz seulement présumée. Vérifier l'ordre des bits Android lors du premier essai. `ConsumerIrManager.transmit` attend alternance on/off en microsecondes, pas directement les mots irplus.

## Feuille de route
Voir `TODO.md` et la documentation dans `docs/`.

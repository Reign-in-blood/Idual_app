# iDual / Jedi RC II — documentation technique IR

## État des connaissances (octobre 2026)
- Télécommande iDual RC II, 26 commandes testées avec succès dans **irplus** par le propriétaire sur ses propres lampes.
- Format d'échange: `WINLIRC_NEC1`; adresse/prefixe `0x407F`, 16 bits de commande complémentaires publiés par bouton.
- Transmission NEC-like sur 32 bits; modulation **environ 38 kHz** déduite de ressources tierces, pas mesurée directement sur ce matériel.
- Codes canoniques : `docs/ir/idual-rc-ii.irplus.xml` et `src/ir/codes.ts`.
- À confirmer sur notre APK: ordre des bits, timing, répétitions et fréquences supportées par le téléphone.

## Références externes
1. Codes iDual RC II fournis par la communauté irplus : https://github.com/irplus-remote/irplus-codes.github.io/issues/435
2. Integration Tasmota/openHAB: https://community.openhab.org/t/solved-ir-send-with-tasmota-mqtt-binding-v2-5/64419
3. Retour Home Assistant / ESPHome iDual Jedi: https://community.home-assistant.io/t/ir-codes-web-ressources-conflict-with-esphome/530687
4. Notice produit PDF, modèle possiblement différent: https://media.castorama.fr/is/content/Castorama/3663602908043_prd_frpdf
5. API Android officielle : https://developer.android.com/reference/android/hardware/ConsumerIrManager

Les pages ci-dessus sont des sources externes, pas des documents constructeur certifiant toutes les caractéristiques de notre télécommande. Ne pas incorporer aveuglément des documents tiers sans vérifier leur licence.

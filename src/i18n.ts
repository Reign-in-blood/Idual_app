import type { CommandId } from './ir/codes';
export type Language = 'fr' | 'en' | 'es';
export const labels: Record<Language,Record<CommandId,string>> = {
fr:{on:'I',off:'O',dimUp:'+',dimDown:'−',candle:'Bougie',warmWhite:'Chaud',daylight:'Jour',coolWhite:'Froid',night:'Nuit',sleep:'Sommeil',work:'Travail',relax:'Détente',sunrise:'Aube',pastelColor:'Pastel',party:'Fête',sunset:'Soleil',forest:'Forêt',ocean:'Océan',fireplace:'Feu',romance:'Cœur',red:'Rouge',orange:'Orange',green:'Vert',blue:'Bleu',vivid:'Vives',pastels:'Douces'},
en:{on:'I',off:'O',dimUp:'+',dimDown:'−',candle:'Candle',warmWhite:'Warm',daylight:'Day',coolWhite:'Cool',night:'Night',sleep:'Sleep',work:'Work',relax:'Relax',sunrise:'Dawn',pastelColor:'Pastel',party:'Party',sunset:'Sunset',forest:'Forest',ocean:'Ocean',fireplace:'Fire',romance:'Love',red:'Red',orange:'Orange',green:'Green',blue:'Blue',vivid:'Vivid',pastels:'Soft'},
es:{on:'I',off:'O',dimUp:'+',dimDown:'−',candle:'Vela',warmWhite:'Cálido',daylight:'Día',coolWhite:'Frío',night:'Noche',sleep:'Dormir',work:'Trabajo',relax:'Relax',sunrise:'Alba',pastelColor:'Pastel',party:'Fiesta',sunset:'Ocaso',forest:'Bosque',ocean:'Océano',fireplace:'Fuego',romance:'Amor',red:'Rojo',orange:'Naranja',green:'Verde',blue:'Azul',vivid:'Vivos',pastels:'Suaves'}
};
export const texts = {
fr:{settings:'Paramètres',appearance:'Apparence',language:'Langue',haptics:'Retour haptique',about:'À propos d’iDual Remote',privacy:'Mentions et confidentialité',source:'Code source sur GitHub',back:'Retour',close:'Fermer',checking:'IR · Vérification…',available:'IR · Disponible',unavailable:'IR · Non disponible',scenes:'Blancs et ambiances',colors:'Couleurs et palettes',offline:'26 commandes · Hors ligne',aboutBody:'Application communautaire gratuite et indépendante pour certains luminaires iDual et smartphones Android équipés d’un émetteur infrarouge compatible.',legalHeader:'Projet non officiel',legalBody:'Cette application n’est ni affiliée, ni approuvée, ni distribuée par Jedi Lighting, iDual ou leurs ayants droit. Les noms des marques identifient exclusivement les produits compatibles. Application fournie sans garantie.',privacyHeader:'Confidentialité',privacyBody:'Cette version ne nécessite aucun compte, aucune publicité et aucun service d’analyse. Les commandes sont émises localement en infrarouge. Les préférences sont conservées sur le téléphone. Quand la vérification automatique est activée, l’application contacte GitHub pour connaître les nouvelles versions ; GitHub peut recevoir des données de connexion.',external:'Le lien GitHub ouvre un site externe soumis à ses propres règles de confidentialité.',hapticNote:'Une courte vibration est demandée à Android lors d’un appui, si le téléphone le permet.'},
en:{settings:'Settings',appearance:'Appearance',language:'Language',haptics:'Haptic feedback',about:'About iDual Remote',privacy:'Legal & privacy',source:'Source code on GitHub',back:'Back',close:'Close',checking:'IR · Checking…',available:'IR · Available',unavailable:'IR · Unavailable',scenes:'White & scenes',colors:'Colors and palettes',offline:'26 commands · Offline',aboutBody:'Free and independent community app for certain iDual lights and Android phones with a compatible infrared transmitter.',legalHeader:'Unofficial project',legalBody:'Not affiliated with, endorsed by, or distributed by Jedi Lighting, iDual, or their rights holders. Brand names are used only to identify compatible products. Provided without warranty.',privacyHeader:'Privacy',privacyBody:'This version requires no account, ads, or analytics. Commands are transmitted locally via infrared. Preferences are stored on your phone. When automatic update checks are enabled, the app contacts GitHub to find new releases; GitHub may receive connection data.',external:'The GitHub link opens an external website with its own privacy rules.',hapticNote:'Requests a short vibration on button presses, if supported by Android.'},
es:{settings:'Ajustes',appearance:'Apariencia',language:'Idioma',haptics:'Respuesta háptica',about:'Acerca de iDual Remote',privacy:'Aviso legal y privacidad',source:'Código fuente en GitHub',back:'Volver',close:'Cerrar',checking:'IR · Comprobando…',available:'IR · Disponible',unavailable:'IR · No disponible',scenes:'Blancos y ambientes',colors:'Colores y paletas',offline:'26 comandos · Sin conexión',aboutBody:'Aplicación comunitaria gratuita e independiente para ciertas luces iDual y teléfonos Android con emisor infrarrojo compatible.',legalHeader:'Proyecto no oficial',legalBody:'Esta aplicación no está afiliada, aprobada ni distribuida por Jedi Lighting, iDual o sus titulares de derechos. Las marcas solo identifican productos compatibles. Se proporciona sin garantía.',privacyHeader:'Privacidad',privacyBody:'Esta versión no necesita cuentas, anuncios ni servicios de análisis. Los comandos se transmiten localmente por infrarrojos. Las preferencias se guardan en tu teléfono. Si la búsqueda automática de actualizaciones está activada, la aplicación consulta GitHub, que puede recibir datos de conexión.',external:'El enlace de GitHub abre un sitio externo con sus propias normas de privacidad.',hapticNote:'Solicita una breve vibración al pulsar botones, si Android lo permite.'}
} as const;
export type TextKey = keyof typeof texts.fr;
export function initialLanguage(): Language {
 const saved=localStorage.getItem('idual-language');
 if(saved==='fr'||saved==='en'||saved==='es')return saved;
 const system=navigator.language.slice(0,2).toLowerCase();
 return system==='es'||system==='en'?system:'fr';
}

export const updateTexts = {
  fr: {
    title: 'Mises à jour',
    auto: 'Recherche automatique',
    help: 'Recherche une nouvelle APK sur GitHub au lancement et au retour dans l’application (au plus une fois par jour).',
    check: 'Rechercher maintenant',
    checking: 'Recherche en cours…',
    upToDate: 'Application à jour',
    available: 'Nouvelle version disponible',
    download: 'Voir et télécharger',
    later: 'Plus tard',
    error: 'Impossible de contacter GitHub. Réessaie lorsque tu es connecté.',
    notChecked: 'Aucune recherche effectuée',
    installed: 'Version installée'
  },
  en: {
    title: 'Updates',
    auto: 'Automatic update checks',
    help: 'Checks GitHub for a new APK on launch and when returning to the app (at most once per day).',
    check: 'Check now',
    checking: 'Checking for updates…',
    upToDate: 'App is up to date',
    available: 'New version available',
    download: 'View and download',
    later: 'Later',
    error: 'Could not reach GitHub. Try again when online.',
    notChecked: 'Not checked yet',
    installed: 'Installed version'
  },
  es: {
    title: 'Actualizaciones',
    auto: 'Buscar actualizaciones automáticamente',
    help: 'Busca nuevas APK en GitHub al abrir o volver a la aplicación (como máximo una vez al día).',
    check: 'Buscar ahora',
    checking: 'Buscando actualizaciones…',
    upToDate: 'La aplicación está actualizada',
    available: 'Nueva versión disponible',
    download: 'Ver y descargar',
    later: 'Más tarde',
    error: 'No se pudo conectar con GitHub. Inténtalo cuando tengas conexión.',
    notChecked: 'Todavía no se ha comprobado',
    installed: 'Versión instalada'
  }
} as const;

export type UpdateTextKey = keyof typeof updateTexts.fr;

/**
 * STAMPIFY — Création de votre site web
 * Script Google Apps Script
 *
 * Instructions :
 * 1. Va sur https://script.google.com
 * 2. Clique sur "Nouveau projet"
 * 3. Colle ce code (remplace tout le contenu existant)
 * 4. Clique sur ▶ Exécuter (bouton Run)
 * 5. Autorise les permissions demandées
 * 6. Une fois terminé, le lien du formulaire s'affiche dans les logs (View > Logs)
 */

function createStampifyForm() {

  // ── Création du formulaire ──────────────────────────────────────────────────
  var form = FormApp.create('Stampify — Création de votre site web');
  form.setDescription(
    '✨ Bienvenue ! Ce formulaire nous permet de créer votre site vitrine.\n' +
    'Merci de le remplir avec soin — plus vous nous donnez d\'informations, plus votre site sera fidèle à votre image.\n\n' +
    '⏱ Temps estimé : 10–15 minutes'
  );
  form.setCollectEmail(false);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);


  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION 1 — INFORMATIONS GÉNÉRALES
  // ══════════════════════════════════════════════════════════════════════════════
  form.addSectionHeaderItem()
    .setTitle('1. Informations Générales')
    .setHelpText('Les informations de base sur votre commerce.');

  form.addTextItem()
    .setTitle('Nom du commerce')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Type de commerce')
    .setChoiceValues(['Café', 'Boulangerie', 'Barbershop', 'Restaurant', 'Salon de manucure', 'Autre'])
    .showOtherOption(true)
    .setRequired(true);

  form.addTextItem()
    .setTitle('Nom du gérant')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Téléphone')
    .setHelpText('Ex : +41 79 123 45 67')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email de contact')
    .setHelpText('L\'email affiché sur votre site vitrine')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Adresse complète')
    .setHelpText('Rue, numéro, code postal, ville, pays')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Horaires d\'ouverture')
    .setHelpText(
      'Indiquez vos horaires pour chaque jour de la semaine.\n' +
      'Ex :\nLundi : 08h00–18h00\nMardi : 08h00–18h00\n...\nDimanche : Fermé'
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('Site web actuel (si existant)')
    .setHelpText('Ex : www.moncommerce.ch — laissez vide si vous n\'en avez pas')
    .setRequired(false);


  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION 2 — IDENTITÉ VISUELLE
  // ══════════════════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('2. Identité Visuelle')
    .setHelpText('Aidez-nous à capter l\'âme de votre marque.');

  form.addFileUploadItem()
    .setTitle('Logo de votre commerce')
    .setHelpText('Formats acceptés : PNG, JPG, SVG, PDF. Idéalement fond transparent (PNG).')
    .setRequired(false);

  form.addTextItem()
    .setTitle('Couleurs principales de votre marque')
    .setHelpText('Ex : Rouge #FF0000, Noir #000000, Beige #F5F0E8 — indiquez autant de couleurs que vous souhaitez.')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Style souhaité pour le site')
    .setChoiceValues(['Moderne & Épuré', 'Chaleureux & Convivial', 'Luxe & Premium', 'Minimaliste', 'Dynamique & Coloré'])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Sites web que vous aimez en référence')
    .setHelpText('Collez les URLs de sites dont vous aimez le design ou l\'ambiance (un par ligne).')
    .setRequired(false);


  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION 3 — CONTENU
  // ══════════════════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('3. Contenu')
    .setHelpText('Le texte qui apparaîtra sur votre site.');

  form.addParagraphTextItem()
    .setTitle('Histoire de votre commerce')
    .setHelpText('En quelques phrases : quand avez-vous ouvert ? Quelle est votre passion ? Votre histoire ?')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Ce qui vous différencie de vos concurrents')
    .setHelpText('Votre point fort, votre valeur unique, ce pourquoi les clients reviennent chez vous.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Vos produits / services principaux')
    .setHelpText('Listez vos offres principales (un par ligne). Ex :\n- Café filtre\n- Croissants maison\n- Formule brunch')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Votre clientèle cible')
    .setHelpText('Ex : jeunes actifs, familles du quartier, touristes, professionnels…')
    .setRequired(true);


  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION 4 — PHOTOS
  // ══════════════════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('4. Photos')
    .setHelpText('Les visuels sont essentiels pour votre site. Plus vous en partagez, mieux c\'est !');

  form.addFileUploadItem()
    .setTitle('Photos du commerce (intérieur & extérieur)')
    .setHelpText('Formats : JPG, PNG, HEIC. Maximum 10 fichiers. Bonne résolution recommandée.')
    .setAllowedFileTypes(['image'])
    .setRequired(false);

  form.addFileUploadItem()
    .setTitle('Photos de vos produits / services')
    .setHelpText('Plats, boissons, coupes de cheveux, produits… Montrez votre savoir-faire !')
    .setAllowedFileTypes(['image'])
    .setRequired(false);

  form.addFileUploadItem()
    .setTitle('Photo du gérant (optionnel)')
    .setHelpText('Une belle photo de vous pour personnaliser votre site et créer du lien avec vos clients.')
    .setAllowedFileTypes(['image'])
    .setRequired(false);


  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION 5 — RÉSEAUX SOCIAUX
  // ══════════════════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('5. Réseaux Sociaux')
    .setHelpText('Vos pages seront liées à votre site vitrine.');

  form.addTextItem()
    .setTitle('Instagram')
    .setHelpText('Ex : https://www.instagram.com/moncommerce')
    .setRequired(false);

  form.addTextItem()
    .setTitle('Facebook')
    .setHelpText('Ex : https://www.facebook.com/moncommerce')
    .setRequired(false);

  form.addTextItem()
    .setTitle('TikTok')
    .setHelpText('Ex : https://www.tiktok.com/@moncommerce')
    .setRequired(false);

  form.addTextItem()
    .setTitle('Google My Business')
    .setHelpText('Lien vers votre fiche Google — laissez vide si vous n\'en avez pas encore.')
    .setRequired(false);


  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION 6 — STAMPIFY
  // ══════════════════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('6. Stampify')
    .setHelpText('Vos liens Stampify seront intégrés directement dans votre site vitrine.');

  form.addTextItem()
    .setTitle('Email de votre compte Stampify')
    .setHelpText('L\'email avec lequel vous êtes connecté sur stampify.ch')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Lien de votre carte fidélité')
    .setHelpText('Ex : stampify.ch/join/moncommerce')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Lien de votre roue')
    .setHelpText('Ex : stampify.ch/spin/moncommerce')
    .setRequired(false);


  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION 7 — PRÉFÉRENCES LIVRAISON
  // ══════════════════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('7. Préférences de Livraison')
    .setHelpText('Dernière étape — on y est presque ! 🎉');

  form.addTextItem()
    .setTitle('Nom de domaine souhaité')
    .setHelpText('Ex : mokxacoffee.fr — si vous n\'avez pas de préférence, laissez vide et nous vous proposerons des options.')
    .setRequired(false);

  form.addDateItem()
    .setTitle('Date souhaitée de livraison du site')
    .setHelpText('Nous ferons de notre mieux pour respecter cette date.')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Commentaires libres')
    .setHelpText('Tout ce que vous souhaitez nous dire : demandes spéciales, contraintes, inspirations, questions…')
    .setRequired(false);


  // ── Confirmation finale ──────────────────────────────────────────────────────
  form.setConfirmationMessage(
    '🎉 Merci ! Nous avons bien reçu vos informations.\n\n' +
    'Notre équipe Stampify va analyser vos réponses et commencer la création de votre site.\n' +
    'Nous vous contacterons sous 24–48h pour la suite.\n\n' +
    'À très vite ! — L\'équipe Stampify'
  );


  // ── Affichage du lien dans les logs ─────────────────────────────────────────
  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();

  Logger.log('════════════════════════════════════════');
  Logger.log('✅ Formulaire créé avec succès !');
  Logger.log('════════════════════════════════════════');
  Logger.log('🔗 Lien à partager aux clients :');
  Logger.log(formUrl);
  Logger.log('');
  Logger.log('✏️  Lien d\'édition (pour modifications) :');
  Logger.log(editUrl);
  Logger.log('════════════════════════════════════════');

  // Affiche une boîte de dialogue avec le lien
  var ui = FormApp.getUi ? null : null;

  SpreadsheetApp.getUi && SpreadsheetApp.getUi().alert(
    '✅ Formulaire créé !',
    'Lien à partager :\n' + formUrl,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

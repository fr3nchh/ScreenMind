const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const placeholder = document.getElementById('placeholder');
const btnCapture = document.getElementById('btn-capture');
const btnAnalyze = document.getElementById('btn-analyze');
const results = document.getElementById('results');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loading-text');

let stream = null;

const allCategories = {
    math: {
        name: "Mathematiques",
        icon: "🔢",
        category: "📚 Scolaire",
        description: "Equations, calculs, geometrie, algebre, fonctions, statistiques...",
        keywords: [
            "addition", "soustraction", "multiplication", "division",
            "equation", "inconnue", "calculer", "resoudre", "demontrer",
            "theoreme", "lemme", "aire", "perimetre", "volume", "surface",
            "triangle", "carre", "rectangle", "cercle", "cylindre", "cone", "sphere",
            "pourcentage", "fraction", "decimale", "entier", "naturel",
            "fonction", "drivee", "integrale", "limite", "continuite",
            "ensemble", "vide", "cardinal", "intersection", "union",
            "probabilite", "statistique", "moyenne", "mediane", "ecart-type",
            "vecteur", "matrice", "determinant", "systeme",
            "cos", "sin", "tan", "arc", "angle", "degre", "radian",
            "pythagore", "racine", "puissance", "exposant", "logarithme",
            "pair", "impair", "premier", "relatif", "rationnel", "irrationnel",
            "algebre", "arithmetique", "geometrie", "analyse",
            "polynome", "factorielle", "binome", "suite", "somme",
            "axiome", "theorie", "diagramme", "graphique", "courbe",
            "temperature", "vitesse", "distance", "force", "masse",
            "rapport", "proportionnalite", "echelle",
            "pi", "sigma", "epsilon", "delta", "alpha", "beta", "gamma"
        ],
        patterns: [
            /\d+\s*[+\-*\/^÷×]\s*\d+/,
            /[x-y]\s*[=<>≤≥≠]\s*\d+/,
            /[∫∂∇√π∞Σ∏]/,
            /\d+\s*[xXyYzZ]\s*[+\-=]/,
            /\d+\s*=\s*\d+/,
            /\b(cos|sin|tan|arccos|arcsin|arctan)\b/,
            /\d+[°]/,
            /\d+\s*[×x]\s*10\^?\d+/,
            /\d+\/\d+/,
            /[=<>≤≥≠]{1,2}/,
            /\d+\.\d+/,
            /\bf\s*\(\s*x\s*\)/,
            /\b\d+\s*(cm|mm|m|km|kg|g|L|mL)\b/,
            /[A-Z]\s*=\s*\d+/
        ],
        weight: 1.5
    },
    anglais: {
        name: "Anglais",
        icon: "🇬🇧",
        category: "📚 Scolaire",
        description: "Grammaire, vocabulaire, conjugaison, compréhension...",
        keywords: [
            "the", "is", "are", "was", "were", "have", "has", "had",
            "will", "shall", "can", "could", "would", "should", "may", "might",
            "do", "does", "did", "be", "been", "being",
            "this", "that", "these", "those",
            "what", "which", "who", "whom", "whose", "where", "when", "why", "how",
            "not", "no", "and", "but", "or", "so", "yet",
            "in", "on", "at", "to", "for", "with", "by", "from", "of", "about",
            "present", "past", "future", "tense", "verb", "noun", "adjective", "adverb",
            "sentence", "paragraph", "word", "phrase", "grammar",
            "good", "bad", "big", "small", "old", "new", "long", "short",
            "beautiful", "important", "interesting", "different", "possible",
            "happy", "sad", "angry", "scared", "surprised", "excited",
            "speak", "talk", "say", "tell", "ask", "answer", "question",
            "read", "write", "listen", "understand", "learn", "study", "teach",
            "eat", "drink", "sleep", "run", "walk", "jump", "swim", "play",
            "book", "school", "teacher", "student", "class", "homework",
            "exam", "test", "grade", "score", "pass", "fail",
            "hello", "goodbye", "please", "thank", "sorry",
            "article", "definite", "indefinite",
            "comparative", "superlative",
            "gerund", "infinitive", "participle",
            "preposition", "conjunction", "pronoun",
            "if", "because", "although", "while", "during", "before", "after",
            "between", "among", "through", "against", "without",
            "never", "always", "sometimes", "often", "usually",
            "more", "most", "less", "enough", "too", "very"
        ],
        patterns: [
            /\b(the|a|an)\s+\w+/i,
            /\b(is|are|was|were)\s+\w+/i,
            /\b(can|could|will|would|should|may|might)\s+\w+/i,
            /\b(my|your|his|her|its|our|their)\s+\w+/i,
            /\w+ing\b/,
            /\w+ed\b/,
            /\w+ly\b/,
            /\w+tion\b/,
            /\w+ness\b/,
            /\w+ful\b/,
            /\w+less\b/,
            /\w+ment\b/,
            /\w+able\b/,
            /\w+ible\b/
        ],
        weight: 1.3
    },

    francais: {
        name: "Francais",
        icon: "🇫🇷",
        category: "📚 Scolaire",
        description: "Grammaire, conjugaison, litterature, analyse de texte...",
        keywords: [
            "le", "la", "les", "un", "une", "des", "du", "de", "au", "aux",
            "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
            "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses",
            "ce", "cette", "ces", "celui", "celle", "ceux", "celles",
            "qui", "que", "quoi", "dont", "ou", "comment", "pourquoi", "quand",
            "est", "sont", "etre", "avoir", "faire", "aller", "voir", "savoir",
            "verbe", "nom", "adjectif", "adverbe", "pronom", "preposition",
            "conjugaison", "grammaire", "orthographe", "syntaxe", "lexique",
            "present", "passe", "futur", "imparfait", "plus-que-parfait",
            "indicatif", "subjonctif", "conditionnel", "imperatif",
            "phrase", "mot", "paragraphe", "texte", "sujet", "complement",
            "masculin", "feminin", "singulier", "pluriel",
            "accord", "ecrire", "lire", "comprendre",
            "litterature", "poesie", "roman", "nouvelle", "theatre",
            "auteur", "oeuvre", "personnage", "intrigue", "theme", "narrateur",
            "negation", "affirmation", "question", "exclamation",
            "racine", "suffixe", "prefixe", "syllabe",
            "regle", "exception", "regulier", "irregulier",
            "cod", "coi", "attribut", "proposition",
            "subordonnee", "principale", "relative", "conjonctive",
            "discours", "direct", "indirect", "narratif", "descriptif"
        ],
        patterns: [
            /\b(le|la|les|un|une|des)\s+\w+/i,
            /\b(je|tu|il|elle|on|nous|vous|ils|elles)\s+\w+/i,
            /\w+er\b/,
            /\w+ir\b/,
            /\w+re\b/,
            /\w+ment\b/,
            /\w+tion\b/,
            /\w+eur\b/,
            /\w+euse\b/,
            /\w+aison\b/,
            /\w+ence\b/,
            /\w+ance\b/
        ],
        weight: 1.3
    },
    science: {
        name: "Sciences",
        icon: "🔬",
        category: "📚 Scolaire",
        description: "Physique, chimie, biologie, experiences...",
        keywords: [
            "atome", "molecule", "element", "energie", "force", "vitesse", "masse",
            "temperature", "chaleur", "froid", "electrique", "magnetique",
            "gravite", "gravitation", "acceleration", "inertie",
            "cellule", "ADN", "ARN", "gene", "chromosome",
            "proteine", "enzyme", "organisme", "bacterie", "virus",
            "photosynthese", "respiration", "digestion",
            "planete", "etoile", "soleil", "lune", "galaxie", "univers",
            "experience", "hypothese", "resultat", "conclusion", "methode",
            "observation", "mesure", "donnee", "cristal", "solution",
            "acide", "base", "sel", "eau", "oxygene", "hydrogene",
            "carbone", "azote", "fer", "cuivre", "cycle", "chaine",
            "lois", "principe", "theorie", "modele",
            "laboratoire", "microscope", "formule", "symbole", "unite"
        ],
        patterns: [
            /\b\d+\s*(g|kg|mg|L|mL|mol|Hz|N|J|W|V|A)\b/,
            /\b(H2O|CO2|NaCl|O2|N2|CH4|C6H12O6)\b/,
            /\d+\s*[x×]\s*10\^?\d+/,
            /\b\d+\s*(°C|°F|K)\b/,
            /\b(pH|pOH)\b/,
            /\b(ion|cation|anion|electrone|neutron|proton)\b/,
            /\b(metalloide|metal|non-metal|isolant|conducteur)\b/,
            /\b(mendeleev|tableau|periodique)\b/,
            /\b(osmose|dialyse|chromatographie)\b/,
            /\b(evaporation|condensation|sublimation|fusion)\b/,
            /\b(covalent|ionique|liaison)\b/
        ],
        weight: 1.4
    },

    histoire: {
        name: "Histoire-Geographie",
        icon: "🌍",
        category: "📚 Scolaire",
        description: "Evenements historiques, dates, geographie...",
        keywords: [
            "guerre", "paix", "revolution", "empire", "royaume", "republique",
            "siecle", "millenaire", "epoque", "civilisation", "peuple", "nation",
            "roi", "reine", "empereur", "prince", "duc",
            "bataille", "invasion", "conquete", "colonisation",
            "independance", "declaration", "traite", "alliance",
            "democratie", "dictature", "monarchie",
            "economie", "commerce", "industrie", "agriculture",
            "population", "demographie", "migration",
            "religion", "culture", "art", "architecture",
            "latitude", "longitude", "climat", "relief", "geographie",
            "continent", "ocean", "mer", "fleuve", "montagne", "desert",
            "carte", "atlas", "frontiere", "capitale",
            "europe", "amerique", "asie", "afrique", "oceanie",
            "francais", "revolution francaise", "premiere guerre mondiale",
            "seconde guerre mondiale", "guerre froide"
        ],
        patterns: [
            /\b\d{4}\b/,
            /\b(1[0-9]{3}|20[0-2]\d)\b/,
            /\b(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)\b/i,
            /\b(siecle)\b/i,
            /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
            /\b(nord|sud|est|ouest)\b/i,
            /\b(pays|etat|nation|region|departement|commune)\b/i,
            /\b(habitant|capitale|frontiere|territoire)\b/i
        ],
        weight: 1.2
    },

    philo: {
        name: "Philosophie",
        icon: "🤔",
        category: "📚 Scolaire",
        description: "Reflection, concepts, auteurs, argumentation...",
        keywords: [
            "philosophie", "philosophique", "pensee",
            "existence", "essence", "realite", "verite",
            "bien", "mal", "morale", "ethique", "justice", "liberte",
            "raison", "logique", "argument", "demonstration", "preuve",
            "conscience", "esprit", "ame", "corps",
            "cause", "effet", "consequence",
            "concept", "notion", "abstraction",
            "these", "antithese", "synthese",
            "socratique", "platon", "aristote", "descartes", "kant",
            "nietzsche", "hegel", "marx", "sartre", "camus",
            "problematique", "questionnement",
            "nihilisme", "humanisme", "existentialisme",
            "volonte", "desir", "bonheur",
            "transcendance", "phenomene"
        ],
        patterns: [
            /\b(pourquoi|comment|qu'est-ce que|qu'est-ce qu')\b/i,
            /\b(il est|on peut|nous devons|je pense)\b/i,
            /\b(donc|car|ainsi|cependant|neanmoins|toutefois)\b/i,
            /\b(ethique|moral|morale|vertu|vice)\b/i,
            /\b(dialectique|materialisme|idealisme)\b/i
        ],
        weight: 1.1
    },
    espagnol: {
        name: "Espagnol",
        icon: "🇪🇸",
        category: "📚 Scolaire",
        description: "Grammaire, vocabulaire, conjugaison espagnol...",
        keywords: [
            "el", "la", "los", "las", "un", "una", "unos", "unas",
            "yo", "tu", "el", "ella", "nosotros", "vosotros", "ellos", "ellas",
            "ser", "estar", "haber", "tener", "hacer", "poder", "querer", "saber",
            "hablar", "comer", "vivir", "escribir", "leer", "estudiar", "trabajar",
            "bueno", "malo", "grande", "pequeno", "nuevo", "viejo",
            "bonito", "feo", "facil", "dificil", "importante", "necesario",
            "hoy", "ayer", "manana", "siempre", "nunca", "aqui", "alli",
            "tambien", "pero", "porque", "entonces", "ademas",
            "clase", "escuela", "profesor", "alumno", "examen", "tarea",
            "muy", "bastante", "poco", "mucho", "menos"
        ],
        patterns: [
            /\b(el|la|los|las)\s+\w+/i,
            /\b(ser|estar|haber)\s+\w+/i,
            /\w+(ar|er|ir)\b/,
            /\b(que|donde|cuando|como|quien)\b/i,
            /\b(tengo|tienes|tiene|tenemos|tienen)\b/i
        ],
        weight: 1.1
    },

    allemand: {
        name: "Allemand",
        icon: "🇩🇪",
        category: "📚 Scolaire",
        description: "Grammaire, vocabulaire, conjugaison allemand...",
        keywords: [
            "der", "die", "das", "ein", "eine", "den", "dem", "des",
            "ich", "du", "er", "sie", "es", "wir", "ihr",
            "sein", "haben", "werden", "konnen", "mussen", "sollen", "wollen",
            "machen", "gehen", "kommen", "sagen", "geben", "nehmen",
            "gut", "schlecht", "gross", "klein", "neu", "alt",
            "schon", "noch", "nicht", "auch", "nur", "sehr", "viel",
            "heute", "gestern", "morgen", "immer", "nie", "hier", "dort",
            "Schule", "Lehrer", "Schuler", "Klasse", "Prufung"
        ],
        patterns: [
            /\b(der|die|das)\s+\w+/i,
            /\b(ich|du|er|sie|es)\s+\w+/i,
            /\w+(en|ern|eln)\b/,
            /\b(nicht|noch|schon)\b/i
        ],
        weight: 1.0
    },

    nsI: {
        name: "NSI / Informatique",
        icon: "💻",
        category: "📚 Scolaire",
        description: "Programmation, algorithmique, reseaux, structures de donnees...",
        keywords: [
            "algorithme", "programmation", "code", "variable", "fonction",
            "boucle", "condition", "tableau", "liste", "dictionnaire",
            "classe", "objet", "methode", "attribut", "instance",
            "python", "java", "javascript", "html", "css", "sql",
            "if", "else", "elif", "for", "while", "return", "print",
            "def", "class", "import", "from", "try", "except",
            "True", "False", "None", "self", "lambda",
            "ichier", "donnee", "base", "donnee", "serveur", "client",
            "reseaux", "internet", "protocol", "http", "tcp", "ip",
            "binary", "decimal", "hexadecimal", "octal", "bit", "byte",
            "compilateur", "interpreteur", "debug", "bug", "erreur",
            "complexite", "triable", "recursif", "iteratif",
            "pile", "file", "arbre", "graphe", "graphe", "noeud", "arete",
            "hash", "encryption", "cle", "public", "prive", "securite",
            "API", "JSON", "XML", "CSV",
            "HTML", "DOM", "CSS", "selector", "style",
            "git", "github", "version", "commit", "push", "pull", "branch"
        ],
        patterns: [
            /\b(def|class|import|for|while|if|else|elif|return|print)\b/,
            /\w+\s*=\s*\w+/,
            /\w+\([^)]*\)/,
            /\b(True|False|None)\b/,
            /\b(def|class)\s+\w+/,
            /\b(import|from)\s+\w+/,
            /\b(for|while)\s*\(/,
            /#/ // Comment
        ],
        weight: 1.4
    },

    sport: {
        name: "Sport / EPS",
        icon: "⚽",
        category: "📚 Scolaire",
        description: "Activite physique, sports, sante, alimentation...",
        keywords: [
            "sport", "football", "basketball", "tennis", "natation", "athletisme",
            "course", "marathon", "sprint", "endurance", "vitesse", "force",
            "muscle", "articulation", "squelette", "os", "tendon",
            " entrainement", "competition", "match", "joueur", "equipe",
            "arbitre", "score", "but", "point", "victoire", "defaite",
            "record", "medaille", "champion", "olympique",
            "sante", "alimentation", "nutrition", "calorie", "protide",
            "glucide", "lipide", "vitamine", "mineraux",
            "effort", "recuperation", "etirement", "echauffement",
            "coordination", "agilite", "equilibre", "flexibilite",
            "IMC", "masse corporelle", "taille", "poids"
        ],
        patterns: [
            /\b(sport|football|basket|tennis|natation)\b/i,
            /\b(match|competition|champion)\b/i,
            /\b(exercice|entrainement|effort)\b/i,
            /\b(IMC|biceps|triceps|quadriceps)\b/i
        ],
        weight: 1.0
    },

    arts: {
        name: "Arts / Education artistique",
        icon: "🎨",
        category: "📚 Scolaire",
        description: "Dessin, peinture, histoire de l'art, esthetique...",
        keywords: [
            "art", "peinture", "dessin", "sculpture", "estampe",
            "couleur", "forme", "ligne", "texture", "matiere",
            "lumiere", "ombre", "clair", "obscur", "contraste",
            "perspective", "symetrie", "composition", "harmonie",
            "impressionnisme", "cubisme", "surrealisme", "realisme",
            "renoir", "monet", "picasso", "dali", "vangogh", "cezanne",
            "musee", "galerie", "exposition", "toile", "pinceau",
            "style", "mouvement", "epoque", "artiste", "oeuvre",
            "grisaille", "aquarelle", "gouache", "encre", "fusain",
            "marbre", "bronze", "terre cuite", "bois", "verre"
        ],
        patterns: [
            /\b(peinture|dessin|sculpture|art)\b/i,
            /\b(couleur|forme|lumiere|ombre)\b/i,
            /\b(musee|galerie|exposition)\b/i
        ],
        weight: 0.9
    },

    // ═══════════════════════════════════════════════════════
    // DOCUMENTS OFFICIELS
    // ═══════════════════════════════════════════════════════

    permis: {
        name: "Permis de Conduire",
        icon: "🚗",
        category: "📋 Documents",
        description: "Permis de conduire, code de la route, transport...",
        keywords: [
            "permis", "conduire", "conduite", "vehicule", "automobile",
            "code", "code de la route", "examen", "lecon", "auto-ecole",
            "plaque", "immatriculation", "carte grise", "assurance",
            "vitesse", "limite", "ralentir", "freiner", "accelerer",
            "intersection", "carrefour", "priorite", "ceder le passage",
            "feu", "rouge", "vert", "ambre", "clignotant",
            "stationnement", "arret", "depassement", "virage",
            "pieton", "passage", "zebre", "cycliste",
            "alcool", "taux", "0.5", "0.2", "0.0",
            "drogue", "stupéfiant", "narcométrie",
            "points", "permis", "retrait", "suspension",
            "catégorie", "B", "A", "C", "D", "AM",
            "CE", "B1", "A1", "A2",
            "ecolier", "stagiaire", "conduite accompagnee",
            "danger", "prevention", "securite", "ceinture", "casque",
            "equipement", "obligatoire", "controle technique",
            "puissance", "cheval", "kW", "kilowatt",
            "cylindree", "cc", "cm3", "litre",
            "essence", "diesel", "gasoil", "electrique", "hybride",
            "autoroute", "route", "voie", "chaussee", "sens unique",
            "panneau", "signalisation", "rond-point", "boulevard",
            "tunnel", "pont", "pente", "descente",
            "neige", "pluie", "brouillard", "verglas", "glissant",
            "amende", "contravention", "PV", "proces-verbal",
            "police", "gendarmerie", "radar", "controle"
        ],
        patterns: [
            /\b(permis|conduire|conduite)\b/i,
            /\b(code de la route|auto-ecole|lecon)\b/i,
            /\b(vitesse|limite|ralentir|freiner)\b/i,
            /\b(plaque|immatriculation|carte grise)\b/i,
            /\b(0\.5|0\.2|0\.0)\b/,
            /\b(permis\s+[A-Z]\b|cat[ée]gorie\s+[A-Z]\b)/i,
            /\b(danger|prevention|securite|ceinture|casque)\b/i,
            /\b(essence|diesel|electrique|hybride)\b/i,
            /\b(amende|contravention|radar)\b/i
        ],
        weight: 1.6
    },

    cni: {
        name: "Carte Nationale d'Identite (CNI)",
        icon: "🪪",
        category: "📋 Documents",
        description: "Carte d'identite, piece d'identite, etat civil...",
        keywords: [
            "carte nationale", "carte d'identite", "identite", "CNI",
            "prenom", "nom", "nom de famille", "nom d'usage",
            "date de naissance", "lieu de naissance", "nee le", "ne le",
            "sexe", "homme", "femme",
            "nationalite", "francaise", "francais",
            "numero", "identification", "personalite",
            "adresse", "domicile", "residence",
            "pere", "mere", "parent", "fils", "fille",
            "taille", "signe particulier", "yeux", "cheveux",
            "delivrance", "expiration", "valable jusqu'au", "date de validite",
            "autorite", "prefecture", "sous-prefecture",
            "mention", "mention supplementaire",
            "carte d'identite europeenne",
            "titulaire", "ce document", "ce titre"
        ],
        patterns: [
            /\b(carte nationale|carte d'identite|CNI)\b/i,
            /\b(prenom|nom|date de naissance|lieu de naissance)\b/i,
            /\b(ne[ée]?\s+le\s+\d)/i,
            /\b(delivrance|expiration|valable)\b/i,
            /\b(nationalite|francaise)\b/i,
            /\b(adresse|domicile|residence)\b/i,
            /\b(prefecture|sous-prefecture)\b/i,
            /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}/, // Date format DD/MM/YYYY
            /\b[A-Z]{1,2}\s*\d{2,5}\b/ // Document number
        ],
        weight: 1.7
    },

    passport: {
        name: "Passeport",
        icon: "🛂",
        category: "📋 Documents",
        description: "Passeport, voyage international, documents de voyage...",
        keywords: [
            "passeport", "passport", "travel", "voyage",
            "prenom", "nom", "nom de famille", "nom d'usage",
            "date de naissance", "lieu de naissance",
            "sexe", "nationalite", "francaise", "francais",
            "numero", "passport number",
            "delivrance", "expiration", "valid until",
            "autorite", "prefecture", "authority",
            "type", "P", "document type",
            "page", "pages",
            "photo", "photographie",
            "signature", "signature du titulaire",
            "biometrie", "empreinte", "empreinte digitale",
            "zone", "mrz", "machine readable zone",
            "code", "pays", "country",
            "visa", "stamp", "cachet",
            "france", "republique francaise",
            "ministere", "affaires etrangeres"
        ],
        patterns: [
            /\b(passeport|passport)\b/i,
            /\b(prenom|nom|date de naissance|lieu de naissance)\b/i,
            /\b(delivrance|expiration|valid)\b/i,
            /\b(nationalite|francaise)\b/i,
            /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}/,
            /\b[A-Z]{1,2}\d{6,9}\b/, // Passport number
            /\b(FRA|F)\b/ // Country code
        ],
        weight: 1.7
    },

    facture: {
        name: "Facture",
        icon: "🧾",
        category: "📋 Documents",
        description: "Facture, achat, devis, bon de commande...",
        keywords: [
            "facture", "invoice", "achat", "vente", "prix", "tarif",
            "montant", "total", "sous-total", "TVA", "HT", "TTC",
            "euro", "EUR", "€", "payement", "paiement", "reglement",
            "especes", "carte", "cheque", "virement", "prelevement",
            "bon de commande", "BC", "devis", "proposition",
            "client", "fournisseur", "vendeur", "acheteur",
            "designation", "quantite", "prix unitaire", "reference",
            "numéro", "numero de facture", "facture N°",
            "date", "echeance", "date limite", "a payer",
            "remise", "reduction", "rabais", "bonification",
            "adresse", "code postal", "ville",
            "SIRET", "SIREN", "TVA intracommunautaire",
            "IBAN", "BIC", "SWIFT",
            "solde", "reste a payer", "avoir", "credit",
            "total general", "montant total", "a regler",
            "merci de votre confiance", "conditions de paiement"
        ],
        patterns: [
            /\b(facture|invoice|devis|bon de commande)\b/i,
            /\b(montant|total|TVA|HT|TTC)\b/i,
            /\b(euro|EUR|€)\b/,
            /\d+[,\.]\d{2}\s*€?/,
            /\b(SIRET|SIREN|TVA)\b/,
            /\b(IBAN|BIC|SWIFT)\b/,
            /\b(remise|reduction|rabais)\b/i,
            /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}/,
            /\b(Facture\s+N[°o°]\s*\d+)/i
        ],
        weight: 1.6
    },
    assurance: {
        name: "Assurance",
        icon: "🛡️",
        category: "📋 Documents",
        description: "Contrat d'assurance, couverture, sinistre...",
        keywords: [
            "assurance", "assurer", "assureur", "assure",
            "contrat", "police", "couverture", "garantie",
            "prime", "cotisation", "mensuel", "annuel",
            "sinistre", "accident", "degat", "incident",
            "remboursement", "indemnisation", "dedommagement",
            "franchise", "plafond", "plafonnement",
            "auto", "habitation", "sante", "vie", "voyage", "responsabilite civile",
            "mutuelle", "complementaire", "remboursement",
            "bénéficiaire", "beneficiaire", "ayant droit",
            "dommages", "materiels", "corporels",
            "constat", "constat amiable", "declaration",
            "expert", "evaluation", "estimation",
            "depannage", "assistance", "deplacement",
            "vol", "incendie", "inondation", "catastrophe naturelle",
            "brise de glace", "bris de glace", "bri de vitre"
        ],
        patterns: [
            /\b(assurance|assurer|assureur)\b/i,
            /\b(contrat|police|garantie)\b/i,
            /\b(sinistre|accident|degat)\b/i,
            /\b(remboursement|indemnisation)\b/i,
            /\b(franchise|plafond)\b/i,
            /\b(constat amiable)\b/i
        ],
        weight: 1.5
    },

    courrier: {
        name: "Courrier / Lettre",
        icon: "💌",
        category: "📋 Documents",
        description: "Lettre, courrier administratif, courrier formel...",
        keywords: [
            "madame", "monsieur", "cher", "chere",
            "objet", "ref", "reference", "reference client",
            "lieu", "date", "fait a",
            "nous avons l'honneur", "je me permets", "je vous prie",
            "dans le cadre", "en reponse", "Suite a",
            "cordialement", "sinceres salutations", "respectueusement",
            "signature", "cachet", "stamp",
            "destinataire", "expediteur", "adresse",
            "piece jointe", "PJ", "ci-joint",
            "reponse", "delai", "echeance", "a compter de",
            "mise en demeure", "notification", "convocation",
            "requete", "demande", "reclamation", "plainte",
            "decision", "arrete", "decision administrative",
            "prefecture", "mairie", "service public",
            "dossier", "numero de dossier", "suivi"
        ],
        patterns: [
            /\b(madame|monsieur)\b/i,
            /\b(cher|chere)\b/i,
            /\b(objet|reference|PJ|piece jointe)\b/i,
            /\b(cordialement|salutations|respectueusement)\b/i,
            /\b(nous avons l'honneur|je me permets)\b/i,
            /\b(en reponse|suite a|dans le cadre)\b/i
        ],
        weight: 1.4
    },

    cv: {
        name: "CV / Lettre de Motivation",
        icon: "📄",
        category: "📋 Documents",
        description: "Curriculum vitae, lettre de motivation, candidature...",
        keywords: [
            "curriculum vitae", "CV", "resume", "profil",
            "formation", "diplome", "etude", "universite", "ecole",
            "experience", "professionnel", "stage", "emploi", "poste",
            "competence", "capacite", "maitrise", "utilisation",
            "langue", "francais", "anglais", "espagnol", "allemand",
            "informatique", "bureautique", "logiciel", "maitrise",
            "centres d'interet", "loisir", "passion",
            "qualite", "rigoureux", "dynamique", "autonome", "organise",
            "reférence", "recommandation",
            "nom", "prenom", "adresse", "telephone", "email", "mail",
            "date de naissance", "nationalite",
            "situation familiale", "marie", "celibataire",
            "permis", "voiture", "disponibilite",
            "salaire", "pretention salariale", "remuneration",
            "lettre de motivation", "candidature spontanee", "offre d'emploi"
        ],
        patterns: [
            /\b(curriculum vitae|CV|resume)\b/i,
            /\b(forma?tion|dipl[ôo]me|exp[ée]rience)\b/i,
            /\b(comp[ée]tence|maitrise|utilisation)\b/i,
            /\b(langue|fran[çc]ais|anglais)\b/i,
            /\b(lettre de motivation|candidature)\b/i,
            /\b(salaire|r[ée]mun[ée]ration)\b/i,
            /\b(\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4})\b/,
            /\b(t[ée]l[ée]phone|email|mail)\b/i
        ],
        weight: 1.5
    },

   BulletinScolaire: {
        name: "Bulletin Scolaire",
        icon: "📊",
        category: "📋 Documents",
        description: "Bulletin de notes, relevé de notes, bulletin scolaire...",
        keywords: [
            "bulletin", "releve de notes", "notes", "evaluation",
            "matiere", "note", "appreciation", "moyenne",
            "eleve", "classe", "niveau", "periode", "trimestre",
            "absence", "retard", "conduite", "comportement",
            "professeur", "principal", "proviseur",
            "admis", "ajourne", "mention", "bien", "tres bien", "assez bien",
            "appreciation generale", "observations",
            "rang", "classement", "total", "coef", "coefficient",
            "sport", "eps", "education physique",
            "french", "francais", "maths", "mathematiques",
            "anglais", "histoire", "geographie", "svt", "physique chimie",
            "informatique", "nsi", "arts", "musique", "philosophie"
        ],
        patterns: [
            /\b(bulletin|releve de notes|evaluation)\b/i,
            /\b(note|moyenne|appreciation)\b/i,
            /\b(eleve|classe|niveau|periode|trimestre)\b/i,
            /\b(absence|retard|conduite)\b/i,
            /\b(admis|ajourne|mention)\b/i,
            /\b\d+\/20/, // Note format /20
            /\b(rang|classement|total)\b/i
        ],
        weight: 1.5
    },

    // ═══════════════════════════════════════════════════════
    // CODE DE LA ROUTE
    // ═══════════════════════════════════════════════════════

    codeRoute: {
        name: "Code de la Route",
        icon: "🚦",
        category: "📋 Documents",
        description: "Code de la route, signalisation, regles de conduite...",
        keywords: [
            "code de la route", "signalisation", "panneau", "reglementation",
            "feu rouge", "feu orange", "feu vert", "feu ambre",
            "stop", "ceder le passage", "priorite", "rond-point",
            "sens unique", "double sens", "carrefour", "intersection",
            "vitesse", "limite", "50", "70", "80", "90", "110", "130",
            "zone", "urbaine", "hors agglomeration", "autoroute",
            "depassement", "distance de securite", "freinage",
            "angle mort", "retroviseur", "miroir",
            "ceinture", "casque", "gants", "gilet jaune",
            "alcool", "taux", "0.5", "0.2", "0.0",
            "drogue", "stupefiant", "narcometrie",
            "telephone", "main libre", "bluetooth",
            "pieton", "passage pieton", "zebre", "trottoir",
            "cycliste", "piste cyclable", "velo",
            "transport scolaire", "bus", "ecolier",
            "danger", "prevention", "securite",
            "panneau d'interdiction", "panneau d'obligation",
            "panneau de danger", "panneau d'information",
            "triangle", "rond", "carré", "rectangle",
            "rouge", "bleu", "vert", "jaune", "blanc", "noir",
            "contrôle technique", "controle technique",
            "amende", "contravention", "point", "retrait",
            "conduite en etat ivresse", "conduite dangereuse",
            "precedence", "preemption"
        ],
        patterns: [
            /\b(code de la route|signalisation)\b/i,
            /\b(feux?\s*(rouge|orange|vert|ambre))\b/i,
            /\b(stop|ceder le passage|priorite)\b/i,
            /\b\d+\s*km\/h\b/,
            /\b(50|70|80|90|110|130)\s*km/,
            /\b(0\.5|0\.2|0\.0)\b/,
            /\b(ceinture|casque|gilet)\b/i,
            /\b(depasser?|distance|freinage)\b/i,
            /\b(panneau|rond-point|intersection)\b/i,
            /\b(amende|contravention|point)\b/i
        ],
        weight: 1.6
    },

    // ═══════════════════════════════════════════════════════
    // SANTÉ / MEDICAL
    // ═══════════════════════════════════════════════════════

    medical: {
        name: "Medical / Sante",
        icon: "🏥",
        category: "📋 Documents",
        description: "Ordonnance, resultats d'analyses, dossier medical...",
        keywords: [
            "medecin", "docteur", "hopital", "clinique", "cabinet",
            "ordonnance", "prescription", "medicament", "traitement",
            "analyse", "bilan", "resultat", "laboratoire",
            "sang", "urine", "examen", "radio", "echographie",
            "diagnostic", "symptome", "maladie", "pathologie",
            "patient", "dossier medical", "carnet de sante",
            "vaccination", "vaccin", "injection", "piqure",
            "pharmacie", "pharmacist", "ordonnance",
            "tension", "arterielle", "glycemie", "cholesterol",
            "temperature", "fievre", "douleur", "inflammation",
            "allergie", "intolerance", "effet secondaire",
            "chirurgie", "intervention", "operation", "anesthesie",
            "radiotherapie", "chimiotherapie", "cancer",
            "diabete", "hypertension", "asthme",
            "mutuelle", "securite sociale", "cpam", "remboursement",
            "arret de travail", "arret maladie", "conge maladie"
        ],
        patterns: [
            /\b(medecin|docteur|hopital|clinique)\b/i,
            /\b(ordonnance|prescription|medicament)\b/i,
            /\b(analyse|bilan|resultat|laboratoire)\b/i,
            /\b(diagnostic|symptome|maladie)\b/i,
            /\b(tension|glycemie|cholesterol)\b/i,
            /\b\d+[,.]?\d*\s*(mg|ml|ui|mcg)\b/,
            /\b(arret de travail|arret maladie)\b/i
        ],
        weight: 1.5
    },

    // ═══════════════════════════════════════════════════════
    // FINANCE / BANQUE
    // ═══════════════════════════════════════════════════════

    finance: {
        name: "Finance / Banque",
        icon: "💰",
        category: "📋 Documents",
        description: "Releve bancaire, operations, virements, impots...",
        keywords: [
            "banque", "compte", "compte courant", "compte epargne",
            "releve", "releve bancaire", "releve de compte",
            "operation", "transaction", "mouvement",
            "virement", "prelevement", "ordre de virement",
            "CB", "carte bancaire", "carte bleue", "credit", "debit",
            "solde", "encours", "decouvert", "agios",
            "taux", "interet", "usure", "rendement",
            "impot", "impots", "declaration", "revenu", "revenu imposable",
            "fiscal", "fiscalite", "TVA", "cotisation",
            "bulletin de salaire", "fiche de paie", "remuneration",
            "salaire net", "salaire brut", "prime", "indemnite",
            "loyer", "charge", "caution", "depot de garantie",
            "credit immobilier", "pret", "emprunt", "mensualite",
            "assurance vie", "placement", "placement", "epargne",
            "bourse", "action", "obligation", "portefeuille",
            "IBAN", "BIC", "SWIFT", "RIB", "IBAN",
            "debit", "credit", "paiement", "reglement",
            "cheque", "especes", "liquide", "monnaie"
        ],
        patterns: [
            /\b(banque|compte|releve)\b/i,
            /\b(virement|prelevement|operation)\b/i,
            /\b(credit|debit|solde)\b/i,
            /\b(impot|fiscal|declaration)\b/i,
            /\b(salaire|remuneration|brut|net)\b/i,
            /\b(IBAN|BIC|SWIFT|RIB)\b/i,
            /\d+[,\.]\d{2}\s*€?/,
            /\b[A-Z]{2}\d{2}\s*\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\s*\d{0,3}\b/ // IBAN
        ],
        weight: 1.5
    },

    // ═══════════════════════════════════════════════════════
    // TRAVAUX / EMPLOI
    // ═══════════════════════════════════════════════════════

    travail: {
        name: "Travail / Emploi",
        icon: "💼",
        category: "📋 Documents",
        description: "Contrat de travail, fiche de paie, offre d'emploi...",
        keywords: [
            "contrat de travail", "CDI", "CDD", "interim", "stage",
            "salaire", "remuneration", "prime", "indemnite",
            "conge", "conge paye", "conge maladie", "RTT",
            "horaires", "temps plein", "temps partiel", "forfait jours",
            "employeur", "employe", "salarié", "collègue",
            "entreprise", "societe", "societe anonyme", "SARL", "SAS",
            "direction", "service", "departement", "equipe",
            "poste", "emploi", "metier", "profession", "activite",
            "recrutement", "embauche", "entretien", "candidature",
            "demission", "licenciement", "rupture conventionnelle",
            "retraite", "depart a la retraite",
            "mutuelle", "protection sociale", "retraite complementaire",
            "bulletin de salaire", "fiche de paie", "bulletin de paie",
            "net a payer", "brut", "net", "charges",
            "paie", "paiement", "virement bancaire",
            "convention collective", "accord d'entreprise",
            "formation professionnelle", "formation",
            "evaluation", "entretien annuel", "objectif",
            "transport", "indemnite de transport", "titres restaurant"
        ],
        patterns: [
            /\b(CDI|CDD|interim)\b/,
            /\b(salaire|remuneration|brut|net)\b/i,
            /\b(conge|RTT|conge paye)\b/i,
            /\b(contrat de travail|employeur|employe)\b/i,
            /\b(entreprise|societe|SARL|SAS)\b/i,
            /\b(bulletin de salaire|fiche de paie)\b/i,
            /\b(demission|licenciement)\b/i
        ],
        weight: 1.5
    },

    // ═══════════════════════════════════════════════════════
    // IMMOBILIER
    // ═══════════════════════════════════════════════════════

    immobilier: {
        name: "Immobilier",
        icon: "🏠",
        category: "📋 Documents",
        description: "Contrat de bail, acte de vente, bien immobilier...",
        keywords: [
            "immobilier", "bien", "propriete", "proprietaire",
            "bail", "contrat de bail", "bail commercial", "bail d'habitation",
            "loyer", "charge", "caution", "depot de garantie",
            "locataire", "bailleur", "proprietaire",
            "appartement", "maison", "villa", "studio", "loft",
            "surface", "m²", "metre carre", "etage", "pièce", "piece",
            "chambre", "salon", "cuisine", "salle de bain", "sdb",
            "cave", "garage", "parking", "balcon", "terrasse",
            "visite", "visite virtuelle", "plan",
            "agent immobilier", "agence", "transaction",
            "acte de vente", "compromis de vente", "promesse de vente",
            "notaire", "etude notariale",
            "hypothèque", "pret immobilier", "credit immobilier",
            "mensualite", "duree", "taux",
            "diagnostic", "diagnostic immobilier", "DPE", "diagnostic de performance energetique",
            "etats des lieux", "etat des lieux d'entree", "etat des lieux de sortie",
            "quittance", "quittance de loyer",
            "travaux", "renovation", "reparation", "entretien",
            "syndic", "copropriete", "assemblee generale",
            "taxe fonciere", "taxe d'habitation"
        ],
        patterns: [
            /\b(immobilier|bail|loyer|propriete)\b/i,
            /\b(locataire|bailleur|proprietaire)\b/i,
            /\b(appartement|maison|villa|studio)\b/i,
            /\b(surface|m²|etage|piece)\b/i,
            /\b(diagnostic|DPE|etat des lieux)\b/i,
            /\b(notaire|acte de vente|compromis)\b/i,
            /\b(pret immobilier|credit immobilier)\b/i,
            /\b(\d+)\s*m²/
        ],
        weight: 1.4
    },

    // ═══════════════════════════════════════════════════════
    // RECETTES / CUISINE
    // ═══════════════════════════════════════════════════════

    cuisine: {
        name: "Recettes / Cuisine",
        icon: "🍳",
        category: "📋 Documents",
        description: "Recettes de cuisine, ingredients, preparation...",
        keywords: [
            "recette", "cuisine", "cuisson", "preparation", "temps",
            "ingrédient", "ingrediant", "ingrédients", "composition",
            "farine", "sucre", "beurre", "oeuf", "oeufs", "lait",
            "creme", "chocolat", "vanille", "cacao",
            "sel", "poivre", "huile", "vinaigre",
            "ail", "oignon", "tomate", "persil", "basilic",
            "poulet", "boeuf", "porc", "poisson", "crevette",
            "riz", "pates", "pâtes", "legume", "légume",
            "salade", "soupe", "dessert", "gateau", "gâteau",
            "tarte", "quiche", "pizza", "sandwich",
            "four", "micro-ondes", "casserole", "poêle", "poile",
            "fourchette", "couteau", "cuillere", "bol", "verre",
            "ml", "cl", "L", "g", "kg", "c.s.", "c.a.", "pincee",
            "minutes", "min", "heures", "h",
            "four a 180", "thermostat", "temperature",
            "melanger", "fouetter", "coupeler", "trancher", "hacher",
            "frire", "griller", "bouillir", "mitonner", " mijoter"
        ],
        patterns: [
            /\b(recette|cuisine|preparation|cuisson)\b/i,
            /\b(\d+)\s*(g|kg|ml|cl|L)\b/,
            /\b(minutes?|heures?|min|h)\b/,
            /\b(four|casserole|poêle|bol|verre)\b/i,
            /\b(farine|sucre|beurre|oeuf|lait|creme|chocolat)\b/i,
            /\b(poulet|boeuf|porc|poisson|riz|pates)\b/i,
            /\b(melanger|fouetter|trancher|hacher|frire|griller)\b/i
        ],
        weight: 1.3
    },

    // ═══════════════════════════════════════════════════════
    // SPORTS / MATCH
    // ═══════════════════════════════════════════════════════

    match: {
        name: "Sport / Match / Competition",
        icon: "🏆",
        category: "📋 Documents",
        description: "Resultats de matchs, classements, competition sportive...",
        keywords: [
            "match", "score", "resultat", "victoire", "defaite", "match nul",
            "equipe", "joueur", "joueuse", "selection",
            "championnat", "ligue", "coupe", "tournoi", "competition",
            "but", "point", "panier", "essaie", "touche",
            "arbitre", "arbitre principal", "assistant",
            "terrain", "stade", "gymnase", "piscine",
            "mi-temps", "temps additionnel", "prolongation", "tirs au but",
            "buteur", "auteur du but", "passeur",
            "carton", "carton jaune", "carton rouge", "avertissement",
            "faute", "penalty", "coup franc", "tir", "tir penalty",
            "corner", "touche", "hors-jeu",
            "classement", "rang", "point", "victoire", "nul", "defaite",
            "saison", "journée", "match aller", "match retour",
            "finale", "demi-finale", "quart de finale", "huitieme",
            "champion", "trophy", "medaille", "podium",
            "football", "basketball", "rugby", "handball", "volleyball",
            "tennis", "badminton", "escalade", "athletisme",
            "olympique", "jeux olympiques", "JO"
        ],
        patterns: [
            /\b(match|score|resultat)\b/i,
            /\b(equipe|joueur|arbitre)\b/i,
            /\b\d+\s*[-:]\s*\d+/, // Score like 2-1, 3:0
            /\b(but|point|panier|essaie)\b/i,
            /\b(championnat|ligue|coupe|tournoi)\b/i,
            /\b(carton|faute|penalty|corner)\b/i,
            /\b(classement|rang|saison|journée)\b/i
        ],
        weight: 1.4
    },

    // ═══════════════════════════════════════════════════════
    // MUSIQUE
    // ═══════════════════════════════════════════════════════

    musique: {
        name: "Musique",
        icon: "🎵",
        category: "📋 Documents",
        description: "Partition, musique, artiste, chanson...",
        keywords: [
            "musique", "chanson", "artiste", "chanteur", "chanteuse",
            "groupe", "bande", "orchestre", "ensemble",
            "note", "partition", "portee", "clcle", "cle de sol",
            "tempo", "rythme", "mesure", "temps", "battement",
            "melodie", "harmonie", "accord", "accords", "accorder",
            "guitare", "piano", "violon", "batterie", "basse", "flute",
            "saxophone", "trompette", "clarinette", "harmonica",
            "concert", "recital", "spectacle", "festival",
            "album", "disque", "CD", "vinyle", "single",
            "ecouter", "entendre", "jouer", "chanter", "composer",
            "genre", "rock", "pop", "jazz", "classique", "rap", "electro",
            "parole", "paroles", "texte", "refrain", "couplet",
            "studio", "enregistrement", "production",
            "radio", "television", "clip", "video musicale",
            "gagnant", "vainqueur", "succes", "hit", "top 50", "top 100",
            "grammy", "victoire de la musique", "nolwenn", "helene"
        ],
        patterns: [
            /\b(musique|chanson|artiste|concert)\b/i,
            /\b(note|partition|tempo|rythme)\b/i,
            /\b(guitare|piano|violon|batterie)\b/i,
            /\b(album|disque|CD|vinyle)\b/i,
            /\b(rock|pop|jazz|rap|electro|classique)\b/i
        ],
        weight: 1.2
    },

    // ═══════════════════════════════════════════════════════
    // JEUX VIDEO
    // ═══════════════════════════════════════════════════════

    jeuxvideo: {
        name: "Jeux Video",
        icon: "🎮",
        category: "📋 Documents",
        description: "Jeux video, gaming, esports...",
        keywords: [
            "jeu", "jeux", "gaming", "joueur", "joueuse",
            "console", "playstation", "xbox", "nintendo", "switch", "PC",
            "manette", "clavier", "souris", "ecran", "télévision", "television",
            "niveau", "level", "difficulte", "mode", "campagne", "histoire",
            "multiplayer", "multi", "online", "en ligne", "solo",
            "personnage", "hero", "heros", "villain", "boss",
            "arme", "epée", "epee", "fusil", "arc", "bouclier",
            "score", "points", "vie", "sante", "mana", "energie",
            "inventaire", "装备", "objet", "item", "loot",
            "quête", "quete", "mission", "objectif", "defi",
            "RPG", "FPS", "MMO", "MOBA", "battle royale",
            "Minecraft", "Fortnite", "Roblox", "GTA", "Call of Duty",
            "FIFA", "League of Legends", "Valorant", "Overwatch",
            "stream", "streaming", "twitch", "youtube",
            "esport", "competition", "tournoi", "championnat",
            "skin", "cosmetique", "battle pass",
            "telecharger", "installer", "mise a jour", "patch",
            "serveur", "latence", "ping", "FPS"
        ],
        patterns: [
            /\b(jeu|jeux|gaming|joueur)\b/i,
            /\b(console|playstation|xbox|nintendo|switch)\b/i,
            /\b(multiplayer|multi|online|solo)\b/i,
            /\b(niveau|level|score|points)\b/i,
            /\b(RPG|FPS|MMO|MOBA)\b/,
            /\b(Minecraft|Fortnite|Roblox|GTA|FIFA|Valorant)\b/i,
            /\b(stream|twitch|youtube|esport)\b/i
        ],
        weight: 1.3
    },

    italien: {
        name: "Italien",
        icon: "🇮🇹",
        category: "📚 Scolaire",
        description: "Grammaire, vocabulaire, conjugaison italien...",
        keywords: ["il", "la", "lo", "gli", "le", "un", "una", "io", "tu", "lui", "lei", "noi", "voi", "loro", "essere", "avere", "fare", "andare", "potere", "volere", "dovere", "parlare", "mangiare", "vivere", "scrivere", "leggere", "buono", "cattivo", "grande", "piccolo", "bello", "brutto", "scuola", "professore", "studente", "esame", "compito", "casa", "acqua", "pane", "vino", "mamma", "papà"],
        patterns: [/\b(il|la|lo|gli|le)\s+\w+/i, /\b(essere|avere|fare)\s+\w+/i, /\w+(are|ere|ire)\b/],
        weight: 0.9
    },

    portugais: {
        name: "Portugais",
        icon: "🇵🇹",
        category: "📚 Scolaire",
        description: "Grammaire, vocabulaire portugais...",
        keywords: ["o", "a", "os", "as", "um", "uma", "eu", "tu", "ele", "ela", "nos", "vos", "eles", "elas", "ser", "estar", "ter", "fazer", "ir", "poder", "querer", "saber", "falar", "comer", "viver", "escrever", "ler", "bom", "mau", "grande", "pequeno", "bonito", "feio", "escola", "professor", "aluno", "exame", "casa", "agua", "pao", "vinho"],
        patterns: [/\b(o|a|os|as)\s+\w+/i, /\b(ser|estar|ter)\s+\w+/i, /\w+(ar|er|ir)\b/],
        weight: 0.9
    },

    chinois: {
        name: "Chinois",
        icon: "🇨🇳",
        category: "📚 Scolaire",
        description: "Langue chinoise, mandarin...",
        keywords: ["de", "shi", "wo", "ni", "ta", "women", "nimen", "tamen", "zhongguo", "xuexiao", "laoshi", "xuesheng", "jia", "shui", "chi", "he", "kan", "ting", "shuo", "xie", "du", "hao", "huai", "da", "xiao", "xin", "jiu", "ren", "tian", "ri", "yue", "nian", "qing", "wen"],
        patterns: [/[\u4e00-\u9fff]/, /\b(zhongguo|xuexiao|laoshi)\b/i],
        weight: 0.8
    },

    japonais: {
        name: "Japonais",
        icon: "🇯🇵",
        category: "📚 Scolaire",
        description: "Langue japonaise...",
        keywords: ["watashi", "anata", "kare", "kanojo", "sensei", "gakusei", "ie", "mizu", "gohan", "sakana", "takusan", "sukoshi", "hai", "iie", "arigatou", "sumimasen", "ohayou", "konnichiwa", "oyasumi", "desu", "masu", "kudasai", "onegaishimasu", "shigoto", "benkyou", "tokyo", "nihon", "nihongo"],
        patterns: [/(desu|masu)\b/, /\b(kudasai|onegaishimasu)\b/i, /[\u3040-\u309f\u30a0-\u30ff]/],
        weight: 0.8
    },

    coreen: {
        name: "Coréen",
        icon: "🇰🇷",
        category: "📚 Scolaire",
        description: "Langue coréenne...",
        keywords: ["annyeong", "kamsahamnida", "yes", "anio", "joesonghamnida", "hanguk", "hangugeo", "hakgyo", "seonsaengnim", "haksaeng", "jib", "mulsu", "bap", "gogi", "chingu", "gongbu", "saram", "yeoja", "namja", "eoneu", "ireoke", "jeoheyo", "mollayo"],
        patterns: [/[\uac00-\ud7af]/, /\b(annyeong|kamsahamnida)\b/i],
        weight: 0.8
    },

    arabe: {
        name: "Arabe",
        icon: "🇸🇦",
        category: "📚 Scolaire",
        description: "Langue arabe...",
        keywords: ["ana", "anta", "anti", "huwa", "hiya", "nahnu", "antum", "hum", "kitaab", "madrasa", "ustadh", "talib", "bayt", "maa", "aqlam", "qalam", "salaam", "marhaba", "shukran", "afwan", "naam", "laa", "kabir", "saghir", "jadeed", "qadim"],
        patterns: [/[\u0600-\u06ff]/, /\b(salaam|marhaba|shukran)\b/i],
        weight: 0.8
    },

    russe: {
        name: "Russe",
        icon: "🇷🇺",
        category: "📚 Scolaire",
        description: "Langue russe...",
        keywords: ["ya", "ty", "on", "ona", "my", "vy", "oni", "byt", "imet", "delat", "idti", "moch", "xotet", "dolzhen", "govorit", "est", "pit", "zhit", "pisat", "chitat", "xороший", "плохой", "большой", "маленький", "школа", "учитель", "ученик", "экзамен", "дом", "вода", "хлеб"],
        patterns: [/[\u0400-\u04ff]/, /\b(xoroshiy|plokhoy|bolshoy)\b/i],
        weight: 0.8
    },

    turc: {
        name: "Turc",
        icon: "🇹🇷",
        category: "📚 Scolaire",
        description: "Langue turque...",
        keywords: ["ben", "sen", "biz", "siz", "onlar", "olmak", "etmek", "yapmak", "gitmek", "gelmek", "yemek", "icmek", "konuşmak", "yazmak", "okumak", "iyi", "kötü", "büyük", "küçük", "okul", "öğretmen", "öğrenci", "sınav", "ev", "su", "ekmek", "şey"],
        patterns: [/\b(ben|sen|biz|siz|onlar)\s+\w+/i, /\w+(mak|mek)\b/],
        weight: 0.8
    },

    // ═══════════════════════════════════════════════════════
    // MATHEMATIQUES AVANCEES
    // ═══════════════════════════════════════════════════════

    mathsAvancees: {
        name: "Maths Avancees",
        icon: "📐",
        category: "📚 Scolaire",
        description: "Algebre lineaire, analyse complexe, topologie...",
        keywords: ["espace vectoriel", "base", "dimension", "sous-espace", "application lineaire", "endomorphisme", "automorphisme", "eigenvalue", "valeur propre", "vecteur propre", "diagonalisation", "triangularisation", "Jordan", "forme normale", "produit scalaire", "produit vectoriel", "norme", "distance", "orthogonalite", "projection", "complement orthogonal", "theoreme de Rank", "rang", "noyau", "image", "theoreme du rang", "integration", "primitive", "theoreme fondamental", "integration par parties", "changement de variable", "serie", "convergence", "divergence", "critere", "majorante", "weierstrass", "Dirichlet", "Abel", "serie de Taylor", "developpement", "polynome de Taylor", "formule de Maclaurin", "analyse complexe", "nombre complexe", "module", "argument", "partie reelle", "partie imaginaire", "representation polaire", "formule d'Euler", "theoreme des residus", "resolution", "equation differentielle", "equation aux derives partielles", "EDP", "ODE", "condition initiale", "theoreme de Cauchy", "Lipschitz", "Picard", "Lindelof"],
        patterns: [/espace\s+vectoriel/i, /valeur\s+propre/i, /produit\s+scalaire/i, /theoreme/i, /\b(rang|noyau|image)\b/i, /equation\s+diff/i, /formule\s+de\s+Taylor/i, /serie\s+de\s+Taylor/i],
        weight: 1.4
    },

    statsProba: {
        name: "Statistiques & Probabilites",
        icon: "📈",
        category: "📚 Scolaire",
        description: "Lois de probabilité, tests, regressions...",
        keywords: ["loi binomiale", "loi de Poisson", "loi normale", "loi exponentielle", "loi uniforme", "loi geometrique", "loi hypergeometrique", "densite", "repartition", "esperance", "variance", "ecart-type", "coefficient de variation", "moment", "skewness", "kurtosis", "correlation", "covariance", "regression lineaire", "regression multiple", "moindres carres", "AIC", "BIC", "test d'hypothese", "H0", "H1", "risque", "p-value", "seuil", "zone de rejet", "intervalle de confiance", "erreur type", "test de Fisher", "test du Chi2", "test de Student", "ANCOVA", "ANOVA", "analyse de variance", "variance inter", "variance intra", "echantillonnage", "population", "echantillon", "estimation", "estimateur", "maximum de vraisemblance", "methodes des moments", "simulat", "simulation", "MCMC", "Markov", "chaîne de Markov", "Monte Carlo", "bootstrapping", "Bayes", "theoreme de Bayes", "probabilité conditionnelle"],
        patterns: [/\b(loi\s+\w+|densite|repartition)\b/i, /\b(esperance|variance|ecart)\b/i, /\b(test\s+\w+|hypothese|p-value)\b/i, /\b(regression|correlation|covariance)\b/i, /\b(ANOVA|ANCOVA|Chi2|Fisher|Student)\b/i, /\b(MCMC|Markov|Monte\s+Carlo|Bayes)\b/i],
        weight: 1.3
    },

    // ═══════════════════════════════════════════════════════
    // PHYSIQUE / CHIMIE AVANCEE
    // ═══════════════════════════════════════════════════════

    physique: {
        name: "Physique",
        icon: "⚛️",
        category: "📚 Scolaire",
        description: "Mecanique, optique, electricite, thermodynamique...",
        keywords: ["mecanique", "cinematique", "dynamique", "vitesse", "acceleration", "force", "poids", "masse", "inertie", "Newton", "frottement", "ressort", "Hooke", "oscillat", "pendule", "periodicite", "frequence", "pulsation", "amplitude", "energie cinetique", "energie potentielle", "travail", "puissance", "conservation", "collision", "impulsion", "quantite de mouvement", "tore", "couple", "rotation", "moment d'inertie", "optique", "rayon", "lumiere", "reflection", "refraction", "Snell", "lentille", "miroir", "focal", "image", "dispersion", "spectre", "interference", "diffraction", "electricite", "charge", "tension", "intensite", "resistance", "Ohm", "Kirchhoff", "condensateur", "bobine", "alternatif", "Courant continu", "electromagnetisme", "Faraday", "Lorentz", "induction", "champ magnetique", "champ electrique", "thermodynamique", "temperature", "pression", "volume", "gaz parfait", "ideal", "entropie", "enthalpie", "transfert", "convection", "conduction", "rayonnement", "nucleaire", "fission", "fusion", "radioactivite", "atome", "electron", "proton", "neutron", "noyau", "orbite", "niveau d'energie", "quantique", "Planck", "Einstein", "relativite", "spacetime", "gravitation", "trou noir", "vitesse de la lumiere", "c"],
        patterns: [/\b(Newton|Ohm|Faraday|Einstein|Planck)\b/i, /\b(force|acceleration|vitesse|masse)\b/i, /\b(energie|travail|puissance)\b/i, /\b(charge|tension|intensite|resistance)\b/i, /\b(optique|lumiere|rayon)\b/i, /\b(thermodynamique|temperature|pression)\b/i, /\b(quantique|relativite|gravitation)\b/i, /\b\d+\s*(m\/s|m\/s2|N|J|W|V|A|Ω|Pa|atm)\b/],
        weight: 1.3
    },

    chimie: {
        name: "Chimie",
        icon: "🧪",
        category: "📚 Scolaire",
        description: "Chimie generale, organique, minerale...",
        keywords: ["chimie", "chimique", "element", "atome", "molecule", "ion", "cation", "anion", "electron", "proton", "neutron", "orbitale", "liaison covalente", "liaison ionique", "liaison metallique", "double liaison", "triple liaison", "hybride", "stereo", "chiralite", "enantiomere", "diastereoisomere", "isomerie", "structure", "formule", "formule brute", "formule semi-developpee", "formule developpee", "represente de Lewis", "tableau periodique", "groupes", "periodes", "metalloides", "metaux", "non-metaux", "alcalins", "alcalino-terreux", "halogenes", "gaz rares", "transition", "oxydation", "reduction", "oxydo-reduction", "REDOX", "oxydant", "reducteur", "oxidant", "number", "electron", "acide", "base", "pH", "pOH", "indicateur", "neutralisation", "sel", "dissolution", "solubilite", "concentration", "molarite", "molalite", "normalite", "dilution", "dosage", "titrage", "retro", "volumetrie", "gravimetrie", "cinetique", "vitesse de reaction", "ordre", "constante", "energie d'activation", "catalyse", "catalyseur", "equilibre", "Le Chatelier", "constante d'equilibre", "chimie organique", "hydrocarbure", "alcane", "alcene", "alcyne", "alcool", "aldehyde", "cetone", "acide carboxylique", "ester", "ether", "amine", "amide", "nitrile", "halogenures", "phenol", "aromatique", "benzene", "toluene", "polymerisation", "monomere", "polymere", "addition", "condensation", "chimie industrielle", "fabrication", "processus", "catalyseur"],
        patterns: [/\b(acide|base|pH|pOH)\b/i, /\b(H2O|CO2|NaCl|O2|N2|CH4|C6H12O6|H2SO4|HCl|NaOH|CaCO3)\b/i, /\b(element|molecule|atome|ion)\b/i, /\b(oxydation|reduction|REDOX)\b/i, /\b(alcane|alcene|alcyne|alcool|aldehyde|cetone)\b/i, /\b(liaison|orbitale|hybride)\b/i, /\b(equilibre|cinetique|vitesse)\b/i],
        weight: 1.3
    },

    // ═══════════════════════════════════════════════════════
    // BIOLOGIE
    // ═══════════════════════════════════════════════════════

    biologie: {
        name: "Biologie",
        icon: "🧬",
        category: "📚 Scolaire",
        description: "Biologie cellulaire, genetique, evolution, ecologie...",
        keywords: ["biologie", "cellule", "membrane", "noyau", "cytoplasme", "organite", "mitochondrie", "ribosome", "reticulum endoplasmique", "appareil de Golgi", "lysosome", "vacuole", "chloroplaste", "paroi", "ADN", "ARN", "gene", "chromosome", "chromatine", "mitose", "meiose", "cytokinese", "replication", "transcription", "traduction", "ARNm", "ARNt", "ARNr", "ribonucleique", "deoxyribonucleique", "code genetique", "genotype", "phenotype", "allele", "locus", "homozygote", "heterozygote", "dominant", "recessif", "Mendel", "genetique", "heredite", "mutation", "deletion", "insertion", "translocation", "trisomie", "monosomie", "evolution", "Darwin", "selection naturelle", "adaptation", "speciation", "biodeiversite", "fossile", "ancetre commun", "clade", "phylogenie", "taxonomie", "kingdom", "regne", "phylum", "classe", "ordre", "famille", "genre", "espece", "bacterie", "virus", "champignon", "plante", "animal", "protiste", "archee", "prokaryote", "eucaryote", "ecosysteme", "biome", "biocenose", "biotope", "chaine alimentaire", "reseau trophique", "producteur", "consommateur", "decomposeur", "cycle biogeochimique", "cycle du carbone", "cycle de l'eau", "cycle de l'azote", "photosynthese", "respiration cellulaire", "glycolyse", "cycle de Krebs", "chaine de transport", "ATP", "ADP", "fermentation", "aerobie", "anaerobie"],
        patterns: [/\b(cellule|ADN|ARN|gene|chromosome)\b/i, /\b(mitose|meiose|replication|transcription|traduction)\b/i, /\b(Darwin|evolution|mutation)\b/i, /\b(ecosysteme|biome|biodiversite)\b/i, /\b(bacterie|virus|champignon|plante|animal)\b/i, /\b(ATP|ADP|photosynthese|respiration)\b/i, /\b(prokaryote|eucaryote)\b/i],
        weight: 1.3
    },

    // ═══════════════════════════════════════════════════════
    // GEOGRAPHIE
    // ═══════════════════════════════════════════════════════

    geographie: {
        name: "Geographie",
        icon: "🗺️",
        category: "📚 Scolaire",
        description: "Geographie physique, humaine, economique...",
        keywords: ["geographie", "latitude", "longitude", "equateur", "tropique", "meridien", "parallele", "fuseau horaire", "temps universel", "UTM", "relief", "montagne", "plaine", "plateau", "vallée", "colline", "depression", "volcan", "seisme", "tectonique", "plaque", "convergent", "divergent", "transformant", "subduction", "rift", "orogenèse", "climat", "temperature", "precipitation", "humidite", "vent", "isotherme", "isobare", "anticyclone", "depression", "front", "temperate", "tropical", "polaire", "mediterraneen", "oceanique", "continental", "hydrographie", "fleuve", "riviere", "lac", "source", "embouchure", "bassin versant", "eau", "mer", "ocean", "Atlantique", "Pacifique", "Indien", "Arctique", "Antarctique", "Manche", "Mediterranee", "Baltique", "Noire", "Caspienne", "population", "demographie", "natalite", "mortalite", "mobilite", "exode rural", "urbanisation", "metropole", "ville", "banlieue", "quartier", "economie", "PIB", "PIB/hab", "PIB par habitant", "developpement", "PMD", "PMA", "IDH", "indicateur de developpement humain", "commerce", "exportation", "importation", "balance commerciale", "monde", "continent", "Afrique", "Amerique", "Asie", "Europe", "Oceanie", "UNION EUROPEENNE", "UE", "ONU", "OTAN", "OPEP", "OMC"],
        patterns: [/\b(latitude|longitude|equateur)\b/i, /\b(climat|temperature|precipitation)\b/i, /\b(fleuve|riviere|lac|ocean|mer)\b/i, /\b(population|demographie|urbanisation)\b/i, /\b(PIB|IDH|developpement)\b/i, /\b(UNION EUROPEENNE|ONU|OTAN)\b/i, /\b\d+[°]\s*[NSEO]\b/],
        weight: 1.2
    },
    recu: {
        name: "Recu / Ticket de caisse",
        icon: "🧾",
        category: "📋 Documents",
        description: "Recu, ticket de caisse, preuve d'achat...",
        keywords: ["recu", "ticket", "ticket de caisse", "preuve d'achat", "bon d'achat", "caisse", "montant", "total", "sous-total", "TVA", "TTC", "HT", "euro", "EUR", "especes", "carte bancaire", "CB", "paiement", "reglement", "monnaie", "rendu", "remboursement", "avoir", "bon de reduction", "code promo", "fidelite", "magasin", "supermarche", "carrefour", "leclerc", "auchan", "intermarche", "casino", "monoprix", "lidl", "aldi", "boulangerie", "pharmacie", "pressing", "garage", "station", "essence", "peage", "autopiste", "parking"],
        patterns: [/\b(recu|ticket|ticket de caisse)\b/i, /\b(montant|total|TVA)\b/i, /\d+[,\.]\d{2}\s*EUR?/, /\b(magasin|supermarche)\b/i, /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}/],
        weight: 1.5
    },

    quittance: {
        name: "Quittance de loyer",
        icon: "🏠",
        category: "📋 Documents",
        description: "Quittance de loyer, attestation de paiement...",
        keywords: ["quittance", "quittance de loyer", "loyer", "bail", "locataire", "bailleur", "proprietaire", "logement", "appartement", "maison", "habitation", "paiement", "reglement", "virement", "cheque", "especes", "montant", "periode", "mois", "charges", "eau froide", "eau chaude", "chauffage", "depot de garantie", "caution", "etat des lieux", "adresse", "code postal", "ville"],
        patterns: [/\b(quittance|quittance de loyer)\b/i, /\b(loyer|bail|locataire|bailleur)\b/i, /\d+[,\.]\d{2}\s*EUR?/, /\b(logement|appartement|maison)\b/i],
        weight: 1.5
    },

    contravention: {
        name: "Contravention / PV",
        icon: "🚨",
        category: "📋 Documents",
        description: "Contravention, proces-verbal, amende...",
        keywords: ["contravention", "proces-verbal", "PV", "amende", "infraction", "radar", "vitesse", "exces de vitesse", "stationnement", "feu rouge", "telephone au volant", "ceinture", "alcool", "controle", "police", "gendarmerie", "policier", "gendarme", "verbalisation", "notifier", "delai", "recours", "reclamation", "opposition", "tribunal", "justice", "juge", "constat", "classe 1", "classe 2", "classe 3", "classe 4", "classe 5", "points", "retrait", "permis", "suspension"],
        patterns: [/\b(contravention|proces-verbal|PV)\b/i, /\b(amende|infraction|radar)\b/i, /\b(police|gendarmerie|verbalisation)\b/i, /\b\d+\s*EUR/, /\b\d+\s*points?\b/i],
        weight: 1.5
    },

    convocation: {
        name: "Convocation / Citation",
        icon: "📬",
        category: "📋 Documents",
        description: "Convocation, citation, ordre de comparution...",
        keywords: ["convocation", "citation", "comparaitre", "comparution", "justice", "tribunal", "juge", "procureur", "audience", "audition", "temoin", "victime", "plainte", "garde a vue", "GAV", "interrogatoire", "mis en examen", "suspect", "prevenu", "accuse", "avocat", "defense", "parquet", "TGI", "tribunal correctionnel", "cassation", "appel", "droits de la defense"],
        patterns: [/\b(convocation|citation|comparaitre)\b/i, /\b(tribunal|juge|justice|audience)\b/i, /\b(plainte|garde a vue|GAV)\b/i, /\b(avocat|defense|parquet)\b/i],
        weight: 1.4
    },

    informatique: {
        name: "Informatique / Tech",
        icon: "💻",
        category: "💼 Pro",
        description: "Programmation, reseaux, systemes, IA...",
        keywords: ["informatique", "ordinateur", "logiciel", "materiel", "hardware", "software", "reseau", "internet", "serveur", "client", "cloud", "base de donnees", "SQL", "NoSQL", "API", "REST", "GraphQL", "web", "frontend", "backend", "DevOps", "CI/CD", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "machine learning", "deep learning", "IA", "intelligence artificielle", "neurone", "NLP", "blockchain", "crypto", "Bitcoin", "Ethereum", "cybersecurite", "hacker", "firewall", "cryptographie", "algorithme", "Python", "Java", "JavaScript", "TypeScript", "Rust", "Go", "Swift", "Kotlin", "PHP", "C", "C++", "React", "Angular", "Vue", "Node", "Django", "Git", "GitHub", "Linux", "Windows", "macOS", "bash", "shell", "terminal", "script", "pipeline", "microservice", "MVC", "ORM", "CRUD", "agile", "scrum", "kanban", "sprint", "test", "debug"],
        patterns: [/\b(SQL|NoSQL|REST|GraphQL|API|DevOps)\b/, /\b(Python|Java|JavaScript|TypeScript|C\+\+|Rust|Go|Swift|Kotlin|PHP)\b/i, /\b(Docker|Kubernetes|AWS|Azure|GCP)\b/, /\b(machine learning|deep learning|IA)\b/, /\b(Git|GitHub|Linux)\b/, /\b(React|Angular|Vue|Node|Django)\b/i, /\b(def|class|import|for|while|if|else|return|print)\b/],
        weight: 1.4
    },

    medecine: {
        name: "Medecine",
        icon: "⚕️",
        category: "💼 Pro",
        description: "Pratique medicale, specialites, diagnostics...",
        keywords: ["medecin", "chirurgien", "cardiologue", "neurologue", "dermatologue", "ophtalmologue", "ORL", "pediatre", "gynecologue", "orthopediste", "radiologue", "anesthesiste", "psychiatre", "psychologue", "infirmier", "infirmiere", "aide-soignant", "pharmacien", "labo", "hospitalisation", "ambulatoire", "cabinet medical", "consultation", "examen clinique", "auscultation", "palpation", "percussion", "ophthalmoscopie", "otoscopie", "endoscopie", "echographie", "IRM", "scanner", "radiographie", "mammographie", "echocardiographie", "electrocardiogramme", "EEG", "EMG", "biopsie", "anatomopathologie", "cytologie", "histologie", "hematologie", "biochimie", "bacteriologie", "virologie", "parasitologie", "serologie", "immunologie", "allergologie", "endocrinologie", "diabetologie", "gastro-enterologie", "pneumologie", "nephrologie", "rhumatologie", "oncologie", "hematologie", "geriatrie", "gerontologie", "reanimation", "soins palliatifs", "urgences", "SAMU", "SMUR"],
        patterns: [/\b(medecin|chirurgien|specialiste)\b/i, /\bIRM|scanner|echographie|radio/i, /\b(cardiolog|neurolog|dermatolog|ophtalmolog)/i, /\b(prescription|ordonnance|diagnostic)\b/i],
        weight: 1.3
    },

    droit: {
        name: "Droit / Juridique",
        icon: "⚖️",
        category: "💼 Pro",
        description: "Droit civil, penal, commercial, administratif...",
        keywords: ["droit", "juridique", "loi", "article", "code civil", "code penal", "code de commerce", "tribunal", "juge", "avocat", "procureur", "magistrat", "greffier", "huissier", "notaire", "arbitre", "mediateur", "conciliation", "contentieux", "litige", "procedure", "instance", "appel", "cassation", "revision", "prescription", "delai", "forclusion", "nullite", "annulation", "resiliation", "resolution", "dommages-interets", "reparation", "indemnisation", "prejudice", "civil", "penal", "administratif", "commercial", "social", "travail", "fiscal", "administratif", "grace", "amnistie", "presomption", "innocence", "culpabilite", "circonstances attenuantes", "aggravantes", "legitime defense", "necessite", "etat de necessite", "force majeure", "cas fortuit", "theorie des risques"],
        patterns: [/\b(droit|loi|juridique|tribunal)\b/i, /\b(article|code civil|code penal)\b/i, /\b(avocat|juge|magistrat|notaire)\b/i, /\b(tribunal|cour|justice)\b/i, /\b(civil|penal|administratif|commercial)\b/i],
        weight: 1.3
    },
    comptabilite: {
        name: "Comptabilite",
        icon: "📊",
        category: "💼 Pro",
        description: "Comptabilite, gestion, bilan, comptes...",
        keywords: ["comptabilite", "comptable", "compte", "bilan", "resultat", "charge", "produit", "tresorerie", "actif", "passif", "capitaux propres", "dettes", "creances", "ecriture", "journal", "grand livre", "balance", "tier", "fournisseur", "client", "facture", "bon de commande", "regle", "rapprochement", "lettrage", "rapprochement bancaire", "TVA", "TVA collectee", "TVA deductible", "TVA a payer", "declaration", "liasse fiscale", "exercice", "cloture", "provisions", "amortissement", "depreciation", "valeur nette", "valeur comptable", "seuil", "seuil de rentabilite", "point mort", "marge", "marge brute", "marge nette", "ratio", "liquidite", "solvabilite", "rentabilite", "ROE", "ROA", "EBITDA", "chiffre d'affaires", "CA"],
        patterns: [/\b(comptabilite|comptable|bilan)\b/i, /\b(charge|produit|actif|passif)\b/i, /\b(TVA|declaration|exercice)\b/i, /\b(marge|ratio|rentabilite)\b/i, /\b(facture|reglement|lettrage)\b/i],
        weight: 1.3
    },

    marketing: {
        name: "Marketing / Communication",
        icon: "📢",
        category: "💼 Pro",
        description: "Marketing, publicite, communication, digital...",
        keywords: ["marketing", "publicite", "communication", "campagne", "strategie", "cible", "cible audience", "segmentation", "positionnement", "mix marketing", "produit", "prix", "place", "distribution", "promotion", "merchandising", "branding", "image de marque", "logo", "charte graphique", "identite visuelle", "storytelling", "contenu", "content marketing", "SEO", "SEA", "SMO", "SMM", "réseaux sociaux", "Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "YouTube", "blog", "newsletter", "email marketing", "campagne emailing", "CRM", "fidelisation", "prospection", "lead", "conversion", "KPI", "ROI", "ROAS", "CPC", "CPM", "CPA", "CTR", "taux de conversion", "funnel", "parcours client", "UX", "UI", "design", "landing page", "site web", "e-commerce", "analytics", "Google Analytics", "pixel", "retargeting", "remarketing"],
        patterns: [/\b(marketing|publicite|communication)\b/i, /\b(SEO|SEA|SMO|SMM|CRM)\b/, /\b(Facebook|Instagram|LinkedIn|TikTok|YouTube)\b/i, /\b(KPI|ROI|ROAS|CPC|CPM|CPA)\b/, /\b(campagne|strategie|cible)\b/i],
        weight: 1.3
    },

    rh: {
        name: "Ressources Humaines",
        icon: "👥",
        category: "💼 Pro",
        description: "GRH, gestion des personnel, recrutement...",
        keywords: ["RH", "ressources humaines", "GRH", "personnel", "employe", "salarie", "recrutement", "embauche", "entretien", "CV", "lettre de motivation", "recrutement", "processus", "onboarding", "integration", "formation", "plan de formation", "evaluation", "entretien annuel", "entretien professional", "GPEC", "management", "manageur", "manager", "encadrement", "coaching", "mentoring", "remuneration", "salaire", "primes", "avantages", "convention collective", "droit du travail", "contrat", "CDI", "CDD", "interim", "stage", "temps plein", "temps partiel", "horaires", "flexibilite", "teletravail", "smart working", "demission", "licenciement", "rupture conventionnelle", "preavis", "solde de tout compte", "certificat de travail", "retraite", "mutuelle", "complementaire", "protection sociale", "QVT", "qualite de vie au travail", "bien-etre", "stress", "harcelement", "discrimination", "egalite", "diversite"],
        patterns: [/\b(RH|ressources humaines|GRH)\b/i, /\b(recrutement|embauche|formation)\b/i, /\b(CDI|CDD|interim|stage)\b/i, /\b(salaire|remuneration|prime)\b/i, /\b(droit du travail|convention collective)\b/i, /\b(demission|licenciement|rupture)\b/i],
        weight: 1.3
    },

    commerce: {
        name: "Commerce / Vente",
        icon: "🛒",
        category: "💼 Pro",
        description: "Commerce, vente, negociation, distribution...",
        keywords: ["commerce", "vente", "negociation", "prospect", "client", "prospection", "deal", "affaire", "contrat commercial", "bon de commande", "livraison", "fournisseur", "stock", "inventaire", "logistique", "supply chain", "chain d'approvisionnement", "acheteur", "vendeur", "commercial", "representant", "business developper", "account manager", "key account", "GPA", "marchandisage", "rayon", "etagerne", "presentation", "PLV", "signalisation", "merchandising", "cross-selling", "up-selling", "panier moyen", "taux de conversion", "fidélisation", "carte de fidelite", "programme de fidelite", "grossiste", "distributeur", "wholesale", "retail", "B2B", "B2C", "e-commerce", "marketplace", "Amazon", "eBay", "Cdiscount"],
        patterns: [/\b(commerce|vente|negociation)\b/i, /\b(client|prospect|fournisseur)\b/i, /\b(commande|livraison|stock)\b/i, /\b(B2B|B2C|e-commerce)\b/i, /\b(wholesale|retail|grossiste)\b/i],
        weight: 1.3
    },
    immobilierPro: {
        name: "Immobilier Pro", icon: "🏢", category: "💼 Pro",
        description: "Transactions immobiliers, investissement...",
        keywords: ["immobilier","investissement","rendement","SCPI","OPCI","pinel","denormandie","locatif","gestion locative","syndic","copropriete","bail commercial","bail professionnel","droit au bail","pas-de-porte","travaux","permis de construire","DPE","amiante","plomb","diagnostic"],
        patterns: [/\b(immobilier|investissement|SCPI)\b/i, /\b(bail|loyer|copropriete|syndic)\b/i, /\b(DPE|amiante|plomb)\b/i],
        weight: 1.3
    },
    courses: {
        name: "Courses / Shopping", icon: "🛍️", category: "🏠 Quotidien",
        description: "Courses, achats, comparaison de prix...",
        keywords: ["courses","acheter","magasin","supermarche","hypermarche","centre commercial","boutique","marque","prix","promo","solde","reduction","garantie","SAV","paiement","caisse","caddie","panier"],
        patterns: [/\b(courses|acheter|magasin)\b/i, /\b(prix|promo|solde|reduction)\b/i, /\d+[,\.]\d{2}\s*EUR?/],
        weight: 1.2
    },
    alimentation: {
        name: "Alimentation / Nutrition", icon: "🥗", category: "🏠 Quotidien",
        description: "Alimentation saine, regimes, nutrition...",
        keywords: ["alimentation","nutrition","regime","calorie","glucide","lipide","proteine","fibre","vitamine","calcium","fer","sucre","sel","graisse","IMC","poids","diabete","hypertension","obesite","intolerance","lactose","gluten","allergie","vegan","vegetarien","bio","pesticide"],
        patterns: [/\b(alimentation|nutrition|regime|calorie)\b/i, /\b(IMC|poids|diabete)\b/i, /\b(vegan|vegetarien|bio)\b/i, /\b\d+\s*(kcal|cal|g|mg|ml)\b/],
        weight: 1.2
    },
    meteo: {
        name: "Meteo / Climat", icon: "🌤️", category: "🏠 Quotidien",
        description: "Previsions meteorologiques, climat...",
        keywords: ["meteo","meteorologie","previsions","climat","temperature","chaud","froid","pluie","neige","vent","orage","nuageux","nuage","ensoleille","brouillard","verglas","grele","tornade","cyclone","ouragan","typhon","canicule","gel","givre","Celsius","Fahrenheit","humidite","pression","anticyclone","depression","front"],
        patterns: [/\b(meteo|meteorologie|previsions|climat)\b/i, /\b(temperature|pluie|neige|vent|orage)\b/i, /\b\d+\s*[°C°F]/, /\b(chaud|froid|nuageux|ensoleille)\b/i],
        weight: 1.1
    },
    sante: {
        name: "Sante / Bien-etre", icon: "💚", category: "🏠 Quotidien",
        description: "Sante, bien-etre, yoga, medecine douce...",
        keywords: ["sante","bien-etre","yoga","meditation","relaxation","sport","exercice","marche","course","natation","velo","fitness","musculation","stretching","sommeil","repos","fatigue","stress","anxiete","depression","therapie","psychologue","psychiatre","medecin","pharmacie","medicament","traitement","homeopathie","phytotherapie","aromatherapie","acupuncture","osteopathie","naturopathie","reflexologie","massage","chakra","pleine conscience","respiration","detox","jeune"],
        patterns: [/\b(sante|bien-etre|yoga|meditation)\b/i, /\b(sommeil|stress|anxiete|depression)\b/i, /\b(medicament|traitement|pharmacie)\b/i, /\b(homeopathie|phytotherapie|aromatherapie)\b/i],
        weight: 1.2
    },
    voyage: {
        name: "Voyage / Tourisme", icon: "✈️", category: "🏠 Quotidien",
        description: "Voyages, tourisme, sejours, decouvertes...",
        keywords: ["voyage","tourisme","sejour","vacances","deplacement","destination","decouverte","avion","train","bus","bateau","croisiere","hotel","hostel","airbnb","camping","caravane","bagage","valise","passeport","visa","billet","reservation","booking","agence","guide","visite","excursion","randonnee","trekking","plage","montagne","foret","desert","monument","musee","temple","chateau","patrimoine","UNESCO","GPS","itineraire"],
        patterns: [/\b(voyage|tourisme|sejour|vacances)\b/i, /\b(avion|train|bus|hotel|camping)\b/i, /\b(passeport|visa|billet|reservation)\b/i, /\b(plage|montagne|foret|desert)\b/i],
        weight: 1.2
    },
    bricolage: {
        name: "Bricolage / DIY", icon: "🔧", category: "🏠 Quotidien",
        description: "Bricolage, travaux maison, outils...",
        keywords: ["bricolage","travaux","outillage","outil","perceuse","visseuse","tournevis","marteau","scie","poncage","peinture","carrelage","plomberie","electricite","maconnerie","menuiserie","soudure","mesure","niveau","vis","cheville","clou","quincaillerie","Leroy Merlin","Castorama","Brico Depot","tutoriel","DIY","manuel","notice","assemblage","montage","installation","reparation","jardinage","plante","fleur","arbre","tondeuse","arrosage","jardin","gazon","engrais"],
        patterns: [/\b(bricolage|travaux|outillage)\b/i, /\b(perceuse|visseuse|tournevis|scie)\b/i, /\b(peinture|carrelage|plomberie|electricite)\b/i, /\b(Leroy Merlin|Castorama|Brico)\b/i, /\b(jardinage|tondeuse|arrosage)\b/i],
        weight: 1.2
    },
    auto: {
        name: "Automobile", icon: "🚗", category: "🏠 Quotidien",
        description: "Voiture, entretien, mecanique, assurance...",
        keywords: ["voiture","automobile","vehicule","moteur","essence","diesel","electrique","hybride","transmission","embrayage","frein","pneu","jante","echappement","amortisseur","suspension","direction","volant","cylindree","CV","kW","kilometrage","compteur","tableau de bord","retroviseur","feu","clignotant","essuie-glace","climatisation","alarme","GPS","autoradio","camera de recul","entretien","revision","vidange","controle technique","CT","assurance","carte grise","immatriculation","concessionnaire","garage","mecanicien","carrosserie"],
        patterns: [/\b(voiture|automobile|vehicule)\b/i, /\b(moteur|essence|diesel|electrique)\b/i, /\b(pneu|frein|direction|volant)\b/i, /\b(entretien|revision|vidange)\b/i, /\b(assurance|carte grise|immatriculation)\b/i, /\b(concessionnaire|garage|mecanicien)\b/i, /\b\d+\s*(km|CV|kW)\b/],
        weight: 1.3
    },
    animaux: {
        name: "Animaux", icon: "🐾", category: "🏠 Quotidien",
        description: "Chiens, chats, animaux de compagnie...",
        keywords: ["animal","chien","chat","oiseau","poisson","lapin","hamster","tortue","serpent","furet","cheval","poney","veterinaire","vaccination","vermifuge","anti-puces","nourriture","croquettes","jouet","litiere","aquarium","cage","promenade","dressage","obeissance","toilettage","sterilisation","puce","tique","parasite","aboiement","ronron","miaulement"],
        patterns: [/\b(chien|chat|oiseau|poisson|lapin)\b/i, /\b(veterinaire|vaccination|nourriture)\b/i, /\b(croquettes|litiere|aquarium)\b/i],
        weight: 1.1
    },
    argot: {
        name: "Argot / Familier", icon: "🗣️", category: "🏠 Quotidien",
        description: "Argot, langage familier, expressions...",
        keywords: ["kiffer","bouffer","kifer","grave","sympa","nul","naze","ouf","dingue","relou","mec","meuf","gonzesse","gamin","boulot","taffe","boss","bosser","picoler","clope","fumer","beuh","joint","weed","deal","dealer","fric","thune","pecune","ble","biff","bagnole","caisse","char","graille","soiree","teuf","rave","party","after","ambiance"],
        patterns: [/\b(kiffer|bouffer|picoler|clope)\b/i, /\b(mec|meuf|gonzesse|gamin)\b/i, /\b(fric|thune|pecune|ble|biff)\b/i, /\b(bagnole|caisse|char)\b/i, /\b(bouffe|graille)\b/i],
        weight: 1.0
    },
    reseauxSociaux: {
        name: "Reseaux Sociaux", icon: "📱", category: "🏠 Quotidien",
        description: "Facebook, Instagram, TikTok, Twitter...",
        keywords: ["Facebook","Instagram","TikTok","Twitter","Snapchat","YouTube","LinkedIn","Pinterest","Reddit","Twitch","Discord","WhatsApp","Telegram","Signal","Viber","post","story","reel","tweet","like","share","comment","commentaire","abonne","follower","following","influenceur","creator","contenu","tendance","hashtag","mention","tag","notification","algorithme","feed","timeline","profil","bio","statut","message","DM","MP","groupe","communaute","live","stream","podcast","vlog","blog","URL","QR code","filtre","emoji","GIF"],
        patterns: [/\b(Facebook|Instagram|TikTok|Twitter|Snapchat|YouTube)\b/i, /\b(LinkedIn|Pinterest|Reddit|Twitch|Discord)\b/i, /\b(WhatsApp|Telegram|Signal)\b/i, /\b(like|share|comment|follow|abonne)\b/i, /\b(hashtag|mention|tag|profil|bio)\b/i, /\b(live|stream|podcast|vlog|blog)\b/i],
        weight: 1.2
    },
    pharmacie: {
        name: "Pharmacie / Medicaments", icon: "💊", category: "🏥 Sante",
        description: "Medicaments, prescriptions, pharmacie...",
        keywords: ["pharmacie","medicament","comprime","gelule","sirop","suppositoire","pommade","creme","spray","inhalateur","injection","piqure","seringue","ordonnance","prescription","posologie","dosage","effet secondaire","contre-indication","interaction","generique","DCI","substance active","DLU","antibiotique","antidouleur","anti-inflammatoire","antidepresseur","anxiolytique","somnifere","antihistaminique","antitussif","mucolytique","laxatif","antifongique","antiviral","corticoide","insuline","hormone","vitamine","complement alimentaire","probiotique"],
        patterns: [/\b(pharmacie|medicament|comprime|gelule|sirop)\b/i, /\b(ordonnance|prescription|posologie)\b/i, /\b(effet secondaire|contre-indication)\b/i, /\b(antibiotique|antidouleur|anti-inflammatoire)\b/i, /\b(DLU|date de peremption)\b/i],
        weight: 1.4
    },
    transports: {
        name: "Transports / Mobilite", icon: "🚇", category: "🏠 Quotidien",
        description: "Transports en commun, mobilite urbaine...",
        keywords: ["transport","metro","bus","tramway","RER","train","TGV","SNCF","RATP","Navigo","ticket","billet","abonnement","carte reduc","station","arret","quai","gare","ferroviaire","velib","scooter electrique","trottinette","carpooling","blablacar","transfert","correspondance","retard","grève","grve","panne","incident","perturbation"],
        patterns: [/\b(metro|bus|tramway|RER|TGV)\b/i, /\b(SNCF|RATP|Navigo)\b/i, /\b(ticket|billet|abonnement)\b/i, /\b(gare|station|arret|quai)\b/i],
        weight: 1.2
    },
    argent: {
        name: "Argent / Economie", icon: "💶", category: "🏠 Quotidien",
        description: "Argent, economie, budget, inflation...",
        keywords: ["argent","economie","budget","depense","recette","epargne","placement","investissement","bourse","action","obligation","crypto","bitcoin","euro","dollar","livre","yen","taux de change","inflation","deflation","stagnation","PIB","croissance","recession","chomage","emploi","salaire","revenu","impot","TVA","fiscalite","credit","pret","emprunt","taux","mensualite"],
        patterns: [/\b(argent|economie|budget|epargne)\b/i, /\b(bourse|action|bitcoin|crypto)\b/i, /\b(euro|dollar|livre|yen)\b/i, /\b(inflation|deflation|recession)\b/i, /\b\d+\s*(EUR|USD|GBP|¥)/i],
        weight: 1.2
    },
    geographieAvancee: {
        name: "Geographie Avancee", icon: "🌐", category: "📚 Scolaire",
        description: "Geographie detaillee, pays, villes, culture...",
        keywords: ["Paris","Lyon","Marseille","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille","Rennes","Reims","Toulon","Le Havre","Grenoble","Dijon","Angers","Nimes","Clermont-Ferrand","Tours","Metz","Besancon","Orleans","Rouen","Mulhouse","Perpignan","Limoges","Brest","Amiens","Rochelle","Ajaccio","Fort-de-France","Papeete","Noumea","Saint-Denis","Tokyo","Pekin","Shanghai","Delhi","Mumbai","New York","Los Angeles","Chicago","Houston","Phoenix","Londres","Berlin","Madrid","Rome","Barcelone","Amsterdam","Bruxelles","Vienne","Prague","Varsovie","Budapest","Lisbonne","Dublin","Copenhague","Stockholm","Helsinki","Oslo","Ankara","Istanbul","Le Caire","Casablanca","Le Cap","Nairobi","Lagos","Accra","Kinshasa","Addis-Abeba","Dubai","Abu Dhabi","Riyad","Doha","Singapour","Seoul","Bangkok","Hanoï","Jakarta","Manille","Kuala Lumpur","Taipei","Pekin","Ottawa","Mexico","Lima","Bogota","Santiago","Buenos Aires","Brasilia","Rio de Janeiro","Sao Paulo","Bogota","Quito","Lima","Bogota","Caracas"],
        patterns: [/\b(Paris|Lyon|Marseille|Toulouse|Nice|Nantes|Strasbourg)\b/i, /\b(Tokyo|Pekin|New York|Londres|Berlin|Madrid|Rome)\b/i, /\b(carte|continent|pays|ville|capitale|region)\b/i],
        weight: 1.1
    },

    culture: {
        name: "Culture / Divertissement", icon: "🎭", category: "🏠 Quotidien",
        description: "Cinema, series, livres, spectacles, art...",
        keywords: ["cinema","film","movie","serie","saison","episode","realisateur","acteur","actrice","comedie","drame","thriller","horreur","science-fiction","fantastique","documentaire","animation","dessin anime","bande-annonce","premiere","release","Oscar","Cesar","Emmy","Globes d'Or","Netflix","Amazon Prime","Disney+","Canal+","OCS","HBO","YouTube","theatre","spectacle","concert","festival","expo","exposition","galerie","musee","louvre","orsay","centre pompidou","beaubourg","opera","ballet","danse","spectacle vivant","comedie musicale","one-man-show","humour","stand-up","podcast","livre","roman","nouvelle","BD","bande dessinee","manga","roman graphique","auteur","editeur","collection","best-seller","Prix Goncourt","Prix Renaudot","Prix Femina"],
        patterns: [/\b(cinema|film|movie|serie|episode)\b/i, /\b(realisateur|acteur|actrice)\b/i, /\b(Oscar|Cesar|Emmy)\b/i, /\b(Netflix|Amazon|Disney|HBO|Canal)\b/i, /\b(theatre|spectacle|concert|festival)\b/i, /\b(livre|roman|manga|BD)\b/i],
        weight: 1.1
    },

};


function detectSubject(text) {
    const textLower = text.toLowerCase();
    const scores = {};

    for (const [key, cat] of Object.entries(allCategories)) {
        scores[key] = { score: 0, matchedKeywords: [], matchedPatterns: 0 };
        const w = cat.weight || 1;

        for (const keyword of cat.keywords) {
            const kw = keyword.toLowerCase();
            let count = 0;

            if (/^[a-zà-ÿ0-9]+$/i.test(keyword)) {
                // Mot simple : on respecte les frontières de mots
                // (sinon "C" matche partout, "pont" matche dans "Dupont"...)
                const re = new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
                count = (textLower.match(re) || []).length;
            } else {
                // Expression avec espaces / ponctuation : sous-chaîne classique
                let idx = 0;
                while ((idx = textLower.indexOf(kw, idx)) !== -1) {
                    count++;
                    idx += kw.length;
                }
            }

            if (count > 0) {
                scores[key].score += count * 2 * w;
                scores[key].matchedKeywords.push(keyword);
            }
        }

        for (const pattern of cat.patterns) {
            const matches = textLower.match(pattern);
            if (matches) {
                scores[key].score += matches.length * 3 * w;
                scores[key].matchedPatterns++;
            }
        }
    }

    let bestSubject = null;
    let bestScore = 0;
    let allScores = [];

    for (const [key, scoreData] of Object.entries(scores)) {
        allScores.push({ key, ...scoreData });
        if (scoreData.score > bestScore) {
            bestScore = scoreData.score;
            bestSubject = key;
        }
    }

    allScores.sort((a, b) => b.score - a.score);

    if (!bestSubject || bestScore === 0) {
        return {
            subject: 'inconnu',
            confidence: 0,
            matchedKeywords: [],
            scores: allScores,
            topMatches: []
        };
    }

    const totalScore = bestScore;
    const second = allScores[1] ? allScores[1].score : 0;
    let confidence;
    if (totalScore <= 0) {
        confidence = 0;
    } else {
        // Part de la matière gagnante par rapport à la meilleure concurrente
        confidence = Math.min(99, Math.round((totalScore / (totalScore + (second || 0))) * 100));
        if (totalScore < 6) confidence = Math.min(confidence, 35);
    }

    const topMatches = allScores.filter(s => s.score > 0).slice(0, 5).map(s => ({
        key: s.key,
        name: allCategories[s.key].name,
        icon: allCategories[s.key].icon,
        category: allCategories[s.key].category,
        score: s.score,
        keywords: s.matchedKeywords.length
    }));

    return {
        subject: bestSubject,
        confidence: confidence,
        matchedKeywords: scores[bestSubject].matchedKeywords,
        scores: allScores,
        topMatches: topMatches
    };
}

// ═══════════════════════════════════════════════════════
// ELEMENTS & ETAT
// ═══════════════════════════════════════════════════════
const $ = id => document.getElementById(id);

const previewImg     = $('preview');
const fileInput      = $('file-input');
const btnFile        = $('btn-file');
const btnCamera      = $('btn-camera');
const btnReset       = $('btn-reset');
const btnShot        = $('btn-shot');
const btnShotCancel  = $('btn-shot-cancel');
const cameraActions  = $('camera-actions');
const ocrLangSel     = $('ocr-lang');
const apiKeyInput    = $('api-key');
const apiModelInput  = $('api-model');
const apiProviderSel = $('api-provider');
const apiHelpEl      = $('api-help');
const apiLinkEl      = $('api-link');
const btnSaveKey     = $('btn-save-key');
const keyStatus      = $('key-status');
const apiDetails     = $('api-details');
const chipsEl        = $('chips');
const answersBlock   = $('answers-block');
const answersList    = $('answers-list');
const answersHint    = $('answers-hint');
const geminiBlock    = $('gemini-block');
const geminiStatus   = $('gemini-status');
const geminiAnswer   = $('gemini-answer');
const btnGemini      = $('btn-gemini');
const topMatchesEl   = $('top-matches');
const webResultsEl   = $('web-results');
const webLinksEl     = $('web-links');
const wikipediaEl    = $('wikipedia-result');
const step2          = $('step-2');
const step3          = $('step-3');

let inputMode    = null;   // 'file' | 'camera' | 'screen'
let imageDataUrl = null;   // base64 sans préfixe data:
let extractedText = null;  // texte lu depuis un fichier non-image (PDF, txt, audio)
let sourceType = 'image';  // 'image' | 'pdf' | 'text' | 'audio'
let lastHash = null;       // hash de l'entrée courante (cache)
let lastAiText = null;     // dernier corrigé IA généré
let forceRefresh = false;  // forcer le recalcul (ignorer le cache)
let imageMime    = 'image/png';
let lastText     = '';
let lastLang     = 'fr';
let lastDetection = null;
let localAnswers = [];
let unsolvedCount = 0;
let needsHelp    = false;

// ═══════════════════════════════════════════════════════
// FOURNISSEURS D'IA & CLÉS
// ═══════════════════════════════════════════════════════
const LS_PROVIDER  = 'screenmind_provider';
const LS_KEY_PRE   = 'screenmind_key_';
const LS_MODEL_PRE = 'screenmind_model_';
const LS_LEGACY    = 'screenmind_gemini_key';   // ancien emplacement (avant multi-fournisseurs)

// URL du proxy (Worker Cloudflare) : la clé API est stockée sur le
// serveur, elle n'apparaît jamais dans le site. Vide = option masquée.
const PROXY_URL = 'https://screenmind.blzix.workers.dev/';

const PROVIDERS = {
    screenmind: {
        label: 'ScreenMind',
        kind: 'proxy',
        keyUrl: '',
        keyHint: 'Aucune clé à créer : la clé est stockée de façon cachée sur un serveur sécurisé, elle n\'est jamais visible dans le site.',
        models: [],
        fallback: 'Le serveur choisit automatiquement le meilleur modèle gratuit.',
        defaultModel: ''
    },
    gemini: {
        label: 'Google Gemini',
        kind: 'gemini',
        keyUrl: 'https://aistudio.google.com/app/apikey',
        keyHint: 'Gratuite sur Google AI Studio. Elle peut être refusée (403) si ton compte a moins de 18 ans, si ta région n\'est pas supportée ou si c\'un compte Éducation.',
        models: ['gemini-2.5-flash', 'gemini-2.0-flash'],
        fallback: 'Modèles possibles : gemini-2.5-flash, gemini-2.0-flash',
        defaultModel: ''
    },
    openrouter: {
        label: 'OpenRouter',
        kind: 'openai',
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        keyUrl: 'https://openrouter.ai/keys',
        keyHint: 'Gratuite, aucune carte bancaire, pas de blocage géo — la meilleure alternative si Google te bloque.',
        fallback: 'Modèles gratuits avec image : nvidia/nemotron-3.5-super-vl:free, google/gemma-4-26b-a4b-it:free, ou openrouter/free',
        defaultModel: 'nvidia/nemotron-3.5-super-vl:free'
    },
    groq: {
        label: 'Groq',
        kind: 'openai',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        keyUrl: 'https://console.groq.com/keys',
        keyHint: 'Gratuite, aucune carte bancaire, très rapide.',
        fallback: 'Modèles avec image : meta-llama/llama-4-scout-17b-16e-instruct, qwen/qwen3.8-27b',
        defaultModel: 'meta-llama/llama-4-scout-17b-16e-instruct'
    },
    mistral: {
        label: 'Mistral AI',
        kind: 'openai',
        endpoint: 'https://api.mistral.ai/v1/chat/completions',
        keyUrl: 'https://console.mistral.ai/api-keys',
        keyHint: 'Entreprise française, offre gratuite sur La Plateforme.',
        fallback: 'Le modèle doit accepter les images (vision), sinon change-le ici.',
        defaultModel: 'mistral-small-latest'
    },
    openai: {
        label: 'OpenAI',
        kind: 'openai',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        keyUrl: 'https://platform.openai.com/api-keys',
        keyHint: 'Offre payante.',
        fallback: 'Modèles peu chers avec image : gpt-5-nano, gpt-5.4-nano, gpt-4.1-mini',
        defaultModel: 'gpt-5-nano'
    }
};

// Migration de l'ancienne clé Gemini unique vers le nouveau système
try {
    const legacy = localStorage.getItem(LS_LEGACY);
    if (legacy && !localStorage.getItem(LS_KEY_PRE + 'gemini')) {
        localStorage.setItem(LS_KEY_PRE + 'gemini', legacy);
    }
} catch (e) { }

function currentProvider() {
    const p = localStorage.getItem(LS_PROVIDER);
    if (p && PROVIDERS[p] && (p !== 'screenmind' || PROXY_URL)) return p;
    return PROXY_URL ? 'screenmind' : 'gemini';
}
function storedKey(p) { return (localStorage.getItem(LS_KEY_PRE + p) || '').trim(); }
function storedModel(p) { return (localStorage.getItem(LS_MODEL_PRE + p) || '').trim(); }

function getApiKey() {
    const fromInput = apiKeyInput ? apiKeyInput.value.trim() : '';
    return fromInput || storedKey(currentProvider());
}

function getModel(p) {
    return storedModel(p) || (PROVIDERS[p].defaultModel || '');
}

// ── Affichage sans emoji (interface sobre) ──
const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;
function noEmoji(s) {
    return String(s == null ? '' : s).replace(EMOJI_RE, '').replace(/\s{2,}/g, ' ').trim();
}
function letterOf(s) {
    const c = noEmoji(s).replace(/[^A-Za-zÀ-ÿ0-9]/g, '');
    return (c.charAt(0) || '?').toUpperCase();
}

function refreshProviderUI() {
    const p = currentProvider();
    const cfg = PROVIDERS[p];
    const isProxy = cfg.kind === 'proxy';

    if (apiProviderSel) {
        const opt = apiProviderSel.querySelector('option[value="screenmind"]');
        if (opt && opt.style) opt.style.display = PROXY_URL ? '' : 'none';
        apiProviderSel.value = p;
    }
    if (apiKeyInput) {
        apiKeyInput.value = storedKey(p);
        apiKeyInput.disabled = isProxy;
        apiKeyInput.placeholder = isProxy ? 'Aucune clé nécessaire' : 'Colle ta clé ici';
    }
    if (apiModelInput) {
        apiModelInput.disabled = isProxy;
        apiModelInput.value = storedModel(p) || cfg.defaultModel;
        apiModelInput.placeholder = cfg.defaultModel ? 'Défaut : ' + cfg.defaultModel : 'Modèle utilisé';
    }
    if (btnSaveKey) btnSaveKey.disabled = isProxy;
    if (apiLinkEl) {
        apiLinkEl.style.display = isProxy ? 'none' : '';
        apiLinkEl.href = cfg.keyUrl;
        apiLinkEl.textContent = 'Obtenir une clé →';
    }
    if (apiHelpEl) apiHelpEl.textContent = cfg.keyHint + '  •  ' + cfg.fallback;
    if (keyStatus) {
        if (isProxy) {
            keyStatus.textContent = 'Clé intégrée sur le serveur — rien à faire de ton côté';
            keyStatus.classList.add('ok');
        } else {
            const has = storedKey(p);
            keyStatus.textContent = has
                ? 'Clé ' + cfg.label + ' enregistrée dans ce navigateur'
                : 'Aucune clé enregistrée pour ' + cfg.label;
            keyStatus.classList[has ? 'add' : 'remove']('ok');
        }
    }
}

if (apiProviderSel) apiProviderSel.addEventListener('change', () => {
    localStorage.setItem(LS_PROVIDER, apiProviderSel.value);
    refreshProviderUI();
});

if (btnSaveKey) btnSaveKey.addEventListener('click', () => {
    const p = currentProvider();
    const cfg = PROVIDERS[p];
    const v = apiKeyInput.value.trim();
    if (v) localStorage.setItem(LS_KEY_PRE + p, v);
    else localStorage.removeItem(LS_KEY_PRE + p);

    const m = apiModelInput ? apiModelInput.value.trim() : '';
    if (m && m !== cfg.defaultModel) localStorage.setItem(LS_MODEL_PRE + p, m);
    else localStorage.removeItem(LS_MODEL_PRE + p);

    refreshProviderUI();
    if (keyStatus) {
        keyStatus.textContent = v ? 'Clé ' + cfg.label + ' enregistrée' : 'Clé effacée.';
        keyStatus.classList[v ? 'add' : 'remove']('ok');
    }
});

refreshProviderUI();

// ═══════════════════════════════════════════════════════
// UTILITAIRES IMAGE / FLUX
// ═══════════════════════════════════════════════════════
function showLoading(msg) {
    loading.style.display = 'flex';
    if (msg) loadingText.textContent = msg;
}
function hideLoading() { loading.style.display = 'none'; }

function stopAllStreams() {
    if (stream) {
        stream.getTracks().forEach(t => {
            t.onended = null;   // évite que l'arrêt déclenche resetAll() en plein analyse
            t.stop();
        });
        stream = null;
    }
    video.srcObject = null;
    video.classList.remove('active');
}

function setImage(dataUrl) {
    stopAllStreams();
    const m = dataUrl.match(/^data:([^;]+);base64,/);
    imageMime = m ? m[1] : 'image/png';
    imageDataUrl = dataUrl.split(',')[1];
    previewImg.src = dataUrl;
    previewImg.classList.add('active');
    placeholder.style.display = 'none';
    cameraActions.style.display = 'none';
    btnAnalyze.disabled = false;
    if (step2) step2.classList.add('is-active');
}

function frameToDataUrl() {
    const w = video.videoWidth, h = video.videoHeight;
    if (!w || !h) return null;
    canvas.width = w; canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL('image/png');
}

// Préparation de l'image pour l'OCR : agrandit, niveaux de gris + contraste
async function prepareOcrImage(b64, mime) {
    const img = new Image();
    img.src = 'data:' + mime + ';base64,' + b64;
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

    let w = img.naturalWidth, h = img.naturalHeight;
    if (w < 1100) { const f = Math.min(3, 1100 / w); w = Math.round(w * f); h = Math.round(h * f); }
    if (w > 2200) { const f = 2200 / w; w = Math.round(w * f); h = Math.round(h * f); }

    canvas.width = w; canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    try {
        const data = ctx.getImageData(0, 0, w, h);
        const p = data.data;
        const n = w * h;
        const gray = new Uint8Array(n);
        let hist = new Uint32Array(256);

        for (let i = 0, j = 0; j < n; i += 4, j++) {
            const g = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) | 0;
            gray[j] = g;
            hist[g]++;
        }

        // Étirement de contraste entre le 1er et le 99e percentile
        let lo = 0, hi = 255, acc = 0;
        const lowTarget = n * 0.01;
        for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= lowTarget) { lo = v; break; } }
        acc = 0;
        const hiTarget = n * 0.99;
        for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= hiTarget) { hi = v; break; } }
        const range = Math.max(1, hi - lo);
        const lut = new Uint8Array(256);
        for (let v = 0; v < 256; v++) {
            const s = ((v - lo) * 255) / range;
            lut[v] = s < 0 ? 0 : (s > 255 ? 255 : s);
        }
        hist = new Uint32Array(256);
        for (let j = 0; j < n; j++) { const s = lut[gray[j]]; gray[j] = s; hist[s]++; }

        // Binarisation (seuil d'Otsu) seulement si ça donne une part de "texte" plausible :
        // sinon une photo mal éclairée deviendrait toute noire et l'OCR échouerait.
        const th = otsuThreshold(hist, n);
        let dark = 0;
        for (let j = 0; j < n; j++) if (gray[j] <= th) dark++;
        const ratio = dark / n;
        const binarize = ratio > 0.004 && ratio < 0.6;

        for (let j = 0, i = 0; j < n; j++, i += 4) {
            const v = binarize ? (gray[j] <= th ? 0 : 255) : gray[j];
            p[i] = p[i + 1] = p[i + 2] = v;
        }
        ctx.putImageData(data, 0, 0);
    } catch (e) { /* image non traitable : on garde l'originale */ }

    return canvas.toDataURL('image/png');
}

function otsuThreshold(hist, total) {
    let sum = 0;
    for (let i = 0; i < 256; i++) sum += i * hist[i];
    let sumB = 0, wB = 0, best = 0, thr = 127;
    for (let t = 0; t < 256; t++) {
        wB += hist[t];
        if (!wB) continue;
        const wF = total - wB;
        if (!wF) break;
        sumB += t * hist[t];
        const mB = sumB / wB, mF = (sum - sumB) / wF;
        const between = wB * wF * (mB - mF) * (mB - mF);
        if (between > best) { best = between; thr = t; }
    }
    return thr;
}

// ═══════════════════════════════════════════════════════
// ENTRÉES : FICHIER / CAMÉRA / ÉCRAN
// ═══════════════════════════════════════════════════════
btnFile.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    inputMode = 'file';
    resetExtracted();
    try { await processFile(f); }
    catch (err) { alert("Fichier illisible : " + err.message); }
    fileInput.value = '';
});

// Glisser-déposer
const previewContainer = $('preview-container');
if (previewContainer) {
    ['dragenter','dragover'].forEach(ev => previewContainer.addEventListener(ev, e => { e.preventDefault(); previewContainer.classList.add('drag-over'); }));
    ['dragleave','drop'].forEach(ev => previewContainer.addEventListener(ev, e => { e.preventDefault(); previewContainer.classList.remove('drag-over'); }));
    previewContainer.addEventListener('drop', async e => {
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (!f) return;
        inputMode = 'file';
        resetExtracted();
        try { await processFile(f); }
        catch (err) { alert("Fichier illisible : " + err.message); }
    });
}

function resetExtracted() {
    extractedText = null;
    sourceType = 'image';
}

function readFileAsDataURL(f) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = () => rej(r.error || new Error('lecture impossible'));
        r.readAsDataURL(f);
    });
}
function readFileAsText(f) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result || ''));
        r.onerror = () => rej(r.error || new Error('lecture impossible'));
        r.readAsText(f);
    });
}
function readFileAsBase64(f) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result || '').split(',')[1] || '');
        r.onerror = () => rej(r.error || new Error('lecture impossible'));
        r.readAsDataURL(f);
    });
}

function showTextPreview(text, name) {
    previewImg.classList.remove('active');
    placeholder.style.display = 'flex';
    placeholder.innerHTML = '<p><strong>' + (name || 'Fichier') + '</strong><br>' +
        text.length + ' caractères lus. Cliquez sur « Analyser ».</p>';
    btnAnalyze.disabled = false;
    if (step2) step2.classList.add('is-active');
}

async function processFile(f) {
    const type = (f.type || '').toLowerCase();
    const name = (f.name || '').toLowerCase();
    if (type.startsWith('image/')) {
        sourceType = 'image';
        const dataUrl = await readFileAsDataURL(f);
        setImage(dataUrl);
        return;
    }
    if (type === 'application/pdf' || name.endsWith('.pdf')) {
        sourceType = 'pdf';
        showLoading('Lecture du PDF...');
        const { text, dataUrl } = await readPdf(f);
        extractedText = text || '';
        if (dataUrl) setImage(dataUrl);
        else showTextPreview(extractedText, f.name);
        hideLoading();
        if (!extractedText.trim() && !imageDataUrl) throw new Error('PDF vide ou illisible');
        return;
    }
    if (type.startsWith('text/') || /\.(txt|md|csv|json|log|html?|xml|rtf)$/i.test(name)) {
        sourceType = 'text';
        const text = await readFileAsText(f);
        extractedText = text;
        showTextPreview(text, f.name);
        return;
    }
    if (type.startsWith('audio/')) {
        sourceType = 'audio';
        showLoading('Transcription audio...');
        const text = await transcribeAudio(f);
        extractedText = text;
        showTextPreview(text, f.name);
        hideLoading();
        return;
    }
    // Fallback : tenter comme texte
    try {
        const text = await readFileAsText(f);
        if (text && text.trim()) {
            sourceType = 'text';
            extractedText = text;
            showTextPreview(text, f.name);
            return;
        }
    } catch (e) { /* ignore */ }
    throw new Error('Format non supporté : ' + (f.type || f.name));
}

async function readPdf(f) {
    if (!window.pdfjsLib) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const ab = await f.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        text += tc.items.map(it => it.str).join(' ') + '\\n';
    }
    let dataUrl = null;
    try {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const c = document.createElement('canvas');
        c.width = viewport.width; c.height = viewport.height;
        const ctx = c.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        dataUrl = c.toDataURL('image/png');
    } catch (e) { /* ignore */ }
    return { text: (text || '').trim(), dataUrl };
}

async function transcribeAudio(f) {
    const b64 = await readFileAsBase64(f);
    const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: b64, mime: f.type || 'audio/mpeg' })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
    return (data.text || '').trim();
}

function loadScript(src) {
    return new Promise((res, rej) => {
        if (document.querySelector('script[src=\"' + src + '\"]')) { res(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => res();
        s.onerror = () => rej(new Error('chargement ' + src));
        document.head.appendChild(s);
    });
}

btnCamera.addEventListener('click', async () => {
    try {
        stopAllStreams();
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } }, audio: false
        });
        video.srcObject = stream;
        video.classList.add('active');
        previewImg.classList.remove('active');
        placeholder.style.display = 'none';
        cameraActions.style.display = 'flex';
        inputMode = 'camera';
        btnAnalyze.disabled = true;
    } catch (err) {
        alert("Caméra indisponible : " + err.message);
    }
});

btnShot.addEventListener('click', () => {
    const d = frameToDataUrl();
    if (d) { setImage(d); inputMode = 'camera'; }
});

btnShotCancel.addEventListener('click', resetAll);

btnCapture.addEventListener('click', async () => {
    try {
        stopAllStreams();
        stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: false });
        video.srcObject = stream;
        video.classList.add('active');
        previewImg.classList.remove('active');
        placeholder.style.display = 'none';
        cameraActions.style.display = 'none';
        inputMode = 'screen';
        btnAnalyze.disabled = false;
        stream.getVideoTracks()[0].onended = () => resetAll();
    } catch (err) {
        alert("Impossible de capturer l'écran : " + err.message);
    }
});

function resetAll() {
    stopAllStreams();
    previewImg.removeAttribute('src');
    previewImg.classList.remove('active');
    placeholder.style.display = 'flex';
    cameraActions.style.display = 'none';
    btnAnalyze.disabled = true;
    results.style.display = 'none';
    imageDataUrl = null;
    extractedText = null;
    sourceType = 'image';
    inputMode = null;
    lastText = ''; localAnswers = []; unsolvedCount = 0; needsHelp = false;
    if (step2) step2.classList.remove('is-active');
    if (step3) step3.classList.remove('is-active');
}
btnReset.addEventListener('click', resetAll);

// ═══════════════════════════════════════════════════════
// DÉTECTION DE LA LANGUE DU TEXTE
// ═══════════════════════════════════════════════════════
const LANG_TABLE = {
    fr: { name: 'Français', flag: '🇫🇷', words: ['le','la','les','des','un','une','est','sont','dans','pour','que','qui','avec','sur','pas','sont','avoir','etre','combien','calculer','resous','resoudre','donne','donner','completes','complete','exercice','enonce','controle','qu\'est-ce','pourquoi','comment','egal','fait','meme','aussi','donc','car'] },
    en: { name: 'English', flag: '🇬🇧', words: ['the','is','are','and','of','to','in','for','with','what','how','why','when','find','solve','calculate','given','exercise','question','answer','complete','write','many','much','there','their','this','that','which','because','also','from','many'] },
    es: { name: 'Español', flag: '🇪🇸', words: ['el','la','los','las','que','de','en','y','es','son','una','unos','para','con','por','cual','cuanto','como','resolver','ejercicio','enunciado','respuesta','completa','calcula','practica','examen','tarea','tambien','pero','porque'] },
    it: { name: 'Italiano', flag: '🇮🇹', words: ['il','lo','gli','che','di','e','in','per','con','una','sono','qual','quanto','come','risolvi','esercizio','risposta','compito','compita','calcola','lezione','esame','anche','perche'] },
    de: { name: 'Deutsch', flag: '🇩🇪', words: ['der','die','das','und','ist','sind','von','mit','für','wie','viele','was','warum','wann','aufgabe','losung','rechne','berechne','ubung','prufung','antwort','vollstandig','auch','aber','weil'] },
    pt: { name: 'Português', flag: '🇵🇹', words: ['o','a','os','as','que','de','em','e','é','são','uma','para','com','qual','quanto','como','resolver','exercicio','enunciado','resposta','completa','calcula','prova','tarefa','tambem','porque'] }
};

function detectLanguage(text) {
    const tokens = (text.toLowerCase().match(/[a-zà-ÿ']+/g) || []);
    if (tokens.length < 3) return 'fr';
    let best = null, bestScore = 0;
    for (const [code, info] of Object.entries(LANG_TABLE)) {
        let score = 0;
        const set = new Set(info.words);
        for (const t of tokens) if (set.has(t)) score++;
        if (score > bestScore) { bestScore = score; best = code; }
    }
    return best || 'fr';
}

// ═══════════════════════════════════════════════════════
// CALCULATEUR (parseur récursif sûr, sans eval)
// ═══════════════════════════════════════════════════════
function parseMath(src, scope) {
    const s = String(src);
    let i = 0;
    const skip = () => { while (i < s.length && /\s/.test(s[i])) i++; };

    function parseExpr() {
        let v = parseTerm(); skip();
        while (i < s.length && (s[i] === '+' || s[i] === '-')) {
            const op = s[i++]; const r = parseTerm();
            v = op === '+' ? v + r : v - r; skip();
        }
        return v;
    }
    function parseTerm() {
        let v = parseUnary(); skip();
        while (i < s.length && (s[i] === '*' || s[i] === '/')) {
            const op = s[i++]; const r = parseUnary();
            v = op === '*' ? v * r : v / r; skip();
        }
        return v;
    }
    function parseUnary() {
        skip();
        if (s[i] === '-') { i++; return -parseUnary(); }
        if (s[i] === '+') { i++; return parseUnary(); }
        return parsePower();
    }
    function parsePower() {
        const base = parseAtom(); skip();
        if (s[i] === '^') { i++; const e = parseUnary(); return Math.pow(base, e); }
        return base;
    }
    function parseAtom() {
        skip();
        if (i >= s.length) throw new Error('fin inattendue');
        if (s[i] === '(') {
            i++; const v = parseExpr(); skip();
            if (s[i] === ')') i++;
            return v;
        }
        const num = /^[0-9]*\.?[0-9]+/.exec(s.slice(i));
        if (num) {
            i += num[0].length;
            let v = parseFloat(num[0]);
            skip();
            if (s[i] === '%') { i++; v = v / 100; }   // 20% -> 0.2
            return v;
        }
        const id = /^[A-Za-zÀ-ÿ]+/.exec(s.slice(i));
        if (id) {
            i += id[0].length;
            const name = id[0].toLowerCase();
            if (name === 'sqrt') { const v = parseAtom(); return Math.sqrt(v); }
            if (name === 'abs')  { const v = parseAtom(); return Math.abs(v); }
            skip();
            if (s[i] === '(') {                                  // f(x)
                i++; const v = parseExpr(); skip();
                if (s[i] === ')') i++;
                return v;
            }
            if (scope && Object.prototype.hasOwnProperty.call(scope, name)) return scope[name];
            if (scope && Object.prototype.hasOwnProperty.call(scope, id[0])) return scope[id[0]];
            throw new Error('variable inconnue : ' + id[0]);
        }
        throw new Error('caractère inattendu : ' + s[i]);
    }

    const out = parseExpr(); skip();
    if (i < s.length) throw new Error('reste : ' + s.slice(i));
    return out;
}

function roundNum(n) {
    if (n === null || n === undefined || !isFinite(n)) return null;
    const r = Math.round(n * 1e6) / 1e6;
    return String(r).replace('.', ',').replace(/,0+$/, '');
}

// ═══════════════════════════════════════════════════════
// RÉSOLUTION AUTOMATIQUE DES ÉNONCÉS
// ═══════════════════════════════════════════════════════
function normalizeLine(s) {
    return String(s)
        .replace(/÷/g, '/').replace(/[×✕✖]/g, '*')
        .replace(/[−–—]/g, '-').replace(/√/g, 'sqrt')
        .replace(/(\d)\s*[xX]\s*(\d)/g, '$1*$2')   // "12 x 5" -> "12*5"
        .replace(/\u00A0/g, ' ')
        .replace(/[?？]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Multipliations implicites : "3x" -> "3*x", "2y + 1" -> "2*y + 1"
function normalizeMath(s) {
    return String(s).replace(/(\d)\s*([A-Za-zÀ-ÿ](?![A-Za-zÀ-ÿ]))/g, '$1*$2');
}

// Toutes les lettres-isolées (= variables possibles) d'une expression
function findVariables(str) {
    const tokens = String(str).match(/[A-Za-zÀ-ÿ]+/g) || [];
    const out = [];
    for (const t of tokens) {
        if (t.length === 1 && !out.includes(t)) out.push(t);
    }
    return out;
}

function solveForVar(left, right, v) {
    const f = x => parseMath(left, { [v]: x }) - parseMath(right, { [v]: x });
    let f0, f1, f2;
    try { f0 = f(0); f1 = f(1); f2 = f(2); } catch (e) { return null; }
    if (![f0, f1, f2].every(isFinite)) return null;

    const a = (f2 - 2 * f1 + f0) / 2;
    const b = f1 - f0 - a;
    const c = f0;
    const ok = x => { try { return Math.abs(parseMath(left, { [v]: x }) - parseMath(right, { [v]: x })) < 1e-6; } catch (e) { return false; } };

    if (Math.abs(a) < 1e-9) {
        if (Math.abs(b) < 1e-9) return null;
        const root = -c / b;
        return ok(root) ? v + ' = ' + roundNum(root) : null;
    }
    const disc = b * b - 4 * a * c;
    if (disc < -1e-9) return null;
    if (Math.abs(disc) < 1e-9) {
        const root = -b / (2 * a);
        return ok(root) ? v + ' = ' + roundNum(root) : null;
    }
    const s = Math.sqrt(disc);
    const r1 = (-b + s) / (2 * a), r2 = (-b - s) / (2 * a);
    const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
    if (!ok(lo) || !ok(hi)) return null;
    return v + ' = ' + roundNum(lo) + ' ou ' + roundNum(hi);
}

function trySolveLine(normalizedLine, originalLine) {
    originalLine = originalLine || normalizedLine;
    const line = String(normalizedLine).replace(/^\s*(?:\d+|[a-zà-ÿ])\s*[).\-:]\s*/i, '').trim() || normalizedLine;

    // 1) Pourcentage : "20 % de 500" / "20% of 500"
    let m = line.match(/(\d+(?:[.,]\d+)?)\s*%\s*(?:de|of|del|della)\s+(\d+(?:[.,]\d+)?)/i);
    if (m) {
        const pct = parseFloat(m[1].replace(',', '.'));
        const base = parseFloat(m[2].replace(',', '.'));
        return { q: originalLine, a: roundNum(pct / 100 * base) + '  (' + m[1] + ' %)' };
    }
    if (/\d\s*%\s*(de|of)\b/i.test(line)) return null;

    // 2) Équation : une seule "="
    const parts = line.split('=');
    if (parts.length === 2) {
        const left = normalizeMath(parts[0].trim());
        const right = normalizeMath(parts[1].trim().replace(/\s+/g, ' ').trim());
        if (left && right) {
            const cands = findVariables(left + ' ' + right);
            if (cands.length) {
                for (const v of cands) {
                    const sol = solveForVar(left, right, v);
                    if (sol) return { q: originalLine, a: sol };
                }
                return null;   // équation à variable non résolue : on ne devine pas
            }
            if (/[0-9]/.test(left) && /[0-9]/.test(right)) {
                try {
                    const lv = parseMath(left), rv = parseMath(right);
                    if (Math.abs(lv - rv) < 1e-9) return { q: originalLine, a: 'VRAI  (' + roundNum(lv) + ' = ' + roundNum(rv) + ')' };
                    return { q: originalLine, a: 'FAUX  (' + roundNum(lv) + ' ≠ ' + roundNum(rv) + ')' };
                } catch (e) { /* on abandonne */ }
            }
        }
    }

    // 3) Calcul brut : "12 × 5", "(5+2)^3", "3 + 4 * 2"...
    const arith = line.match(/\(?\s*\d+(?:[.,]\d+)?(?:\s*[+\-*/^]\s*\(?\s*\d+(?:[.,]\d+)?\s*\)?)+/);
    if (arith) {
        const expr = arith[0].replace(/,/g, '.');
        const ops = (expr.match(/[+\-*/^]/g) || []).length;
        if (ops <= 6) {
            try {
                const v = parseMath(expr);
                if (isFinite(v)) return { q: originalLine, a: roundNum(v) };
            } catch (e) { /* pas un calcul */ }
        }
    }
    return null;
}

const EXPLAIN_VERBS = /\b(explique[rz]?|r[ée]dige[rz]?|d[ée]montre|d[ée]montrez|justifie[rz]?|r[ée]sum[ée]|compare[rz]?|discute[rz]?|r[ée]fl[ée]chis|traduis|traduisez|decris|décris|write an?|explain|discuss|describe|justify|translate|why do|comment|pourquoi)\b/i;

function solveLocally(text) {
    const answers = [];
    let unsolved = 0;
    const lines = text.split(/\n+/);

    for (const raw of lines) {
        const line = normalizeLine(raw);
        if (!line || line.length < 2) continue;
        if (/^\s*(exercice|question|ex\.?)\s*[\d.ivx]*\s*[.:-]?\s*$/i.test(line)) continue;          // titre seul
        if (/^\s*(nom|pr[ée]nom|classe|date|page|colle|eleve|élève|professeur|lyc[ée]e|coll[èe]ge|[ée]cole|chapitre|mati[èe]re|barème|bareme)/i.test(line) && line.split(' ').length < 9) continue;
        if (/\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/.test(line)) continue;   // dates

        const isQuestion = /\s/.test(line) && (
            /[?]/.test(raw) ||
            /^\s*(exercice\s*\d*|question\s*\d*|\d+\s*[).\-]|[a-z]\s*[).])\s*/i.test(line) ||
            /^(calcule[rz]?|resous|résous|resouds|donne|donner|completes|complète|trouve|find|solve|calculate|determine|détermine)\b/i.test(line) ||
            EXPLAIN_VERBS.test(line)
        );

        let solved = null;
        try { solved = trySolveLine(line, raw); } catch (e) { solved = null; }

        if (solved) {
            if (!answers.some(a => a.a === solved.a && a.q === solved.q)) answers.push(solved);
        } else if (isQuestion) {
            unsolved++;
        }
    }
    return { answers, unsolved };
}

// ═══════════════════════════════════════════════════════
// AFFICHAGE
// ═══════════════════════════════════════════════════════
function addChip(text, cls) {
    const s = document.createElement('span');
    s.className = 'chip ' + (cls || '');
    s.textContent = text;
    chipsEl.appendChild(s);
}

function displayResults(detection, langCode, text) {
    results.style.display = 'block';
    if (step3) step3.classList.add('is-active');

    const subject = allCategories[detection.subject] || {
        name: 'Contenu non identifié', icon: '', category: '—',
        description: "Le contenu n'a pas pu être identifié automatiquement"
    };

    $('subject-icon').textContent = letterOf(subject.name);
    $('subject-name').textContent = subject.name;
    $('subject-description').textContent = subject.description;
    const cat = $('subject-category');
    if (cat) cat.textContent = noEmoji(subject.category);

    const fill = $('confidence-fill'), txt = $('confidence-text');
    fill.style.width = detection.confidence + '%';
    if (detection.confidence > 70) {
        fill.style.background = '#5fa8d3';
        txt.style.color = '#3f8ab8';
    } else if (detection.confidence > 40) {
        fill.style.background = '#e8a13c';
        txt.style.color = '#c9862a';
    } else {
        fill.style.background = '#d0603c';
        txt.style.color = '#c0562f';
    }
    txt.textContent = detection.confidence + '%';

    // Chips : langue détectée + matière + confiance
    chipsEl.innerHTML = '';
    const L = LANG_TABLE[langCode] || LANG_TABLE.fr;
    addChip(noEmoji(L.name) + ' détecté', 'chip-lang');
    addChip(noEmoji(subject.name), 'chip-subject');
    addChip('Confiance ' + detection.confidence + '%', detection.confidence > 60 ? 'chip-good' : 'chip-warn');
    const wordCount = (text.match(/\S+/g) || []).length;
    addChip(wordCount + ' mots lus', 'chip-soft');

    // Autres détections
    if (topMatchesEl) {
        if (detection.topMatches && detection.topMatches.length > 1) {
            topMatchesEl.innerHTML = '<h3>Autres pistes :</h3>';
            detection.topMatches.slice(1, 4).forEach(m => {
                const div = document.createElement('div');
                div.className = 'top-match-item';
                div.innerHTML = '<span class="top-match-icon">' + letterOf(m.name) + '</span>' +
                    '<span class="top-match-name">' + noEmoji(m.name) + '</span>' +
                    '<span class="top-match-cat">' + noEmoji(m.category) + '</span>' +
                    '<span class="top-match-score">' + m.keywords + ' mots-clés</span>';
                topMatchesEl.appendChild(div);
            });
        } else topMatchesEl.innerHTML = '';
    }
}

function renderAnswers(list, unsolved) {
    answersList.innerHTML = '';
    answersBlock.style.display = 'block';

    if (list.length) {
        list.forEach(a => {
            const div = document.createElement('div');
            div.className = 'answer-item';
            const q = document.createElement('div');
            q.className = 'answer-q';
            q.textContent = a.q;
            const ans = document.createElement('div');
            ans.className = 'answer-a';
            ans.textContent = noEmoji(a.a);
            div.appendChild(q); div.appendChild(ans);
            answersList.appendChild(div);
        });
        answersHint.textContent = unsolved > 0
            ? list.length + ' réponse(s) calculée(s) sur l\'appareil • ' + unsolved + ' question(s) plus longue(s) → corrigé détaillé ci-dessous'
            : 'Tout a été résolu automatiquement, sans connexion.';
    } else {
        answersHint.textContent = 'Rien de calculable localement sur cette image (pas de calcul ni d\'équation simple détecté).';
    }
}

// ═══════════════════════════════════════════════════════
// MARKDOWN SIMPLE (sortie IA)
// ═══════════════════════════════════════════════════════
function mdToHtml(md) {
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const inline = s => s
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

    let html = '', listOpen = false;
    const closeList = () => { if (listOpen) { html += '</ul>'; listOpen = false; } };

    for (const raw of String(md).split('\n')) {
        const line = raw.trim();
        if (/^#{1,6}\s+/.test(line)) {
            closeList();
            html += '<h4>' + inline(line.replace(/^#{1,6}\s+/, '')) + '</h4>';
        } else if (/^\s*([-*•o]|✅|✔)\s+/.test(line)) {
            if (!listOpen) { html += '<ul>'; listOpen = true; }
            html += '<li>' + inline(line.replace(/^\s*([-*•o]|✅|✔)\s+/, '')) + '</li>';
        } else if (/^\s*\d+[.)]\s+/.test(line)) {
            if (!listOpen) { html += '<ol>'; listOpen = true; listOpen = true; }
            html += '<li>' + inline(line.replace(/^\s*\d+[.)]\s+/, '')) + '</li>';
        } else if (line === '') {
            closeList();
        } else {
            closeList();
            html += '<p>' + inline(line) + '</p>';
        }
    }
    closeList();
    return html;
}

// ═══════════════════════════════════════════════════════
// IA DE SECOURS (quand c'est trop complexe pour le site)
// ═══════════════════════════════════════════════════════

// Compresse la photo en JPEG (max 1600px) pour ne pas exploser les API
async function compressForApi(b64, mime) {
    const raw = 'data:' + (mime || 'image/png') + ';base64,' + b64;
    try {
        const img = new Image();
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = raw; });
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(img.width || 0, img.height || 0));
        if (!(img.width > 0) || !(img.height > 0) || scale === 1) return { mime: mime, b64: b64 };
        const w = Math.max(1, Math.round((img.width || 1) * scale));
        const h = Math.max(1, Math.round((img.height || 1) * scale));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) return { mime: mime, b64: b64 };
        ctx.drawImage(img, 0, 0, w, h);
        const out = c.toDataURL('image/jpeg', 0.85);
        const newB64 = out.split(',')[1];
        if (!newB64) return { mime: mime, b64: b64 };
        return { mime: 'image/jpeg', b64: newB64 };
    } catch (e) {
        return { mime: mime, b64: b64 };   // pas de canvas → on envoie l'original
    }
}

// Appel à l'API Google Gemini (format natif)
async function callGemini(key, prompt, img, model) {
    const parts = [{ text: prompt }];
    if (img) parts.push({ inline_data: { mime_type: img.mime, data: img.b64 } });
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(key), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: parts }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
        })
    });
    const data = await res.json();
    if (!res.ok) {
        const err = (data.error && data.error.message) || ('HTTP ' + res.status);
        const e = new Error(err);
        e.retryable = (res.status === 404 || res.status === 429 || res.status >= 500);
        throw e;
    }
    const resParts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = resParts.map(p => p.text || '').join('').trim();
    if (!text) throw new Error('Réponse vide du modèle');
    return text;
}

// Appel compatible OpenAI (OpenRouter, Groq, Mistral, OpenAI…)
async function callOpenAICompatible(cfg, key, prompt, img, model) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
    };
    if (cfg.endpoint && cfg.endpoint.indexOf('openrouter.ai') !== -1) {
        headers['HTTP-Referer'] = (typeof location !== 'undefined' && location && location.origin) ? location.origin : 'https://fr3nchh.github.io';
        headers['X-Title'] = 'ScreenMind';
    }
    const content = img
        ? [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: 'data:' + img.mime + ';base64,' + img.b64 } }
        ]
        : prompt;
    const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: content }],
            temperature: 0.3
        })
    });
    const data = await res.json();
    if (!res.ok) {
        const err = (data.error && (data.error.message || data.error)) || ('HTTP ' + res.status);
        const e = new Error(typeof err === 'string' ? err : JSON.stringify(err));
        e.retryable = (res.status === 404 || res.status === 429 || res.status >= 500);
        throw e;
    }
    let resultContent = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (Array.isArray(resultContent)) resultContent = resultContent.map(c => (c && c.text) || '').join('');
    resultContent = (resultContent || '').trim();
    if (!resultContent) throw new Error('Réponse vide du modèle');
    return resultContent;
}

// Appel via le proxy (clé stockée côté serveur, jamais dans le site)
async function callProxy(prompt, img, model) {
    const body = { prompt: prompt };
    if (img) body.image = { mime: img.mime, b64: img.b64 };
    if (model) body.model = model;
    if (lastHash) body.hash = lastHash;
    const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const e = new Error(data.error || ('HTTP ' + res.status));
        e.retryable = (res.status === 404 || res.status === 429 || res.status >= 500);
        throw e;
    }
    const text = (data.text || '').trim();
    if (!text) throw new Error('Réponse vide du serveur');
    return text;
}

async function askAI() {
    const p = currentProvider();
    const cfg = PROVIDERS[p];
    const key = getApiKey();
    if (!key && cfg.kind !== 'proxy') {
        geminiBlock.style.display = 'block';
        geminiStatus.textContent = "Il faut une clé " + cfg.label + " pour cet exercice (2 clics, elle reste dans ton navigateur).";
        geminiStatus.className = 'hint warn';
        if (apiDetails) { apiDetails.open = true; apiDetails.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        if (apiKeyInput) apiKeyInput.focus();
        return;
    }
    if (!imageDataUrl && !extractedText) return;

    const L = LANG_TABLE[lastLang] || LANG_TABLE.fr;
    let models = [getModel(p)].concat(cfg.models || []).filter((m, i, a) => m && a.indexOf(m) === i);
    if (!models.length) models.push('');

    geminiBlock.style.display = 'block';
    btnGemini.disabled = true;
    try {
        geminiAnswer.innerHTML = '';
        geminiStatus.className = 'hint';
        geminiStatus.textContent = "Photo envoyée à " + cfg.label + "… (10 à 30 secondes)";
        showLoading(cfg.label + ' lit la photo et prépare le corrigé...');

    const prompt =
        "Tu es un professeur patient et rigoureux.\n" +
        "Le texte ci-dessous (ou la photo ci-jointe) est un énoncé d'exercice, de devoir, de contrôle ou un document quelconque.\n" +
        (extractedText ? ("Texte du document :\n---\n" + extractedText.slice(0, 12000) + "\n---\n") : "") +
        "1. Détermine la langue du texte.\n" +
        "2. Donne LA RÉPONSE COMPLÈTE de chaque question/exercice, étape par étape, en justifiant brièvement.\n" +
        "3. Réponds TOUJOURS dans la langue du texte (langue estimée : " + L.name + ").\n" +
        "4. Si ce n'est pas un exercice, résume le document en 5 points maximum.\n" +
        "Format Markdown : un titre court par question, des listes à puces pour les étapes, et la réponse finale en gras.";

    const img = imageDataUrl ? await compressForApi(imageDataUrl, imageMime) : null;

    let lastError = null;
    for (const model of models) {
        try {
            const text = (cfg.kind === 'proxy')
                ? await callProxy(prompt, img, model)
                : (cfg.kind === 'gemini')
                    ? await callGemini(key, prompt, img, model)
                    : await callOpenAICompatible(cfg, key, prompt, img, model);

            geminiAnswer.innerHTML = mdToHtml(text);
            geminiStatus.textContent = 'Corrigé détaillé généré par ' + cfg.label + (model ? ' (' + model + ')' : '') + ' — dans la langue de ton image.';
            lastAiText = text;
            if (lastHash) {
                const c = cacheGet(lastHash);
                if (c) { c.aiText = text; cacheSet(lastHash, c); }
                else cacheSet(lastHash, { text: lastText, aiText: text, ts: Date.now() });
            }
            hideLoading();
            btnGemini.disabled = false;
            addCopyButton(text);
            return;
        } catch (err) {
            lastError = err.message || String(err);
            if (err.retryable === false) break;
        }
    }

    geminiStatus.className = 'hint warn';
    geminiStatus.textContent = cfg.label + ' : ' + lastError;
    btnGemini.disabled = false;
    hideLoading();
    } catch (err) {
        console.error('Erreur IA:', err);
        geminiStatus.className = 'hint warn';
        geminiStatus.textContent = cfg.label + ' : ' + (err && err.message ? err.message : err);
    } finally {
        btnGemini.disabled = false;
        hideLoading();
    }
}

// Ancien nom conservé pour compatibilité
async function askGemini() { return askAI(); }

function addCopyButton(text) {
    const old = geminiAnswer.querySelector('.copy-btn');
    if (old) old.remove();
    const b = document.createElement('button');
    b.className = 'btn btn-small copy-btn';
    b.textContent = 'Copier le corrigé';
    b.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => { b.textContent = 'Copié'; });
    });
    geminiAnswer.appendChild(b);
}

btnGemini.addEventListener('click', askAI);

// ═══════════════════════════════════════════════════════
// RECHERCHES DANS LA LANGUE DÉTECTÉE
// ═══════════════════════════════════════════════════════
const WIKI_HOST = { fr: 'fr', en: 'en', es: 'es', it: 'it', de: 'de', pt: 'pt' };

async function searchWeb(langCode, query, subjectName) {
    if (!webResultsEl) return;
    webResultsEl.style.display = 'block';
    webLinksEl.innerHTML = '';
    if (wikipediaEl) { wikipediaEl.className = 'wikipedia-box'; wikipediaEl.innerHTML = ''; }

    const host = WIKI_HOST[langCode] || 'fr';
    const encoded = encodeURIComponent(query);

    const links = [
        { title: 'Google : « ' + query.slice(0, 70) + ' »', url: 'https://www.google.com/search?q=' + encoded + '&hl=' + host, snippet: 'Recherche dans ta langue' },
        { title: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=' + encoded + '&hl=' + host, snippet: 'Cours, annales et solutions académiques' },
        { title: 'YouTube', url: 'https://www.youtube.com/results?search_query=' + encoded, snippet: 'Vidéo de correction / explication' },
        { title: subjectName, url: 'https://' + host + '.wikipedia.org/wiki/Special:Search?search=' + encoded, snippet: 'Wikipédia (' + host + ')' }
    ];
    links.forEach(l => {
        const a = document.createElement('a');
        a.className = 'web-link-item';
        a.href = l.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.innerHTML = '<div class="web-link-title"></div><div class="web-link-url"></div><div class="web-link-snippet"></div>';
        a.querySelector('.web-link-title').textContent = l.title;
        a.querySelector('.web-link-url').textContent = l.url;
        a.querySelector('.web-link-snippet').textContent = l.snippet;
        webLinksEl.appendChild(a);
    });

    try {
        const s = await fetch('https://' + host + '.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(subjectName));
        if (s.ok) {
            const d = await s.json();
            if (d.extract && wikipediaEl) {
                wikipediaEl.className = 'wikipedia-box active';
                const t = document.createElement('div'); t.className = 'wikipedia-title'; t.textContent = (d.title || subjectName);
                const e = document.createElement('div'); e.className = 'wikipedia-extract'; e.textContent = d.extract;
                wikipediaEl.appendChild(t); wikipediaEl.appendChild(e);
                if (d.content_urls) {
                    const a = document.createElement('a');
                    a.href = d.content_urls.desktop.page; a.target = '_blank'; a.className = 'wikipedia-link';
                    a.textContent = "Lire l'article complet →";
                    wikipediaEl.appendChild(a);
                }
            }
        }
    } catch (e) { /* wikipédia indisponible */ }
}

// ═══════════════════════════════════════════════════════
// CACHE : accélérer les exercices déjà vus
// ═══════════════════════════════════════════════════════
const CACHE_PREFIX = 'screenmind_cache_';
const CACHE_TTL = 30 * 24 * 3600 * 1000; // 30 jours

async function computeHash() {
    const src = extractedText ? ('T:' + extractedText) : ('I:' + (imageDataUrl || ''));
    try {
        const buf = new TextEncoder().encode(src);
        const digest = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        // Fallback simple si crypto indisponible
        let h = 0;
        for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) >>> 0;
        return 'fb_' + h.toString(16);
    }
}

function cacheGet(hash) {
    if (!hash) return null;
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + hash);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || !data.ts || Date.now() - data.ts > CACHE_TTL) {
            localStorage.removeItem(CACHE_PREFIX + hash);
            return null;
        }
        return data;
    } catch (e) { return null; }
}

function cacheSet(hash, data) {
    if (!hash) return;
    try {
        localStorage.setItem(CACHE_PREFIX + hash, JSON.stringify(Object.assign({}, data || {}, { ts: Date.now() })));
    } catch (e) { /* quota dépassé */ }
}

function addRecalcButton() {
    const old = geminiBlock.querySelector('.recalc-btn');
    if (old) old.remove();
    const b = document.createElement('button');
    b.className = 'btn btn-ghost recalc-btn';
    b.textContent = 'Recalculer (ignorer le cache)';
    b.style.marginTop = '10px';
    b.addEventListener('click', () => { forceRefresh = true; analyzeScreen().catch(err => alert(err && err.message ? err.message : err)); });
    geminiBlock.appendChild(b);
}

async function applyCached(c) {
    showLoading('Résultat en cache…');
    const text = c.text || '';
    lastText = text;
    const langCode = c.langCode || detectLanguage(text);
    lastLang = langCode;
    const detection = c.detection || { subject: 'inconnu', confidence: 0, matchedKeywords: [], topMatches: [] };
    lastDetection = detection;
    localAnswers = c.answers || [];
    unsolvedCount = c.unsolved || 0;
    needsHelp = (localAnswers.length === 0 || unsolvedCount > 0);
    lastAiText = c.aiText || null;

    displayResults(detection, langCode, text);
    renderAnswers(localAnswers, unsolvedCount);
    const dt = $('detected-text');
    if (dt) dt.textContent = text ? (text.length > 2500 ? text.substring(0, 2500) + '…' : text) : 'Aucun texte lu.';

    geminiBlock.style.display = 'block';
    geminiAnswer.innerHTML = '';
    geminiStatus.className = 'hint';
    if (c.aiText) {
        geminiAnswer.innerHTML = mdToHtml(c.aiText);
        geminiStatus.textContent = 'Résultat en cache (instantané).';
        addCopyButton(c.aiText);
    } else if (needsHelp) {
        geminiStatus.textContent = 'Résultat en cache. Tu peux demander un corrigé détaillé.';
    } else {
        geminiStatus.textContent = 'Le site a tout résolu lui-même (hors connexion).';
    }
    addRecalcButton();
    hideLoading();
}

// ═══════════════════════════════════════════════════════
// ANALYSE PRINCIPALE
// ═══════════════════════════════════════════════════════
async function analyzeScreen() {
    if (inputMode === 'screen') {
        const d = frameToDataUrl();
        if (d) setImage(d);
    }
    if (!imageDataUrl && !extractedText) {
        alert("Ajoute d'abord un fichier (image, PDF, texte, audio), une photo ou une capture d'écran.");
        return;
    }

    showLoading('Préparation...');
    try {
        // ── Cache : exercice déjà vu ? ──
        const hash = await computeHash().catch(() => null);
        lastHash = hash;
        if (hash && !forceRefresh) {
            const cached = cacheGet(hash);
            if (cached) {
                forceRefresh = false;
                await applyCached(cached);
                return;
            }
        }
        forceRefresh = false;

        lastAiText = null;
        let text = '';
    let ocrOk = true;

    if (extractedText) {
        text = extractedText;
        ocrOk = true;
    } else {
        try {
            const ocrImage = await prepareOcrImage(imageDataUrl, imageMime);
            const langData = ocrLangSel.value || 'fra+eng';

            showLoading('Lecture du texte (OCR)...');
            const result = await Tesseract.recognize(ocrImage, langData, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        loadingText.textContent = 'OCR en cours... ' + Math.round(m.progress * 100) + '%';
                    } else if (m.status === 'loading language core') {
                        loadingText.textContent = 'Chargement de la langue OCR...';
                    }
                }
            });
            text = (result.data.text || '').trim();
        } catch (err) {
            console.error('Erreur OCR:', err);
            ocrOk = false;
            text = '';
        }
    }
    lastText = text;

    // ── 1. Langue du texte
    const langCode = detectLanguage(text);
    lastLang = langCode;

    // ── 2. Matière / type de document
    const detection = text ? detectSubject(text) : { subject: 'inconnu', confidence: 0, matchedKeywords: [], topMatches: [] };
    lastDetection = detection;

    // ── 3. Réponses automatiques
    const solved = text ? solveLocally(text) : { answers: [], unsolved: 0 };
    localAnswers = solved.answers;
    unsolvedCount = solved.unsolved;
    needsHelp = localAnswers.length === 0 || unsolvedCount > 0 || EXPLAIN_VERBS.test(text) || !ocrOk || !text.trim();

    // ── Affichage
    displayResults(detection, langCode, text || '');
    renderAnswers(localAnswers, unsolvedCount);

    const dt = $('detected-text');
    if (dt) {
        dt.textContent = text
            ? (text.length > 2500 ? text.substring(0, 2500) + '…' : text)
            : (ocrOk ? 'Aucun texte lu sur cette image.' : 'OCR indisponible (vérifie ta connexion la première fois).');
    }

    // ── 4. Corrigé complet
    geminiBlock.style.display = 'block';
    geminiAnswer.innerHTML = '';
    geminiStatus.className = 'hint';

    const key = getApiKey();
    const aiCfg = PROVIDERS[currentProvider()];
    const aiLabel = aiCfg.label;
    const useAI = !!key || aiCfg.kind === 'proxy';
    if (needsHelp) {
        if (useAI) {
            geminiStatus.textContent = localAnswers.length
                ? "Quelques questions dépassent l'analyse locale → envoi direct à " + aiLabel + "…"
                : "Trop complexe pour l'analyse locale → envoi direct à " + aiLabel + "…";
            await askAI();
        } else {
            geminiStatus.className = 'hint warn';
            geminiStatus.textContent = "Cet exercice demande un corrigé détaillé. Ajoute ta clé " + aiLabel + " et le site te donnera les réponses automatiquement, dans la langue de l'image.";
            if (apiDetails) { apiDetails.open = true; }
        }
    } else {
        geminiStatus.textContent = 'Le site a tout résolu lui-même (hors connexion). Tu peux quand même demander un corrigé détaillé.';
    }

    // ── 5. Recherches dans la langue détectée
    const firstQuestion = (text.split(/\n/).map(normalizeLine).find(l => l.length > 12 && /\?|calcule|resous|trouve|find|solve|determine/i.test(l))) || '';
    const query = firstQuestion ? firstQuestion.slice(0, 120) : (detection.matchedKeywords || []).slice(0, 4).join(' ') || 'exercice';
    searchWeb(langCode, query, allCategories[detection.subject] ? allCategories[detection.subject].name : query);

    cacheSet(lastHash, {
        text: text,
        langCode: langCode,
        detection: detection,
        answers: localAnswers,
        unsolved: unsolvedCount,
        aiText: lastAiText
    });

    hideLoading();
    } catch (err) {
        console.error('Erreur analyse:', err);
        alert("Erreur lors de l'analyse : " + (err && err.message ? err.message : err));
    } finally {
        hideLoading();
    }
}

btnAnalyze.addEventListener('click', () => {
    analyzeScreen().catch(err => {
        console.error(err);
        alert('Erreur lors de l\'analyse : ' + err.message);
        hideLoading();
    });
});

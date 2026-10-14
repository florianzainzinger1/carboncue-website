import type { MessageDictionary } from "../messages";

export const dictionary = {
  shell: {
    skipToContent: "Zum Inhalt springen",
    navigationLabel: "Hauptnavigation",
    languageNavigationLabel: "Sprachauswahl",
    currentLanguageLabel: "Aktuelle Sprache",
    footerLabel: "Enterprise Compliance & Financial Architecture",
    disclaimer:
      "CarbonCue bietet operative Entscheidungsunterstützung, Szenarioanalysen und Workflow-Dokumentation. CarbonCue führt keine Handelsgeschäfte aus, erbringt keine regulierte Anlageberatung, ersetzt keine Rechts- oder Regulierungsberatung und garantiert weder die Einhaltung regulatorischer Pflichten noch Marktergebnisse.",
    contactCta: "15-Minuten Erstgespräch anfragen",
  },
  navigation: {
    home: "Start",
    product: "Produkt",
    contact: "Kontakt",
    privacy: "Datenschutz",
    imprint: "Impressum",
  },
  home: {
    metadata: {
      title:
        "CarbonCue | Audit-sichere EU-ETS Compliance & Budgetierung für die Industrie",
      description:
        "Die broker-neutrale Plattform für DACH-Industrieunternehmen: Beenden Sie das Excel-Chaos, schützen Sie sich vor 100 €/t Pönalstrafen und steuern Sie Ihre EUA-Position revisionssicher.",
    },
    hero: {
      badge: "EU-ETS Phase 4 · Broker-Neutrale Compliance-Plattform",
      title: "Volle Kontrolle über Ihre EU-ETS-Budgets.",
      summary:
        "Schluss mit Excel-Chaos und unübersichtlichen E-Mails. CarbonCue bringt Ihre CO₂-Daten, Budgets und Freigaben an einen Ort. So wissen Sie jederzeit exakt, wann Sie was brauchen.",
    },
    story: {
      eyebrow: "So entsteht die Deckungslücke",
      title: "So wird aus CO₂ ein ungedecktes Kostenrisiko.",
      summary:
        "Verfolgen Sie, wie sich über das Jahr unbemerkt eine ungedeckte CO₂-Position aufbaut und ab wann diese Lücke zu einem echten finanziellen Risiko wird.",
      panelTitle: "Ihr Compliance-Jahr",
      demoBadgeLabel: "DEMO",
      demoBadgeAssistiveLabel: "Synthetische Beispielwerte",
      steps: [
        {
          kicker: "Die Verpflichtung",
          title: "Jede Tonne braucht ein Zertifikat",
          text: "Im EU-Emissionshandel muss jede ausgestoßene Tonne CO₂ durch ein Zertifikat gedeckt sein, eine sogenannte EUA.",
        },
        {
          kicker: "Kostenlose Zuteilung",
          title: "Die freie Zuteilung deckt selten alles",
          text: "Ein Teil der Zertifikate wird kostenlos zugeteilt. Bei emissionsintensiven Anlagen reicht diese Menge meist nicht über das ganze Jahr.",
        },
        {
          kicker: "Die Überschreitung",
          title: "Sobald Sie darüber liegen, öffnet sich eine Lücke",
          text: "Übersteigen die kumulierten Emissionen die verfügbare Deckung, entsteht eine ungedeckte Position. Sie wächst bis zum Abgabetermin weiter – die Position kann in beide Richtungen laufen: Deckungslücke oder ungenutzter Überschuss.",
        },
        {
          kicker: "Die doppelten Kosten",
          title: "Eine ungedeckte Position kostet zweimal",
          text: "In diesem Beispiel fällt neben dem Nachkauf der fehlenden Zertifikate zusätzlich eine Strafzahlung an. Beide Beträge addieren sich, sie ersetzen einander nicht.",
        },
        {
          kicker: "Der Ansatz",
          title: "Früh erkennen statt spät reagieren",
          text: "Wird die Lücke Monate im Voraus sichtbar, lässt sie sich planbar schließen: mit Budget, Freigabe und dokumentierter Entscheidung.",
        },
        {
          kicker: "Die andere Richtung",
          title: "Ein Überschuss ist gebundenes Kapital",
          text: "Liegt die Zuteilung über den Emissionen, entsteht ein Überschuss. Unbeachtet bleibt er totes Kapital – sichtbar gemacht wird er zur planbaren Liquiditätsreserve, mit dokumentierter Entscheidung.",
        },
      ],
      graph: {
        alt: "Kumulierte CO₂-Emissionen steigen über die gehaltenen Zertifikate hinaus. Die ungedeckte Menge wird anschließend als Balken aus einzelnen Tonnen dargestellt, deren ungedeckter Teil doppelt belastet wird. Zum Schluss zeigt die Figur den umgekehrten Fall: Die Deckungslinie liegt über den Emissionen und der Überschuss erscheint als zusätzlicher Bestand.",
        emissions: "Emissionen",
        allowances: "Gehaltene Zertifikate",
        shortfallStarts: "Lücke beginnt",
        chargesKicker: "Pro ungedeckter Tonne",
        coveredLabel: "Gedeckt",
        uncoveredLabel: "Ungedeckt",
        penaltyShort: "100 € Strafzahlung",
        repurchaseShort: "Nachkauf trotzdem nötig",
        closedLabel: "Lücke rechtzeitig geschlossen",
        surplusLabel: "Überschuss = gebundenes Kapital",
        surplusShort: "Überschuss",
        months: ["Jan", "Apr", "Jul", "Okt", "Dez"],
      },
    },
    calculator: {
      eyebrow: "Prüfen Sie Ihr Unternehmen",
      title: "Was kostet Ihre ungedeckte Menge?",
      demoLabel: "DEMO",
      demoAssistiveLabel: "Beispielrechnung mit selbst gewählten Werten",
      uncoveredLabel: "Ungedeckte Menge",
      uncoveredHint:
        "Emissionen abzüglich kostenloser Zuteilung und vorhandener Bestände.",
      uncoveredUnit: "t CO₂",
      priceLabel: "Angenommener EUA-Preis",
      priceHint: "Ihre eigene Annahme, keine Prognose.",
      priceUnit: "€ / EUA",
      presetLabel: "Typische Größenordnung wählen",
      presets: ["Keramik", "Papier", "Glas", "Zement / Kalk"],
      budgetLabel: "Beschaffungsbedarf",
      budgetHint: "Das zahlen Sie, wenn Sie rechtzeitig einkaufen.",
      penaltyLabel: "Zusätzliche Strafzahlung",
      penaltyHint:
        "Fällt nur an, wenn die Abgabefrist am 30. September verstreicht.",
      totalRiskLabel: "Kosten im Versäumnisfall",
      totalRiskHint: "Beschaffung und Strafzahlung addieren sich.",
      surplusTitle: "Was ist Ihr Überschuss wert?",
      modeLabel: "Ihre Ausgangslage",
      modeDeficit: "Deckungslücke",
      modeSurplus: "Überschuss",
      surplusVolumeLabel: "Überschussmenge",
      surplusVolumeHint:
        "Kostenlose Zuteilung und Bestände abzüglich Ihrer Emissionen.",
      assetValueLabel: "Rechnerischer Gegenwert",
      assetValueHint: "Gebundenes Kapital bei Ihrer eigenen Preisannahme.",
      assetNote:
        "CarbonCue macht diese Position sichtbar und hält jede Entscheidung dazu audit-sicher fest – ohne Verkaufsempfehlung und ohne Prognose.",
      ctaButton: "Zahlen im 15-Minuten Gespräch einordnen",
    },
    duality: {
      eyebrow: "Beide Richtungen im Griff",
      deficit: {
        kicker: "Deckungslücke",
        title: "Risiko früh erkennen",
        body: "Eine ungedeckte Position wird Monate im Voraus sichtbar und planbar geschlossen: mit Budget, Freigabe und dokumentierter Entscheidung.",
      },
      surplus: {
        kicker: "Überschuss",
        title: "Liquidität sichtbar machen",
        body: "Auch bei Zertifikate-Überschuss: Sichern Sie Ihre Liquidität und dokumentieren Sie audit-sicher. CarbonCue zeigt den rechnerischen Gegenwert Ihres Bestands und hält jede Entscheidung nachvollziehbar fest.",
      },
    },
    solution: {
      eyebrow: "Ihre Lösung",
      title: "Warum CarbonCue perfekt für Ihr Unternehmen ist",
      body: "CarbonCue bringt Ihre Emissionsdaten, Finanzbudgets und internen Freigaben auf einer einzigen Plattform zusammen. So sehen Sie jederzeit auf einen Blick, wie viele Zertifikate Sie benötigen, und können den Kauf rechtzeitig und sicher freigeben.",
    },
    cta: {
      title: "Sehen Sie, wie CarbonCue diese Position erzeugt.",
      description:
        "Auf der Produktseite zeigen wir den vollständigen Ablauf – von den Rohdaten bis zur dokumentierten Entscheidung.",
      primary: "Mehr über unser Produkt",
    },
  },
  product: {
    metadata: {
      title: "Produkt | CarbonCue — Audit-sichere EU-ETS Plattform",
      description:
        "Der durchgängige Workflow von Datenkonsolidierung und Budgetierung bis zur internen Freigabe und Compliance-Dokumentation.",
    },
    intro: {
      eyebrow: "Produktarchitektur",
      title: "Ein strukturierter Workflow für Position, Budget und Freigabe.",
      statusTitle: "Entwicklungs- & Pilotierungsphase",
      statusBody:
        "CarbonCue wird derzeit gemeinsam mit ausgewählten DACH-Industrieunternehmen validiert. Sichern Sie sich im Designpartner-Programm frühzeitigen Zugang.",
    },
    workflow: {
      eyebrow: "Funktionsumfang",
      title: "Jede Stufe schafft Klarheit, Sicherheit und Verantwortlichkeit.",
      stagesLabel: "Sechs Kernkomponenten der CarbonCue-Plattform",
      stages: [
        {
          eyebrow: "Konsolidierung",
          title: "Datenimport & Validierung",
          description:
            "Laden Sie Emissionsmeldungen, Zuteilungsbescheide und Kontostände hoch. CarbonCue prüft die Formate und übernimmt den Rest.",
          exampleLabel: "Beispiel",
          example:
            "ERP-Exporte und Registerstände werden automatisch standardisiert und mit den Vorjahresdaten abgeglichen.",
        },
        {
          eyebrow: "Integrität",
          title: "Datenqualität & Audit-Trail",
          description:
            "Sehen Sie zu jeder Zahl, woher sie stammt, wann sie kam und wer sie zuletzt angefasst hat. Ohne Rückfragen im Controlling.",
          exampleLabel: "Beispiel",
          example:
            "Vorläufige Schätzwerte werden explizit gekennzeichnet, bis die verifizierten Prüfberichte vorliegen.",
        },
        {
          eyebrow: "Deckungsrechnung",
          title: "Echtzeit-Positionsanalyse",
          description:
            "Sie sehen jederzeit, wie viele Tonnen noch ungedeckt sind. Nachvollziehbar bis auf die einzelne Buchung.",
          exampleLabel: "Beispiel",
          example:
            "Sofortiger Überblick über die ungedeckte Tonnenmenge für das laufende und das kommende Erfüllungsjahr.",
        },
        {
          eyebrow: "Finanzszenarien",
          title: "Budgetierung & Sensitivitätsanalyse",
          description:
            "Planen Sie Ihr Beschaffungsbudget über mehrere Preisannahmen hinweg und wissen Sie vorher, was auf den Cashflow zukommt.",
          exampleLabel: "Beispiel",
          example:
            "Vergleich von Best-Case-, Base-Case- und Worst-Case-Preisen für die Treasury-Planung.",
        },
        {
          eyebrow: "Governance",
          title: "Digitale Freigabematrix",
          description:
            "Geben Sie Zukäufe digital frei, nach Ihren Schwellenwerten und Rollen. Jede Freigabe bleibt revisionssicher dokumentiert.",
          exampleLabel: "Beispiel",
          example:
            "Antrag für den Zukauf von 25.000 EUA erfordert die digitale Freigabe durch Werksleitung und CFO.",
        },
        {
          eyebrow: "Reporting",
          title: "Entscheidungsnachweis & Compliance-Export",
          description:
            "Liefern Sie Wirtschaftsprüfern und Aufsichtsorganen auf Knopfdruck den vollständigen Nachweis, statt Belege zusammenzusuchen.",
          exampleLabel: "Beispiel",
          example:
            "Vollständiges Dokumentenpaket mit allen Annahmen, Freigaben und Zeitstempeln auf Knopfdruck.",
        },
      ],
    },
    cta: {
      title: "Erleben Sie den Workflow in Ihrem Unternehmen.",
      description:
        "Wir zeigen Ihnen anhand Ihrer individuellen Anlagenstruktur, wie CarbonCue Ihr EU-ETS-Management optimiert.",
      label: "Kontakt",
    },
  },
  contact: {
    metadata: {
      title: "Kontakt | CarbonCue — Vertraulicher Direktaustausch",
      description:
        "Treten Sie direkt mit dem Gründerteam von CarbonCue in Kontakt für ein 15-minütiges Pilotgespräch.",
    },
    intro: {
      eyebrow: "Direkter Kontakt",
      title: "Sprechen wir über Ihr Setup.",
      summary:
        "Schildern Sie uns kurz Ihre Situation. Wir melden uns verlässlich und vertraulich bei Ihnen.",
    },
    form: {
      nameLabel: "Name",
      companyLabel: "Unternehmen",
      emailLabel: "Geschäftliche E-Mail",
      messageLabel: "Ihre Nachricht (optional)",
      submitLabel: "Anfrage senden",
      submittingLabel: "Wird gesendet …",
      successTitle: "Vielen Dank.",
      successBody:
        "Wir haben Ihre Anfrage erhalten und melden uns in Kürze vertraulich bei Ihnen.",
      errorMessage:
        "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an kontakt@carboncue.eu.",
    },
    confidentiality: {
      title: "Vertraulicher Erstkontakt",
      description:
        "Für ein erstes Kennenlernen genügen Branche und ungefähre Größenordnung. Detaillierte Betriebsdaten fordern wir erst nach Abschluss einer Geheimhaltungsvereinbarung (NDA) an.",
      caution:
        "Bitte übermitteln Sie über den Erstkontakt noch keine vertraulichen Zertifikats- oder Registerunterlagen.",
    },
    founders: {
      title: "Wer hinter CarbonCue steht",
      description:
        "CarbonCue wird in Wien von Studierenden der TU Wien entwickelt. Es ist ein unabhängiges Projekt der Gründer und kein Projekt der Universität; eine Gesellschaft ist noch nicht gegründet.",
      roles: {
        productAndTechnology: "Mitgründer · Produkt & Technologie",
      },
      linkedInSuffix: "auf LinkedIn",
    },
  },
  privacy: {
    metadata: {
      title: "Datenschutz | CarbonCue",
      description:
        "Datenschutzhinweise für die CarbonCue-Website, das Kontaktformular und den E-Mail-Kontakt.",
    },
    eyebrow: "Datenschutz",
    title: "Datenschutzhinweise",
    introduction:
      "Der Schutz Ihrer personenbezogenen Daten hat für CarbonCue höchste Priorität. Diese Website erhebt keine Tracking-Cookies und speichert keine Nutzerprofile.",
    controller: {
      title: "Gemeinsam Verantwortliche",
      description:
        "CarbonCue, Österreich. <Vollständige Angaben: siehe Live-Website>",
      jointLabel: "Gemeinsam Verantwortliche",
      countryLabel: "Land",
      country: "Österreich",
      emailLabel: "Kontakt",
    },
    siteData: {
      title: "Server-Logdaten",
      description:
        "Beim Aufruf der Website fallen lediglich technisch notwendige Server-Logs an, die zur Gewährleistung der Sicherheit und Stabilität des Betriebs dienen.",
    },
    formData: {
      title: "Kontaktformular",
      description:
        "Wenn Sie unser Kontaktformular nutzen, verarbeiten wir die von Ihnen angegebenen Daten – Name, Unternehmen, geschäftliche E-Mail-Adresse und optional Ihre Nachricht – ausschließlich zur Bearbeitung und Beantwortung Ihrer Anfrage.",
      storage:
        "Die Anfragen werden sicher in einer Datenbank unserer Hosting-Infrastruktur (Vercel mit Neon-Datenbank) gespeichert. Für die interne Benachrichtigung über neue Anfragen setzen wir den Transaktions-E-Mail-Dienst Resend ein. Beide Anbieter verarbeiten die Daten ausschließlich in unserem Auftrag.",
    },
    emailData: {
      title: "E-Mail-Kommunikation",
      description:
        "Wenn Sie per E-Mail Kontakt aufnehmen, werden Ihre angegebenen Kontaktdaten ausschließlich zur Bearbeitung der Anfrage verarbeitet.",
      categoriesLabel: "Verarbeitete Datenkategorien",
      categories: [
        "Name und Unternehmensangaben",
        "E-Mail-Adresse und Kommunikationsinhalt",
        "Technische E-Mail-Metadaten",
      ],
    },
    purposes: {
      title: "Zwecke der Verarbeitung",
      description:
        "Die Datenverarbeitung dient ausschließlich folgenden Zwecken:",
      items: [
        "Beantwortung Ihrer geschäftlichen Anfrage",
        "Abstimmung eines Pilotprojekts oder Discovery Calls",
        "Erfüllung gesetzlicher Dokumentationspflichten",
      ],
    },
    legalBasis: {
      title: "Rechtsgrundlagen",
      description:
        "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an geschäftlicher Kommunikation).",
    },
    retention: {
      title: "Speicherdauer",
      description:
        "Daten aus E-Mail-Anfragen werden gelöscht, sobald der jeweilige Vorgang abgeschlossen ist und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.",
    },
    recipients: {
      title: "Empfänger",
      description:
        "Für den Betrieb der Website, die Speicherung von Kontaktanfragen und den E-Mail-Versand setzen wir Auftragsverarbeiter ein (Vercel/Neon für Hosting und Datenbank, Resend für Transaktions-E-Mails). Eine Weitergabe an unbeteiligte Dritte findet nicht statt.",
    },
    rights: {
      title: "Ihre Betroffenenrechte",
      description:
        "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Datenübertragbarkeit.",
      items: [
        "Auskunft",
        "Berichtigung",
        "Löschung",
        "Einschränkung der Verarbeitung",
        "Datenübertragbarkeit",
        "Widerspruch",
      ],
      complaint:
        "Zudem steht Ihnen ein Beschwerderecht bei der österreichischen Datenschutzbehörde zu. E-Mail: kontakt@carboncue.eu.",
    },
    cookies: {
      title: "Keine Cookies & kein Tracking",
      description:
        "Diese Website verwendet keine Marketing-Cookies, kein Google Analytics und keine externen Tracking-Pixel.",
    },
    contact: {
      title: "Kontakt bei Datenschutzfragen",
      description: "Wenden Sie sich direkt an kontakt@carboncue.eu.",
    },
  },
  imprint: {
    metadata: {
      title: "Impressum | CarbonCue",
      description: "Impressumsangaben für die CarbonCue-Website.",
    },
    eyebrow: "Impressum",
    title: "Angaben gemäß § 5 ECG und § 25 MedienG",
    introduction:
      "CarbonCue ist ein Softwareentwicklungsprojekt. <Angaben zu den Betreibern: siehe Live-Website>",
    incomplete: {
      title: "Impressumshinweis",
      description:
        "Softwareentwicklung und Validierung einer broker-neutralen Plattform für EU-ETS Position, Budget und Freigaben.",
    },
    operator: {
      title: "Medieninhaber & Verantwortliche",
      legalBasis: "Angaben nach § 5 ECG & § 25 MedienG",
      jointLabel: "Projektverantwortliche",
      addressLabel: "Standort",
      countryLabel: "Land",
      country: "Österreich",
      emailLabel: "E-Mail",
    },
    mediaOwner: {
      title: "Projekturheber",
      description: "CarbonCue <vollständige Angaben: siehe Live-Website>",
    },
    businessPurpose: {
      title: "Unternehmensgegenstand",
      description:
        "Entwicklung von Softwarelösungen für industrielles CO₂-Emissions- und Budgetmanagement.",
    },
    editorialLine: {
      title: "Grundlegende Richtung",
      description:
        "Information über die CarbonCue-Softwareplattform und Kooperationsmöglichkeiten im Designpartner-Programm.",
    },
    responsibility: {
      title: "Inhaltliche Verantwortung",
      description:
        "CarbonCue <vollständige Angaben: siehe Live-Website>. Kontakt: kontakt@carboncue.eu.",
    },
  },
  demo: {
    eyebrow: "Exemplarisches Rechenbeispiel",
    title: "Vom CO₂-Ausstoß zum klaren Finanzbudget.",
    summary:
      "CarbonCue konsolidiert alle Variablen – Zuteilungen, Bestände und aktuelle Marktpreise – in die einzige Zahl, die für Ihr Controlling zählt.",
    badgeLabel: "DEMO",
    badgeAssistiveLabel: "Synthetische Beispielwerte",
    provenanceLabel: "Beispiel-Kalkulation",
    installationName: "Industrieanlage",
    stagesLabel: "Bedarf, Deckung, Lücke und Budget",
    obligationTitle: "Bedarf",
    coverageTitle: "Vorhandene Deckung",
    gapTitle: "Ungedeckte Lücke",
    minusAssistiveLabel: "minus",
    equalsAssistiveLabel: "ergibt",
    budgetTitle: "Das offene Beschaffungsbudget",
    budgetValueLabel: "Budgetbedarf",
    budgetPriceNote: "Berechnet zum aktuellen Marktpreis von {price} / EUA.",
    footnote:
      "* Alle Zahlen sind rein illustrative Beispiele und stellen keine Marktprognosen dar.",
  },
} as const satisfies MessageDictionary;

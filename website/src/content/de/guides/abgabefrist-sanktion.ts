import type { GuideContent } from "../../guides/types";

/**
 * German-only guide. Text is the verified content of 2026-09-14, copied
 * verbatim; the internal verification notes live in
 * docs/research/seo-guides-verification-2026-09-14.md and are not published.
 */
export const abgabefristSanktionGuide = {
  slug: "abgabefrist-sanktion",
  navLabel: "Abgabefrist & Sanktion",
  metaTitle: "EU-ETS-Abgabefrist 30. September: Sanktion je Tonne (DE/AT)",
  metaDescription:
    "Abgabefrist 30. September: Zahlungspflicht nach TEHG (2025: 135,31 € je Tonne), Sanktionszahlung nach EZG 2011 und Nachabgabe im Vergleich DE/AT.",
  eyebrow: "EU-ETS-1 · Compliance-Zyklus · Deutschland und Österreich",
  h1: "Abgabefrist 30. September: Was passiert, wenn Emissionsberechtigungen fehlen",
  lead: "Betreiber ortsfester Anlagen im EU-ETS-1 müssen bis zum 30. September Berechtigungen in Höhe der Emissionen des Vorjahres abgeben. Für jede fehlende Tonne setzt die Behörde in Deutschland eine Zahlungspflicht fest, in Österreich wird eine Sanktionszahlung mit Bescheid vorgeschrieben; beide gehen von 100 Euro aus und steigen mit dem europäischen Verbraucherpreisindex, in Deutschland für das Berichtsjahr 2025 auf 135,31 Euro je Tonne. Die fehlenden Berechtigungen müssen trotzdem nachträglich abgegeben werden.",
  keyFacts: [
    "Abgabefrist: 30. September für die Emissionen des vorangegangenen Kalenderjahres (DE: § 7 Abs. 1 TEHG, AT: § 32 Abs. 1 EZG 2011) [2][9]",
    "Emissionsbericht: bis 31. März des Folgejahres (DE: § 21 Abs. 1 TEHG, AT: § 9 Abs. 1 EZG 2011) [3][8]",
    "Zahlungspflicht in Deutschland für das Berichtsjahr 2025: 135,31 Euro je nicht abgegebener Tonne CO₂-Äquivalent laut DEHSt [1]",
    "Die Zahlung ersetzt die Abgabe nicht: In Deutschland sind fehlende Berechtigungen bis zum Ablauf des 31. Mai des Folgejahres abzugeben (§ 46 Abs. 3 TEHG) [6]",
    "Veröffentlichung der Namen: in Deutschland im Bundesanzeiger, sofern ein bestandskräftiger Festsetzungsbescheid vorliegt; in Österreich auf der Internetseite des im Gesetz genannten Ministeriums [6][10]",
  ],
  sections: [
    {
      id: "kurzantwort",
      heading: "Kurzantwort",
      paragraphs: [
        "Die Tabelle stellt die Regeln für ortsfeste Anlagen in Deutschland und Österreich gegenüber.",
      ],
      bullets: [
        "Bis 30. September müssen Sie Berechtigungen in Höhe der Emissionen des Vorjahres abgeben [2][9].",
        "Fehlt ein Teil, wird je fehlender Tonne ein indexierter Betrag auf Basis von 100 Euro festgesetzt (DE) oder mit Bescheid vorgeschrieben (AT) [6][10]. In Deutschland nennt die DEHSt für das Berichtsjahr 2025 135,31 Euro [1]; für Österreich haben wir keinen offiziell veröffentlichten Eurobetrag gefunden.",
        "Die Abgabepflicht erlischt dadurch nicht. Zusätzlich werden die Namen veröffentlicht, in Deutschland nach bestandskräftigem Festsetzungsbescheid [6][10].",
      ],
      table: {
        caption:
          "Deutschland und Österreich im Vergleich (EU-ETS-1, ortsfeste Anlagen)",
        head: ["Thema", "Deutschland (TEHG)", "Österreich (EZG 2011)"],
        rows: [
          [
            "Emissionsbericht",
            "bis Ablauf 31. März, § 21 Abs. 1 [3]",
            "bis 31. März, elektronisch, § 9 Abs. 1 [8]",
          ],
          [
            "Abgabefrist",
            "30. September, § 7 Abs. 1 [2]",
            "30. September, § 32 Abs. 1 [9]",
          ],
          [
            "Folge je fehlender Tonne",
            "Zahlungspflicht, 100 € indexiert; 2025: 135,31 € [1][6]",
            "Sanktionszahlung, 100 € indexiert; Betrag laut Bescheid [10]",
          ],
          [
            "Nachabgabe",
            "bis Ablauf 31. Mai des Folgejahres, § 46 Abs. 3 [6]",
            "mit der Abgabe für das folgende Kalenderjahr, § 53 Abs. 1 [10]",
          ],
          [
            "Höhere Gewalt",
            "Absehen von der Festsetzung möglich, § 46 Abs. 1 [6]",
            "Grund unerheblich, § 53 Abs. 3 [10]",
          ],
          [
            "Veröffentlichung",
            "Bundesanzeiger, nach bestandskräftigem Bescheid, § 46 Abs. 4 [1][6]",
            "Internetseite des Ministeriums, § 53 Abs. 4 [10]",
          ],
          [
            "Vollzug",
            "DEHSt im Umweltbundesamt [1]",
            "Ministerium; Register technisch: Umweltbundesamt GmbH [10][12]",
          ],
        ],
      },
    },
    {
      id: "jahreszyklus",
      heading: "Fristen im Jahreszyklus: 31. März und 30. September",
      paragraphs: [
        "Diese Seite betrifft Anlagenbetreiber im EU-ETS-1. Die Frist 30. September gilt in Deutschland auch für Schifffahrtsunternehmen; für Verantwortliche im EU-ETS-2 sieht § 7 TEHG ab dem 1. Januar 2028 eine eigene Abgabefrist zum 31. Mai vor [2]. Das österreichische EZG 2011 spricht statt von Berechtigungen von Emissionszertifikaten; gemeint ist dasselbe.",
        "Der Zyklus beginnt mit der Überwachung: In Deutschland ermitteln Betreiber ihre Emissionen nach dem genehmigten Überwachungsplan (§ 21 Abs. 1 TEHG) [3], in Österreich sind die Emissionen nach § 7 EZG 2011 zu überwachen [8]. Die Angaben im deutschen Emissionsbericht müssen von einer Prüfstelle verifiziert sein (§ 5 Abs. 2 TEHG) [4].",
        "In Deutschland ist der Bericht bis zum Ablauf des 31. März des Folgejahres zu erstatten (§ 21 Abs. 1 TEHG) [3]. In Österreich ist die Emissionsmeldung bis zum 31. März des Folgejahres elektronisch zu übermitteln (§ 9 Abs. 1 EZG 2011), zusammen mit dem Prüfgutachten einer unabhängigen Prüfeinrichtung (§ 10 Abs. 1) [8][11].",
        "Bis 30. September folgt die Abgabe [2][9]. Früher lag diese Frist am 30. April; die Verschiebung auf den 30. September geht auf die Richtlinie (EU) 2023/959 zurück [13]. Die DEHSt nennt den 30. September als Frist seit dem Berichtsjahr 2023 [1], die österreichische Registerstelle schreibt, dass die Abgabe seit 2024 bis 30. September zu erfolgen hat [12]. Beide Angaben beschreiben denselben Schritt: Die Emissionen des Jahres 2023 waren erstmals bis September 2024 abzugeben.",
      ],
    },
    {
      id: "zahlungspflicht-je-tonne",
      heading: "Wie hoch ist die Zahlungspflicht je Tonne?",
      paragraphs: [
        "Nach § 46 Abs. 1 TEHG setzt die zuständige Behörde für jede Tonne CO₂-Äquivalent, für die keine Berechtigungen abgegeben wurden, eine Zahlungspflicht von 100 Euro fest. Der Betrag erhöht sich entsprechend dem europäischen Verbraucherpreisindex gegenüber dem Bezugsjahr 2012 [6].",
        "Hat der Betreiber nach § 5 Abs. 1 TEHG berichtet, darf die Zahlungspflicht nur festgesetzt werden, soweit die abgegebenen Berechtigungen geringer sind als die verifizierten Emissionen im Emissionsbericht (§ 46 Abs. 1 TEHG) [6]. Die DEHSt folgert daraus: Wer entsprechend dem verifizierten Bericht abgegeben hat, bekommt wegen nachträglich festgestellter Berichtsfehler keine Zahlungspflicht auferlegt; die Nachabgabefrist zum 31. Mai ist aber einzuhalten [1].",
        "Hat der Betreiber nicht ordnungsgemäß berichtet, schätzt die Behörde die Emissionen. Die Schätzung unterbleibt, wenn der Betreiber seiner Berichtspflicht im Rahmen der Anhörung ordnungsgemäß nachkommt (§ 46 Abs. 2 TEHG) [6].",
        "Die folgende Tabelle zeigt die von der DEHSt veröffentlichten Beträge je Berichtsjahr [1]. Rechnung für die Unterdeckung: fehlende Tonnen mal Betrag des betreffenden Berichtsjahres.",
      ],
      table: {
        caption:
          "Zahlungspflicht je nicht abgegebener Tonne CO₂-Äquivalent nach Berichtsjahr, Deutschland (Quelle: DEHSt [1], vollständige Reihe 2013 bis 2025)",
        head: ["Berichtsjahr", "Betrag je Tonne"],
        rows: [
          ["2025", "135,31 €"],
          ["2024", "132,06 €"],
          ["2023", "128,71 €"],
          ["2022", "121,01 €"],
          ["2021", "110,82 €"],
          ["2020", "107,71 €"],
          ["2019", "107,71 €"],
          ["2018", "106,15 €"],
          ["2017", "104,06 €"],
          ["2016", "102,31 €"],
          ["2015", "102,05 €"],
          ["2014", "102,07 €"],
          ["2013", "101,50 €"],
        ],
      },
    },
    {
      id: "abgabepflicht-bleibt",
      heading: "Die Abgabepflicht bleibt bestehen",
      paragraphs: [
        "Die Zahlung ist kein Freikauf. Nach § 46 Abs. 3 TEHG bleibt der Betreiber verpflichtet, die fehlenden Berechtigungen bis zum Ablauf des 31. Mai des Folgejahres abzugeben [6]. Die DEHSt verweist ausdrücklich auf diese Nachabgabefrist [1].",
        "In Österreich entbindet die Sanktionszahlung nicht von der Pflicht, Emissionszertifikate in Höhe der Emissionsüberschreitung abzugeben; nach § 53 Abs. 1 EZG 2011 geschieht das mit der Abgabe für das folgende Kalenderjahr [10]. Eine gesonderte Nachabgabefrist wie der 31. Mai in Deutschland ist in § 53 EZG 2011 nicht vorgesehen.",
        "Für die Budgetplanung heißt das: Eine Unterdeckung kostet die Zahlung und zusätzlich die später abzugebenden Berechtigungen.",
      ],
    },
    {
      id: "deutschland",
      heading: "Deutschland: TEHG",
      paragraphs: [
        "Zuständig für den Vollzug ist die Deutsche Emissionshandelsstelle (DEHSt) im Umweltbundesamt [1]. Die für Betreiber relevanten Folgen stehen im TEHG:",
      ],
      bullets: [
        "Zahlungspflicht (§ 46 Abs. 1 TEHG): 100 Euro je Tonne, indexiert. Konnte der Betreiber seiner Abgabepflicht aufgrund höherer Gewalt nicht nachkommen, kann die Behörde von der Festsetzung absehen [6].",
        "Veröffentlichung (§ 46 Abs. 4 TEHG): Namen von Betreibern, die gegen die Abgabepflicht verstoßen, werden im Bundesanzeiger veröffentlicht. Das setzt einen bestandskräftigen Festsetzungsbescheid voraus [6][1].",
        "Kontosperre (§ 45 TEHG): Kommt ein Betreiber seiner Berichtspflicht nicht nach, verfügt die Behörde die Sperrung des Kontos; die Sperre ist aufzuheben, sobald ein ordnungsgemäßer Bericht vorliegt oder die Emissionen geschätzt wurden [5]. Die DEHSt sperrt, wenn bis 31. März kein Emissionsbericht eingereicht und die verifizierten Emissionen nicht ins Unionsregister eingetragen und bestätigt wurden. Aufgehoben wird die Sperre erst nach ordnungsgemäßem Bericht oder Schätzung und dem entsprechenden Registereintrag [1].",
        "Folgen der Sperre laut DEHSt: Die Abgabepflicht kann weiter erfüllt werden, Übertragungen auf andere Konten sind dagegen nicht möglich [1].",
        "Bußgelder (§ 49 TEHG): Wer vorsätzlich einen Bericht nicht, nicht richtig, nicht vollständig oder nicht rechtzeitig erstattet, handelt ordnungswidrig (Abs. 1 Nr. 1); bei Fahrlässigkeit ebenso (Abs. 2). Die Geldbuße beträgt in den Fällen des Abs. 1 bis zu 500.000 Euro, in den übrigen Fällen, also auch bei fahrlässigem Handeln, bis zu 100.000 Euro (Abs. 7) [7].",
      ],
    },
    {
      id: "oesterreich",
      heading: "Österreich: EZG 2011",
      paragraphs: [
        "§ 32 Abs. 1 EZG 2011 verpflichtet den Inhaber einer genehmigten Anlage, jährlich bis 30. September Emissionszertifikate in Höhe der geprüften Emissionen des vorhergehenden Kalenderjahres abzugeben [9]. Wer nicht bis zum 30. September oder innerhalb einer nach § 24c Abs. 4 gesetzten Frist ausreichend abgibt, hat nach § 53 Abs. 1 eine Sanktionszahlung von 100 Euro je Tonne Kohlenstoffdioxidäquivalent zu entrichten [10]. Für ab dem 1. Jänner 2013 vergebene Emissionszertifikate erhöht sich die Sanktionszahlung entsprechend dem Europäischen Verbraucherpreisindex (§ 53 Abs. 2) [10].",
        "Die Sanktion wird mit Bescheid vorgeschrieben. Der Grund, aus dem keine ausreichende Zahl von Emissionszertifikaten abgegeben wurde, ist für die Verhängung unerheblich (§ 53 Abs. 3) [10]. Die Namen der Anlageninhaber sind auf der Internetseite des Ministeriums zu veröffentlichen (§ 53 Abs. 4) [10].",
        "Zur Zuständigkeit: § 53 EZG 2011 nennt in der geltenden Fassung noch das Bundesministerium für Klimaschutz, Umwelt, Energie, Mobilität, Innovation und Technologie [10]. Die Informationen und Formulare für Anlagenbetreiber veröffentlicht inzwischen das Bundesministerium für Land- und Forstwirtschaft, Klima- und Umweltschutz, Regionen und Wasserwirtschaft [11]. Die technische Durchführung des Registers übernimmt die Umweltbundesamt GmbH als Registerstelle [12].",
        "Einen offiziell veröffentlichten indexierten Eurobetrag je Tonne für Österreich haben wir auf den Seiten des Ministeriums und der Registerstelle nicht gefunden (Stand 14.09.2026) [11][12]. Die DEHSt-Werte beruhen auf dem europäischen Verbraucherpreisindex, sind aber keine österreichische Festsetzung. Den konkreten Betrag enthält der Bescheid.",
      ],
    },
    {
      id: "schweiz",
      heading: "Schweiz: eigenes System",
      paragraphs: [
        "Die Schweiz betreibt ein eigenes Emissionshandelssystem, das seit dem 1. Januar 2020 mit dem EU-System verknüpft ist [14]. Fristen, Sanktionen und Zuständigkeiten richten sich nach Schweizer Recht; die Regeln aus TEHG und EZG 2011 lassen sich nicht übertragen. Maßgeblich sind die Informationen des Bundesamts für Umwelt (BAFU) [14].",
      ],
    },
    {
      id: "checkliste",
      heading: "Checkliste vor dem 30. September",
      paragraphs: ["Organisatorische Prüfschritte für die Abgabe:"],
      bullets: [
        "Emissionsmenge des Vorjahres aus dem verifizierten Bericht übernehmen, nicht aus internen Vorabschätzungen [3][9].",
        "Prüfen, ob die verifizierten Emissionen im Unionsregister eingetragen und bestätigt sind und das Konto nicht gesperrt ist [1][5].",
        "Bestand im Registerkonto der Anlage prüfen, einschließlich der kostenlosen Zuteilung, und die Differenz zur verifizierten Menge berechnen.",
        "Zeichnungsberechtigungen und Vertretungsregeln im Register klären, damit die Abgabe nicht an Abwesenheiten scheitert.",
        "Interne Freigabe und Abgabetermin mit Puffer vor dem 30. September festlegen und die erfolgte Abgabe im Register kontrollieren.",
        "Offene Nachabgaben aus Vorjahren berücksichtigen [6][10].",
        "Die Unterdeckungsrechnung (fehlende Tonnen mal Betrag je Tonne) für das Controlling dokumentieren [1].",
      ],
    },
  ],
  faq: [
    {
      question: "Bis wann müssen Emissionsberechtigungen abgegeben werden?",
      answer:
        "Bis zum 30. September für die Emissionen des vorangegangenen Kalenderjahres, in Deutschland nach § 7 Abs. 1 TEHG, in Österreich nach § 32 Abs. 1 EZG 2011 [2][9]. Laut DEHSt gilt diese Frist seit dem Berichtsjahr 2023, vorher war es der 30. April [1].",
    },
    {
      question: "Wie hoch ist die Zahlungspflicht je Tonne?",
      answer:
        "Gesetzlich 100 Euro je Tonne CO₂-Äquivalent, erhöht entsprechend dem europäischen Verbraucherpreisindex gegenüber 2012 [6]. Die DEHSt nennt für das Berichtsjahr 2025 135,31 Euro und für 2024 132,06 Euro [1].",
    },
    {
      question:
        "Kann ich die Unterdeckung bezahlen und die Sache ist erledigt?",
      answer:
        "Nein. In Deutschland bleiben die fehlenden Berechtigungen bis zum Ablauf des 31. Mai des Folgejahres abzugeben [6]. In Österreich sind sie mit der Abgabe für das folgende Kalenderjahr abzugeben [10].",
    },
    {
      question: "Spielt der Grund für die fehlende Abgabe eine Rolle?",
      answer:
        "In Österreich nicht: Nach § 53 Abs. 3 EZG 2011 ist der Grund unerheblich [10]. In Deutschland kann die Behörde bei höherer Gewalt von der Festsetzung absehen (§ 46 Abs. 1 TEHG) [6]. Ob ein Fall darunter fällt, entscheidet die Behörde im Einzelfall.",
    },
    {
      question:
        "Was ist der Unterschied zwischen Kontosperre und Zahlungspflicht?",
      answer:
        "Die Kontosperre nach § 45 TEHG knüpft an die nicht erfüllte Berichtspflicht an [5]. Die Zahlungspflicht nach § 46 TEHG knüpft an fehlende Berechtigungen zum 30. September an [6]. Beides kann unabhängig voneinander eintreten.",
    },
    {
      question:
        "Gibt es in Österreich einen veröffentlichten Eurobetrag für die indexierte Sanktionszahlung?",
      answer:
        "Auf den Seiten des Ministeriums und der Registerstelle haben wir mit Stand 14.09.2026 keinen gefunden [11][12]. § 53 EZG 2011 regelt die Basis von 100 Euro und die Indexierung [10]; die Höhe im Einzelfall ergibt sich aus dem Bescheid.",
    },
  ],
  sources: [
    {
      id: 1,
      label: "Sanktionierung (EU-ETS 1)",
      publisher: "Deutsche Emissionshandelsstelle (DEHSt) im Umweltbundesamt",
      url: "https://www.dehst.de/DE/Themen/EU-ETS-1/EU-ETS-1-Informationen/Sanktionierung/sanktionierung_artikel.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 2,
      label: "§ 7 TEHG – Abgabeverpflichtung",
      publisher: "Bundesministerium der Justiz, gesetze-im-internet.de",
      url: "https://www.gesetze-im-internet.de/tehg_2025/__7.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 3,
      label:
        "§ 21 TEHG – Ermittlung von und Berichterstattung über Emissionen für Anlagen",
      publisher: "Bundesministerium der Justiz, gesetze-im-internet.de",
      url: "https://www.gesetze-im-internet.de/tehg_2025/__21.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 4,
      label: "§ 5 TEHG – Ermittlung von Emissionen und Emissionsbericht",
      publisher: "Bundesministerium der Justiz, gesetze-im-internet.de",
      url: "https://www.gesetze-im-internet.de/tehg_2025/__5.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 5,
      label: "§ 45 TEHG – Durchsetzung der Berichtspflicht",
      publisher: "Bundesministerium der Justiz, gesetze-im-internet.de",
      url: "https://www.gesetze-im-internet.de/tehg_2025/__45.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 6,
      label: "§ 46 TEHG – Durchsetzung der Abgabepflicht",
      publisher: "Bundesministerium der Justiz, gesetze-im-internet.de",
      url: "https://www.gesetze-im-internet.de/tehg_2025/__46.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 7,
      label: "§ 49 TEHG – Bußgeldvorschriften",
      publisher: "Bundesministerium der Justiz, gesetze-im-internet.de",
      url: "https://www.gesetze-im-internet.de/tehg_2025/__49.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 8,
      label: "Emissionszertifikategesetz 2011 (EZG 2011), §§ 7, 9 und 10",
      publisher: "Rechtsinformationssystem des Bundes (RIS)",
      url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007503",
      retrievedOn: "2026-09-14",
    },
    {
      id: 9,
      label: "§ 32 EZG 2011 – Abgabe der Emissionszertifikate für Anlagen",
      publisher: "Rechtsinformationssystem des Bundes (RIS)",
      url: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007503&Paragraf=32",
      retrievedOn: "2026-09-14",
    },
    {
      id: 10,
      label: "§ 53 EZG 2011 – Sanktionen",
      publisher: "Rechtsinformationssystem des Bundes (RIS)",
      url: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007503&Paragraf=53",
      retrievedOn: "2026-09-14",
    },
    {
      id: 11,
      label: "Jährlicher Emissionsbericht (EU-Emissionshandel, Anlagen)",
      publisher:
        "Bundesministerium für Land- und Forstwirtschaft, Klima- und Umweltschutz, Regionen und Wasserwirtschaft (BMLUK)",
      url: "https://www.bmluk.gv.at/themen/klima-und-umwelt/klima/eu_emissionshandel/anlagen/formulare/bericht.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 12,
      label: "Gesetzliche Grundlagen",
      publisher:
        "Österreichisches Emissionshandelsregister (Umweltbundesamt GmbH, Registerstelle)",
      url: "https://www.emissionshandelsregister.at/rechtliches/gesetzlichegrundlagen",
      retrievedOn: "2026-09-14",
    },
    {
      id: 13,
      label: "Richtlinie (EU) 2023/959 zur Änderung der Richtlinie 2003/87/EG",
      publisher: "EUR-Lex, Amt für Veröffentlichungen der EU",
      url: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32023L0959",
      retrievedOn: "2026-09-14",
    },
    {
      id: 14,
      label: "Emissionshandelssystem für Betreiber von Anlagen",
      publisher: "Bundesamt für Umwelt (BAFU)",
      url: "https://www.bafu.admin.ch/de/ehs-anlagen",
      retrievedOn: "2026-09-14",
    },
  ],
  disclaimer:
    "Diese Seite bietet allgemeine Informationen zum EU-Emissionshandel und ist keine Rechts-, Steuer- oder Anlageberatung. Sie ersetzt nicht die Prüfung des Einzelfalls durch die zuständige Behörde oder eine fachkundige Beratung. Stand: 14. September 2026. Hinweise auf Fehler oder veraltete Angaben auf dieser Seite nehmen wir über die Kontaktseite entgegen.",
} as const satisfies GuideContent;

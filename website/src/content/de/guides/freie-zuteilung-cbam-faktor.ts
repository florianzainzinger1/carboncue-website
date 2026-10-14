import type { GuideContent } from "../../guides/types";

/**
 * German-only guide. Text is the verified content of 2026-09-14, copied
 * verbatim; the internal verification notes live in
 * docs/research/seo-guides-verification-2026-09-14.md and are not published.
 */
export const freieZuteilungCbamFaktorGuide = {
  slug: "freie-zuteilung-cbam-faktor",
  navLabel: "Kostenlose Zuteilung & CBAM-Faktor",
  metaTitle: "Kostenlose Zuteilung & CBAM-Faktor 2026–2034: Werte je Jahr",
  metaDescription:
    "CBAM-Faktor 2026–2034 als Tabelle: So sinkt die kostenlose Zuteilung im EU-ETS, wen es trifft, Rechenbeispiel und Kommissionsvorschlag bis 2038.",
  eyebrow: "EU-ETS · Kostenlose Zuteilung",
  h1: "Kostenlose Zuteilung und CBAM-Faktor 2026–2034",
  lead: "Für Waren aus Anhang I der CBAM-Verordnung wird die kostenlose Zuteilung im EU-ETS ab 2026 mit dem CBAM-Faktor gekürzt: von 97,5 % im Jahr 2026 bis 14 % im Jahr 2033; ab 2034 gibt es für diese Waren keine kostenlose Zuteilung mehr [1]. Anlagen, die weder Anhang-I-Waren herstellen noch Wärme für deren Herstellung liefern, trifft der CBAM-Faktor nicht, wohl aber Carbon-Leakage-Faktor, Emissionswerte 2026–2030 und Konditionalität [3][10]. Die Kommission hat am 17.07.2026 vorgeschlagen, das Abschmelzen bis 2038 zu strecken; das ist ein Vorschlag, kein geltendes Recht [5].",
  keyFacts: [
    "CBAM-Faktor nach geltendem Recht: 2026 97,5 %, 2027 95 %, 2028 90 %, 2029 77,5 %, 2030 51,5 %, 2031 39 %, 2032 26,5 %, 2033 14 %; ab 2034 keine kostenlose Zuteilung mehr für diese Waren [1].",
    "Betroffen ist die Herstellung von Waren aus Anhang I der Verordnung (EU) 2023/956: Zement, Strom, Düngemittel, Eisen und Stahl, Aluminium, Wasserstoff [4].",
    "Der CBAM-Status wird über KN-Codes bestimmt; auch Wärme-, Brennstoff- und Prozessemissions-Elemente sowie an andere Anlagen gelieferte Wärme für CBAM-Waren werden nach CBAM-Status getrennt [3].",
    "Die Emissionswerte 2026–2030 legt die Durchführungsverordnung (EU) 2026/1412 vom 26.06.2026 fest [10].",
    "Nicht umgesetzte Energieaudit-Empfehlungen oder ein fehlender Klimaneutralitätsplan können die Zuteilung um 20 % kürzen (Art. 22a und 22b EU-ZuVO) [1][3].",
    "Vorschlag COM(2026) 616 vom 17.07.2026, nicht beschlossen: CBAM-Faktor 2028 91,5 %, 2034–2037 15 %, ab 2038 0 %; ab 2031 Zuteilung grundsätzlich nur mit Dekarbonisierungsplan [5].",
  ],
  sections: [
    {
      id: "kurzantwort",
      heading: "Kurzantwort: CBAM-Faktor je Jahr",
      paragraphs: [
        "Art. 10a Abs. 1a der Richtlinie 2003/87/EG in der Fassung der Richtlinie (EU) 2023/959 bestimmt, dass für die Herstellung der Waren aus Anhang I der CBAM-Verordnung keine Zertifikate kostenlos zugeteilt werden. In den ersten Anwendungsjahren gilt abweichend davon eine geringere Zuteilung, gekürzt über den CBAM-Faktor [1][2]. Die Jahreswerte stehen im Wortlaut unter dem Vorbehalt von Art. 36 Abs. 2 Buchst. b der CBAM-Verordnung, der die Anwendung mehrerer Artikel, darunter Art. 31, ab dem 01.01.2026 regelt [1][4]. Die DEHSt gibt die Werte bis 2030 in Tabelle 3 ihres Leitfadens Zuteilung 2026–2030, Teil 1, wieder; für Produkte außerhalb von Anhang I gilt dort ein Faktor von 1,000 [3].",
        "Die Spalte „Kürzung“ zeigt den Abschlag auf die Zuteilung, die ein CBAM-Zuteilungselement ohne CBAM-Faktor erhalten würde. Sie ist kein Abschlag auf die Emissionen und kein Vergleich mit dem Vorjahr.",
      ],
      table: {
        caption:
          "CBAM-Faktor nach Art. 10a Abs. 1a Richtlinie 2003/87/EG (geltendes Recht) [1][3]",
        head: [
          "Jahr",
          "CBAM-Faktor",
          "Kürzung gegenüber Zuteilung ohne CBAM-Faktor",
        ],
        rows: [
          ["2026", "97,5 %", "2,5 %"],
          ["2027", "95 %", "5 %"],
          ["2028", "90 %", "10 %"],
          ["2029", "77,5 %", "22,5 %"],
          ["2030", "51,5 %", "48,5 %"],
          ["2031", "39 %", "61 %"],
          ["2032", "26,5 %", "73,5 %"],
          ["2033", "14 %", "86 %"],
          ["ab 2034", "keine kostenlose Zuteilung mehr", "100 %"],
        ],
      },
    },
    {
      id: "wen-der-cbam-faktor-trifft",
      heading: "Wen der CBAM-Faktor trifft und wen nicht",
      paragraphs: [
        "Maßgeblich ist Anhang I der Verordnung (EU) 2023/956. Er nennt Waren in sechs Gruppen, jeweils mit KN-Codes: Zement (u. a. Zementklinker, Portlandzement), Strom, Düngemittel (u. a. Salpetersäure, Ammoniak, Stickstoffdünger), Eisen und Stahl (u. a. agglomerierte Eisenerze, Kapitel 72 mit Ausnahmen sowie ausgewählte Waren aus Kapitel 73), Aluminium und Wasserstoff [4]. Für die Stromerzeugung erfolgt nach Art. 10a Abs. 1 der Richtlinie ohnehin grundsätzlich keine kostenlose Zuteilung [1].",
        "Nach dem DEHSt-Leitfaden wird der Carbon-Leakage-Status über PRODCOM-Codes, der CBAM-Status über KN-Codes bestimmt; Betreiber geben für jedes Produkt beide Codes an [3]. Deckt ein Produkt-Emissionswert Waren mit und ohne CBAM-Status ab (Beispiel der DEHSt: Eisenguss), wird die Anlage in ein Zuteilungselement „CBAM“ und eines „nicht CBAM“ mit demselben Emissionswert aufgeteilt [3].",
        "Zu beachten: Auch Wärme- und Brennstoff-Zuteilungselemente sowie Prozessemissionen werden nach CBAM-Status getrennt. Das gilt ebenso für Wärme, die an eine andere Anlage weitergeleitet und dort zur Herstellung von CBAM-Waren genutzt wird [3]. Eine Anlage kann also vom CBAM-Faktor betroffen sein, ohne selbst Stahl oder Zement zu erzeugen.",
        "Nicht in Anhang I aufgeführt sind etwa Kalk, Glas, Keramik, Papier oder Gips [4]; die DEHSt nennt Gips als Beispiel für ein Zuteilungselement „Carbon-Leakage, nicht CBAM“ [3]. Für solche Anlagen gilt kein CBAM-Faktor, wohl aber die Emissionswerte 2026–2030 [10], der Carbon-Leakage-Faktor und die Konditionalität [3].",
        "Anhang I kann sich ändern. Die Kommission hat am 17.12.2025 vorgeschlagen, ihn ab 01.01.2028 auf nachgelagerte Waren aus Stahl und Aluminium zu erweitern [11]. Der Rat hat dazu am 12.06.2026 eine Einigung erzielt; die Verhandlungen mit dem Europäischen Parlament standen danach noch aus [12].",
      ],
    },
    {
      id: "berechnung-freie-zuteilung",
      heading: "So wird die kostenlose Zuteilung berechnet",
      paragraphs: [
        "Die Berechnung erfolgt je Zuteilungselement. Die Emissionswerte 2026–2030 hat die Kommission mit der Durchführungsverordnung (EU) 2026/1412 vom 26.06.2026 festgelegt, veröffentlicht am 29.06.2026 [10]. Die folgenden Angaben stützen sich auf den DEHSt-Leitfaden Teil 1 (Stand März 2024). Er erschien, als die Delegierte Verordnung (EU) 2019/331 (EU-Zuteilungsverordnung, EU-ZuVO) noch geändert wurde, und steht nach eigener Aussage unter Vorbehalt [3]. Maßgeblich sind die geltenden Rechtsakte und der Zuteilungsbescheid.",
        "Grundlage ist das Produkt aus historischer Aktivitätsrate und Emissionswert (Produkt-, Wärme- oder Brennstoff-Emissionswert). Für Prozessemissionen dienen bis 31.12.2027 97 % und ab 2028 91 % der zuteilungsfähigen historischen Prozessemissionen als Basis. Die historische Aktivitätsrate für 2026–2030 ist der Median der Jahre 2019 bis 2023 [3].",
        "Der Carbon-Leakage-Faktor beträgt 1,0 für Sektoren mit Verlagerungsrisiko. Ohne Verlagerungsrisiko sinkt er von 0,300 (2026) über 0,225, 0,150 und 0,075 auf 0,000 (2030); für Fernwärme bleibt er bei 0,300 [3].",
        "Vereinfacht je Element: Emissionswert × historische Aktivitätsrate × Carbon-Leakage-Faktor × CBAM-Faktor. Die Summe über alle Elemente ergibt die vorläufige Zuteilung. Darauf kommt gegebenenfalls der sektorübergreifende Korrekturfaktor, den die Kommission einheitlich festlegt; ausgenommen sind die effizientesten Anlagen je Produkt (Art. 16 Abs. 8 EU-ZuVO) [3].",
        "Weicht die Aktivitätsrate im gleitenden Zweijahresdurchschnitt um mehr als 15 % ab, wird die Zuteilung angepasst [6].",
        "Zwei Kürzungen um je 20 % sind möglich [3]:",
      ],
      bullets: [
        "Art. 22a EU-ZuVO: Anlagen mit Pflicht zu Energieaudit oder zertifiziertem Energiemanagementsystem erhalten die volle Zuteilung nur, wenn die empfohlenen Maßnahmen umgesetzt wurden. Ausnahmen gelten u. a. bei einer Amortisationszeit von mehr als drei Jahren oder gleichwertigen anderen Minderungsmaßnahmen [1][3].",
        "Art. 22b EU-ZuVO: Lag die Emissionsintensität eines Produkt-Emissionswert-Elements (Mittelwert 2016/2017) über dem 80. Perzentil, war bis 01.05.2024 ein Klimaneutralitätsplan zu erstellen, sonst wird die Zuteilung um 20 % gekürzt. Ausgenommen sind Elemente mit weniger als 20 % Anteil an der vorläufigen Zuteilung. Betroffene Betreiber informiert die DEHSt individuell [1][3].",
      ],
    },
    {
      id: "rechenbeispiel",
      heading: "Rechenbeispiel in Tonnen (fiktiv)",
      paragraphs: [
        "Fiktives Beispiel, keine reale Anlage und keine realen Emissionswerte. Annahmen: eine Anlage mit einem einzigen Zuteilungselement „Produkt-Emissionswert, Carbon-Leakage, CBAM“; angenommener Emissionswert 0,700 t CO₂/t Produkt; historische Aktivitätsrate 1.000.000 t Produkt, über alle Jahre unverändert; Carbon-Leakage-Faktor 1,0; sektorübergreifender Korrekturfaktor 1,0; keine Kürzung nach Art. 22a oder 22b; jährliche Emissionen konstant 800.000 t CO₂. Ab 2031 unterstellt das Beispiel vereinfachend unveränderte Emissionswerte und Aktivitätsraten, die tatsächlich neu festgelegt werden. Die im Kommissionsvorschlag vorgesehene Konditionalität ab 2031 ist nicht berücksichtigt.",
        "Zuteilung vor CBAM-Faktor: 0,700 × 1.000.000 = 700.000 Zertifikate pro Jahr. Die Deckungslücke ist die Differenz zwischen Emissionen und kostenloser Zuteilung.",
      ],
      table: {
        caption:
          "Fiktives Beispiel: Zuteilung und Deckungslücke in t CO₂ (geltender CBAM-Faktor [1])",
        head: [
          "Jahr",
          "CBAM-Faktor",
          "Kostenlose Zuteilung",
          "Deckungslücke bei 800.000 t",
        ],
        rows: [
          ["2026", "97,5 %", "682.500", "117.500"],
          ["2027", "95 %", "665.000", "135.000"],
          ["2028", "90 %", "630.000", "170.000"],
          ["2029", "77,5 %", "542.500", "257.500"],
          ["2030", "51,5 %", "360.500", "439.500"],
          ["2031", "39 %", "273.000", "527.000"],
          ["2032", "26,5 %", "185.500", "614.500"],
          ["2033", "14 %", "98.000", "702.000"],
          ["2034", "keine kostenlose Zuteilung", "0", "800.000"],
        ],
      },
    },
    {
      id: "begriffsfalle-kuerzung",
      heading: "Faktor und Kürzung: „CBAM-Faktor 97,5 %“ heißt „2,5 % Kürzung“",
      paragraphs: [
        "Beide Angaben beschreiben denselben Wert: Ein CBAM-Faktor von 97,5 % bedeutet 2,5 % weniger als ohne Faktor [1]. Verwechslungen entstehen an drei Stellen.",
        "Erstens gilt der Abschlag nur für CBAM-Zuteilungselemente, nicht für die ganze Anlage [3]. Zweitens bezieht er sich auf die Zuteilung ohne CBAM-Faktor im selben Jahr, nicht auf die Zuteilung 2021–2025, denn Emissionswerte und Aktivitätsraten wurden für 2026–2030 neu bestimmt [3][10]. Drittens: Ein CBAM-Faktor von 51,5 % im Jahr 2030 entspricht einer Kürzung um 48,5 % [1].",
      ],
    },
    {
      id: "geltendes-recht-vs-vorschlag",
      heading: "Geltendes Recht und Kommissionsvorschlag COM(2026) 616",
      paragraphs: [
        "Am 17.07.2026 hat die Kommission den Vorschlag COM(2026) 616 zur Änderung der Richtlinie 2003/87/EG vorgelegt [5]. Er ist nicht beschlossen. Bis zu einer Annahme durch Parlament und Rat gelten die Werte aus Art. 10a Abs. 1a in der aktuellen Fassung [1].",
        "Laut Begründung sollen ab 2028 15 % der durch den CBAM-Faktor abgeschmolzenen Zuteilung wieder eingeführt und das Auslaufen bis 2038 verzögert werden. Die Werte des vorgeschlagenen Gesetzestexts stehen in der Tabelle am Ende dieses Abschnitts [5]. Für Waren, die künftig in Anhang I aufgenommen werden, sieht der Vorschlag 97,9 % im ersten und 95,8 % im zweiten Jahr des auf die Aufnahme folgenden Fünfjahres-Zuteilungszeitraums vor, bis dahin 100 %; danach folgt die Staffel ab dem Wert für 2028 [5].",
        "Ab 2031 soll die kostenlose Zuteilung grundsätzlich an einen verifizierten und genehmigten Dekarbonisierungsplan gebunden sein (englische Fassung: „Invest in EU decarbonisation plan“). Die Investitionen müssten je Fünfjahreszeitraum mindestens dem wirtschaftlichen Wert von 100 % der kostenlosen Zuteilung entsprechen. Bestandsanlagen würden den Plan mit den bis 30.09.2029 zu übermittelnden Daten einreichen. Nach Genehmigung würden 80 % der Zuteilung jährlich ausgegeben, die übrigen 20 % erst, wenn die Behörde spätestens zwei Jahre nach Ende des Zeitraums Umsetzung und erhebliche Emissionsminderungen bestätigt. Bei Verlagerung aus der EU wären erhaltene Zertifikate zurückzugeben [5].",
        "Die bisherigen Kürzungsregeln zu Energieaudit und Klimaneutralitätsplan (Art. 10a Abs. 1 Unterabs. 3 bis 6 und Art. 10b Abs. 4 Unterabs. 2 bis 5 der Richtlinie) würden ab 2031 nicht mehr angewendet. Ausnahmen oder Sonderregeln sind u. a. für Anlagen mit Projekten aus Innovationsfonds oder Industrial Decarbonisation Bank, für die 10 % effizientesten Anlagen und für emissionsfreie oder emissionsarme Anlagen vorgesehen [5]. Laut ICAP wird eine Einigung bis Ende des ersten Quartals 2027 angestrebt [8].",
        "Ein gesonderter Verordnungsvorschlag vom selben Tag, COM(2026) 619, soll die Zuteilung nach Wärme- und Brennstoff-Emissionswert für 2026–2030 über eine geringere maximale jährliche Minderungsrate um insgesamt rund 80 Millionen Zertifikate erhöhen; der Ausgleich für 2026 würde über die Werte für 2027 erfolgen. Auch er ist nicht beschlossen [7]. Die Kommissionsseite zur Zuteilung an Industrieanlagen spricht von einem Abschmelzen zwischen 2026 und 2038 [6]. Das entspricht dem Vorschlag; nach geltendem Recht endet die kostenlose Zuteilung für diese Waren 2034 [1].",
      ],
      table: {
        caption:
          "CBAM-Faktor: geltendes Recht [1] und Vorschlag COM(2026) 616 [5]",
        head: ["Jahr", "Geltendes Recht", "Vorschlag (nicht beschlossen)"],
        rows: [
          ["2026", "97,5 %", "97,5 %"],
          ["2027", "95 %", "95 %"],
          ["2028", "90 %", "91,5 %"],
          ["2029", "77,5 %", "81 %"],
          ["2030", "51,5 %", "59 %"],
          ["2031", "39 %", "48 %"],
          ["2032", "26,5 %", "37,5 %"],
          ["2033", "14 %", "27 %"],
          ["2034–2037", "0 % (keine kostenlose Zuteilung)", "15 %"],
          ["ab 2038", "0 % (keine kostenlose Zuteilung)", "0 %"],
        ],
      },
    },
    {
      id: "budgetplanung",
      heading: "Was das für die Budgetplanung bedeutet",
      paragraphs: [
        "Für die Budgetplanung bietet es sich an, zuerst in Tonnen statt in Euro zu rechnen. Die Deckungslücke je Jahr ergibt sich aus erwarteten Emissionen minus erwarteter kostenloser Zuteilung. Beides lässt sich mit den Angaben aus dem Zuteilungsbescheid, soweit er vorliegt, sonst mit den Daten des Zuteilungsantrags, und der Tabelle oben fortschreiben.",
        "Sinnvoll sind mindestens zwei Pfade: geltendes Recht und Kommissionsvorschlag. Solange der Vorschlag nicht angenommen ist, bildet nur der erste Pfad die Rechtslage ab [1][5]. Ein Kostenwert entsteht erst, wenn die Tonnen mit einer eigenen Preisannahme multipliziert werden. Diese Annahme sollte als solche gekennzeichnet und mit Spannbreiten gerechnet werden.",
        "Weitere Unsicherheiten: der sektorübergreifende Korrekturfaktor [3], Anpassungen bei Produktionsänderungen [6], mögliche 20-%-Kürzungen nach Art. 22a oder 22b bis einschließlich 2030 [3], der Vorschlag COM(2026) 619 [7] und neue Emissionswerte ab 2031. In Österreich sah der Zeitplan des BMLUK eine Buchung der Gratiszuteilungen 2026 im Unionsregister ab September 2026 vor [9]; ob sie erfolgt ist, ist hier nicht geprüft. Den Stand der eigenen Anlage erfahren Sie in Deutschland bei der DEHSt; aktuelle Hinweise für Österreich veröffentlicht das BMLUK [9].",
      ],
    },
  ],
  faq: [
    {
      question: "Wie hoch ist der CBAM-Faktor 2026?",
      answer:
        "97,5 %. CBAM-Zuteilungselemente erhalten 2026 also 2,5 % weniger kostenlose Zuteilung als ohne Faktor [1][3].",
    },
    {
      question: "Wie hoch ist der CBAM-Faktor 2027 und 2030?",
      answer:
        "2027 beträgt er 95 %, 2030 51,5 %. Das sind 5 % bzw. 48,5 % weniger kostenlose Zuteilung für CBAM-Zuteilungselemente [1][3].",
    },
    {
      question:
        "Ab wann gibt es für CBAM-Waren keine kostenlose Zuteilung mehr?",
      answer:
        "Nach geltendem Recht ab 2034 [1]. Der Kommissionsvorschlag COM(2026) 616 würde das auf 2038 verschieben, ist aber nicht beschlossen [5].",
    },
    {
      question:
        "Gilt der CBAM-Faktor auch für Kalk-, Glas- oder Papieranlagen?",
      answer:
        "Nach dem derzeitigen Anhang I der CBAM-Verordnung nein, diese Waren sind dort nicht aufgeführt [4]. Es gelten aber Carbon-Leakage-Faktor, Emissionswerte 2026–2030 und die Konditionalität nach Art. 22a und 22b EU-ZuVO [3][10]. Ausnahme: Liefert die Anlage Wärme an eine Anlage, die damit CBAM-Waren herstellt, wird dieser Wärmeanteil nach dem DEHSt-Leitfaden als CBAM-Element geführt [3].",
    },
    {
      question:
        "Wird die Zuteilung der ganzen Anlage mit dem CBAM-Faktor multipliziert?",
      answer:
        "Nein, nur die Zuteilungselemente mit CBAM-Status. Deshalb trennt die DEHSt Produkt-, Wärme-, Brennstoff- und Prozessemissions-Elemente nach CBAM-Status [3].",
    },
    {
      question: "Kann die Zuteilung zusätzlich zum CBAM-Faktor sinken?",
      answer:
        "Ja. Möglich sind der sektorübergreifende Korrekturfaktor und Kürzungen um 20 % bei nicht umgesetzten Energieaudit-Empfehlungen oder fehlendem Klimaneutralitätsplan [3]. Außerdem wird die Zuteilung angepasst, wenn die Aktivitätsrate im gleitenden Zweijahresdurchschnitt um mehr als 15 % abweicht [6].",
    },
  ],
  sources: [
    {
      id: 1,
      label:
        "Richtlinie 2003/87/EG, konsolidierte Fassung vom 01.03.2024 (u. a. Art. 10a Abs. 1 und 1a, Art. 10b Abs. 4)",
      publisher: "EUR-Lex, Amt für Veröffentlichungen der EU",
      url: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02003L0087-20240301",
      retrievedOn: "2026-09-14",
    },
    {
      id: 2,
      label: "Richtlinie (EU) 2023/959 zur Änderung der Richtlinie 2003/87/EG",
      publisher: "EUR-Lex, Amt für Veröffentlichungen der EU",
      url: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32023L0959",
      retrievedOn: "2026-09-14",
    },
    {
      id: 3,
      label:
        "Leitfaden Zuteilung 2026–2030, Teil 1 (Stand März 2024), Kap. 3.1–3.5, Tabellen 2 und 3",
      publisher: "Deutsche Emissionshandelsstelle (DEHSt) im Umweltbundesamt",
      url: "https://www.dehst.de/SharedDocs/downloads/DE/stationaere_anlagen/2026-2030/leitfaden-zuteilung-2026-2030-1.pdf?__blob=publicationFile&v=5",
      retrievedOn: "2026-09-14",
    },
    {
      id: 4,
      label: "Verordnung (EU) 2023/956 (CBAM-Verordnung), Anhang I und Art. 36",
      publisher: "EUR-Lex, Amt für Veröffentlichungen der EU",
      url: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32023R0956",
      retrievedOn: "2026-09-14",
    },
    {
      id: 5,
      label:
        "COM(2026) 616 final vom 17.07.2026, Vorschlag zur Änderung der Richtlinie 2003/87/EG (Begründung; Art. 1 zu Art. 10a Abs. 1a, 3a bis 3c)",
      publisher: "Europäische Kommission, via EUR-Lex (englische Fassung)",
      url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52026PC0616",
      retrievedOn: "2026-09-14",
    },
    {
      id: 6,
      label: "Allocation to industrial installations",
      publisher: "Europäische Kommission, GD Klimapolitik",
      url: "https://climate.ec.europa.eu/eu-action/carbon-markets/eu-emissions-trading-system-eu-ets/free-allocation/allocation-industrial-installations_en",
      retrievedOn: "2026-09-14",
    },
    {
      id: 7,
      label:
        "COM(2026) 619 final vom 17.07.2026, Vorschlag zu angepassten Werten der Wärme- und Brennstoff-Emissionswerte 2026–2030",
      publisher: "Europäische Kommission",
      url: "https://climate.ec.europa.eu/document/download/672f0f66-a1c2-41d4-a6d6-ff82fea1eb62_en",
      retrievedOn: "2026-09-14",
    },
    {
      id: 8,
      label: "EU Commission publishes EU ETS review proposal",
      publisher:
        "International Carbon Action Partnership (ICAP), Sekundärquelle",
      url: "https://icapcarbonaction.com/en/news/eu-commission-publishes-eu-ets-review-proposal",
      retrievedOn: "2026-09-14",
    },
    {
      id: 9,
      label: "Aktuelle Entwicklung – Sondersituation 2026",
      publisher:
        "Bundesministerium für Land- und Forstwirtschaft, Klima- und Umweltschutz, Regionen und Wasserwirtschaft (BMLUK)",
      url: "https://www.bmluk.gv.at/themen/klima-und-umwelt/klima/eu_emissionshandel/aktuelle_entwicklung.html",
      retrievedOn: "2026-09-14",
    },
    {
      id: 10,
      label:
        "Durchführungsverordnung (EU) 2026/1412 der Kommission vom 26.06.2026 zur Festlegung angepasster Benchmarkwerte für 2026–2030 (ABl. L vom 29.06.2026)",
      publisher: "EUR-Lex, Amt für Veröffentlichungen der EU",
      url: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32026R1412",
      retrievedOn: "2026-09-14",
    },
    {
      id: 11,
      label:
        "COM(2025) 989 final vom 17.12.2025, Vorschlag zur Erweiterung der CBAM-Verordnung auf nachgelagerte Waren",
      publisher: "Europäische Kommission, via EUR-Lex",
      url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025PC0989",
      retrievedOn: "2026-09-14",
    },
    {
      id: 12,
      label:
        "Commission welcomes Council agreement on strengthening CBAM (12.06.2026)",
      publisher: "Europäische Kommission, GD Steuern und Zollunion",
      url: "https://taxation-customs.ec.europa.eu/news/commission-welcomes-council-agreement-strengthening-cbam-2026-06-12_en",
      retrievedOn: "2026-09-14",
    },
  ],
  disclaimer:
    "Diese Seite enthält allgemeine Informationen zur Rechtslage im EU-ETS und ist keine Rechts-, Steuer- oder Anlageberatung. Sie ersetzt nicht die Prüfung des Einzelfalls und nicht den Zuteilungsbescheid der zuständigen Behörde. Das Rechenbeispiel ist fiktiv. Die Kommissionsvorschläge COM(2026) 616, COM(2026) 619 und COM(2025) 989 sind nicht beschlossen und können sich im Gesetzgebungsverfahren ändern. Stand: 14. September 2026.",
} as const satisfies GuideContent;

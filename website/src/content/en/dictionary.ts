import type { MessageDictionary } from "../messages";

export const dictionary = {
  shell: {
    skipToContent: "Skip to content",
    navigationLabel: "Primary navigation",
    languageNavigationLabel: "Language selection",
    currentLanguageLabel: "Current language",
    footerLabel: "Enterprise Compliance & Financial Architecture",
    disclaimer:
      "CarbonCue provides operational decision support, scenario analysis, and workflow documentation. It does not execute trades, provide regulated investment advice, replace legal or regulatory advice, or guarantee compliance or market outcomes.",
    contactCta: "Request a 15-minute intro call",
  },
  navigation: {
    home: "Home",
    product: "Product",
    contact: "Contact",
    privacy: "Privacy",
    imprint: "Imprint",
  },
  home: {
    metadata: {
      title:
        "CarbonCue | Audit-Proof EU ETS Compliance & Budgeting for Industry",
      description:
        "The broker-neutral platform for industrial leaders in the DACH region: eliminate spreadsheet chaos, prevent €100/t penalty exposure, and manage EUA requirements with full auditability.",
    },
    hero: {
      badge: "EU ETS Phase 4 · Broker-Neutral Compliance Platform",
      title: "Take full control over your EU ETS budgets.",
      summary:
        "Stop managing EU ETS compliance in messy Excel sheets. CarbonCue brings your emissions data, budgets, and approvals into one place, so you always know exactly what you need and when.",
    },
    story: {
      eyebrow: "How the coverage gap opens",
      title: "How CO₂ turns into an uncovered financial risk.",
      summary:
        "Follow how an uncovered CO₂ position builds up unnoticed over the year, and at what point that gap becomes a real financial risk.",
      panelTitle: "Your compliance year",
      demoBadgeLabel: "DEMO",
      demoBadgeAssistiveLabel: "Synthetic example values",
      steps: [
        {
          kicker: "The obligation",
          title: "Every tonne needs an allowance",
          text: "Under the EU Emissions Trading System every tonne of CO₂ emitted must be matched by one allowance, an EUA.",
        },
        {
          kicker: "Free allocation",
          title: "Free allocation rarely covers it all",
          text: "Part of the allowances is allocated for free. For emission-intensive installations that volume usually does not stretch across the whole year.",
        },
        {
          kicker: "The overshoot",
          title: "Once you pass it, a gap opens",
          text: "When cumulative emissions exceed the available coverage, an uncovered position appears. It keeps widening until the surrender date - and the position can run in either direction: a coverage gap or an unused surplus.",
        },
        {
          kicker: "The double cost",
          title: "An uncovered position costs twice",
          text: "In this example the missing allowances still have to be bought, and a penalty applies on top. The two amounts add up, they do not replace each other.",
        },
        {
          kicker: "The approach",
          title: "See it early instead of reacting late",
          text: "When the gap is visible months ahead it can be closed deliberately: with a budget, an approval and a documented decision.",
        },
        {
          kicker: "The other direction",
          title: "A surplus is bound capital",
          text: "When allocation exceeds emissions, a surplus builds up. Ignored, it sits as dead capital - made visible, it becomes a plannable liquidity reserve with a documented decision.",
        },
      ],
      graph: {
        alt: "Cumulative CO₂ emissions rising past the allowances held. The uncovered volume is then shown as a bar of individual tonnes whose uncovered part is charged twice. Finally the figure shows the opposite case: the coverage line sits above the emissions and the surplus appears as additional holdings.",
        emissions: "Emissions",
        allowances: "Allowances held",
        shortfallStarts: "gap starts",
        chargesKicker: "Per uncovered tonne",
        coveredLabel: "Covered",
        uncoveredLabel: "Uncovered",
        penaltyShort: "€100 penalty",
        repurchaseShort: "Repurchase still required",
        closedLabel: "Gap closed in time",
        surplusLabel: "Surplus = bound capital",
        surplusShort: "Surplus",
        months: ["Jan", "Apr", "Jul", "Oct", "Dec"],
      },
    },
    calculator: {
      eyebrow: "Check your own company",
      title: "What does your uncovered volume cost?",
      demoLabel: "DEMO",
      demoAssistiveLabel: "Example calculation with values you choose",
      uncoveredLabel: "Uncovered volume",
      uncoveredHint:
        "Emissions minus free allocation and allowances already held.",
      uncoveredUnit: "t CO₂",
      priceLabel: "Assumed EUA price",
      priceHint: "Your own assumption, not a forecast.",
      priceUnit: "€ / EUA",
      presetLabel: "Pick a typical order of magnitude",
      presets: ["Ceramics", "Paper", "Glass", "Cement / lime"],
      budgetLabel: "Procurement need",
      budgetHint: "What you pay when you buy in time.",
      penaltyLabel: "Additional penalty",
      penaltyHint: "Applies only if the 30 September deadline is missed.",
      totalRiskLabel: "Cost if the deadline is missed",
      totalRiskHint: "Procurement and penalty add up.",
      surplusTitle: "What is your surplus worth?",
      modeLabel: "Your position",
      modeDeficit: "Deficit",
      modeSurplus: "Surplus",
      surplusVolumeLabel: "Surplus volume",
      surplusVolumeHint: "Free allocation and holdings minus your emissions.",
      assetValueLabel: "Calculated equivalent value",
      assetValueHint: "Bound capital at your own price assumption.",
      assetNote:
        "CarbonCue makes this position visible and keeps every decision about it documented and audit-proof - no sale recommendation, no forecast.",
      ctaButton: "Put these numbers in context in a 15-minute call",
    },
    duality: {
      eyebrow: "Both directions covered",
      deficit: {
        kicker: "Coverage gap",
        title: "See the risk early",
        body: "An uncovered position becomes visible months ahead and is closed deliberately: with a budget, an approval and a documented decision.",
      },
      surplus: {
        kicker: "Surplus",
        title: "Make liquidity visible",
        body: "Holding surplus allowances? Secure your liquidity and document it audit-proof. CarbonCue shows the calculated value of your holdings and keeps every decision traceable.",
      },
    },
    solution: {
      eyebrow: "Your solution",
      title: "Why CarbonCue fits your company",
      body: "CarbonCue brings your emissions data, financial budgets and internal approvals together on a single platform. You see at a glance how many allowances you need, and you can approve the purchase in time and with confidence.",
    },
    cta: {
      title: "See how CarbonCue produces that position.",
      description:
        "The product page walks through the full flow – from raw inputs to a documented decision.",
      primary: "More about our product",
    },
  },
  product: {
    metadata: {
      title: "Product | CarbonCue — Audit-Proof EU ETS Platform",
      description:
        "The complete end-to-end workflow from data consolidation and financial scenario modeling to internal approvals and compliance exports.",
    },
    intro: {
      eyebrow: "Product Architecture",
      title: "A Structured Workflow for Position, Budget, and Approval.",
      statusTitle: "Development & Pilot Phase",
      statusBody:
        "CarbonCue is currently being co-developed with selected DACH manufacturing leaders. Secure early access via our Design Partner Program.",
    },
    workflow: {
      eyebrow: "Platform Capabilities",
      title: "Every Stage Delivers Clarity, Security, and Accountability.",
      stagesLabel: "Six core stages of the CarbonCue platform",
      stages: [
        {
          eyebrow: "Ingestion",
          title: "Data Import & Validation",
          description:
            "Upload emissions reports, allocation notices and registry balances. CarbonCue checks the formats and takes care of the rest.",
          exampleLabel: "Example",
          example:
            "ERP exports and registry balances are standardized and reconciled with prior-year baseline records.",
        },
        {
          eyebrow: "Integrity",
          title: "Data Quality & Provenance",
          description:
            "For every figure you see where it came from, when it arrived and who touched it last. No follow-up questions from finance.",
          exampleLabel: "Example",
          example:
            "Preliminary estimates are clearly flagged until official verified audit reports are attached.",
        },
        {
          eyebrow: "Net Position",
          title: "Real-Time Exposure Analysis",
          description:
            "You see how many tonnes are still uncovered at any moment, traceable down to the individual entry.",
          exampleLabel: "Example",
          example:
            "Instant clarity on the uncovered EUA deficit for the current and the next compliance year.",
        },
        {
          eyebrow: "Financial Scenarios",
          title: "Budgeting & Sensitivity Modeling",
          description:
            "Plan your procurement budget across several price assumptions and know in advance what it does to cashflow.",
          exampleLabel: "Example",
          example:
            "Comparison of base-case and stress-case price assumptions for treasury committee sign-off.",
        },
        {
          eyebrow: "Governance",
          title: "Digital Approval Matrix",
          description:
            "Approve purchases digitally along your own thresholds and roles. Every approval stays documented and audit-proof.",
          exampleLabel: "Example",
          example:
            "Procurement request for 25,000 EUAs requires dual digital sign-off from Plant Manager and CFO.",
        },
        {
          eyebrow: "Reporting",
          title: "Decision Record & Compliance Export",
          description:
            "Hand auditors and supervisory bodies the complete record at the press of a button, instead of chasing evidence.",
          exampleLabel: "Example",
          example:
            "Complete audit package containing all historical snapshots, approvals, and timestamps in seconds.",
        },
      ],
    },
    cta: {
      title: "Experience the workflow inside your own company.",
      description:
        "Let us demonstrate how CarbonCue eliminates manual risk for your specific multi-installation footprint.",
      label: "Contact",
    },
  },
  contact: {
    metadata: {
      title: "Contact | CarbonCue — Confidential Founder Exchange",
      description:
        "Connect directly with the founders of CarbonCue for a 15-minute discovery consultation.",
    },
    intro: {
      eyebrow: "Direct contact",
      title: "Let's talk about your setup.",
      summary:
        "Tell us briefly about your situation. We reply reliably and in confidence.",
    },
    form: {
      nameLabel: "Name",
      companyLabel: "Company",
      emailLabel: "Business email",
      messageLabel: "Your message (optional)",
      submitLabel: "Send inquiry",
      submittingLabel: "Sending …",
      successTitle: "Thank you.",
      successBody:
        "We have received your inquiry and will get back to you shortly and in confidence.",
      errorMessage:
        "Your inquiry could not be sent. Please try again or email us directly at kontakt@carboncue.eu.",
    },
    confidentiality: {
      title: "Confidential Initial Contact",
      description:
        "For an introductory call, high-level plant industry and volume suffice. Detailed operational figures are only requested after signing a formal Non-Disclosure Agreement (NDA).",
      caution:
        "Please do not send sensitive registry records or confidential documents in your initial message.",
    },
    founders: {
      title: "Who is behind CarbonCue",
      description:
        "CarbonCue is being developed in Vienna by students at TU Wien. It is an independent project of its founders and not a project of the university; no company has been incorporated yet.",
      roles: {
        productAndTechnology: "Co-founder · Product & Technology",
      },
      linkedInSuffix: "on LinkedIn",
    },
  },
  privacy: {
    metadata: {
      title: "Privacy Policy | CarbonCue",
      description:
        "Privacy and data protection policy for the CarbonCue website, the contact form, and email contact.",
    },
    eyebrow: "Privacy Policy",
    title: "Data Protection Notice",
    introduction:
      "Protecting your corporate and personal data is a foundational priority. This website does not use tracking cookies, analytics trackers, or third-party behavioral scripts.",
    controller: {
      title: "Joint Controllers",
      description:
        "CarbonCue, Austria. <Full controller details: see the live website>",
      jointLabel: "Joint Controllers",
      countryLabel: "Country",
      country: "Austria",
      emailLabel: "Contact",
    },
    siteData: {
      title: "Server Log Data",
      description:
        "Visiting this static website generates only standard, technically necessary server logs required for infrastructure security and reliability.",
    },
    formData: {
      title: "Contact Form",
      description:
        "When you use our contact form, the data you provide – name, company, business email address, and optionally your message – is processed exclusively to handle and respond to your inquiry.",
      storage:
        "Inquiries are stored securely in a database within our hosting infrastructure (Vercel with a Neon database). We use the transactional email service Resend for internal notification of new inquiries. Both providers process the data solely on our behalf.",
    },
    emailData: {
      title: "Email Inquiries",
      description:
        "When initiating email contact, your provided details are processed exclusively for responding to your business inquiry.",
      categoriesLabel: "Data Categories Processed",
      categories: [
        "Name, role, and corporate affiliation",
        "Email address and message text",
        "Technical communication metadata",
      ],
    },
    purposes: {
      title: "Processing Purposes",
      description: "Data is processed strictly for the following purposes:",
      items: [
        "Responding to your direct business inquiry",
        "Coordinating pilot program discovery calls",
        "Fulfilling statutory documentation requirements",
      ],
    },
    legalBasis: {
      title: "Legal Basis",
      description:
        "Processing is conducted under GDPR Art. 6(1)(b) (pre-contractual measures) and GDPR Art. 6(1)(f) (legitimate interest in corporate communication).",
    },
    retention: {
      title: "Data Retention",
      description:
        "Inquiry records are deleted once the business matter is concluded, subject to applicable statutory corporate record retention periods.",
    },
    recipients: {
      title: "Data Recipients",
      description:
        "We use processors to operate the website, store contact inquiries, and send email (Vercel/Neon for hosting and database, Resend for transactional email); they act solely on our behalf. Data is never sold or shared with uninvolved third parties.",
    },
    rights: {
      title: "Your Statutory Rights",
      description:
        "Under GDPR, data subjects maintain rights of access, rectification, erasure, restriction, and portability.",
      items: [
        "Right of Access",
        "Right to Rectification",
        "Right to Erasure",
        "Right to Restriction",
        "Right to Data Portability",
        "Right to Object",
      ],
      complaint:
        "You also maintain the right to lodge a complaint with the Austrian Data Protection Authority. Contact: kontakt@carboncue.eu.",
    },
    cookies: {
      title: "Zero Cookies & Zero Tracking",
      description:
        "This website does not set marketing cookies, utilize Google Analytics, or load third-party ad networks.",
    },
    contact: {
      title: "Privacy Inquiries",
      description:
        "For any data protection inquiries, email kontakt@carboncue.eu.",
    },
  },
  imprint: {
    metadata: {
      title: "Imprint | CarbonCue",
      description: "Legal notice and publisher information for CarbonCue.",
    },
    eyebrow: "Imprint",
    title: "Information Pursuant to § 5 ECG & § 25 MedienG",
    introduction:
      "CarbonCue is a technology development project. <Operator details: see the live website>",
    incomplete: {
      title: "Project Notice",
      description:
        "Development and validation of broker-neutral software for EU ETS position, budgeting, and approval governance.",
    },
    operator: {
      title: "Project Operators",
      legalBasis: "Information under § 5 ECG & § 25 MedienG",
      jointLabel: "Project Operators",
      addressLabel: "Location",
      countryLabel: "Country",
      country: "Austria",
      emailLabel: "Email",
    },
    mediaOwner: {
      title: "Project Authors & Publishers",
      description: "CarbonCue <full details: see the live website>",
    },
    businessPurpose: {
      title: "Business Purpose",
      description:
        "Development of enterprise software solutions for industrial compliance and emissions budgeting.",
    },
    editorialLine: {
      title: "Editorial Scope",
      description:
        "Information regarding the CarbonCue software platform and Design Partner Program opportunities.",
    },
    responsibility: {
      title: "Editorial Responsibility",
      description:
        "CarbonCue <full details: see the live website>. Contact: kontakt@carboncue.eu.",
    },
  },
  demo: {
    eyebrow: "Illustrative Calculation Model",
    title: "From CO₂ emitted to a clear financial budget.",
    summary:
      "CarbonCue consolidates every variable – allocations, holdings and current market prices – into the one number your finance team actually needs.",
    badgeLabel: "DEMO",
    badgeAssistiveLabel: "Synthetic Demonstration Values",
    provenanceLabel: "Example calculation",
    installationName: "Industrial installation",
    stagesLabel: "Requirement, coverage, gap and budget",
    obligationTitle: "Requirement",
    coverageTitle: "Existing coverage",
    gapTitle: "Uncovered gap",
    minusAssistiveLabel: "minus",
    equalsAssistiveLabel: "equals",
    budgetTitle: "The open procurement budget",
    budgetValueLabel: "Required budget",
    budgetPriceNote: "Calculated at the current market price of {price} / EUA.",
    footnote:
      "* All figures are purely illustrative examples and do not constitute market forecasts.",
  },
} as const satisfies MessageDictionary;

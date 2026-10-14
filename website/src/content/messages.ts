type PageMetadataMessages = Readonly<{
  title: string;
  description: string;
}>;

type ComplianceStepMessages = Readonly<{
  kicker: string;
  title: string;
  text: string;
}>;

type WorkflowStageMessages = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

type ProductStageMessages = WorkflowStageMessages &
  Readonly<{
    exampleLabel: string;
    example: string;
  }>;

export type MessageDictionary = Readonly<{
  shell: Readonly<{
    skipToContent: string;
    navigationLabel: string;
    languageNavigationLabel: string;
    currentLanguageLabel: string;
    footerLabel: string;
    disclaimer: string;
    /** Shared label for every "book a call" action across the site. */
    contactCta: string;
  }>;
  navigation: Readonly<{
    home: string;
    product: string;
    contact: string;
    privacy: string;
    imprint: string;
  }>;
  home: Readonly<{
    metadata: PageMetadataMessages;
    hero: Readonly<{
      badge: string;
      title: string;
      summary: string;
    }>;
    story: Readonly<{
      eyebrow: string;
      title: string;
      summary: string;
      panelTitle: string;
      demoBadgeLabel: string;
      demoBadgeAssistiveLabel: string;
      steps: readonly [
        ComplianceStepMessages,
        ComplianceStepMessages,
        ComplianceStepMessages,
        ComplianceStepMessages,
        ComplianceStepMessages,
        ComplianceStepMessages,
      ];
      graph: Readonly<{
        alt: string;
        emissions: string;
        allowances: string;
        shortfallStarts: string;
        /** Kicker above the two charge chips in the zoomed frame, e.g. "Per uncovered tonne". */
        chargesKicker: string;
        coveredLabel: string;
        uncoveredLabel: string;
        /** Chip text: the penalty charge, e.g. "€100 penalty". */
        penaltyShort: string;
        /** Chip text: the allowance still has to be bought, e.g. "Repurchase still required". */
        repurchaseShort: string;
        closedLabel: string;
        /** Label beside the asset blocks in the surplus scene, e.g. "Surplus = bound capital". */
        surplusLabel: string;
        /** One-word in-block label for the petrol zone, e.g. "Surplus". */
        surplusShort: string;
        months: readonly [string, string, string, string, string];
      }>;
    }>;
    calculator: Readonly<{
      eyebrow: string;
      title: string;
      demoLabel: string;
      demoAssistiveLabel: string;
      uncoveredLabel: string;
      uncoveredHint: string;
      uncoveredUnit: string;
      priceLabel: string;
      priceHint: string;
      priceUnit: string;
      presetLabel: string;
      presets: readonly [string, string, string, string];
      budgetLabel: string;
      budgetHint: string;
      penaltyLabel: string;
      penaltyHint: string;
      totalRiskLabel: string;
      totalRiskHint: string;
      /** Section title while surplus mode is active; `title` covers deficit mode. */
      surplusTitle: string;
      /** Group label for the deficit/surplus mode switch. */
      modeLabel: string;
      modeDeficit: string;
      modeSurplus: string;
      /** Volume labels for surplus mode; deficit mode keeps uncoveredLabel. */
      surplusVolumeLabel: string;
      surplusVolumeHint: string;
      /** Surplus result: the computed value of the surplus at the reader's price. */
      assetValueLabel: string;
      assetValueHint: string;
      /** Surplus result note: visibility and documented decisions, never sale advice. */
      assetNote: string;
      ctaButton: string;
    }>;
    duality: Readonly<{
      eyebrow: string;
      deficit: Readonly<{
        kicker: string;
        title: string;
        body: string;
      }>;
      surplus: Readonly<{
        kicker: string;
        title: string;
        body: string;
      }>;
    }>;
    solution: Readonly<{
      eyebrow: string;
      title: string;
      body: string;
    }>;
    cta: Readonly<{
      title: string;
      description: string;
      primary: string;
    }>;
  }>;
  product: Readonly<{
    metadata: PageMetadataMessages;
    intro: Readonly<{
      eyebrow: string;
      title: string;
      statusTitle: string;
      statusBody: string;
    }>;
    workflow: Readonly<{
      eyebrow: string;
      title: string;
      stagesLabel: string;
      stages: readonly [
        ProductStageMessages,
        ProductStageMessages,
        ProductStageMessages,
        ProductStageMessages,
        ProductStageMessages,
        ProductStageMessages,
      ];
    }>;
    cta: Readonly<{
      title: string;
      description: string;
      label: string;
    }>;
  }>;
  contact: Readonly<{
    metadata: PageMetadataMessages;
    intro: Readonly<{
      eyebrow: string;
      title: string;
      summary: string;
    }>;
    form: Readonly<{
      nameLabel: string;
      companyLabel: string;
      emailLabel: string;
      messageLabel: string;
      submitLabel: string;
      submittingLabel: string;
      successTitle: string;
      successBody: string;
      errorMessage: string;
    }>;
    confidentiality: Readonly<{
      title: string;
      description: string;
      caution: string;
    }>;
    /** Founders section below the contact form. Names and LinkedIn URLs come from content/founders.ts. */
    founders: Readonly<{
      title: string;
      description: string;
      roles: Readonly<{
        productAndTechnology: string;
      }>;
      /** Suffix after the founder's name in the LinkedIn link, e.g. "on LinkedIn". */
      linkedInSuffix: string;
    }>;
  }>;
  privacy: Readonly<{
    metadata: PageMetadataMessages;
    eyebrow: string;
    title: string;
    introduction: string;
    controller: Readonly<{
      title: string;
      description: string;
      jointLabel: string;
      countryLabel: string;
      country: string;
      emailLabel: string;
    }>;
    siteData: Readonly<{
      title: string;
      description: string;
    }>;
    formData: Readonly<{
      title: string;
      description: string;
      storage: string;
    }>;
    emailData: Readonly<{
      title: string;
      description: string;
      categoriesLabel: string;
      categories: readonly [string, string, string];
    }>;
    purposes: Readonly<{
      title: string;
      description: string;
      items: readonly [string, string, string];
    }>;
    legalBasis: Readonly<{
      title: string;
      description: string;
    }>;
    retention: Readonly<{
      title: string;
      description: string;
    }>;
    recipients: Readonly<{
      title: string;
      description: string;
    }>;
    rights: Readonly<{
      title: string;
      description: string;
      items: readonly [string, string, string, string, string, string];
      complaint: string;
    }>;
    cookies: Readonly<{
      title: string;
      description: string;
    }>;
    contact: Readonly<{
      title: string;
      description: string;
    }>;
  }>;
  imprint: Readonly<{
    metadata: PageMetadataMessages;
    eyebrow: string;
    title: string;
    introduction: string;
    incomplete: Readonly<{
      title: string;
      description: string;
    }>;
    operator: Readonly<{
      title: string;
      legalBasis: string;
      jointLabel: string;
      addressLabel: string;
      countryLabel: string;
      country: string;
      emailLabel: string;
    }>;
    mediaOwner: Readonly<{
      title: string;
      description: string;
    }>;
    businessPurpose: Readonly<{
      title: string;
      description: string;
    }>;
    editorialLine: Readonly<{
      title: string;
      description: string;
    }>;
    responsibility: Readonly<{
      title: string;
      description: string;
    }>;
  }>;
  demo: Readonly<{
    eyebrow: string;
    title: string;
    summary: string;
    badgeLabel: string;
    badgeAssistiveLabel: string;
    /** One-line provenance shown above the calculation, not a panel. */
    provenanceLabel: string;
    installationName: string;
    stagesLabel: string;
    obligationTitle: string;
    coverageTitle: string;
    gapTitle: string;
    minusAssistiveLabel: string;
    equalsAssistiveLabel: string;
    budgetTitle: string;
    budgetValueLabel: string;
    /** Reads "Calculated at the current market price of {price} / EUA". */
    budgetPriceNote: string;
    footnote: string;
  }>;
}>;

export type PageMetadata = PageMetadataMessages;

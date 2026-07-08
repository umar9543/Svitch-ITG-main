import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
    supabase: {
      login: `${ROOTS.AUTH}/supabase/login`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      register: `${ROOTS.AUTH}/supabase/register`,
      newPassword: `${ROOTS.AUTH}/supabase/new-password`,
      forgotPassword: `${ROOTS.AUTH}/supabase/forgot-password`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    scorecard: `${ROOTS.DASHBOARD}/scorecard`,
    businessTurnover: `${ROOTS.DASHBOARD}/scorecard/turnover`,
    mail: `${ROOTS.DASHBOARD}/mail`,
    customerDatabase: {
      root: `${ROOTS.DASHBOARD}/customer-database`,
      addCustomer: `${ROOTS.DASHBOARD}/customer-database/add-customer`,
      edit: (id) => `${ROOTS.DASHBOARD}/customer-database/${id}`,
    },
    OnBoarding: {
      root: `${ROOTS.DASHBOARD}/Onboarding`,
      inviteParticipant: {
        root: `${ROOTS.DASHBOARD}/Onboarding/invite-participant`,
        addInviteParticipant: `${ROOTS.DASHBOARD}/Onboarding/invite-participant/add`,
        edit: (id) => `${ROOTS.DASHBOARD}/Onboarding/invite-participant/${id}`,
      },
      selfAssessment: {
        root: `${ROOTS.DASHBOARD}/Onboarding/self-assessment`,
        addSelfAssessment: `${ROOTS.DASHBOARD}/Onboarding/self-assessment/add`,
        edit: (id) => `${ROOTS.DASHBOARD}/Onboarding/self-assessment/${id}`,
      },
      coversheet: {
        root: `${ROOTS.DASHBOARD}/Onboarding/coversheet`,
        addCoversheet: `${ROOTS.DASHBOARD}/Onboarding/coversheet/add`,
        edit: (id) => `${ROOTS.DASHBOARD}/Onboarding/coversheet/${id}`,
      },
      preOnboarding: {
        root: `${ROOTS.DASHBOARD}/Onboarding/pre-onboarding`,
        addPreOnboarding: `${ROOTS.DASHBOARD}/Onboarding/pre-onboarding/add`,
        edit: (id) => `${ROOTS.DASHBOARD}/Onboarding/pre-onboarding/${id}`,
      },
    },
    projectDatabase: {
      root: `${ROOTS.DASHBOARD}/project-database`,
      addProject: `${ROOTS.DASHBOARD}/project-database/add-project`,
      invitation: `${ROOTS.DASHBOARD}/project-database/invitation`,
      addInvitation: `${ROOTS.DASHBOARD}/project-database/add-invitation`,
    },
    supplier: {
      root: `${ROOTS.DASHBOARD}/supplier`,
      scorecard: `${ROOTS.DASHBOARD}/supplier/scorecard`,
      overview: `${ROOTS.DASHBOARD}/supplier/overview`,
      complianceStatus: `${ROOTS.DASHBOARD}/supplier/compliance-status`,
      edit: (id) => `${ROOTS.DASHBOARD}/supplier/${id}`,
    },
    kpi: {
      root: `${ROOTS.DASHBOARD}/kpi`,
      addKpi: `${ROOTS.DASHBOARD}/kpi/add-kpi`,
      environmental: `${ROOTS.DASHBOARD}/kpi/environmental`,
      social: `${ROOTS.DASHBOARD}/kpi/social`,
      productivity: `${ROOTS.DASHBOARD}/kpi/productivity`,
      combined: `${ROOTS.DASHBOARD}/kpi/combined`,
    },
    KpiCombined: {
      root: `${ROOTS.DASHBOARD}/kpi/combined`,
      addKpiCombined: `${ROOTS.DASHBOARD}/kpi/combined/add`,
      edit: (id) => `${ROOTS.DASHBOARD}/kpi/combined/${id}`,
    },
    KpiSocialIndigator: {
      root: `${ROOTS.DASHBOARD}/kpi/social/indigators`,
      add: `${ROOTS.DASHBOARD}/kpi/social/indigators/add`,
      edit: (id) => `${ROOTS.DASHBOARD}/kpi/social/indigators/${id}`,
    },
    KpiSocialWages: {
      root: `${ROOTS.DASHBOARD}/kpi/social/wages`,
      add: `${ROOTS.DASHBOARD}/kpi/social/wages/add`,
      edit: (id) => `${ROOTS.DASHBOARD}/kpi/social/wages/${id}`,
    },
    KpiSocialEvent: {
      root: `${ROOTS.DASHBOARD}/kpi/social/event`,
      add: `${ROOTS.DASHBOARD}/kpi/social/event/add`,
      edit: (id) => `${ROOTS.DASHBOARD}/kpi/social/event/${id}`,
    },
    audit: {
      root: `${ROOTS.DASHBOARD}/audit`,
      addAudit: `${ROOTS.DASHBOARD}/audit/add-auditor`,
      edit: (id) => `${ROOTS.DASHBOARD}/audit/${id}`,
      auditor: `${ROOTS.DASHBOARD}/audit/auditor`,
      schedule: `${ROOTS.DASHBOARD}/audit/schedule`,
      kpi: `${ROOTS.DASHBOARD}/audit/database/kpi`,
      // AuditScheme: `${ROOTS.DASHBOARD}/audit/database/AuditScheme`,
      // questionaries: `${ROOTS.DASHBOARD}/audit/database/questionnaires`,
      AuditDB: `${ROOTS.DASHBOARD}/audit/database/AuditDB`,
      ChemicalInventoryList: `${ROOTS.DASHBOARD}/audit/database/ChemicalInventoryList`,

      FactoryOnboarding: `${ROOTS.DASHBOARD}/audit/FactoryOnboarding`,
      PreAuditReport: `${ROOTS.DASHBOARD}/audit/PreAuditReport`,
    },
    AuditSchedule: {
      root: `${ROOTS.DASHBOARD}/audit/AuditSchedule`,
      add: `${ROOTS.DASHBOARD}/audit/AuditSchedule/add`,
      edit: (id) => `${ROOTS.DASHBOARD}/audit/AuditSchedule/${id}`,
    },
    AuditScheme: {
      root: `${ROOTS.DASHBOARD}/audit/database/AuditScheme`,
      add: `${ROOTS.DASHBOARD}/audit/database/AuditScheme/add`,
      edit: (id) => `${ROOTS.DASHBOARD}/audit/database/AuditScheme/${id}`,
    },
    RiskAnalysis: {
      root: `${ROOTS.DASHBOARD}/RiskAnalysis`,
      RiskFactor: {
        root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor`,
        CountryRisk: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/CountryRisk`,
          add: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/CountryRisk/add`,
          rating: {
            root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/CountryRisk/rating`,
            add: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/CountryRisk/rating/add`,
          },
        },
        IndustryRisk: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/IndustryRisk`,
          add: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/IndustryRisk`,
          rating: {
            root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/IndustryRisk/rating`,
            add: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/IndustryRisk/rating/add`,
          },
        },
        BasicRisk: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/BasicRisk`,
          add: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/BasicRisk`,
          rating: {
            root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/BasicRisk/rating`,
            add: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/BasicRisk/rating/add`,
          },
        },
        NonCompliantRisk: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/NonCompliantRisk`,
          add: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/NonCompliantRisk`,
          rating: {
            root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/NonCompliantRisk/rating`,
            add: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskFactor/NonCompliantRisk/rating/add`,
          },
        },
      },
      Riskframework: {
        root: `${ROOTS.DASHBOARD}/RiskAnalysis/Riskframework`,
        Laws: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/Riskframework/Laws`,
          addLaws: `${ROOTS.DASHBOARD}/RiskAnalysis/Riskframework/Laws/add`,
          edit: (id) => `${ROOTS.DASHBOARD}/RiskAnalysis/Riskframework/Laws/${id}`,
        },
        LawsMatrix: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/Riskframework/LawsMatrix`,
          addLawsMatrix: `${ROOTS.DASHBOARD}/RiskAnalysis/Riskframework/LawsMatrix/add`,
          edit: (id) => `${ROOTS.DASHBOARD}/RiskAnalysis/Riskframework/LawsMatrix/${id}`,
        },
        Overview: `${ROOTS.DASHBOARD}/RiskAnalysis/Riskframework/Overview`,
      },
      RiskMitigation: {
        root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk`,
        questionaries: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/questionnaires`,
          addQuestionnaire: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/questionnaires/add-questionnaires`,
          preview: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/questionnaires/preview`,
          edit: (id) =>
            `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/questionnaires/${id}`,
        },
        papers: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/papers`,
          addPaper: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/papers/add`,
          edit: (id) =>
            `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/papers/${id}`,
        },
        inviteParticipant: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/invite-participant`,
          addInviteParticipant: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/invite-participant/add`,
        },
        surveyResult: (id) =>
          `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/survey-result/${id}`,
        workshop: {
          root: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/workshop`,
          addInvitation: `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/workshop/invitation`,
          editInvitation: (id) =>
            `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/workshop/invitation/${id}`,
          participation: (id) =>
            `${ROOTS.DASHBOARD}/RiskAnalysis/RiskMitigation/NonCompliantRisk/workshop/${id}/participation`,
        },
      },
      FactorMapping: {
        root: `${ROOTS.DASHBOARD}/RiskAnalysis/FactorMapping`,
        addFactorMapping: `${ROOTS.DASHBOARD}/RiskAnalysis/FactorMapping/add`,
        edit: (id) => `${ROOTS.DASHBOARD}/RiskAnalysis/FactorMapping/${id}`,
      },
      Workshop: {
        root: `${ROOTS.DASHBOARD}/RiskAnalysis/Workshop`,
        addWorkshop: `${ROOTS.DASHBOARD}/RiskAnalysis/Workshop/add`,
        edit: (id) => `${ROOTS.DASHBOARD}/RiskAnalysis/Workshop/${id}`,
      },
      Questionnaire: {
        root: `${ROOTS.DASHBOARD}/RiskAnalysis/Questionnaire`,
        addQuestionnaire: `${ROOTS.DASHBOARD}/RiskAnalysis/Questionnaire/add`,
        edit: (id) => `${ROOTS.DASHBOARD}/RiskAnalysis/Questionnaire/${id}`,
      },
    },
    Reports: {
      root: `${ROOTS.DASHBOARD}/Reports`,
    },
    // {
    //   root: `${ROOTS.DASHBOARD}/customer-database`,
    //   addCustomer: `${ROOTS.DASHBOARD}/customer-database/add-customer`,
    // },
    // addCustomer: `${ROOTS.DASHBOARD}/customer-database/add-customer`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};

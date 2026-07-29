'use client';
import { useState, useEffect, useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';
import { getDecryptedUserData } from 'src/utils/getUser';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  // State for userID
  const [userID, setUserID] = useState(null);

  // Fetch userID on client side using useEffect
  useEffect(() => {
    const decryptedUserData = getDecryptedUserData();
    if (decryptedUserData && decryptedUserData[0] && decryptedUserData[0].UserID) {
      setUserID(decryptedUserData[0].UserID);
    }
  }, []);

  // Build menu data
  const data = useMemo(
    () => [
      {
        subheader: t('overview'),
        items: [
          // {
          //   title: t('Dashboard'),
          //   path: paths.dashboard.root,
          //   icon: ICONS.dashboard,
          // },
          // {
          //   title: t('Conrad Scorecard'),
          //   path: paths.dashboard.scorecard,
          //   icon: ICONS.analytics,
          // },
          {
            title: t('Business Turnover'),
            path: paths.dashboard.businessTurnover,
            icon: ICONS.banking,
          },
          ,
          // ...(userID != 265
          //   ? [
          //       {
          //         title: t('customer database'),
          //         path: paths.dashboard.customerDatabase.root,
          //         icon: ICONS.file,
          //       },
          //     ]
          //   : []),
          // ...(userID == 265 || userID == 1576 || userID == 1577
          //   ? [
          // {
          //   title: t('onboarding'),
          //   path: paths.dashboard.OnBoarding.root,
          //   icon: ICONS.mail,
          //   children: [
          //     {
          //       title: t('pre-onboarding'),
          //       path: paths.dashboard.OnBoarding.preOnboarding.root,
          //     },
          //     {
          //       title: t('invite participant'),
          //       path: paths.dashboard.OnBoarding.inviteParticipant.root,
          //     },
          //     { title: t('coversheet'), path: paths.dashboard.OnBoarding.coversheet.root },
          //     // {
          //     //   title: t('self assessment'),
          //     //   path: paths.dashboard.OnBoarding.selfAssessment.root,
          //     // },
          //   ],
          // },
          //   ]
          // : []),
          // ...(userID != 265
          //   ? [
          //       {
          //         title: t('project database'),
          //         path: '#',
          //         icon: ICONS.ecommerce,
          //         children: [
          //           { title: t('project database'), path: paths.dashboard.projectDatabase.root },
          //           { title: t('invitation'), path: paths.dashboard.projectDatabase.invitation },
          //         ],
          //       },
          //     ]
          //   : []),
          // ...(userID == 265 || userID == 1576 || userID == 1577
          //   ? [
          // {
          //   title: t('supplier database'),
          //   path: paths.dashboard.supplier.root,
          //   icon: ICONS.job,
          //   children: [
          //     // { title: t('supplier onboarding'), path: paths.dashboard.supplier.root },
          //     { title: t('supplier Overview'), path: paths.dashboard.supplier.root },
          //     { title: t('conrad score card'), path: paths.dashboard.supplier.scorecard },
          //     { title: t('compliance status'), path: paths.dashboard.supplier.complianceStatus },
          //   ],
          // },
          //   ]
          // : []),
          // ...(userID != 265
          //   ? [
          //       {
          //         title: t('KPI database'),
          //         path: '#',
          //         icon: ICONS.banking,
          //         children: [
          //           { title: t('environmental'), path: paths.dashboard.kpi.environmental },
          //           {
          //             title: t('social'),
          //             path: paths.dashboard.KpiSocialIndigator.root,
          //             children: [
          //               { title: t('indigators'), path: paths.dashboard.KpiSocialIndigator.root },
          //               { title: t('wages'), path: paths.dashboard.KpiSocialWages.root },
          //               { title: t('event database'), path: paths.dashboard.KpiSocialEvent.root },
          //             ],
          //           },
          //           { title: t('productivity'), path: paths.dashboard.kpi.productivity },
          //           { title: t('combined KPI'), path: paths.dashboard.kpi.combined },
          //         ],
          //       },
          //     ]
          //   : []),
          // ...(userID != 265
          // ? [
          // {
          //   title: t('Audit Database'),
          //   path: '#',
          //   icon: ICONS.analytics,
          //   children: [
          // { title: t('auditor database'), path: paths.dashboard.audit.auditor },
          // { title: t('audit schedule'), path: paths.dashboard.AuditSchedule.root },
          // {
          //   title: t('audit database'),
          //   icon: ICONS.chat,
          //   path: paths.dashboard.audit.questionaries,
          //   children: [
          //     // { title: t('KPI'), path: paths.dashboard.audit.kpi },
          //     // { title: t('scheme'), path: paths.dashboard.AuditScheme.root },
          //     { title: t('questionnaires'), path: paths.dashboard.audit.questionaries },
          //     // { title: 'Audit', path: paths.dashboard.audit.AuditDB },
          //     // {
          //     //   title: 'Chemical Inventory List',
          //     //   path: paths.dashboard.audit.ChemicalInventoryList,
          //     // },
          //   ],
          // },
          // {
          //   title: t('pre audit'),
          //   path: '#',
          //   children: [
          //     {
          //       title: t('Factory Onboarding'),
          //       path: paths.dashboard.audit.FactoryOnboarding,
          //     },
          //     {
          //       title: t('Pre Audit Report'),
          //       path: paths.dashboard.audit.PreAuditReport,
          //     },
          //   ],
          // },
          // ],
          // },
          //   ]
          // : []),
          // ...(userID != 1576
          //   ? [
          //       {
          //         title: t('Risk Analysis'),
          //         path: paths.dashboard.RiskAnalysis.root,
          //         icon: ICONS.analytics,
          //         children: [
          //           {
          //             title: t('Risk Factor'),
          //             path: paths.dashboard.RiskAnalysis.RiskFactor.root,
          //             children: [
          //               {
          //                 title: t('Country Risk'),
          //                 path: paths.dashboard.RiskAnalysis.RiskFactor.CountryRisk.rating.root,
          //               },
          //               {
          //                 title: t('Industry Risk'),
          //                 path: paths.dashboard.RiskAnalysis.RiskFactor.IndustryRisk.rating.root,
          //               },
          //               // {
          //               //   title: t('Basic Risk'),
          //               //   path: paths.dashboard.RiskAnalysis.RiskFactor.BasicRisk.rating.root,
          //               //   children: [
          //               //     // {
          //               //     //   title: t('Overview'),
          //               //     //   path: paths.dashboard.RiskAnalysis.RiskFactor.BasicRisk.root,
          //               //     // },
          //               //     {
          //               //       title: t('Basic Risk By PA'),
          //               //       path: paths.dashboard.RiskAnalysis.RiskFactor.BasicRisk.rating.root,
          //               //     },
          //               //   ],
          //               // },
          //               {
          //                 title: t('Non-Compliant Risk'),
          //                 path: paths.dashboard.RiskAnalysis.RiskFactor.NonCompliantRisk.rating
          //                   .root,
          //               },
          //             ],
          //           },
          //           {
          //             title: t('Risk Framework'),
          //             path: paths.dashboard.RiskAnalysis.Riskframework.root,
          //             children: [
          //               {
          //                 title: t('Laws'),
          //                 path: paths.dashboard.RiskAnalysis.Riskframework.Laws.root,
          //               },
          //               {
          //                 title: t('Risk Matrix Overview'),
          //                 path: paths.dashboard.RiskAnalysis.Riskframework.Overview,
          //               },
          //               {
          //                 title: t('Risk Matrix'),
          //                 path: paths.dashboard.RiskAnalysis.Riskframework.LawsMatrix.root,
          //               },
          //             ],
          //           },

          //           {
          //             title: t('Risk Mitigation'),
          //             path: paths.dashboard.RiskAnalysis.RiskMitigation.root,
          //             children: [
          //               {
          //                 title: t('Questionnaires'),
          //                 path: paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root,
          //                 // children: [
          //                 //   {
          //                 //     title: t('Questions'),
          //                 //     path: paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root,
          //                 //   },

          //                 //   {
          //                 //     title: t('Preview'),
          //                 //     path: paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.preview,
          //                 //   },
          //                 // ],
          //               },
          //               {
          //                 title: t('Survey'),
          //                 path: paths.dashboard.RiskAnalysis.RiskMitigation.papers.root,
          //               },
          //               {
          //                 title: t('Broadcast'),
          //                 path: paths.dashboard.RiskAnalysis.RiskMitigation.inviteParticipant.root,
          //               },
          //               {
          //                 title: t('Workshop'),
          //                 path: paths.dashboard.RiskAnalysis.RiskMitigation.workshop.root,
          //               },
          //               // {
          //               //   title: t('Risk Assessment Report'),
          //               //   path: paths.dashboard.RiskAnalysis.RiskMitigation.inviteParticipant.root,
          //               // },
          //             ],
          //           },
          //           // {
          //           //   title: t('FactMapping'),
          //           //   path: paths.dashboard.RiskAnalysis.FactorMapping.root,
          //           // },
          //           // { title: t('Workshop'), path: paths.dashboard.RiskAnalysis.Workshop.root },
          //           // {
          //           //   title: t('Questionnaire'),
          //           //   path: paths.dashboard.RiskAnalysis.Questionnaire.root,
          //           // },
          //         ],
          //       },
          //     ]
          //   : []),
          // ...(userID != 265
          //   ? [
          //       {
          //         title: t('Report'),
          //         path: '#',
          //         icon: ICONS.file,
          //         children: [
          //           { title: t('oekotex overview report'), path: '/dashboard/Reports/Oekotex' },
          //           { title: t('Customer Report - Overview'), path: '/dashboard/Reports/Customer' },
          //           { title: t('Supplier Report - Overview'), path: '/dashboard/Reports/Supplier' },
          //           { title: t('BSCI Overview Report'), path: '/dashboard/Reports/BSCI' },
          //           {
          //             title: t('Combined KPI Analytical Report'),
          //             path: '/dashboard/Reports/CoKPI',
          //           },
          //           { title: t('Baseline Analysis Report'), path: '/dashboard/Reports/Baseline' },
          //           { title: t('KPI Follow-up Report'), path: '/dashboard/Reports/KPIFollowup' },
          //         ],
          //       },
          //     ]
          //   : []),
        ],
      },
    ],
    [t, userID]
  );

  return data;
}

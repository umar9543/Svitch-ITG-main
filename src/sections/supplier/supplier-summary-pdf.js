import { Document, Image, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

const PRIMARY_COLOR = '#1B2B65';
const BORDER_COLOR = '#D0D5DD';
const HEADER_BG = '#F2F4F7';
const TEXT_COLOR = '#344054';
const LABEL_COLOR = '#667085';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: TEXT_COLOR,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: `2px solid ${PRIMARY_COLOR}`,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY_COLOR,
  },
  headerDate: {
    fontSize: 8,
    color: LABEL_COLOR,
    marginTop: 2,
  },
  logoLeft: {
    width: 60,
    height: 30,
    objectFit: 'contain',
  },
  logoRight: {
    width: 70,
    height: 30,
    objectFit: 'contain',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY_COLOR,
    marginBottom: 8,
    marginTop: 16,
    paddingBottom: 4,
    borderBottom: `1px solid ${PRIMARY_COLOR}`,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  fieldGroup: {
    width: '50%',
    paddingRight: 8,
    marginBottom: 6,
  },
  fieldGroupThird: {
    width: '33.33%',
    paddingRight: 8,
    marginBottom: 6,
  },
  fieldGroupFull: {
    width: '100%',
    marginBottom: 6,
  },
  label: {
    fontSize: 7.5,
    color: LABEL_COLOR,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 9,
    color: TEXT_COLOR,
  },
  table: {
    marginTop: 4,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: HEADER_BG,
    borderBottom: `1px solid ${BORDER_COLOR}`,
    borderTop: `1px solid ${BORDER_COLOR}`,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${BORDER_COLOR}`,
    minHeight: 20,
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
    borderRight: `1px solid ${BORDER_COLOR}`,
    justifyContent: 'center',
  },
  tableCellHeader: {
    padding: 4,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY_COLOR,
    borderRight: `1px solid ${BORDER_COLOR}`,
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: `1px solid ${BORDER_COLOR}`,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: LABEL_COLOR,
  },
});

const CapacityUnit = [
  { Value: '1', Text: 'DOZEN' },
  { Value: '2', Text: 'PCS' },
  { Value: '3', Text: 'KG' },
  { Value: '4', Text: 'M' },
  { Value: '5', Text: 'YARD' },
  { Value: '6', Text: 'TONS' },
  { Value: '7', Text: 'PAIRS' },
];

const AntUnit = [
  { Value: '1', Text: 'EURO' },
  { Value: '2', Text: 'TAKA' },
  { Value: '3', Text: 'USD' },
  { Value: '4', Text: 'RMB' },
  { Value: '5', Text: 'PKR' },
];

function fDate(date, fmt) {
  const f = fmt || 'dd MMM yyyy';
  try {
    return date ? format(new Date(date), f) : '-';
  } catch {
    return '-';
  }
}

function resolveId(list, idKey, valueKey, id) {
  if (!id || !list?.length) return '-';
  const item = list.find((i) => String(i[idKey]) === String(id));
  return item?.[valueKey] || '-';
}

function resolveMultipleIds(list, idKey, valueKey, ids) {
  if (!ids || !list?.length) return '-';
  const idArray = typeof ids === 'string' ? ids.split(',').map((i) => i.trim()) : ids;
  const resolved = idArray
    .map((id) => {
      const item = list.find((i) => String(i[idKey]) === String(id));
      return item?.[valueKey];
    })
    .filter(Boolean);
  return resolved.length > 0 ? resolved.join(', ') : '-';
}

const Field = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

export default function SupplierSummaryPDF({
  currentSupplier,
  contacts,
  supplies,
  certificates,
  surveyDetail,
  lookups,
  svitchLogoUrl,
  conradLogoUrl,
}) {
  const supplier = currentSupplier || {};
  const {
    countries = [],
    contactTypes = [],
    partyTypes = [],
    noOfEmployees = [],
    perOfExpBusiness = [],
    expInBusinessType = [],
    perExpBusinessEuro = [],
    shippingTerms = [],
    yearsInBusiness = [],
    yearsInEuroBusiness = [],
    businessType = [],
    mainExportMarket = [],
  } = lookups || {};

  const capacityUnitText =
    CapacityUnit.find((u) => String(u.Value) === String(supplier.CapacityUnit))?.Text || '-';
  const amtSignText =
    AntUnit.find((u) => String(u.Value) === String(supplier.AmtSign))?.Text || '-';

  const contactColumns = [
    { header: 'Contact Type', width: '18%' },
    { header: 'Name', width: '20%' },
    { header: 'Job Title', width: '20%' },
    { header: 'Mobile', width: '20%' },
    { header: 'Email', width: '22%' },
  ];

  const supplyColumns = [
    { header: 'Party Type', width: '12%' },
    { header: 'Material', width: '12%' },
    { header: 'Party Name', width: '14%' },
    { header: 'Country', width: '10%' },
    { header: 'Address', width: '14%' },
    { header: 'Contact', width: '10%' },
    { header: 'Phone', width: '10%' },
    { header: 'Email', width: '10%' },
    { header: 'Additional Info', width: '8%' },
  ];

  const certColumns = [
    { header: 'Certificate', width: '25%' },
    { header: 'Description', width: '25%' },
    { header: 'Valid From', width: '25%' },
    { header: 'Valid To', width: '25%' },
  ];

  const surveyColumns = [
    { header: 'Survey', width: '30%' },
    { header: 'Status', width: '20%' },
    { header: 'Assessment Date', width: '25%' },
    { header: 'Obtained Marks', width: '25%' },
  ];

  const contactRows = (Array.isArray(contacts) ? contacts : []).map((c) => [
    resolveId(contactTypes, 'Contact_Type_ID', 'Contact_Type', c.ContactType),
    c.PersonName || '-',
    c.Designation || '-',
    c.CellNo || '-',
    c.EmailAddress || '-',
  ]);

  const supplyRows = (Array.isArray(supplies) ? supplies : []).map((s) => [
    resolveId(partyTypes, 'PartyTypeid', 'PartyTypeSupplychain', s.TypeID) ||
      (String(s.TypeID) === '4' ? 'Trading Company' : '-'),
    s.MaterialorProcess || '-',
    s.FactoryName || '-',
    resolveId(countries, 'Country_id', 'CountryName', s.CountryId),
    s.Address || '-',
    s.ContactPerson || '-',
    s.PhoneNumber || '-',
    s.Email || '-',
    s.AdditionalInformation || '-',
  ]);

  const certRows = (Array.isArray(certificates) ? certificates : []).map((c) => [
    c.CertificateType || '-',
    c.Description || '-',
    fDate(c.CertificateFrom, 'dd MMM yyyy'),
    fDate(c.CertificateTo, 'dd MMM yyyy'),
  ]);

  const surveyRows = (Array.isArray(surveyDetail) ? surveyDetail : []).map((s) => [
    s.SurveyNo || '-',
    s.Status || '-',
    fDate(s.AssessmentDate, 'dd MMM yyyy'),
    s.Marks || '-',
  ]);

  const renderTable = (columns, rows) => (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {columns.map((col, i) => (
          <View key={i} style={[styles.tableCellHeader, { width: col.width }]}>
            <Text>{col.header}</Text>
          </View>
        ))}
      </View>
      {rows.length === 0 ? (
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '100%', textAlign: 'center' }]}>
            <Text>No data available</Text>
          </View>
        </View>
      ) : (
        rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.tableRow} wrap={false}>
            {row.map((cell, cellIdx) => (
              <View key={cellIdx} style={[styles.tableCell, { width: columns[cellIdx].width }]}>
                <Text>{String(cell ?? '-')}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            {svitchLogoUrl && <Image style={styles.logoLeft} src={svitchLogoUrl} />}
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Supplier Summary</Text>
            <Text style={styles.headerDate}>
              Generated on {format(new Date(), 'dd MMM yyyy, hh:mm a')}
            </Text>
          </View>
          {conradLogoUrl && <Image style={styles.logoRight} src={conradLogoUrl} />}
        </View>

        {/* Company Information */}
        <Text style={styles.sectionTitle}>Company Information</Text>
        <View style={styles.row}>
          <View style={styles.fieldGroupFull}>
            <Field label="Supplier Name" value={supplier.VenderName} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroupFull}>
            <Field label="Address Line 1" value={supplier.Address1} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroupFull}>
            <Field label="Address Line 2" value={supplier.Address2} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroupThird}>
            <Field
              label="Country"
              value={resolveId(countries, 'Country_id', 'CountryName', supplier.CountryID)}
            />
          </View>
          <View style={styles.fieldGroupThird}>
            <Field label="Province" value={supplier.Province} />
          </View>
          <View style={styles.fieldGroupThird}>
            <Field label="City" value={supplier.City} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroupThird}>
            <Field label="Phone" value={supplier.PhoneNumber} />
          </View>
          <View style={styles.fieldGroupThird}>
            <Field label="Fax" value={supplier.FaxNo} />
          </View>
          <View style={styles.fieldGroupThird}>
            <Field label="Zip Code" value={supplier.ZipCode} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroupThird}>
            <Field label="Web Address" value={supplier.Website} />
          </View>
          <View style={styles.fieldGroupThird}>
            <Field
              label="Main Export Market"
              value={resolveMultipleIds(
                mainExportMarket,
                'Country_id',
                'CountryName',
                supplier.MainExportMarketId
              )}
            />
          </View>
          <View style={styles.fieldGroupThird}>
            <Field label="Onboarding Email" value={supplier.OnBoardingEmail} />
          </View>
        </View>

        {/* Setup Details */}
        <Text style={styles.sectionTitle}>Setup Details</Text>
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Field
              label="Capacity per Month"
              value={`${supplier.Capacity || '-'} ${capacityUnitText}`}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Field
              label="Turnover per Year"
              value={`${supplier.Annualturnover || '-'} ${amtSignText}`}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroupFull}>
            <Field label="Business License No." value={supplier.BusinessLicenseNumber} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroupFull}>
            <Field label="Additional Info" value={supplier.AboutSupplier} />
          </View>
        </View>

        {/* Business Numbers */}
        <Text style={styles.sectionTitle}>Business Numbers</Text>
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Field
              label="No. of Employee"
              value={resolveId(noOfEmployees, 'NoOfEmployeesID', 'Value', supplier.NoOfEmployeesID)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Field
              label="% of Export Business"
              value={resolveId(
                perOfExpBusiness,
                'PercentageOfExportBusinessID',
                'Value',
                supplier.PercentageOfExportBusinessID
              )}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Field
              label="Experience in Business Type"
              value={resolveMultipleIds(
                expInBusinessType,
                'ExperienceInBusinessTypeID',
                'Value',
                supplier.ExperienceInBusinessTypeID
              )}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Field
              label="% of Business in Europe"
              value={resolveId(
                perExpBusinessEuro,
                'BusinessPercentageInEuropeanID',
                'Value',
                supplier.BusinessPercentageInEuropeanID
              )}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Field
              label="Shipping Terms"
              value={resolveId(shippingTerms, 'ShippingTermsID', 'Value', supplier.ShippingTermsID)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Field
              label="Years in Business"
              value={resolveId(
                yearsInBusiness,
                'YearsInBusinessID',
                'Value',
                supplier.YearsInBusinessID
              )}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldGroup}>
            <Field
              label="Years in European Business"
              value={resolveId(
                yearsInEuroBusiness,
                'YearsInEuropeanBusinessID',
                'Value',
                supplier.YearsInEuropeanBusinessID
              )}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Field
              label="Business Type"
              value={resolveId(businessType, 'BusinessTypeID', 'Value', supplier.BusinessTypeID)}
            />
          </View>
        </View>

        {/* General Contact Information */}
        <Text style={styles.sectionTitle}>General Contact Information</Text>
        {renderTable(contactColumns, contactRows)}

        {/* Supply Chain */}
        <Text style={styles.sectionTitle}>Supply Chain</Text>
        {renderTable(supplyColumns, supplyRows)}

        {/* Certificates and Patents */}
        <Text style={styles.sectionTitle}>Certificates and Patents</Text>
        {renderTable(certColumns, certRows)}

        {/* Survey */}
        {surveyRows.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Survey</Text>
            {renderTable(surveyColumns, surveyRows)}
          </>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Svitch - Supplier Summary</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

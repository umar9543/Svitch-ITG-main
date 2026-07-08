import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, Form } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { _roles } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete, RHFUpload } from 'src/components/hook-form';
import {
  Autocomplete,
  Avatar,
  Button,
  ButtonBase,
  Checkbox,
  Collapse,
  IconButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import { DesktopDatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import Scrollbar from 'src/components/scrollbar';
import { Get, Post, Put } from 'src/utils/AxiosHelper';
import { decrypt, encrypt } from 'src/api/encryption';
import { LoadingScreen } from 'src/components/loading-screen';
import { getDecryptedUserData, getUserData } from 'src/utils/getUser';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import ChartsRadarBar from 'src/sections/_examples/extra/chart-view/chart-radar-bar';
import Link from 'next/link';
import { fDate, fTime } from 'src/utils/format-time';
import { TablePaginationCustom } from 'src/components/table';
import { UploadBox } from 'src/components/upload';
import sanitizeFileName from 'src/utils/sanitizeFileName';

// ----------------------------------------------------------------------

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

// const Negotiation = [
//   { ID: '1', Text: 'Grace Ng' },
//   { ID: '2', Text: 'Louis Lui' },
//   { ID: '3', Text: 'William Mai' },
//   { ID: '4', Text: 'Steve Yeung' },
// ];

// const PayTerms = [
//   { ID: '1', Text: 'T/T' },
//   { ID: '2', Text: 'L/C' },
//   { ID: '3', Text: 'Partly T/T' },
//   { ID: '4', Text: 'Advance payment' },
// ];

// const AssortRange = [
//   { ID: '1', Text: '3D-Printing' },
//   { ID: '2', Text: 'Batteries / rechargeable batteries' },
//   { ID: '3', Text: 'Occupational safety and health' },
//   { ID: '4', Text: 'Automation technology' },
//   { ID: '5', Text: 'Components' },
//   { ID: '6', Text: 'Assemblies' },
//   { ID: '7', Text: 'Kits' },
//   { ID: '8', Text: 'Office equipment & chemistry' },
//   { ID: '9', Text: 'Books' },
//   { ID: '10', Text: 'Car HIFI & car accessories' },
//   { ID: '11', Text: 'Computer technology & office-organization' },
//   { ID: '12', Text: 'Services' },
//   { ID: '13', Text: 'Reception technology, audio & video' },
//   { ID: '14', Text: 'Energy & Environment' },
//   { ID: '15', Text: 'Fitness/Hobby/Leisure' },
//   { ID: '16', Text: 'Radio' },
//   { ID: '17', Text: 'Health' },
//   { ID: '18', Text: 'Domestic appliances' },
//   { ID: '19', Text: 'House technic' },
//   { ID: '20', Text: 'Hydraulics & Pneumatics' },
//   { ID: '21', Text: 'Communication technology' },
//   { ID: '22', Text: 'Lighting technology' },
//   { ID: '23', Text: 'Lifestyle' },
//   { ID: '24', Text: 'Soldering technology' },
//   { ID: '25', Text: 'Measuring technology' },
//   { ID: '26', Text: 'Model railway technology' },
//   { ID: '27', Text: 'Modelling' },
//   { ID: '28', Text: 'Power supplies' },
//   { ID: '29', Text: 'Outdoor' },
//   { ID: '30', Text: 'Remaining stock' },
//   { ID: '31', Text: 'Sound & Light' },
//   { ID: '32', Text: 'Electricity supplies' },
//   { ID: '33', Text: 'Tools & Attachment' },
//   { ID: '34', Text: 'Weather & Clocks' },
//   { ID: '35', Text: 'Encore items' },
// ];

// const AssortStrg = [
//   { ID: '1', Text: 'Core-Assortment' },
//   { ID: '2', Text: 'Not Core-Assortment' },
// ];

// Function to format date to dd-MM-yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // 'en-GB' format will give dd-MM-yyyy
};

export default function SupplierOnboardForm({
  currentSupplier,
  allCountries,
  currentSupplierContact,
  vendorSupply,
  currentCertificate,
  setisLoading,
  currentScores,
  currentCoverSheet,
}) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const SupplierType = ['1']; // for InserVendorDetail api

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;
  const UserData = getDecryptedUserData();

  const [onBoardingResults, setOnBoardingResults] = useState([]);
  const [ResponsibleManger, setResponsibleManger] = useState([]);

  const [Negotiation, setNegotiation] = useState([]);
  const [AgreedPaymentTerms, setAgreedPaymentTerms] = useState([]);

  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredManager, setFilteredManager] = useState([]);
  const [IndustryType, setIndustryType] = useState([]);
  const [mainExportMarket, setMainExportMarket] = useState([]);
  const [facility, setFacility] = useState([]);

  const radarData = [
    currentScores[0]?.Point1,
    currentScores[0]?.Point2,
    currentScores[0]?.Point3,
    currentScores[0]?.Point4,
    currentScores[0]?.Point5,
    currentScores[0]?.Point6,
    currentScores[0]?.Point7,
    currentScores[0]?.Point8,
    currentCertificate?.length * 5 || 0,
    // currentScores[0]?.Point10,
  ].map(Number); // Convert strings to numbers if necessary
  const totalScore = radarData?.reduce((acc, val) => acc + val, 0);

  // business Numbers dropdowns
  const [NoOfEmployee, setNoOfEmployee] = useState([]);
  const [PerOfExpBusiness, setPerOfExpBusiness] = useState([]);
  const [ExpInBusinessType, setExpInBusinessType] = useState([]);
  const [PerExpBusinessEuro, setPerExpBusinessEuro] = useState([]);
  const [ShippingTerms, setShippingTerms] = useState([]);
  const [YearsInBusiness, setYearsInBusiness] = useState([]);
  const [YearsInEuroBusiness, setYearsInEuroBusiness] = useState([]);
  const [BusinessType, setBusinessType] = useState([]);
  const [AssortmentRange, setAssortmentRange] = useState([
    {
      AssortmentRangeID: '1',
      Value: 'All 7 valid certificate ',
    },
    {
      AssortmentRangeID: '2',
      Value: '5 valid certificate',
    },
    {
      AssortmentRangeID: '3',
      Value: '3 valid certificate',
    },
    {
      AssortmentRangeID: '4',
      Value: '1 valid certificate',
    },
  ]);
  const [AssortmentStrategy, setAssortmentStrategy] = useState([]);

  const [DocumentData, setDocumentData] = useState([]);

  const [productPortfolio, setProductPortfolio] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [productGroup, setProductGroup] = useState([]);
  const [verticalIntegration, setVerticalIntegration] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const [countryRisk, setCountryRisk] = useState([]);
  const [industryRisk, setIndustryRisk] = useState([]);
  const [amforiRisk, setAmforiRisk] = useState([]);
  const [certificateRating, setCertificateRating] = useState([]);
  const [workshopScores, setWorkshopScores] = useState([]);
  const [surveyScores, setSurveyScores] = useState([]);

  const [workshopData, setWorkshopData] = useState([]);
  const [workshopPage, setWorkshopPage] = useState(0);
  const [workshopRowsPerPage, setWorkshopRowsPerPage] = useState(5);

  const [surveyDetail, setSurveyDetail] = useState([]);
  const [surveyPage, setSurveyPage] = useState(0);
  const [surveyRowsPerPage, setSurveyRowsPerPage] = useState(5);

  const [BusinessLogoByID, setBusinessLogoByID] = useState([]);
  const [VenderLogoByID, setVenderLogoByID] = useState([]);

  const NewSupplierSchema = Yup.object().shape({
    // Address1: Yup.string().required('Address is required'),
    // // Address2: Yup.string().required('Address is required'),
    // AmtSign: Yup.string().required('Turnover Unit is required'),
    // Annualturnover: Yup.number('Turnover per year should be a number ').required(
    //   'Turnover per year is required'
    // ),
    // AssortmentRangeID: Yup.string().required('Assortment Range is required'),
    // AssortmentStrategyID: Yup.string().required('Assortment Strategy is required'),
    // // BusinessLicenseNumber: Yup.string().required('Business License Number is required'),
    // BusinessPercentageInEuropeanID: Yup.string().required(
    //   'Business Percentage in European is required'
    // ),
    // BusinessTypeID: Yup.string().required('Business Type is required'),
    // Capacity: Yup.number().required('Capacity is required'),
    // CapacityUnit: Yup.string().required('Capacity Unit is required'),
    // City: Yup.string().required('City is required'),
    // // CountryID: Yup.string().required('Country is required'),
    // // CustomerID: Yup.array().required('Customer is required'),
    // ExperienceInBusinessTypeID: Yup.string().required('Experience in Business Type is required'),
    // // FacilityID: Yup.array().required('Facility is required'),
    // // FactoryArea: Yup.string().required('Factory Area is required'),
    // // FaxNo: Yup.string().required('Fax Number is required'),
    // // IndustryTypeID: Yup.string().required('Industry Type is required'),
    // // MainExportMarketId: Yup.array().required('Main Export Market is required'),
    // NoOfEmployeesID: Yup.string().required('No of Employees is required'),
    // OnBoardingEmail: Yup.string().email().required('Onboarding Email is required'),
    // PercentageOfExportBusinessID: Yup.string().required(
    //   'Percentage of Export Business is required'
    // ),
    // // PhoneNumber: Yup.string().required('Phone Number is required'),
    // // ProductCategoriesID: Yup.string().required('Product Category is required'),
    // // ProductGroupid: Yup.array().required('Product Group is required'),
    // // ProductPortfolioID: Yup.string().required('Product Portfolio is required'),
    // // Province: Yup.string().required('Province is required'),
    // ShippingTermsID: Yup.string().required('Shipping Terms is required'),
    // ShortName: Yup.string().required('Short Name is required'),
    // VenderName: Yup.string().required('Vendor Name is required'),
    // // VerticalIntegrationID: Yup.string().required('Vertical Integration is required'),
    // // Website: Yup.string().required('Website is required'),
    // // WorkingHours: Yup.string().required('Working Hours is required'),
    // YearsInBusinessID: Yup.string().required('Years in Business is required'),
    // YearsInEuropeanBusinessID: Yup.string().required('Years in European Business is required'),
    // // ZipCode: Yup.string().required('Zip Code is required'),
  });

  const [typeOfSupply, setTypeOfSupply] = useState([
    {
      PartyTypeSupplychain: 'Trading Company',
      PartyTypeid: 4,
    },
  ]);
  const [contactType, setContactType] = useState([]);
  const [partyType, setPartyType] = useState([]);
  const [country, setCountry] = useState([]);
  const [formData, setFormData] = useState({
    document: '',
    Description: '',
    CertificateFrom: '',
    CertificateTo: '',
    FileName: null,
  });
  // Dropdown options for certificates
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const updatedCertificates = currentCertificate.map((cert) => ({
    ...cert,
    CertificateFrom: cert?.CertificateFrom,
    CertificateTo: cert?.CertificateTo,
  }));

  // State for table data
  const [tableData, setTableData] = useState(
    updatedCertificates.length > 0 ? updatedCertificates : []
  );

  // Handle FileName drop
  const handleDropSingleFile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file); // Store the uploaded file in state
    setValue('FileName', file); // Update the file value in the form
  };

  // Handle adding data to the table
  const handleAdd = () => {
    const newEntry = {
      CertificateType: selectedCertificate
        ? selectedCertificate.Certificate
        : 'No Certificate Type selected',
      CertificateID: selectedCertificate ? selectedCertificate.CertificateID : '0',
      Description: formData.Description,
      CertificateFrom: CertificateFromSA || '',
      CertificateTo: CertificateToSA || '',
      FileName: selectedFile ? selectedFile.name : 'No file uploaded',
      FileToSend: selectedFile ? selectedFile : null,
    };

    setTableData([...tableData, newEntry]);
    // Reset form fields after adding
    setFormData({
      document: '',
      Description: '',
      CertificateFrom: '',
      CertificateTo: '',
      FileName: null,
    });
    setSelectedFile(null); // Reset the file input
    setSelectedCertificate(null); // Reset the CertificateType dropdown
    // reset();
  };

  // Handle delete row from table
  const handleDelete = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1); // Remove the selected row
    setTableData(updatedTableData);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [CertificateFromSA, setValidityFromSA] = useState(null);
  const [CertificateToSA, setValidityToSA] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [value, setValue] = useState(new Date());

  const countries = allCountries;
  const [CountryID, setCountryID] = useState(
    countries?.find((country) => country.Country_id === currentSupplier?.CountryID)?.Country_id ||
    ''
  );

  useEffect(() => {
    setCountryID(
      countries?.find((country) => country.Country_id === currentSupplier?.CountryID)?.Country_id ||
      ''
    );
  }, [currentSupplier]);

  // const [loading, setLoading] = useState(true);

  const GetNegotiates = async () => {
    try {
      const res = await Get(`GetNegotiates`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      setNegotiation(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };

  const GetAgreedPaymentTerms = async () => {
    try {
      const res = await Get(`GetAgreedPaymentTerms`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      // console.log('decryptedFilteredCustomers', decryptedFilteredCustomers);
      setAgreedPaymentTerms(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };

  const getGetOnBoardingResults = async () => {
    try {
      const res = await Get(`GetOnBoardingResults`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      // console.log('decryptedFilteredCustomers', decryptedFilteredCustomers);
      setOnBoardingResults(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };
  const GetResponsibleManger = async () => {
    try {
      const res = await Get(`GetResponsibleManger?UserID=${userID}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      // console.log('decryptedFilteredCustomers', decryptedFilteredCustomers);
      setFilteredManager(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };
  const getFilteredCustomers = async () => {
    try {
      const res = await Get(`GetFilteredDataCustomer?UserID=${userID}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      // console.log('decryptedFilteredCustomers', decryptedFilteredCustomers);
      setFilteredCustomers(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };
  const getIndustryType = async () => {
    try {
      const res = await Get(`GetIndustryType?UserID=${userID}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      // console.log('decryptedFilteredCustomers', decryptedFilteredCustomers);
      setIndustryType(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier industry type', error);
    }
  };

  const getMainExportMarket = async () => {
    try {
      const res = await Get(`GetCountriesDataForExportMarket?UserID=${userID}`);
      const decryptedMainExportMarket = decryptObjectKeys(res.data.ServiceRes);
      // console.log('decryptedMainExportMarket', decryptedMainExportMarket);
      setMainExportMarket(decryptedMainExportMarket);
    } catch (error) {
      console.log('error getting supplier main export market', error);
    }
  };

  const getFacility = async () => {
    try {
      const res = await Get(`GetFacilityData?UserID=${userID}`);
      const decryptedFacility = decryptObjectKeys(res.data.ServiceRes);
      // console.log('decryptedFacility', decryptedFacility);
      setFacility(decryptedFacility);
    } catch (error) {
      console.log('error getting supplier facility', error);
    }
  };

  const getProductPortfolio = async () => {
    try {
      const res = await Get(`GetProductPortfolioData?UserID=${userID}`);
      const decryptedPortfolio = decryptObjectKeys(res.data.ServiceRes);
      setProductPortfolio(decryptedPortfolio);
    } catch (error) {
      console.log('error getting supplier product portfolio', error);
    }
  };

  const GetSupplierContactType = async () => {
    try {
      const res = await Get(`GetCustomerContactType?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setContactType(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting customer contact by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting customer contact by ID', error);
    }
  };

  const GetSupplierPartyType = async () => {
    try {
      const res = await Get(`GetCustomerPartyType?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setPartyType(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting customer party type by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting customer party type by ID', error);
    }
  };

  const GetCountry = async () => {
    try {
      const res = await Get(`GetCountry?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCountry(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting country by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country by ID', error);
    }
  };

  // const GetTypeOfSupply = async () => {
  //   try {
  //     const res = await Get(`GetTypeSupplyChain?UserID=${userID}`);
  //     if (res.data.ResponseCode === '100') {
  //       // console.log('res.data.ServiceRes', res.data.ServiceRes);
  //       const decryptedData = decryptObjectKeys(res.data.ServiceRes);
  //       setTypeOfSupply(decryptedData);
  //     } else if (res.data.ResponseCode === '-2') {
  //       console.log('error in getting type of supply by id', res.data.ServiceRes);
  //     }
  //   } catch (error) {
  //     console.log('error getting type of supply by ID', error);
  //   }
  // };

  // Business Numbers Dropdowns

  const getNoOfEmployees = async () => {
    try {
      const res = await Get(`GetNoOfEmployees?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setNoOfEmployee(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting no of employees by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting no of employees by ID', error);
    }
  };

  const getPerOfExpBusiness = async () => {
    try {
      const res = await Get(`GetPercentageOfExportBusiness?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setPerOfExpBusiness(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting % of exp business by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting % of exp business by ID', error);
    }
  };

  const getExpInBusinessType = async () => {
    try {
      const res = await Get(`GetExperienceInBusinessType?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setExpInBusinessType(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting exp in business type by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting exp in business type by ID', error);
    }
  };

  const getPerExpBusinessEuro = async () => {
    try {
      const res = await Get(`GetBusinessPercentageInEuroPe?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setPerExpBusinessEuro(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting % exp business euro by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting % exp business euro by ID', error);
    }
  };

  const getShippingTerms = async () => {
    try {
      const res = await Get(`GetShippingTerms?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setShippingTerms(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting shipping terms by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting shipping terms by ID', error);
    }
  };

  const getYearsInBusiness = async () => {
    try {
      const res = await Get(`GetYearsInBusiness?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setYearsInBusiness(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting years in business by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting years in business by ID', error);
    }
  };

  const getBusinessType = async () => {
    try {
      const res = await Get(`GetBusinessType?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setBusinessType(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting business type by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting business type by ID', error);
    }
  };

  const getAssortmentRange = async () => {
    try {
      const res = await Get(`GetAssortmentRange?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setAssortmentRange(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting assorment range by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting assorment range by ID', error);
    }
  };

  const getAssortmentStrategy = async () => {
    try {
      const res = await Get(`GetAssortmentStrategy?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setAssortmentStrategy(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting assortment strategy by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting assortment strategy by ID', error);
    }
  };

  const getGetDocumentData = async () => {
    try {
      const res = await Get(`GetDocumentData`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setDocumentData(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting document data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting document data by ID', error);
    }
  };

  const GetCountryRisk = async () => {
    try {
      const res = await Get(
        `GetRiskAnalysisCountryRateing?CountryID=${currentSupplier?.CountryID}`
      );
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCountryRisk(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        const data = [
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Child Labour\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Force Labour\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Health & Safety\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Freedom of Association\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Discrimination\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Living Wage\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Environmental Impact \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Land Rights \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Abuse of Force \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Mercury Risk \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Pollution \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Waste \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Policy & Procedure \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisCountryRateingMstID: '1',
            Initiavtive: 'LKSG',
            CountryName: 'CHINA',
            Name: 'Grievance mechanism \r\n',
            Rate: '0.00',
          },
        ];
        setCountryRisk(data);
        console.log('no data in countryRisk data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting countryRisk data by ID', error);
    }
  };

  const GetIndustryRisk = async () => {
    try {
      const res = await Get(
        `GetRiskAnalysisIndustryRateing?IndustryTypeID=${currentSupplier?.IndustryTypeID || '2'
        }&CountryID=${currentSupplier?.CountryID}`
      );
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);

        setIndustryRisk(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        const data = [
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Child Labour\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Force Labour\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Health & Safety\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Freedom of Association\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Discrimination\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Living Wage\r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Environmental Impact \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Land Rights \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Abuse of Force \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Mercury Risk \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Pollution \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Waste \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Policy & Procedure \r\n',
            Rate: '0.00',
          },
          {
            RiskAnalysisIndustryRateingMstID: '1',
            Initiavtive: 'LKSG',
            IndustryName: 'ELECTRONIC',
            CountryName: 'CHINA',
            Name: 'Grievance mechanism \r\n',
            Rate: '0.00',
          },
        ];
        setIndustryRisk(data);
        console.log('no data in industryRisk data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting industryRisk data by ID', error);
    }
  };

  const GetAmforiRisk = async () => {
    try {
      const res = await Get(
        `GetCertiFicateRateingForAmfori?VenderLibraryID=${currentSupplier?.VenderLibraryID}`
      );
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setAmforiRisk(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        const data = [
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Child Labour\r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Force Labour\r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Health & Safety\r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Freedom of Association\r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Discrimination\r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Living Wage\r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Environmental Impact \r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Land Rights \r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Abuse of Force \r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Mercury Risk \r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Pollution \r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Waste \r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Policy & Procedure \r\n',
            Rate: '-',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Grievance mechanism \r\n',
            Rate: '-',
          },
        ];
        const noData = [
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Child Labour\r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Force Labour\r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Health & Safety\r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Freedom of Association\r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Discrimination\r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Living Wage\r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Environmental Impact \r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Land Rights \r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Abuse of Force \r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Mercury Risk \r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Pollution \r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Waste \r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Policy & Procedure \r\n',
            Rate: 'NA',
          },
          {
            NonComplaintRiskAnalysisgMstID: '4',
            Certificate: 'BSCI (Business Social Compliance Initiative)',
            Name: 'Grievance mechanism \r\n',
            Rate: 'NA',
          },
        ];
        if (
          tableData?.find(
            (item) => item.CertificateType === 'BSCI (Business Social Compliance Initiative)'
          )
        ) {
          setAmforiRisk(data);
        } else {
          setAmforiRisk(noData);
        }
        console.log('no data in amforiRisk data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting amforiRisk data by ID', error);
    }
  };

  const GetCertificateRating = async () => {
    try {
      const res = await Get(
        `GetCertiFicateRateingBySupplierID?VenderLibraryID=${currentSupplier?.VenderLibraryID}`
      );
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        const mapped = decryptedData.map((item) => ({
          Name: item.CertificateName?.trim(),
          Rate: item.Score,
        }));
        console.log('certificateRating mapped', mapped);
        setCertificateRating(mapped);

      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting certificateRating data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting certificateRating data by ID', error);
    }
  };

  const GetWorkshopScores = async () => {
    try {
      const res = await Get(
        `GetSupplierPAScore?SupplierID=${currentSupplier?.VenderLibraryID}`
      );
      if (res.data.ResponseCode === '100') {
        const decrypted = decryptObjectKeys(res.data.ServiceRes);
        const mapped = decrypted.map((item) => ({
          Name: item.PerformanceAreaName?.trim(),
          Rate: item.Score,
        }));
        console.log('workshopScores mapped', mapped);
        setWorkshopScores(mapped);
      }
    } catch (error) {
      console.log('error getting workshop scores', error);
    }
  };

  const GetSurveyScores = async () => {
    try {
      const res = await Get(
        `GetSupplierPAScoreSurvey?SupplierID=${currentSupplier?.VenderLibraryID}`
      );
      if (res.data.ResponseCode === '100') {
        const decrypted = decryptObjectKeys(res.data.ServiceRes);
        setSurveyScores(decrypted.map((item) => ({ Name: item.PerformanceAreaName?.trim(), Rate: item.Score })));
      }
    } catch (error) {
      console.log('error getting survey scores', error);
    }
  };

  const fetchWorkshopData = async () => {
    if (!currentSupplier?.VenderLibraryID) return;
    try {
      const res = await Get(`GetSupplierWorkshops?SupplierID=${currentSupplier.VenderLibraryID}`);
      const raw = res?.data?.SupplierWorkshops ?? [];
      const decrypted = decryptObjectKeys(raw);
      setWorkshopData(Array.isArray(decrypted) ? decrypted : []);
    } catch {
      setWorkshopData([]);
    }
  };

  const fetchSurveyDetail = async () => {
    if (!currentSupplier?.VenderLibraryID) return;
    try {
      const res = await Get(`GetSurveyDetailBySupplierID?SupplierID=${currentSupplier.VenderLibraryID}`);
      if (res.data.ResponseCode === '100') {
        const decrypted = decryptObjectKeys(res.data.ServiceRes);
        setSurveyDetail(Array.isArray(decrypted) ? decrypted : []);
      }
    } catch {
      setSurveyDetail([]);
    }
  };

  const GetBusinessLogoByID = async () => {
    try {
      const res = await Get(`GetBusinessLogoByID?VenderID=${currentSupplier?.VenderLibraryID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setBusinessLogoByID(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting GetBusinessLogoByID data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting GetBusinessLogoByID data by ID', error);
    }
  };

  const GetVenderLogoByID = async () => {
    try {
      const res = await Get(`GetVenderLogoByID?VenderID=${currentSupplier?.VenderLibraryID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setVenderLogoByID(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting GetVenderLogoByID data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting GetVenderLogoByID data by ID', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          GetNegotiates(),
          GetAgreedPaymentTerms(),

          getGetOnBoardingResults(),
          GetResponsibleManger(),
          getFilteredCustomers(),
          getIndustryType(),
          getProductPortfolio(),
          getMainExportMarket(),
          getFacility(),
          GetSupplierContactType(),
          GetSupplierPartyType(),
          GetCountry(),
          // GetTypeOfSupply(),
          // bussiness numbers
          getNoOfEmployees(),
          getPerOfExpBusiness(),
          getExpInBusinessType(),
          getPerExpBusinessEuro(),
          getShippingTerms(),
          getBusinessType(),
          getYearsInBusiness(),
          getAssortmentRange(),
          getAssortmentStrategy(),

          getGetDocumentData(),

          GetBusinessLogoByID(),
          GetVenderLogoByID(),

          GetCountryRisk(),
          GetIndustryRisk(),
          GetAmforiRisk(),
          GetCertificateRating(),
          GetWorkshopScores(),
          GetSurveyScores(),
          fetchWorkshopData(),
          fetchSurveyDetail(),
        ]);
        setisLoading(false);
      } catch (error) {
        console.error('error loading all the required api', error);
      }
    };

    fetchData();
  }, []);

  const customerIds = currentSupplier?.CustomerID?.split(',').map((id) => id.trim());
  const filteredManagerIds = currentCoverSheet?.ManagerID?.split(',').map((id) => id.trim());
  const mainExportMarketIds = currentSupplier?.MainExportMarketId?.split(',').map((id) =>
    id.trim()
  );
  const facilityIds = currentSupplier?.FacilityID?.split(',').map((id) => id.trim());
  const verticalIntegrationIds = currentSupplier?.VerticalIntegrationID?.split(',').map((id) =>
    id.trim()
  );
  const experienceIds = currentSupplier?.ExperienceInBusinessTypeID?.split(',').map((id) =>
    id.trim()
  );

  const [selectedMarkets, setSelectedMarkets] = useState(mainExportMarketIds || []);
  const [selectedFacilities, setSelectedFacilities] = useState(facilityIds || []);
  const [selectedCustomers, setSelectedCustomers] = useState(customerIds || []);
  const [selectedManagers, setSelectedManagers] = useState(filteredManagerIds || []);

  const [selectedVerticalIntegration, setSelectedVerticalIntegration] = useState(
    verticalIntegrationIds || []
  );
  const [selectedExperienceInBusinessTypeID, setSelectedExperienceInBusinessTypeID] = useState(
    experienceIds || []
  );

  // console.log('currentCoversheet', currentCoverSheet);
  const defaultValues = useMemo(
    () => ({
      OnBoardingResultID: currentCoverSheet
        ? currentCoverSheet?.OnBoardingResultID
        : totalScore >= 100
          ? '1'
          : '3',
      SummarybyPSOTeam: currentCoverSheet?.SummarybyPSOTeam || '',
      ManagerID: currentCoverSheet?.ManagerID || '',

      NegotiateID: currentCoverSheet?.NegotiateID || '',
      AssortmentRangeID: currentCoverSheet?.AssortmentRangeID || '',
      AssortmentStrategyID: currentCoverSheet?.AssortmentStrategyID || '',
      PlannedAnnualTurnover: currentCoverSheet?.PlannedAnnualTurnover || '',
      PaymentTermsID: currentCoverSheet?.PaymentTermsID || '',
      ServiceRemission: currentCoverSheet?.ServiceRemission || '',
      BonusAgreement: currentCoverSheet?.BonusAgreement || '',

      VenderName: currentSupplier?.VenderName || '',
      ShortName: currentSupplier?.ShortName || 'N/A',
      Address1: currentSupplier?.Address1 || '',
      Address2: currentSupplier?.Address2 || '',
      Province: currentSupplier?.Province || '',
      CustomerID: customerIds || [UserData[0]?.CustomerId],
      IndustryTypeID: currentSupplier?.IndustryTypeID || [],
      CountryID: countries?.find((country) => country.CountryName === value)?.Country_id,
      City: currentSupplier?.City || '',
      PhoneNumber: currentSupplier?.PhoneNumber || '',
      FaxNo: currentSupplier?.FaxNo || '',
      ZipCode: currentSupplier?.ZipCode || '',
      Website: currentSupplier?.Website || '',
      MainExportMarketId: mainExportMarketIds || [],
      ExperienceInBusinessTypeID: experienceIds || [],

      FacilityId: facilityIds || [],

      ProductPortfolioID: currentSupplier?.ProductPortfolioID || '',
      ProductCategoriesID: currentSupplier?.ProductCategoriesID || '',
      ProductGroupid: currentSupplier?.ProductGroupid || '',
      Capacity: currentSupplier?.Capacity || '',
      CapacityUnit: currentSupplier?.CapacityUnit || '0',
      AmtSign: currentSupplier?.AmtSign || '',
      Annualturnover: currentSupplier?.Annualturnover || '',
      AboutSupplier: currentSupplier?.AboutSupplier || '',

      BusinessLicenseNumber: currentSupplier?.BusinessLicenseNumber || '',
      FactoryArea: currentSupplier?.FactoryArea || '',
      NumberofEmployees: currentSupplier?.NumberofEmployees || '',
      WorkingHours: currentSupplier?.WorkingHours || '',

      VerticalIntegrationID: verticalIntegrationIds || [],

      contacts:
        Array.isArray(currentSupplierContact) && currentSupplierContact?.length > 0
          ? currentSupplierContact?.map((contact) => ({
            DBName: contact?.DBName || 'ILV_Version2',
            CustomerDetailID: contact?.CustomerDetailID || '',
            ContactType: contact?.ContactType || '',
            PersonName: contact?.PersonName || '',
            VenderPersonnelID: contact?.VenderPersonnelID || '',
            Designation: contact?.Designation || '',
            Img_Foto: contact?.Img_Foto || '',
            CellNo: contact?.CellNo || '',
            EmailAddress: contact?.EmailAddress || '',
            UserID: contact?.UserID || userID || 1,
          }))
          : [
            {
              DBName: 'ILV_Version2',
              ContactType: '',
              PersonName: '',
              VenderPersonnelID: '',
              Designation: '',
              Img_Foto: '',
              CellNo: '',
              EmailAddress: '',
              UserID: userID || 1,
            },
          ],

      supplies:
        Array.isArray(vendorSupply) && vendorSupply?.length > 0
          ? vendorSupply?.map((supply) => ({
            DBName: supply?.DBName || 'ILV_Version2',
            CustomerSupplyChainID: supply?.CustomerSupplyChainID || '',
            CustomerID: supply?.CustomerID || UserData[0]?.CustomerId,
            TypeID: supply?.TypeID || '',
            MaterialorProcess: supply?.MaterialorProcess || '',
            FactoryName: supply?.FactoryName || '',
            CountryId: supply?.CountryId || '',
            Address: supply?.Address || '',
            ContactPerson: supply?.ContactPerson || '',
            PhoneNumber: supply?.PhoneNumber || '',
            Email: supply?.Email || '',
            AgentTradingCompany: supply?.AgentTradingCompany || '',
            AdditionalInformation: supply?.AdditionalInformation || '',
            UserID: supply?.UserID || userID || 1,
          }))
          : [
            {
              CustomerID: UserData[0]?.CustomerId,
              TypeID: '',
              MaterialorProcess: '',
              CountryId: '',
              Address: '',
              ContactPerson: '',
              PhoneNumber: '',
              Email: '',
              UserID: userID || 1,
            },
          ],

      // AssortmentRangeID: currentSupplier?.AssortmentRangeID || '',
      // AssortmentStrategyID: currentSupplier?.AssortmentStrategyID || '',
      BusinessPercent: currentSupplier?.BusinessPercent || '',
      OnBoardingEmail: currentSupplier?.OnBoardingEmail || '',
      IndustryTypeID: currentSupplier?.IndustryTypeID || '2',
      NoOfEmployeesID: currentSupplier?.NoOfEmployeesID || '',
      PercentageOfExportBusinessID: currentSupplier?.PercentageOfExportBusinessID || '',
      // ExperienceInBusinessTypeID: currentSupplier?.ExperienceInBusinessTypeID || '',
      ShippingTermsID: currentSupplier?.ShippingTermsID || '',
      BusinessTypeID: currentSupplier?.BusinessTypeID || '',
      YearsInBusinessID: currentSupplier?.YearsInBusinessID || '',
      YearsInEuropeanBusinessID: currentSupplier?.YearsInEuropeanBusinessID || '',
      BusinessPercentageInEuropeanID: currentSupplier?.BusinessPercentageInEuropeanID || '',
      // title: currentSupplier?.title || '',
      // content: currentSupplier?.content || '',
      // employmentTypes: currentSupplier?.employmentTypes || [],
      // experience: currentSupplier?.experience || '1 year exp',
      // role: currentSupplier?.role || _roles[1],
      // skills: currentSupplier?.skills || [],
      // workingSchedule: currentSupplier?.workingSchedule || [],
      // locations: currentSupplier?.locations || [],
      // benefits: currentSupplier?.benefits || [],
      // expiredDate: currentSupplier?.expiredDate || null,
      // salary: currentSupplier?.salary || {
      //   type: 'Hourly',
      //   price: 0,
      //   negotiable: false,
      // ManagerID: currentSupplier?.ManagerID || '',
      // },
    }),
    [currentSupplier, currentSupplierContact, vendorSupply, CountryID, totalScore]
  );
  // console.log('main export market', mainExportMarket);

  useEffect(() => {
    // console.log('filteredCustomers', filteredCustomers);
    // console.log('facility', facility);
    setSelectedPortfolio(defaultValues.ProductPortfolioID);
    setSelectedCategory(defaultValues.ProductCategoriesID);
    setSelectedGroup(defaultValues.ProductGroupid);
    setSelectedMarkets(defaultValues.MainExportMarketId);
    setSelectedExperienceInBusinessTypeID(defaultValues.ExperienceInBusinessTypeID);
    setSelectedFacilities(defaultValues.FacilityId);
    setSelectedCustomers(defaultValues?.CustomerID || [UserData[0]?.CustomerId]);
    setSelectedManagers(currentCoverSheet?.ManagerID);
    setSelectedVerticalIntegration(defaultValues?.VerticalIntegrationID);
  }, [defaultValues]);

  const [selectedPortfolio, setSelectedPortfolio] = useState(defaultValues.ProductPortfolioID);
  const [selectedCategory, setSelectedCategory] = useState(defaultValues.ProductCategoriesID);
  const [selectedGroup, setSelectedGroup] = useState(defaultValues.ProductGroupid);

  // console.log('ProductCategory',productCategory);

  useEffect(() => {
    // if (selectedPortfolio) {
    const fetchProductCategory = async () => {
      try {
        const res = await Get(
          `GetPortfolioCategories?UserID=${userID}&ProductPortfolioID=${16}` //selectedPortfolio
        );
        const decryptedCategory = decryptObjectKeys(res.data.ServiceRes);
        setProductCategory(decryptedCategory);
      } catch (error) {
        console.log('error getting supplier product category', error);
      }
    };
    const fetchVerticalIntegration = async () => {
      try {
        const res = await Get(
          `GetVerticalIntegration?UserID=${userID}&ProductPortfolioID=${selectedPortfolio}`
        );
        const decryptedVerticalIntegration = decryptObjectKeys(res.data.ServiceRes);
        setVerticalIntegration(decryptedVerticalIntegration);
        // console.log('vertical integration', decryptedVerticalIntegration);
      } catch (error) {
        console.log('error getting supplier vertical integration', error);
      }
    };

    fetchProductCategory();
    fetchVerticalIntegration();
    // } else {
    //   setProductCategory([]);
    //   setSelectedCategory(null);
    //   setProductGroup([]);

    //   setVerticalIntegration([]);
    //   setSelectedVerticalIntegration(null);
    // }
  }, [userID]);

  useEffect(() => {
    if (selectedCategory) {
      const fetchProductGroup = async () => {
        try {
          const res = await Get(
            `GetProductGroupDataByProductCategories?UserID=${userID}&ProductCategoriesID=${selectedCategory}`
          );
          const decryptedGroup = decryptObjectKeys(res.data.ServiceRes);
          setProductGroup(decryptedGroup);
        } catch (error) {
          console.log('error getting supplier product group', error);
        }
      };

      fetchProductGroup();
    } else {
      setProductGroup([]);
    }
  }, [selectedCategory, userID]);

  const [contacts, setContacts] = useState(defaultValues.contacts);
  const [supplies, setSupplies] = useState(defaultValues.supplies);

  const handleContactAutocompleteChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    if (field === 'ContactType') {
      const selectedContactType = contactType.find((type) => type.Contact_Type === value);
      updatedContacts[index][field] = selectedContactType
        ? selectedContactType.Contact_Type_ID
        : '';
    } else if (field === 'PrefixID') {
      const selectedTitle = titles.find((title) => title.PrefixValue === value);
      updatedContacts[index][field] = selectedTitle ? selectedTitle.PrefixID : '';
    } else {
      updatedContacts[index][field] = value;
    }
    setContacts(updatedContacts);
    setValue(`contacts[${index}].${field}`, updatedContacts[index][field]); // Sync with form state
  };

  // Handle Input change
  const handleContactInputChange = (index, field, event) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = event.target.value;
    setContacts(updatedContacts);
    setValue(`contacts[${index}].${field}`, updatedContacts[index][field]); // Sync with form state
  };

  // Handle contact deletion
  const handleContactDelete = async (index) => {
    const contactToDelete = contacts[index];
    if (contactToDelete.CustomerDetailID) {
      try {
        const response = await Delete(
          `DeleteCustomerDetail?CustomerDetailID=${contactToDelete.CustomerDetailID}`
        );
        if (response.data.ResponseCode === '100') {
          console.log('Contact deleted successfully from the server');
        } else {
          console.error('Failed to delete contact from the server', response.data);
        }
      } catch (error) {
        console.error('Error while deleting contact from the server', error);
      }
    }
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  // Handle adding a new contact
  const handleAddContact = () => {
    const newContact = {
      DBName: 'ILV_Version2',
      ContactType: '',
      PersonName: '',
      VenderPersonnelID: '',
      Designation: '',
      Img_Foto: '',
      CellNo: '',
      EmailAddress: '',
      UserID: userID || 1,
    };
    setContacts([...contacts, newContact]);
  };

  // supply functions
  const handleAddSupply = () => {
    const newSupply = vendorSupply
      ? {
        DBName: 'ILV_Version2',
        CustomerSupplyChainID: '',
        TypeID: '',
        MaterialorProcess: '',
        FactoryName: '',
        CountryId: '',
        Address: '',
        ContactPerson: '',
        PhoneNumber: '',
        Email: '',
        AgentTradingCompany: '',
        AdditionalInformation: '',
        UserID: userID || 1,
      }
      : {
        // DBName: 'ILV_Version2',
        TypeID: '',
        MaterialorProcess: '',
        FactoryName: '',
        CountryId: '',
        Address: '',
        ContactPerson: '',
        PhoneNumber: '',
        Email: '',
        AgentTradingCompany: '',
        AdditionalInformation: '',
        UserID: userID || 1,
      };
    setSupplies([...supplies, newSupply]);
  };

  const handleSupplyAutocompleteChange = (index, field, value) => {
    const updatedSupplies = [...supplies];
    if (field === 'CountryId') {
      const selectedCountry = country.find((c) => c.CountryName === value);
      updatedSupplies[index][field] = selectedCountry ? selectedCountry.Country_id : '';
    } else if (field === 'TypeID') {
      const selectedPartyType = typeOfSupply.find((type) => type.PartyTypeSupplychain === value);
      updatedSupplies[index][field] = selectedPartyType ? selectedPartyType.PartyTypeid : '';
    } else {
      updatedSupplies[index][field] = value;
    }
    setSupplies(updatedSupplies);
    setValue(`supplies[${index}].${field}`, updatedSupplies[index][field]);
  };

  const handleSupplyInputChange = (index, field, event) => {
    const updatedSupplies = [...supplies];
    updatedSupplies[index][field] = event.target.value;
    setSupplies(updatedSupplies);
    setValue(`supplies[${index}].${field}`, event.target.value);
  };

  const handleSupplyDelete = async (index) => {
    const supplyToDelete = supplies[index];

    if (supplyToDelete.CustomerSupplyChainID) {
      try {
        // Call the API to delete the supply chain row
        const response = await Delete(
          `DeleteCustomerSupplyChain?CustomerSupplyChainID=${supplyToDelete.CustomerSupplyChainID}`
        );
        if (response.data.ResponseCode === '100') {
          console.log('Supply chain row deleted successfully from the server');
        } else {
          console.error('Failed to delete supply chain row from the server', response.data);
        }
      } catch (error) {
        console.error('Error while deleting supply chain row from the server', error);
      }
    }

    // Remove the supply chain row from the UI
    const updatedSupplies = supplies.filter((_, i) => i !== index);
    setSupplies(updatedSupplies);
  };

  const methods = useForm({
    resolver: yupResolver(NewSupplierSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const values = watch();

  const getYearsInEuroBusiness = async () => {
    try {
      const res = await Get(
        `GetYearsInEuropeanBusiness?UserID=${userID}&YearsInBusinessID=${values?.YearsInBusinessID}`
      );
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setYearsInEuroBusiness(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting years in euro business by id', res.data.ServiceRes);
        setYearsInEuroBusiness([]);
      }
    } catch (error) {
      console.log('error getting years in euro business by ID', error);
      setYearsInEuroBusiness([]);
    }
  };

  useEffect(() => {
    getYearsInEuroBusiness();
  }, [values?.YearsInBusinessID]);

  const handleCountryChange = (event, value) => {
    const selectedCountry = countries?.find((country) => country.CountryName === value);
    setCountryID(selectedCountry?.Country_id || '');
  };

  useEffect(() => {
    if (currentSupplier) {
      methods.reset(defaultValues);
    }
  }, [currentSupplier, defaultValues, reset]);

  // Define categories of risks

  // Helper function to group certificate ratings by Certificate name
  const groupByCertificate = (data) => {
    return data.reduce((acc, item) => {
      const certName = item.Certificate.trim();
      if (!acc[certName]) {
        acc[certName] = [];
      }
      acc[certName].push(item);
      return acc;
    }, {});
  };

  // Define categories of risks
  const riskCategories = [
    { name: 'Country Risk', data: countryRisk },
    { name: 'Industry Risk', data: industryRisk },
    { name: 'Basic Risk', data: industryRisk },
    { name: 'amfori Risk', data: amforiRisk },
  ];

  const calcuRiskCategory =
    amforiRisk[0]?.Rate == '-' || amforiRisk[0]?.Rate == 'NA'
      ? [{ name: 'Basic Risk', data: industryRisk }]
      : [{ name: 'amfori Risk', data: amforiRisk }];

  function extractUniqueNames(array) {
    const uniqueNames = new Set();

    array.forEach((item) => {
      uniqueNames.add(item.Name.trim()); // Add trimmed Name to the Set
    });

    return Array.from(uniqueNames);
  }

  const uniqueNamesArray = extractUniqueNames(industryRisk);
  // Define the columns based on risk areas
  const columns = uniqueNamesArray;

  // Function to calculate column sums for the Supplier Risk Rating row
  const calculateColumnSums = (columns, calcuRiskCategory, groupedCertificates) => {
    const columnSums = {};

    columns.forEach((col) => {
      let sum = 0;

      // Sum from risk categories
      calcuRiskCategory.forEach((category) => {
        const rateValue = parseFloat(getRateForColumn(category.data, col));
        if (!isNaN(rateValue)) {
          sum += rateValue;
        }
      });

      Object.values(groupedCertificates).forEach((certificateGroup) => {
        const rateValue = parseFloat(getRateForColumn(certificateGroup, col));
        if (!isNaN(rateValue)) {
          if (amforiRisk[0]?.Rate == '-' || amforiRisk[0]?.Rate == 'NA') {
            sum += rateValue;
          }
          sum;
        }
      });

      // ✅ Workshop score adjustment
      const workshopVal = parseFloat(getRateForColumn(workshopScores, col));
      if (!isNaN(workshopVal)) sum += workshopVal;

      // ✅ Survey score adjustment
      const surveyVal = parseFloat(getRateForColumn(surveyScores, col));
      if (!isNaN(surveyVal)) sum += surveyVal;

      columnSums[col] = sum;
    });

    return columnSums;
  };

  // Helper function to extract the rate for each risk area based on its name
  const getRateForColumn = (riskData, riskName) => {
    const foundRisk = riskData.find((risk) => risk.Name.trim() === riskName);
    return foundRisk ? foundRisk.Rate : '-';
  };

  // Group certificates by Certificate name
  const groupedCertificates = groupByCertificate(certificateRating);

  // Calculate sums for the Supplier Risk Rating row
  const columnSums = calculateColumnSums(columns, calcuRiskCategory, groupedCertificates);

  const isHighRisk = columns.some((col) => (columnSums[col] || 0) >= 3);
  const riskStatus = isHighRisk ? 'High Risk' : 'Low Risk';
  const potentialRiskPAs = columns.filter((col) => (columnSums[col] || 0) >= 3);

  const InsertOnBoardingCoverSheet = async (newdata) => {
    console.info('InsertOnBoardingCoverSheet', newdata);
    const Status = {
      VenderLibraryID: currentSupplier?.VenderLibraryID,
      OnBoardingResultID: newdata?.OnBoardingResultID,
    };

    const encryptedInsertCoverSheet = Object.assign(
      {},
      ...Object.keys(newdata).map((key) => ({
        [key]: encrypt(newdata[key]),
      }))
    );
    const encryptedInsertCoverSheetStatus = Object.assign(
      {},
      ...Object.keys(Status).map((key) => ({
        [key]: encrypt(Status[key]),
      }))
    );

    const res = await Post('InsertOnBoardingCoverSheet', encryptedInsertCoverSheet);
    if (res.data.ResponseCode === '100') {
      console.info('InsertOnBoardingCoverSheet', res.data);

      const result = await Put(`UpdateCoverSheetStatus`, encryptedInsertCoverSheetStatus);
      if (result.data.ResponseCode === '100') {
        enqueueSnackbar('Coversheet Update success!');
      } else {
        console.log('error in UpdateCoverSheetStatus ');
      }
      // router.push(paths.dashboard.On);
    } else {
      console.info('InsertOnBoardingCoverSheet', res.data);
      enqueueSnackbar('Coversheet Update failed!');
    }
  };

  const UpdateCoverSheet = async (updateData) => {
    console.info('UpdateCoverSheet', updateData);
    const Status = {
      VenderLibraryID: currentSupplier?.VenderLibraryID,
      OnBoardingResultID: updateData?.OnBoardingResultID,
    };
    const encryptedUpdateCoverSheet = Object.assign(
      {},
      ...Object.keys(updateData).map((key) => ({
        [key]: encrypt(updateData[key]),
      }))
    );
    const encryptedUpdateCoverSheetStatus = Object.assign(
      {},
      ...Object.keys(Status).map((key) => ({
        [key]: encrypt(Status[key]),
      }))
    );
    const res = await Put('UpdateCoverSheet', encryptedUpdateCoverSheet);
    if (res.data.ResponseCode === '100') {
      console.info('UpdateOnBoardingCoverSheet', res.data);

      const result = await Put(`UpdateCoverSheetStatus`, encryptedUpdateCoverSheetStatus);
      if (result.data.ResponseCode === '100') {
        enqueueSnackbar('Coversheet Update success!');
      } else {
        console.log('error in UpdateCoverSheetStatus ');
      }
      // router.push(paths.dashboard.On);
    } else {
      console.info('UpdateOnBoardingCoverSheet', res.data);
      enqueueSnackbar('Coversheet Update failed!');
    }
  };

  const [BusinessLicenseNumberFile, setBusinessLicenseNumberFile] = useState(null);


  const handleBusinessFile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const sanitized = sanitizeFileName(file.name);
      const renamedFile = new File([file], sanitized, { type: file.type });
      setBusinessLicenseNumberFile(renamedFile); // Store the uploaded file in state
    }
    // setValue('FileName', file); // Update the file value in the form
  };
  const handleLogoFile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const sanitized = sanitizeFileName(file.name);
      const renamedFile = new File([file], sanitized, { type: file.type });
      setLogo(renamedFile); // Store the uploaded file in state
    }
    // setValue('FileName', file); // Update the file value in the form
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      // enqueueSnackbar(currentSupplier ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.supplierDatabase.root);
      const newdata = {
        VenderLibraryID: currentSupplier?.VenderLibraryID,
        OnBoardingResultID: data?.OnBoardingResultID,
        SummarybyPSOTeam: data?.SummarybyPSOTeam,
        ManagerID: data?.ManagerID,
        UserId: userID || '1',
        NegotiateID: data?.NegotiateID,
        AssortmentRangeID: data?.AssortmentRangeID,
        AssortmentStrategyID: data?.AssortmentStrategyID,
        PlannedAnnualTurnover: data?.PlannedAnnualTurnover,
        PaymentTermsID: data?.PaymentTermsID,
        ServiceRemission: data?.ServiceRemission,
        BonusAgreement: data?.BonusAgreement,
      };

      const updateData = {
        OnBoardingCoverSheetID: currentCoverSheet?.OnBoardingCoverSheetID,
        OnBoardingResultID: data?.OnBoardingResultID,
        SummarybyPSOTeam: data?.SummarybyPSOTeam,
        ManagerID: data?.ManagerID,
        NegotiateID: data?.NegotiateID,
        AssortmentRangeID: data?.AssortmentRangeID,
        AssortmentStrategyID: data?.AssortmentStrategyID,
        PlannedAnnualTurnover: data?.PlannedAnnualTurnover,
        PaymentTermsID: data?.PaymentTermsID,
        ServiceRemission: data?.ServiceRemission,
        BonusAgreement: data?.BonusAgreement,
        // UserId: userID || '1',
      };

      if (currentCoverSheet?.IsSubmited == 'True') {
        await UpdateCoverSheet(updateData);
      } else {
        await InsertOnBoardingCoverSheet(newdata);
      }
      // console.info('CountryID', CountryID);
    } catch (error) {
      console.error(error);
    }
  });

  // Extract the values from Point1 to Point8

  const renderDetails = (
    <>
      {/* Supplier Information */}
      <Grid xs={12} md={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} alignItems="center">
            <Card sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2">
                Onboarding Results <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="OnBoardingResultID"
                control={control}
                // defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={onBoardingResults}
                    getOptionLabel={(option) => option.OnBoardingResult || ''}
                    isOptionEqualToValue={(option, value) => option.OnBoardingResultID === value}
                    value={
                      onBoardingResults.find((init) => init.OnBoardingResultID === field.value) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.OnBoardingResultID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps, // Keep the default InputProps for autocomplete
                          sx: {
                            bgcolor: ['1', '2'].includes(field.value) // If field.value is '1' or '4'
                              ? 'rgba(39, 245, 118, 0.22)' // Greenish background
                              : ['3', '4'].includes(field.value) // If field.value is '2' or '3'
                                ? 'rgba(245, 39, 39, 0.22)' // Reddish background
                                : 'white', // Default white background
                            borderRadius: '8px', // Keep border-radius
                          },
                        }}
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />

              <Typography variant="subtitle2" mt={1}>
                Summary by PSO Team <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField
                name="SummarybyPSOTeam"
                multiline
                minRows={3}
                placeholder="Summary..."
              />

              <Typography variant="subtitle2" mt={1}>
                Responsible Manager <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Grid item xs={12} md={12} sx={{ p: 0 }}>
                {/* <Typography variant="subtitle2">Customer</Typography> */}
                <Controller
                  name="ManagerID"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      autoHighlight
                      options={filteredManager}
                      getOptionLabel={(option) => option.ManagerName}
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.ManagerID : '');
                        setSelectedManagers(newValue ? newValue.ManagerID : '');
                      }}
                      value={
                        filteredManager.find((group) => group.ManagerID === selectedManagers) ||
                        null
                      }
                      renderOption={(props, option) => <li {...props}>{option.ManagerName}</li>}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle2" pl={5}>
              {defaultValues.VenderName}
            </Typography>
            <ChartsRadarBar
              series={[
                {
                  name: 'Score',
                  data: radarData,
                },
              ]}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3, mt: -10 }}>
              <Typography variant="caption" pl={5}>
                Total Achieved Score:
                <span style={totalScore >= 100 ? { color: 'green' } : { color: 'red' }}>
                  {totalScore}
                </span>
              </Typography>
              {/* <Typography variant="caption" pl={5}>
                Total Score: 160
              </Typography> */}
            </Box>
          </Grid>
        </Grid>

        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Negotiated Conditions
          </Typography>
          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Negotiated By <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="NegotiateID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={Negotiation}
                    getOptionLabel={(option) => option.Name || ''}
                    isOptionEqualToValue={(option, value) => option.NegotiateID === value}
                    value={Negotiation.find((init) => init.NegotiateID === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.NegotiateID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}></Grid>
            {/* <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Product Portfolio <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Autocomplete
                name="ProductPortfolioID"
                autoHighlight
                placeholder="Product Portfolio"
                options={productPortfolio}
                getOptionLabel={(option) => option.ProductPortfolioName}
                onChange={(event, newValue) => {
                  setSelectedPortfolio(newValue?.ProductPortfolioID || null);
                  setSelectedCategory(null); // Reset Category when Portfolio changes
                  setSelectedGroup(null); // Reset Group when Portfolio changes
                }}
                value={
                  productPortfolio.find(
                    (portfolio) => portfolio.ProductPortfolioID === selectedPortfolio
                  ) || null
                }
                renderInput={(params) => <TextField {...params} placeholder="Product Portfolio" />}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Product Category <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Autocomplete
                name="ProductCategoriesID"
                autoHighlight
                placeholder="Product Category"
                options={productCategory}
                getOptionLabel={(option) => option.ProductCategoriesName}
                onChange={(event, newValue) => {
                  setSelectedCategory(newValue?.ProductCategoriesID || null);
                  setSelectedGroup(null); // Reset Group when Category changes
                }}
                value={
                  productCategory.find((cat) => cat.ProductCategoriesID === selectedCategory) ||
                  null
                }
                renderInput={(params) => <TextField {...params} placeholder="Product Category" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Product Group <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Autocomplete
                multiple
                name="ProductGroupid"
                autoHighlight
                disableCloseOnSelect
                options={productGroup}
                getOptionLabel={(option) => option.ProductGroupName}
                onChange={(event, newValue) =>
                  setSelectedGroup(newValue.map((group) => group.ProductGroupID))
                }
                value={
                  productGroup.filter((group) => selectedGroup?.includes(group.ProductGroupID)) ||
                  []
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} style={{ marginRight: 8 }} />
                    {option.ProductGroupName}
                  </li>
                )}
                renderInput={(params) => <TextField {...params} placeholder="Product Group" />}
                // Render limited number of chips and show "+X more" for additional items
                renderTags={(selected, getTagProps) => {
                  const maxVisibleChips = 2; // Limit the number of visible chips
                  return (
                    <>
                      {selected.slice(0, maxVisibleChips).map((option, index) => (
                        <Chip
                          key={option.ProductGroupID}
                          label={option.ProductGroupName}
                          {...getTagProps({ index })}
                          color="primary"
                        />
                      ))}
                      {selected.length > maxVisibleChips && (
                        <Chip
                          label={`+${selected.length - maxVisibleChips} more`}
                          color="primary"
                        />
                      )}
                    </>
                  );
                }}
                sx={{
                  '& .MuiAutocomplete-inputRoot': {
                    display: 'flex',
                    flexWrap: 'wrap',
                  },
                }}
              />
            </Grid> */}

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Assortment Range <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="AssortmentRangeID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={AssortmentRange}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) => option.AssortmentRangeID === value}
                    value={
                      AssortmentRange.find((init) => init.AssortmentRangeID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.AssortmentRangeID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Assortment Strategy <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="AssortmentStrategyID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={AssortmentStrategy}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) => option.AssortmentStrategyID === value}
                    value={
                      AssortmentStrategy.find(
                        (init) => init.AssortmentStrategyID === field.value
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.AssortmentStrategyID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Planned Annual Turnover <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField name="PlannedAnnualTurnover" placeholder="1000" type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Agreed Payment Terms  <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="PaymentTermsID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={AgreedPaymentTerms}
                    getOptionLabel={(option) => option.PaymentTerms || ''}
                    isOptionEqualToValue={(option, value) => option.PaymentTermsID === value}
                    value={
                      AgreedPaymentTerms.find((init) => init.PaymentTermsID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.PaymentTermsID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 2 }}>
              <Typography variant="subtitle2">3% Service Remission:</Typography>
              <Controller
                name="ServiceRemission"
                control={control}
                defaultValue="False" // Set the default value
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="True" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="False" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 2 }}>
              <Typography variant="subtitle2">2% Bonus Agreement:</Typography>
              <Controller
                name="BonusAgreement"
                control={control}
                defaultValue="False" // Set the default value
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="True" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="False" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                )}
              />
            </Grid>
          </Grid>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <LoadingButton
            isLoading={isSubmitting}
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            color="primary"
          >
            Save Changes
          </LoadingButton>
        </Box>

        {/* Risk Analysis Section */}
        <Card sx={{ mb: 2 }}>
          <ButtonBase onClick={handleExpandClick} sx={{ width: '100%', textAlign: 'left' }}>
            <Typography
              variant="h6"
              sx={{
                p: 2,
                my: 0.5,
                borderBottom: expanded ? '1px solid #e0e0e0' : 'none',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              Risk Analysis
              <IconButton
                sx={{
                  marginLeft: 'auto',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              >
                <Iconify icon="si:expand-more-alt-fill" />
              </IconButton>
            </Typography>
          </ButtonBase>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Scrollbar sx={{ my: 3, px: 2 }}>
              <TableContainer>
                <Table sx={{ '& tbody tr:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" sx={{ minWidth: 170, fontWeight: 'medium' }}>
                        LkSG
                      </TableCell>
                      {columns.map((col, index) => (
                        <TableCell
                          key={index}
                          align="center"
                          sx={{ minWidth: 150, fontWeight: 'medium' }}
                        >
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {riskCategories.map((category, catIndex) => (
                      <TableRow key={catIndex}>
                        <TableCell align="left" sx={{ fontWeight: 'medium' }}>
                          {category.name}
                        </TableCell>
                        {columns.map((col, colIndex) => (
                          <TableCell
                            key={colIndex}
                            align="center"
                            sx={{
                              color:
                                getRateForColumn(category.data, col) < 3
                                  ? 'green'
                                  : getRateForColumn(category.data, col) >= 3
                                    ? 'red'
                                    : '#777',
                            }}
                          >
                            {getRateForColumn(category.data, col) === '-'
                              ? '-'
                              : getRateForColumn(category.data, col) === 'NA'
                                ? 'NA'
                                : parseFloat(getRateForColumn(category.data, col)).toFixed(0)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                    {/* Certificate Ratings Section */}
                    {certificateRating.length > 0 && <TableRow sx={{ backgroundColor: '#F4F6F8' }}>
                      <TableCell align="left" sx={{ fontWeight: 'medium', color: '#637381' }}>
                        Certificate Rating
                      </TableCell>
                      {columns.map((col, index) => (
                        <TableCell key={index} align="center" sx={{ minWidth: 150 }}></TableCell>
                      ))}
                    </TableRow>}

                    {/* Render each grouped certificate */}
                    {Object.keys(groupedCertificates).map((certName, certIndex) => (
                      <TableRow key={certIndex}>
                        <TableCell align="left">{certName}</TableCell>
                        {columns.map((col, colIndex) => (
                          <TableCell
                            key={colIndex}
                            align="center"
                            sx={{
                              color:
                                getRateForColumn(groupedCertificates[certName], col) < 3
                                  ? 'green'
                                  : getRateForColumn(groupedCertificates[certName], col) >= 3
                                    ? 'red'
                                    : '#777',
                            }}
                          >
                            {Math.trunc(getRateForColumn(groupedCertificates[certName], col))}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                    {/* Workshop Score row */}
                    <TableRow>
                      <TableCell align="left" sx={{ fontWeight: 'medium' }}>
                        Workshop
                      </TableCell>
                      {columns.map((col, colIndex) => {
                        const val = getRateForColumn(workshopScores, col);
                        const numVal = parseFloat(val);
                        return (
                          <TableCell
                            key={colIndex}
                            align="center"
                            sx={{
                              color:
                                val === '-' || val === 'NA'
                                  ? '#777'
                                  : numVal < 3
                                    ? 'green'
                                    : 'red',
                            }}
                          >
                            {val === '-' || val === 'NA' ? val : parseFloat(val).toFixed(0)}
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Survey Rating row */}
                    <TableRow>
                      <TableCell align="left" sx={{ fontWeight: 'medium' }}>
                        Survey Rating
                      </TableCell>
                      {columns.map((col, colIndex) => {
                        const val = getRateForColumn(surveyScores, col);
                        const numVal = parseFloat(val);
                        return (
                          <TableCell
                            key={colIndex}
                            align="center"
                            sx={{
                              color:
                                val === '-' || val === 'NA'
                                  ? '#777'
                                  : numVal < 3
                                    ? 'green'
                                    : 'red',
                            }}
                          >
                            {val === '-' || val === 'NA' ? val : parseFloat(val).toFixed(0)}
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Supplier Risk Rating row */}
                    <TableRow>
                      <TableCell align="left" sx={{ fontWeight: 'medium' }}>
                        Supplier Risk Rating
                      </TableCell>
                      {columns.map((col, index) => {
                        const val = columnSums[col] || 0;
                        return (
                          <TableCell
                            key={index}
                            align="center"
                            sx={{ color: val < 3 ? 'green' : 'red' }}
                          >
                            {Math.round(val)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    Certificate Rating
                    </TableRow>
                    </TableHead>
                    <TableBody>

                    </TableBody>

              </Table>
              </TableContainer> */}
            </Scrollbar>
          </Collapse>
        </Card>

        <Card>
          {/* {!mdUp && <CardHeader title="Details" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Company Information
          </Typography>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={8}>
              <Typography variant="subtitle2">
                Supplier Name <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField name="VenderName" placeholder="Legal Business Name" />
            </Grid>

            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Risk Status</Typography>
              <TextField
                fullWidth
                value={riskStatus}
                InputProps={{ readOnly: true }}
                inputProps={{ style: { color: isHighRisk ? 'red' : 'green', backgroundColor: isHighRisk ? 'rgba(245, 39, 39, 0.22)' : 'rgba(39, 245, 118, 0.22)', borderRadius: '8px' } }}
              />

            </Grid>

            <Grid spacing={1.5} xs={12} md={12}>
              <Typography variant="subtitle2">Potential Risks</Typography>
              <TextField
                fullWidth
                value={potentialRiskPAs.length > 0 ? potentialRiskPAs.join(', ') : 'None'}
                InputProps={{ readOnly: true }}
                sx={{ mt: 0.5 }}
              />
            </Grid>

            {/* <Grid spacing={1.5} xs={12} md={6}>
              
              <Typography variant="subtitle2">
                Short Name <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField name="ShortName" placeholder="Short Name" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Customer <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="CustomerID"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    autoHighlight
                    disableCloseOnSelect
                    options={filteredCustomers}
                    getOptionLabel={(option) => option.CustomerName}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map((group) => group.CustomerID));
                      setSelectedCustomers(newValue.map((group) => group.CustomerID));
                    }}
                    value={
                      filteredCustomers.filter((group) =>
                        selectedCustomers?.includes(group.CustomerID)
                      ) || []
                    }
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} style={{ marginRight: 8 }} />
                        {option.CustomerName}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        disabled
                        {...params}
                        placeholder="Customer"
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                    renderTags={(selected, getTagProps) => {
                      const maxVisibleChips = 2;
                      return (
                        <>
                          {selected.slice(0, maxVisibleChips).map((option, index) => (
                            <Chip
                              key={option.CustomerID}
                              label={option.CustomerName}
                              {...getTagProps({ index })}
                              color="primary"
                            />
                          ))}
                          {selected.length > maxVisibleChips && (
                            <Chip
                              label={`+${selected.length - maxVisibleChips} more`}
                              color="primary"
                            />
                          )}
                        </>
                      );
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Industry Type <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="IndustryTypeID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={IndustryType}
                    getOptionLabel={(option) => option.IndustryName || ''}
                    isOptionEqualToValue={(option, value) => option.IndustryTypeID === value}
                    value={IndustryType.find((init) => init.IndustryTypeID === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.IndustryTypeID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="Industry Type"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Grid> */}
          </Grid>

          <Grid spacing={1.5} xs={12} md={12}>
            <Typography variant="subtitle2">
              Address Line 1 <span style={{ color: 'red' }}>*</span>
            </Typography>
            <RHFTextField name="Address1" placeholder="14th Street NewYork..." />
          </Grid>
          <Grid spacing={1.5} xs={12} md={12}>
            <Typography variant="subtitle2">Address Line 2</Typography>
            <RHFTextField name="Address2" placeholder="14th Street NewYork..." />
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">
                Country <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFAutocomplete
                name="CountryID"
                placeholder="Choose a Country"
                fullWidth
                value={
                  countries?.find((country) => country.Country_id === CountryID)?.CountryName || ''
                }
                onChange={handleCountryChange}
                options={countries?.map((option) => option.CountryName)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Province</Typography>
              <RHFTextField name="Province" placeholder="Province" />
            </Grid>

            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">
                City <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField name="City" placeholder="City" />
            </Grid>
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Phone</Typography>
              <RHFTextField name="PhoneNumber" placeholder="+1 234567890" />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Fax</Typography>
              <RHFTextField name="FaxNo" placeholder="123450..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Zip Code</Typography>
              <RHFTextField name="ZipCode" placeholder="781211..." />
            </Grid>
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">
                Web Address <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField name="Website" placeholder="City" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Main Export Market <span style={{ color: 'red' }}>*</span>
              </Typography>
              {/* 
              <Select
                // labelId="demo-multiple-checkbox-label"
                // id="demo-multiple-checkbox"
                placeholder="Main Export Market"
                multiple
                sx={{ width: '100%' }}
                value={selectedMarkets}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setSelectedMarkets(typeof value === 'string' ? value.split(',') : value);
                }}
                input={<OutlinedInput placeholder="Select Main Export Market" />}
                renderValue={(selected) =>
                  selected
                    .map(
                      (id) =>
                        mainExportMarket.find((country) => country.Country_id === id)?.CountryName
                    )
                    .join(', ')
                }
              >
                {mainExportMarket.map((country) => (
                  <MenuItem key={country.Country_id} value={country.Country_id}>
                    <Checkbox checked={selectedMarkets.indexOf(country.Country_id) > -1} />
                    <ListItemText primary={country.CountryName} />
                  </MenuItem>
                ))}
              </Select> 
              */}

              <Controller
                name="MainExportMarketId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    autoHighlight
                    disableCloseOnSelect
                    options={mainExportMarket}
                    getOptionLabel={(option) => option.CountryName}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map((group) => group.Country_id));
                      setSelectedMarkets(newValue.map((group) => group.Country_id));
                    }}
                    value={
                      mainExportMarket.filter((group) =>
                        selectedMarkets?.includes(group.Country_id)
                      ) || []
                    }
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} style={{ marginRight: 8 }} />
                        {option.CountryName}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="Customer"
                        placeholder="Select Main Export Market"
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                    renderTags={(selected, getTagProps) => {
                      const maxVisibleChips = 1;
                      return (
                        <>
                          {selected.slice(0, maxVisibleChips).map((option, index) => (
                            <Chip
                              key={option.Country_id}
                              label={option.CountryName}
                              {...getTagProps({ index })}
                              color="primary"
                            />
                          ))}
                          {selected.length > maxVisibleChips && (
                            <Chip
                              label={`+${selected.length - maxVisibleChips} more`}
                              color="primary"
                            />
                          )}
                        </>
                      );
                    }}
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Facility <span style={{ color: 'red' }}>*</span>
              </Typography>
              
              <Controller
                name="FacilityID"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    autoHighlight
                    disableCloseOnSelect
                    options={facility}
                    getOptionLabel={(option) => option.FacilityName}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map((group) => group.FacilityID));
                      setSelectedFacilities(newValue.map((group) => group.FacilityID));
                    }}
                    value={
                      facility.filter((group) => selectedFacilities?.includes(group.FacilityID)) ||
                      []
                    }
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} style={{ marginRight: 8 }} />
                        {option.FacilityName}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="Customer"
                        placeholder="Facility"
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                    renderTags={(selected, getTagProps) => {
                      const maxVisibleChips = 2;
                      return (
                        <>
                          {selected.slice(0, maxVisibleChips).map((option, index) => (
                            <Chip
                              key={option.FacilityID}
                              label={option.FacilityName}
                              {...getTagProps({ index })}
                              color="primary"
                            />
                          ))}
                          {selected.length > maxVisibleChips && (
                            <Chip
                              label={`+${selected.length - maxVisibleChips} more`}
                              color="primary"
                            />
                          )}
                        </>
                      );
                    }}
                  />
                )}
              />
            </Grid> */}
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">
                Onboarding Email <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField name="OnBoardingEmail" placeholder="Onboarding Email" type="email" />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {/* Setup Details */}
      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Setup Details
          </Typography>
          {/* <Grid> */}
          {/* <Grid spacing={1.5} xs={12} md={4}>
            <Typography variant="subtitle2">Supplier Cluster</Typography>
            <RHFAutocomplete
              name="Supplier Cluster"
              autoHighlight
              placeholder="Supplier Cluster"
              options={_roles.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />
          </Grid> */}
          {/* <Grid container spacing={1.5} sx={{ p: 1.5 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Product Portfolio <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Autocomplete
                name="ProductPortfolioID"
                autoHighlight
                placeholder="Product Portfolio"
                options={productPortfolio}
                getOptionLabel={(option) => option.ProductPortfolioName}
                onChange={(event, newValue) => {
                  setSelectedPortfolio(newValue?.ProductPortfolioID || null);
                  setSelectedCategory(null); // Reset Category when Portfolio changes
                  setSelectedGroup(null); // Reset Group when Portfolio changes
                }}
                value={
                  productPortfolio.find(
                    (portfolio) => portfolio.ProductPortfolioID === selectedPortfolio
                  ) || null
                }
                renderInput={(params) => <TextField {...params} placeholder="Product Portfolio" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Product Category <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Autocomplete
                name="ProductCategoriesID"
                autoHighlight
                placeholder="Product Category"
                options={productCategory}
                getOptionLabel={(option) => option.ProductCategoriesName}
                onChange={(event, newValue) => {
                  setSelectedCategory(newValue?.ProductCategoriesID || null);
                  setSelectedGroup(null); // Reset Group when Category changes
                }}
                value={
                  productCategory.find((cat) => cat.ProductCategoriesID === selectedCategory) ||
                  null
                }
                renderInput={(params) => <TextField {...params} placeholder="Product Category" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Product Group <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Autocomplete
                multiple
                name="ProductGroupid"
                autoHighlight
                disableCloseOnSelect
                options={productGroup}
                getOptionLabel={(option) => option.ProductGroupName}
                onChange={(event, newValue) =>
                  setSelectedGroup(newValue.map((group) => group.ProductGroupID))
                }
                value={
                  productGroup.filter((group) => selectedGroup?.includes(group.ProductGroupID)) ||
                  []
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} style={{ marginRight: 8 }} />
                    {option.ProductGroupName}
                  </li>
                )}
                renderInput={(params) => <TextField {...params} placeholder="Product Group" />}
                // Render limited number of chips and show "+X more" for additional items
                renderTags={(selected, getTagProps) => {
                  const maxVisibleChips = 2; // Limit the number of visible chips
                  return (
                    <>
                      {selected.slice(0, maxVisibleChips).map((option, index) => (
                        <Chip
                          key={option.ProductGroupID}
                          label={option.ProductGroupName}
                          {...getTagProps({ index })}
                          color="primary"
                        />
                      ))}
                      {selected.length > maxVisibleChips && (
                        <Chip
                          label={`+${selected.length - maxVisibleChips} more`}
                          color="primary"
                        />
                      )}
                    </>
                  );
                }}
                sx={{
                  '& .MuiAutocomplete-inputRoot': {
                    display: 'flex',
                    flexWrap: 'wrap',
                  },
                }}
              />
            </Grid>
          </Grid> */}
          {/* <Grid spacing={1.5} xs={12} md={4}>
            <Typography variant="subtitle2">
              Vertical Integration <span style={{ color: 'red' }}>*</span>
            </Typography>

            <Autocomplete
              multiple
              name="VerticalIntegrationID"
              autoHighlight
              disableCloseOnSelect
              options={verticalIntegration}
              getOptionLabel={(option) => option.Name}
              onChange={(event, newValue) =>
                setSelectedVerticalIntegration(newValue.map((group) => group.VVIID))
              }
              value={
                verticalIntegration.filter((group) =>
                  selectedVerticalIntegration?.includes(group.VVIID)
                ) || []
              }
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} style={{ marginRight: 8 }} />
                  {option.Name}
                </li>
              )}
              renderInput={(params) => <TextField {...params} placeholder="Vertical Integration" />}
              // Render limited number of chips and show "+X more" for additional items
              renderTags={(selected, getTagProps) => {
                const maxVisibleChips = 2; // Limit the number of visible chips
                return (
                  <>
                    {selected.slice(0, maxVisibleChips).map((option, index) => (
                      <Chip
                        key={option.VVIID}
                        label={option.Name}
                        {...getTagProps({ index })}
                        color="primary"
                      />
                    ))}
                    {selected.length > maxVisibleChips && (
                      <Chip label={`+${selected.length - maxVisibleChips} more`} color="primary" />
                    )}
                  </>
                );
              }}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  display: 'flex',
                  flexWrap: 'wrap',
                },
              }}
            />
          </Grid> */}
          <Grid container spacing={1.5} sx={{ p: 1.5 }}>
            <Grid spacing={1.5} xs={12} md={6}>
              <Typography variant="subtitle2">
                Capacity per Month <span style={{ color: 'red' }}>*</span>{' '}
                {/* <span style={{ color: 'grey', fontSize: '12px', fontWeight: 'lighter' }}>
                  (Please select the appropriate unit for your product)
                </span> */}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }} gap={1}>
                <RHFTextField name="Capacity" placeholder="Capacity per Month" />

                <Controller
                  name="CapacityUnit"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <RHFAutocomplete
                      {...field}
                      options={CapacityUnit}
                      getOptionLabel={(option) => option.Text || ''}
                      isOptionEqualToValue={(option, value) => option.Value === value}
                      value={CapacityUnit.find((init) => init.Value === field.value) || null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.Value : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Unit"
                          sx={{ width: '150px' }}
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid spacing={1.5} xs={12} md={6}>
              <Typography variant="subtitle2">
                Turnover per year <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }} gap={1}>
                <RHFTextField name="Annualturnover" placeholder="Turnover per year" />

                <Controller
                  name="AmtSign"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <RHFAutocomplete
                      {...field}
                      options={AntUnit}
                      getOptionLabel={(option) => option.Text || ''}
                      isOptionEqualToValue={(option, value) => option.Value === value}
                      value={AntUnit.find((init) => init.Value === field.value) || null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.Value : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Unit"
                          sx={{ width: '150px' }}
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid spacing={1.5} xs={12} md={12}>
            <Typography variant="subtitle2">
              Business License No. <span style={{ color: 'red' }}>*</span>
            </Typography>
            {/* </Grid> */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { md: 'center' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <RHFTextField name="BusinessLicenseNumber" placeholder="8791" />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flexShrink: 0,
                }}
              >
                <UploadBox
                  name="BusinessLicenseNumberFile"
                  file={BusinessLicenseNumberFile}
                  disabled
                  onDrop={handleBusinessFile}
                  multiple
                />

                {BusinessLicenseNumberFile ? (
                  <Chip
                    label={BusinessLicenseNumberFile.name}
                    size="small"
                    color="info"
                    variant="soft"
                    icon={<Iconify icon="eva:file-text-fill" width={18} />}
                    onDelete={() => setBusinessLicenseNumberFile(null)}
                    sx={{ maxWidth: 260 }}
                  />
                ) : BusinessLogoByID.length > 0 ? (
                  <Chip
                    label={BusinessLogoByID[BusinessLogoByID.length - 1]?.FileName || 'View File'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    icon={<Iconify icon="eva:external-link-fill" width={16} />}
                    component="a"
                    href={BusinessLogoByID[BusinessLogoByID.length - 1]?.FileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    // onDelete={() =>
                    //   DeleteBusinessLogoByID(
                    //     BusinessLogoByID[BusinessLogoByID.length - 1]?.VenderID
                    //   )
                    // }
                    // deleteIcon={<Iconify icon="solar:trash-bin-trash-bold" width={16} />}
                    sx={{ maxWidth: 260 }}
                  />
                ) : null}
              </Box>
            </Box>
          </Grid>
          {/* 
          <Grid container spacing={1.5} sx={{ p: 1.5 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2">
                  Factory Area (m2) <span style={{ color: 'red' }}>*</span>
                </Typography>
                <RHFTextField name="FactoryArea" placeholder="Factory Area (m2)" />
              </Box>
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2">
                  {' '}
                  No. of Employee <span style={{ color: 'red' }}>*</span>
                </Typography>
                <RHFTextField name="NumberofEmployees" placeholder="100" />
              </Box>
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2">
                  {' '}
                  Working Hours <span style={{ color: 'red' }}>*</span>
                </Typography>
                <RHFTextField name="WorkingHours" placeholder="8" />
              </Box>
            </Grid>
          </Grid> */}

          <Grid container spacing={1.5} sx={{ p: 1.5 }}>
            <Grid spacing={1.5} xs={12} md={12}>
              <Typography variant="subtitle2"> Additional Info</Typography>
              <RHFTextField
                name="AboutSupplier"
                placeholder="Additional Info.."
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {/* Business Numbers */}
      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Business Numbers
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', p: 1.5 }}>
            <Box>
              <Typography variant="subtitle2">
                No. of Employee <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="NoOfEmployeesID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={NoOfEmployee}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) => option.NoOfEmployeesID === value}
                    value={
                      NoOfEmployee.find((init) => init.NoOfEmployeesID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.NoOfEmployeesID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                % of Export Business <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="PercentageOfExportBusinessID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={PerOfExpBusiness}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) =>
                      option.PercentageOfExportBusinessID === value
                    }
                    value={
                      PerOfExpBusiness.find(
                        (init) => init.PercentageOfExportBusinessID === field.value
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.PercentageOfExportBusinessID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                Experience in Business Type <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="ExperienceInBusinessTypeID"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    autoHighlight
                    disableCloseOnSelect
                    options={ExpInBusinessType}
                    getOptionLabel={(option) => option.Value || ''}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map((group) => group.ExperienceInBusinessTypeID));
                      setSelectedExperienceInBusinessTypeID(
                        newValue.map((group) => group.ExperienceInBusinessTypeID)
                      );
                    }}
                    value={
                      ExpInBusinessType.filter((group) =>
                        selectedExperienceInBusinessTypeID?.includes(
                          group.ExperienceInBusinessTypeID
                        )
                      ) || []
                    }
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} style={{ marginRight: 8 }} />
                        {option.Value}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="Customer"
                        placeholder="Select Experience in Buisiness"
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                    renderTags={(selected, getTagProps) => {
                      const maxVisibleChips = 1;
                      return (
                        <>
                          {selected.slice(0, maxVisibleChips).map((option, index) => (
                            <Chip
                              key={option.ExperienceInBusinessTypeID}
                              label={option.Value}
                              {...getTagProps({ index })}
                              color="primary"
                            />
                          ))}
                          {selected.length > maxVisibleChips && (
                            <Chip
                              label={`+${selected.length - maxVisibleChips} more`}
                              color="primary"
                            />
                          )}
                        </>
                      );
                    }}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                % of Business in Europe <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="BusinessPercentageInEuropeanID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={PerExpBusinessEuro}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) =>
                      option.BusinessPercentageInEuropeanID === value
                    }
                    value={
                      PerExpBusinessEuro.find(
                        (init) => init.BusinessPercentageInEuropeanID === field.value
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.BusinessPercentageInEuropeanID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                Shipping Terms <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="ShippingTermsID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={ShippingTerms}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) => option.ShippingTermsID === value}
                    value={
                      ShippingTerms.find((init) => init.ShippingTermsID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.ShippingTermsID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                Years in Business <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="YearsInBusinessID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={YearsInBusiness}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) => option.YearsInBusinessID === value}
                    value={
                      YearsInBusiness.find((init) => init.YearsInBusinessID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.YearsInBusinessID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                Years in European Business <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="YearsInEuropeanBusinessID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={YearsInEuroBusiness}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) =>
                      option.YearsInEuropeanBusinessID === value
                    }
                    value={
                      YearsInEuroBusiness.find(
                        (init) => init.YearsInEuropeanBusinessID === field.value
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.YearsInEuropeanBusinessID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                Business Type <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="BusinessTypeID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={BusinessType}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) => option.BusinessTypeID === value}
                    value={BusinessType.find((init) => init.BusinessTypeID === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.BusinessTypeID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box>
            {/* <Box>
              <Typography variant="subtitle2">
                Certificates <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="AssortmentRangeID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={AssortmentRange}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) => option.AssortmentRangeID === value}
                    value={
                      AssortmentRange.find((init) => init.AssortmentRangeID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.AssortmentRangeID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box> */}
            {/* <Box>
              <Typography variant="subtitle2">Assortment Strategy</Typography>
              <Controller
                name="AssortmentStrategyID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={AssortmentStrategy}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) => option.AssortmentStrategyID === value}
                    value={
                      AssortmentStrategy.find(
                        (init) => init.AssortmentStrategyID === field.value
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.AssortmentStrategyID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="No. of Employee"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box> */}
          </Box>
        </Card>
      </Grid>
      {/* Conditions */}
      {/* <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Conditions
          </Typography>
          <Grid container spacing={3} sx={{ p: 1.5 }}>
            <Grid spacing={1.5} xs={12} md={6}>
              <Typography variant="subtitle2">What are your payment terms?</Typography>
              <RHFAutocomplete
                name="payTerms"
                autoHighlight
                placeholder="Payment Terms"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={6}>
              <Typography variant="subtitle2">What is the service remissions?</Typography>
              <RHFAutocomplete
                name="remission"
                autoHighlight
                placeholder="Remission"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={12}>
              <Typography variant="subtitle2">What is the bonus agreement?</Typography>
              <RHFAutocomplete
                name="agreement"
                autoHighlight
                placeholder="Agreement"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid> */}

      {/* Genral Contact Information */}
      {/* <Grid xs={12} md={12}>
   
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            General Contact Information
          </Typography>
          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Contact Type</Typography>
              <RHFAutocomplete
                name="ContactType"
                autoHighlight
                placeholder="Email"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Name</Typography>
              <RHFTextField name="contactName" placeholder="John Doe..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Job Title</Typography>
              <RHFTextField name="title" placeholder="IT Manager" />
            </Grid>
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
          
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Mobile Number</Typography>
              <RHFTextField name="Mobile" placeholder="+1 234567890..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Email</Typography>
              <RHFTextField name="email" type="email" placeholder="john@mail.com..." />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, pb: 1.5 }}>
            <Button variant="contained" color="primary">
              Add More
            </Button>
          </Box>
          <Box sx={{ px: 2.5, pb: 1.5 }}>
            <CustomTable />
          </Box>
        </Card>
      </Grid>  */}

      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            General Contact Information
          </Typography>
          <Scrollbar>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 200 }}>Contact Type</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>Name</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Job Title</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Mobile Number</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>Email</TableCell>
                    {/* <TableCell>Actions</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Controller
                          name={`contacts[${index}].ContactType`}
                          control={control}
                          render={({ field }) => (
                            <RHFAutocomplete
                              {...field}
                              value={
                                contactType.find(
                                  (type) => type.Contact_Type_ID === contact.ContactType
                                )?.Contact_Type || ''
                              }
                              onChange={(event, value) =>
                                handleContactAutocompleteChange(index, 'ContactType', value)
                              }
                              autoHighlight
                              placeholder="Select Contact Type"
                              options={contactType.map((option) => option.Contact_Type)}
                              getOptionLabel={(option) => option}
                              renderOption={(props, option) => (
                                <li {...props} key={option}>
                                  {option}
                                </li>
                              )}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`contacts[${index}].PersonName`}
                          value={contact.PersonName}
                          onChange={(event) => handleContactInputChange(index, 'PersonName', event)}
                          placeholder="John Doe"
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`contacts[${index}].Designation`}
                          value={contact.Designation}
                          onChange={(event) =>
                            handleContactInputChange(index, 'Designation', event)
                          }
                          placeholder="Managing Director"
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`contacts[${index}].CellNo`}
                          value={contact.CellNo}
                          onChange={(event) => handleContactInputChange(index, 'CellNo', event)}
                          placeholder="+1 234567890"
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`contacts[${index}].EmailAddress`}
                          value={contact.EmailAddress}
                          onChange={(event) =>
                            handleContactInputChange(index, 'EmailAddress', event)
                          }
                          placeholder="john@mail.com..."
                        />
                      </TableCell>
                      {/* <TableCell>
                        <IconButton onClick={() => handleContactDelete(index)} color="error">
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, pb: 1.5, mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleAddContact}>
              Add More
            </Button>
          </Box> */}
        </Card>
      </Grid>

      {/* Supply Chain */}

      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Supply Chain
          </Typography>
          <Scrollbar>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 180 }}>Party Type</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Material</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Party Name</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Country</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Address</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Contact Person</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Phone Number</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Email</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Google</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Additional Info</TableCell>

                    {/* <TableCell>Action</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supplies.map((supply, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <RHFAutocomplete
                          name={`supplies[${index}].TypeID`}
                          value={
                            typeOfSupply.find((type) => type.PartyTypeid === supply.TypeID)
                              ?.PartyTypeSupplychain || ''
                          }
                          onChange={(event, value) =>
                            handleSupplyAutocompleteChange(index, 'TypeID', value)
                          }
                          autoHighlight
                          placeholder="Select Party Type"
                          options={typeOfSupply.map((option) => option.PartyTypeSupplychain)}
                          getOptionLabel={(option) => option}
                          renderOption={(props, option) => (
                            <li {...props} key={option}>
                              {option}
                            </li>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`supplies[${index}].MaterialorProcess`}
                          placeholder="Material"
                          value={supply.MaterialorProcess}
                          onChange={(event) =>
                            handleSupplyInputChange(index, 'MaterialorProcess', event)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`supplies[${index}].FactoryName`}
                          placeholder="Supplier Name"
                          value={supply.FactoryName}
                          onChange={(event) => handleSupplyInputChange(index, 'FactoryName', event)}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFAutocomplete
                          name={`supplies[${index}].CountryId`}
                          type="country"
                          value={
                            country.find((c) => c.Country_id === supply.CountryId)?.CountryName ||
                            ''
                          }
                          onChange={(event, value) =>
                            handleSupplyAutocompleteChange(index, 'CountryId', value)
                          }
                          autoHighlight
                          placeholder="Select Country"
                          options={country.map((option) => option.CountryName)}
                          getOptionLabel={(option) => option}
                          renderOption={(props, option) => (
                            <li {...props} key={option}>
                              {option}
                            </li>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`supplies[${index}].Address`}
                          placeholder="Address"
                          value={supply.Address}
                          onChange={(event) => handleSupplyInputChange(index, 'Address', event)}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`supplies[${index}].ContactPerson`}
                          placeholder="Contact Person"
                          value={supply.ContactPerson}
                          onChange={(event) =>
                            handleSupplyInputChange(index, 'ContactPerson', event)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`supplies[${index}].PhoneNumber`}
                          placeholder="Phone Number"
                          value={supply.PhoneNumber}
                          onChange={(event) => handleSupplyInputChange(index, 'PhoneNumber', event)}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`supplies[${index}].Email`}
                          placeholder="Email"
                          value={supply.Email}
                          onChange={(event) => handleSupplyInputChange(index, 'Email', event)}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`supplies[${index}].AgentTradingCompany`}
                          placeholder="Agent Trading Company"
                          value={supply.AgentTradingCompany}
                          onChange={(event) =>
                            handleSupplyInputChange(index, 'AgentTradingCompany', event)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`supplies[${index}].AdditionalInformation`}
                          placeholder="Additional Information"
                          value={supply.AdditionalInformation}
                          onChange={(event) =>
                            handleSupplyInputChange(index, 'AdditionalInformation', event)
                          }
                        />
                      </TableCell>
                      {/* <TableCell>
                        <IconButton onClick={() => handleSupplyDelete(index)} color="error">
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, pb: 1.5, mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleAddSupply}>
              Add More
            </Button>
          </Box> */}
        </Card>
      </Grid>

      {/* Certificates and Patents */}
      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Certificates and Patents
          </Typography>
          <Grid container spacing={3} sx={{ p: 1.5 }}>
            {/* <Typography variant="subtitle2" sx={{ p: 2 }}>
              Please upload all the certificates and patents the company has obtained:
            </Typography> */}
            {/* <Grid container spacing={3} xs={12} md={12}>
              <Grid container spacing={2} xs={12} md={8} sx={{ mt: 2 }}>
                <Grid spacing={2} xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2">
                      Document <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Controller
                      name="CertificateID"
                      control={control}
                      defaultValue=""
                      render={({ field, fieldState: { error } }) => (
                        <RHFAutocomplete
                          {...field}
                          options={DocumentData}
                          getOptionLabel={(option) => option.Certificate || ''}
                          isOptionEqualToValue={(option, value) => option.CertificateID === value}
                          value={
                            DocumentData.find((init) => init.CertificateID === field.value) || null
                          }
                          onChange={(event, newValue) => {
                            setSelectedCertificate(newValue); // Store the selected CertificateType in state
                            field.onChange(newValue ? newValue.CertificateID : '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              fullWidth
                              error={!!error}
                              helperText={error ? error.message : ''}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid spacing={2} xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2">Description (if others)</Typography>
                    <TextField
                      name="Description"
                      placeholder="Certificate Description"
                      fullWidth
                      value={formData.Description}
                      onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    />
                  </Box>
                </Grid>

                <Grid spacing={2} xs={12} md={12}>
                  <Controller
                    name="NoValidityLimit"
                    control={control}
                    defaultValue={false} // Default value of the checkbox
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            size="small"
                            checked={!!field.value} // Ensure it's a boolean value
                            onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                          />
                        }
                        label="No Validity Limit"
                      />
                    )}
                  />
                </Grid>

                <Grid container spacing={2} xs={12} md={12}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2">
                      Validity From <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Controller
                      name="CertificateFrom"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DesktopDatePicker
                          inputFormat="yyyy-MM-dd"
                          value={CertificateFromSA}
                          onChange={(newValue) => {
                            setValidityFromSA(newValue);
                            field.onChange(format(newValue, 'yyyy-MM-dd'));
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2">
                      Validity To <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Controller
                      name="CertificateTo"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DesktopDatePicker
                          inputFormat="yyyy-MM-dd"
                          value={CertificateToSA}
                          onChange={(newValue) => {
                            setValidityToSA(newValue);
                            field.onChange(format(newValue, 'yyyy-MM-dd'));
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid spacing={2} xs={12} md={4}>
                <Upload
                  name="FileName"
                  file={selectedFile}
                  // accept=".pdf"
                  onDrop={handleDropSingleFile}
                  sx={{ mt: 2 }}
                  multiple
                />
                <Box>{selectedFile?.name}</Box>
              </Grid>
            </Grid> */}
          </Grid>
          {/* <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mx: 2, mb: 2 }}
              onClick={handleAdd} // Call handleAdd on click
            >
              Add
            </Button>
          </Box> */}
          <Scrollbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Certificate</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Validity from</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>File</TableCell>
                  {/* <TableCell></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.CertificateType}</TableCell>
                    <TableCell>{row.Description}</TableCell>
                    <TableCell>{fDate(row.CertificateFrom)}</TableCell>
                    <TableCell>{fDate(row.CertificateTo)}</TableCell>
                    <TableCell>
                      {row?.Path ? (
                        <Chip
                          label="View File"
                          size="small"
                          component="a"
                          href={row?.Path || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          clickable
                          color="primary"
                          variant="outlined"
                          icon={<Iconify icon="eva:external-link-fill" width={16} />}
                        />
                      ) : (
                        row?.FileName
                      )}
                    </TableCell>
                    {/* <TableCell
                      sx={{ color: 'error.main', cursor: 'pointer' }}
                      onClick={() => handleDelete(index)} // Call handleDelete on click
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </Card>
      </Grid>


      {/* Logo */}
      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Logo
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1">Supplier's Logo</Typography>
                {VenderLogoByID && (
                  <Link
                    href={VenderLogoByID[VenderLogoByID.length - 1]?.FileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Avatar src={VenderLogoByID[VenderLogoByID.length - 1]?.FileUrl || '#'} />
                  </Link>
                )}
              </Box>
              <Box>{/* <UploadBox placeholder="Choose File" sx={{ width: 200 }} /> */}</Box>
            </Box>
          </Box>
        </Card>

        {/* <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            loading={isSubmitting}
            sx={{ ml: 2 }}
          >
            {!currentSupplier ? 'Create Supplier' : 'Save Changes'}
          </LoadingButton>
        </Box> */}
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* {!loading ? ( */}
        {renderDetails}


        {/* ) : ( */}
        {/* <LoadingScreen
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh',
            }}
          /> */}
        {/* )} */}
        {/* {renderProperties}

        {renderActions} */}
      </Grid>
      {/* Survey section outside disabled fieldset so Download PDF button works  */}
      <Grid container spacing={3} sx={{ margin: 0.5, px: 0 }}>
        <Grid xs={12} md={12} px={0}>
          <Card>
            <Typography variant="h6" sx={{ p: 2, m: 0.5, borderBottom: '1px solid #e0e0e0' }}>
              Workshop
            </Typography>
            <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Workshop Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Registered</TableCell>
                    <TableCell>Attended</TableCell>
                    <TableCell>Participants</TableCell>
                    <TableCell>Certificate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workshopData.length > 0 ? (
                    workshopData
                      .slice(
                        workshopPage * workshopRowsPerPage,
                        workshopPage * workshopRowsPerPage + workshopRowsPerPage
                      )
                      .map((row, index) => {
                        const formatTimeStr = (t) => {
                          if (!t) return '-';
                          try { return fTime(new Date(`1970-01-01T${t}`)); } catch { return t; }
                        };
                        const isYes = (val) => val === '1' || val === 'true' || val === 'True' || val === 'Yes';
                        return (
                          <TableRow key={row.WorkshopInvitationMstID ?? index}>
                            <TableCell>{row.WorkShopName ?? '-'}</TableCell>
                            <TableCell>{row.WorkShopDate ? fDate(row.WorkShopDate, 'dd MMM yyyy') : '-'}</TableCell>
                            <TableCell>{formatTimeStr(row.StartTime)}</TableCell>
                            <TableCell>{formatTimeStr(row.EndTime)}</TableCell>
                            <TableCell>
                              <Chip
                                label={isYes(row.IsRegistered) ? 'Yes' : 'No'}
                                size="small"
                                color={isYes(row.IsRegistered) ? 'success' : 'default'}
                                variant="soft"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={isYes(row.IsAttended) ? 'Yes' : 'No'}
                                size="small"
                                color={isYes(row.IsAttended) ? 'success' : 'default'}
                                variant="soft"
                              />
                            </TableCell>
                            <TableCell>{row.Participants ?? '-'}</TableCell>
                            <TableCell>
                              {row.CertificateURL ? (
                                <Chip
                                  label="View Certificate"
                                  size="small"
                                  component="a"
                                  href={row.CertificateURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  clickable
                                  color="primary"
                                  variant="outlined"
                                  icon={<Iconify icon="eva:external-link-fill" width={16} />}
                                />
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        No workshop data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {workshopData.length > 0 && (
                <TablePaginationCustom
                  count={workshopData.length}
                  page={workshopPage}
                  rowsPerPage={workshopRowsPerPage}
                  onPageChange={(e, newPage) => setWorkshopPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setWorkshopRowsPerPage(parseInt(e.target.value, 10));
                    setWorkshopPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              )}
            </Scrollbar>
          </Card>
        </Grid>
      </Grid>



      <Grid container spacing={3} sx={{ margin: 0.5, px: 0 }}>
        <Grid xs={12} md={12} px={0}>
          <Card>
            <Typography variant="h6" sx={{ p: 2, m: 0.5, borderBottom: '1px solid #e0e0e0' }}>
              Survey
            </Typography>
            <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Survey</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assessment Date</TableCell>
                    <TableCell>Obtained Marks</TableCell>
                    <TableCell>Answer Sheet</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surveyDetail.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        No survey data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    surveyDetail
                      .slice(
                        surveyPage * surveyRowsPerPage,
                        surveyPage * surveyRowsPerPage + surveyRowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow key={row.uniqueKey ?? index}>
                          <TableCell>{row.SurveyNo ?? '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.Status ?? '-'}
                              size="small"
                              color={
                                row.Status?.toLowerCase() === 'attempted'
                                  ? 'success'
                                  : 'error'
                              }
                              variant="soft"
                            />
                          </TableCell>
                          <TableCell>
                            {row.AssessmentDate
                              ? fDate(row.AssessmentDate, 'dd MMM yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>{row.Marks ?? '-'}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <SurveyPdfDownloadButton
                              row={row}
                              renderTrigger={row?.Status === "Attempted" && (({ onClick, loading, label }) => (
                                <Button
                                  type="button"
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  disabled={!!loading}
                                  startIcon={<Iconify icon="material-symbols:download" />}
                                  onClick={onClick}
                                >
                                  {label}
                                </Button>
                              ))}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
              {surveyDetail.length > 0 && (
                <TablePaginationCustom
                  count={surveyDetail.length}
                  page={surveyPage}
                  rowsPerPage={surveyRowsPerPage}
                  onPageChange={(e, newPage) => setSurveyPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setSurveyRowsPerPage(parseInt(e.target.value, 10));
                    setSurveyPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              )}
            </Scrollbar>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SupplierOnboardForm.propTypes = {
  currentSupplier: PropTypes.object,
};

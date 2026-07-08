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
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import { UploadBox } from 'src/components/upload';
import Upload from 'src/components/upload/upload';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import Scrollbar from 'src/components/scrollbar';
import { Delete, Get, Post, Put } from 'src/utils/AxiosHelper';
import { decrypt, encrypt } from 'src/api/encryption';
import { getDecryptedUserData, getUserData } from 'src/utils/getUser';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import Link from 'next/link';
import { ConfirmDialog } from './custom-dialog';
import sanitizeFileName from 'src/utils/sanitizeFileName';
import { fDate } from 'src/utils/format-time';

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

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(today.getDate()).padStart(2, '0'); // Ensure 2 digits for day

  return `${year}-${month}-${day}`;
}

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
  setisLoading,
  OnBoardingDTLID,
  currentCertificate,
}) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const SupplierType = ['1']; // for InserVendorDetail api

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;
  const UserData = getDecryptedUserData();

  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [IndustryType, setIndustryType] = useState([]);
  const [mainExportMarket, setMainExportMarket] = useState([]);
  const [facility, setFacility] = useState([]);

  // business Numbers dropdowns
  const [NoOfEmployee, setNoOfEmployee] = useState([]);
  const [PerOfExpBusiness, setPerOfExpBusiness] = useState([]);
  const [ExpInBusinessType, setExpInBusinessType] = useState([]);
  const [PerExpBusinessEuro, setPerExpBusinessEuro] = useState([]);
  const [ShippingTerms, setShippingTerms] = useState([]);
  const [YearsInBusiness, setYearsInBusiness] = useState([]);
  const [YearsInEuroBusiness, setYearsInEuroBusiness] = useState([]);
  const [BusinessType, setBusinessType] = useState([]);

  const [BusinessLogoByID, setBusinessLogoByID] = useState([]);
  const [VenderLogoByID, setVenderLogoByID] = useState([]);

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
  const [MainDocsData, setMainDocsData] = useState([]);

  const [productPortfolio, setProductPortfolio] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [productGroup, setProductGroup] = useState([]);
  const [verticalIntegration, setVerticalIntegration] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [BusinessLicenseNumberFile, setBusinessLicenseNumberFile] = useState(null);
  const [logo, setLogo] = useState(null);

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const NewSupplierSchema = Yup.object().shape({
    Address1: Yup.string().required('Address is required'),
    // Address2: Yup.string().required('Address is required'),
    AmtSign: Yup.string().required('Turnover Unit is required'),
    Annualturnover: Yup.number('Turnover per year should be a number').required(
      'Turnover per year is required'
    ),
    // AssortmentRangeID: Yup.string()
    //   .required('Assortment Range is required')
    //   .test('not-zero', 'Assortment Range is required', (value) => value !== '0'),
    // AssortmentStrategyID: Yup.string()
    //   .required('Assortment Strategy is required')
    //   .test('not-zero', 'Assortment Strategy is required', (value) => value !== '0'),
    BusinessLicenseNumber: Yup.string().required('Business License Number is required'),
    BusinessPercentageInEuropeanID: Yup.string()
      .required('Business Percentage in European is required')
      .test('not-zero', 'Business Percentage in European is required', (value) => value !== '0'),
    BusinessTypeID: Yup.string()
      .required('Business Type is required')
      .test('not-zero', 'Business Type is required', (value) => value !== '0'),
    Capacity: Yup.string().required('Capacity is required'),
    CapacityUnit: Yup.string().required('Capacity Unit is required'),
    City: Yup.string().required('City is required'),
    CountryID: Yup.string().required('Country is required'),
    // CustomerID: Yup.array().min(1, 'Customer is required').required('Customer is required'),
    ExperienceInBusinessTypeID: Yup.array()
      .min(1, 'Experience in Business is required')
      .required('Experience in Business is required'),
    // .test('not-zero', 'Experience in Business Type is required', (value) => value !== '0'),
    // FacilityID: Yup.array().min(1, 'Facility is required').required('Facility is required'),
    // FactoryArea: Yup.string().required('Factory Area is required'),
    // FaxNo: Yup.string().required('Fax Number is required'),
    // IndustryTypeID: Yup.string().required('Industry Type is required'),
    MainExportMarketId: Yup.array()
      .min(1, 'Main Export Market is required')
      .required('Main Export Market is required')
      .test('not-zero', 'Main Export Market is required', (value) => {
        // Ensure the array doesn't contain '0'
        return value && !value.includes('0');
      }),
    // NumberofEmployees: Yup.string().required('No of Employees is required'),
    NoOfEmployeesID: Yup.string()
      .required('No of Employees is required')
      .test('not-zero', 'No of Employees is required', (value) => value !== '0'),
    OnBoardingEmail: Yup.string().email().required('Onboarding Email is required'),
    PercentageOfExportBusinessID: Yup.string()
      .required('Percentage of Export Business is required')
      .test('not-zero', 'Percentage of Export Business is required', (value) => value !== '0'),
    PhoneNumber: Yup.string().required('Phone Number is required'),
    // ProductCategoriesID: Yup.string()
    //   .required('Product Category is required')
    //   .test('not-zero', 'Product Category is required', (value) => value !== '0'),
    // ProductGroupid: Yup.array()
    //   .min(1, 'Product Group is required')
    //   .required('Product Group is required')
    //   .test('not-zero', 'Product Group is required', (value) => value !== '0'),
    // ProductPortfolioID: Yup.string()
    //   .required('Product Portfolio is required')
    //   .test('not-zero', 'Product Portfolio is required', (value) => value !== '0'),
    // Province: Yup.string().required('Province is required'),
    ShippingTermsID: Yup.string()
      .required('Shipping Terms is required')
      .test('not-zero', 'Shipping Terms is required', (value) => value !== '0'),
    // ShortName: Yup.string().required('Short Name is required'),
    VenderName: Yup.string().required('Vendor Name is required'),
    // VerticalIntegrationID: Yup.array()
    //   .min(1, 'Vertical Integration is required')
    //   .required('Vertical Integration is required')
    //   .test('not-zero', 'Vertical Integration is required', (value) => {
    //     // Ensure the array doesn't contain '0'
    //     return value && !value.includes('0');
    //   }),

    Website: Yup.string().required('Web address is required'),
    // WorkingHours: Yup.string().required('Working Hours is required'),
    YearsInBusinessID: Yup.string()
      .required('Years in Business is required')
      .test('not-zero', 'Years in Business is required', (value) => value !== '0'),
    YearsInEuropeanBusinessID: Yup.string()
      .required('Years in European Business is required')
      .test('not-zero', 'Years in European Business is required', (value) => value !== '0'),
    // ZipCode: Yup.string().required('Zip Code is required'),
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

  const updatedCertificates = currentCertificate?.map((cert) => ({
    ...cert,
    CertificateFrom: cert?.CertificateFrom,
    CertificateTo: cert?.CertificateTo,
  }));

  // State for table data
  const [tableData, setTableData] = useState(
    updatedCertificates.length > 0 ? updatedCertificates : []
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // Handle FileName drop
  const handleDropSingleFile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const sanitized = sanitizeFileName(file.name);
      const renamedFile = new File([file], sanitized, { type: file.type });
      setSelectedFile(renamedFile);
      setValue('FileName', renamedFile);
    }
  };

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

  // Handle adding data to the table
  const handleAdd = () => {
    if (
      selectedCertificate?.CertificateID == undefined ||
      CertificateFromSA == null ||
      CertificateToSA == null
    ) {
      return enqueueSnackbar('Please fill all the required fields', { variant: 'warning' });
    } else if (!selectedFile) {
      return enqueueSnackbar('Please upload a document', { variant: 'warning' });
    }

    // check validity between dates
    if (new Date(CertificateFromSA) > new Date(CertificateToSA)) {
      return enqueueSnackbar('Certificate To date should be greater than Certificate From date', {
        variant: 'error',
      });
    }

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
    setValidityFromSA(null); // Reset the CertificateFrom date
    setValidityToSA(null); // Reset the CertificateTo date
    setFormData({ ...formData, Description: '' });
    // reset();
  };

  const handleOpenConfirm = (index) => {
    setSelectedRowIndex(index);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedRowIndex !== null) {
      const row = tableData[selectedRowIndex];
      handleDelete(selectedRowIndex, row?.CertificateID, row?.VenderCertificateID);
      setConfirmOpen(false);
    }
  };

  // Handle delete row from table
  const handleDelete = async (index, CertificateID, VenderCertificateID) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
    try {
      const res = await Delete(
        `DeleteVendorCertificate?VenderID=${currentSupplier?.VenderLibraryID}&CertificateID=${CertificateID}&VenderCertificateID=${VenderCertificateID}`
      );
      if (res.data.ResponseCode === '100') {
        enqueueSnackbar('Certificate deleted successfully', { variant: 'success' });
      }
    } catch (error) {
      console.log('Error deleting certificate:', error);
    }
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

  const getFilteredCustomers = async () => {
    try {
      const res = await Get(`GetFilteredDataCustomer?UserID=${userID}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      setFilteredCustomers(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };
  const getIndustryType = async () => {
    try {
      const res = await Get(`GetIndustryType?UserID=${userID}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      setIndustryType(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier industry type', error);
    }
  };

  const getMainExportMarket = async () => {
    try {
      const res = await Get(`GetCountriesDataForExportMarket?UserID=${userID}`);
      const decryptedMainExportMarket = decryptObjectKeys(res.data.ServiceRes);
      setMainExportMarket(decryptedMainExportMarket);
    } catch (error) {
      console.log('error getting supplier main export market', error);
    }
  };

  const getFacility = async () => {
    try {
      const res = await Get(`GetFacilityData?UserID=${userID}`);
      const decryptedFacility = decryptObjectKeys(res.data.ServiceRes);
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

  // const getAssortmentRange = async () => {
  //   try {
  //     const res = await Get(`GetAssortmentRange?UserID=${userID}`);
  //     if (res.data.ResponseCode === '100') {
  //       // console.log('res.data.ServiceRes', res.data.ServiceRes);
  //       const decryptedData = decryptObjectKeys(res.data.ServiceRes);
  //       setAssortmentRange(decryptedData);
  //     } else if (res.data.ResponseCode === '-2') {
  //       console.log('error in getting assorment range by id', res.data.ServiceRes);
  //     }
  //   } catch (error) {
  //     console.log('error getting assorment range by ID', error);
  //   }
  // };

  // const getAssortmentStrategy = async () => {
  //   try {
  //     const res = await Get(`GetAssortmentStrategy?UserID=${userID}`);
  //     if (res.data.ResponseCode === '100') {
  //       // console.log('res.data.ServiceRes', res.data.ServiceRes);
  //       const decryptedData = decryptObjectKeys(res.data.ServiceRes);
  //       setAssortmentStrategy(decryptedData);
  //     } else if (res.data.ResponseCode === '-2') {
  //       console.log('error in getting assortment strategy by id', res.data.ServiceRes);
  //     }
  //   } catch (error) {
  //     console.log('error getting assortment strategy by ID', error);
  //   }
  // };

  const getGetDocumentData = async () => {
    try {
      const res = await Get(`GetDocumentData`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        const existingIds = new Set(tableData.map((item) => item.CertificateID));
        const newDocumentData = decryptedData?.filter(
          (item) => !existingIds.has(item.CertificateID)
        );
        setMainDocsData(decryptedData);
        setDocumentData(newDocumentData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting document data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting document data by ID', error);
    }
  };

  const GetBusinessLogoByID = async () => {
    try {
      const res = await Get(`GetBusinessLogoByID?VenderID=${currentSupplier?.VenderLibraryID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        console.log('GetBusinessLogoByID', decryptedData);

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
        console.log('GetVenderLogoByID', decryptedData);

        setVenderLogoByID(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting GetVenderLogoByID data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting GetVenderLogoByID data by ID', error);
    }
  };

  useEffect(() => {
    const existingIds = new Set(tableData?.map((item) => item.CertificateID));
    const newDocumentData = MainDocsData?.filter((item) => !existingIds.has(item.CertificateID));
    setDocumentData(newDocumentData);
  }, [tableData]);

  // console.log('AssortmentRange', AssortmentRange);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getGetDocumentData(),

          getFilteredCustomers(),
          getIndustryType(),
          // getProductPortfolio(),
          getMainExportMarket(),
          // getFacility(),
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
          // getAssortmentRange(),
          // getAssortmentStrategy(),

          GetBusinessLogoByID(),
          GetVenderLogoByID(),
        ]);
        setisLoading(false);
      } catch (error) {
        console.error('error loading all the required api', error);
      }
    };

    fetchData();
  }, []);

  const customerIds = currentSupplier?.CustomerID?.split(',').map((id) => id.trim());
  const mainExportMarketIds = currentSupplier?.MainExportMarketId?.split(',').map((id) =>
    id.trim()
  );
  const facilityIds = currentSupplier?.FacilityID;
  const verticalIntegrationIds = currentSupplier?.VerticalIntegrationID?.split(',').map((id) =>
    id.trim()
  );
  const experienceIds = currentSupplier?.ExperienceInBusinessTypeID?.split(',').map((id) =>
    id.trim()
  );

  const [selectedMarkets, setSelectedMarkets] = useState(mainExportMarketIds || []);
  const [selectedFacilities, setSelectedFacilities] = useState(facilityIds || []);
  const [selectedCustomers, setSelectedCustomers] = useState(customerIds || []);
  const [selectedVerticalIntegration, setSelectedVerticalIntegration] = useState(
    verticalIntegrationIds || []
  );
  const [selectedExperienceInBusinessTypeID, setSelectedExperienceInBusinessTypeID] = useState(
    experienceIds || []
  );

  const defaultValues = useMemo(
    () => ({
      VenderName: currentSupplier?.VenderName || '',
      ShortName: currentSupplier?.ShortName || 'N/A',
      Address1: currentSupplier?.Address1 || '',
      Address2: currentSupplier?.Address2 || '',
      Province: currentSupplier?.Province || '',
      CustomerID: customerIds || [UserData[0]?.CustomerId],
      // IndustryTypeID: currentSupplier?.IndustryTypeID || [],
      CountryID: currentSupplier?.CountryID || '',
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
      ProductGroupid: currentSupplier?.ProductGroupid || [],
      Capacity: currentSupplier?.Capacity || null,
      CapacityUnit: currentSupplier?.CapacityUnit || '0',
      AmtSign: currentSupplier?.AmtSign || '',
      Annualturnover: currentSupplier?.Annualturnover || null,
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

      AssortmentRangeID: currentSupplier?.AssortmentRangeID || '',
      AssortmentStrategyID: currentSupplier?.AssortmentStrategyID || '',
      BusinessPercent: currentSupplier?.BusinessPercent || '',
      OnBoardingEmail: currentSupplier?.OnBoardingEmail || '',
      // IndustryTypeID: currentSupplier?.IndustryTypeID || '',
      NoOfEmployeesID: currentSupplier?.NoOfEmployeesID || '',
      PercentageOfExportBusinessID: currentSupplier?.PercentageOfExportBusinessID || '',
      // ExperienceInBusinessTypeID: currentSupplier?.ExperienceInBusinessTypeID || '0',
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
      // },
    }),
    [currentSupplier, currentSupplierContact, vendorSupply, CountryID]
  );

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
    setSelectedVerticalIntegration(defaultValues?.VerticalIntegrationID);
  }, [defaultValues]);

  const [selectedPortfolio, setSelectedPortfolio] = useState(defaultValues.ProductPortfolioID);
  const [selectedCategory, setSelectedCategory] = useState(defaultValues.ProductCategoriesID);
  const [selectedGroup, setSelectedGroup] = useState(defaultValues.ProductGroupid);

  useEffect(() => {
    if (selectedPortfolio) {
      const fetchProductCategory = async () => {
        try {
          const res = await Get(
            `GetPortfolioCategories?UserID=${userID}&ProductPortfolioID=${selectedPortfolio}`
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
    } else {
      setProductCategory([]);
      setSelectedCategory(null);
      setProductGroup([]);

      setVerticalIntegration([]);
      setSelectedVerticalIntegration(null);
    }
  }, [selectedPortfolio, userID]);

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

  const DeleteBusinessLogoByID = async (id) => {
    try {
      const response = await Delete(`DeleteBusinessLogoByVenderID?VenderID=${id}`);
      if (response.data.ResponseCode === '100') {
        enqueueSnackbar('Business Logo deleted successfully', { variant: 'success' });
        setBusinessLicenseNumberFile(null);
        setBusinessLogoByID([]);
      } else {
        enqueueSnackbar('Business Logo deleted successfully', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting Business Logo:', error);
    }
  };
  const DeleteLogo = async (id) => {
    try {
      const response = await Delete(`DeleteVendorFilesByVenderID?VenderID=${id}`);
      if (response.data.ResponseCode === '100') {
        enqueueSnackbar('Logo deleted successfully', { variant: 'success' });
        setLogo(null);
        setVenderLogoByID([]);
      } else {
        enqueueSnackbar('Logo deleted successfully', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting Logo:', error);
    }
  };

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

  // insert vendor details
  const InsertVendorDetail = async (insertVendorDetail) => {
    // decrypt array
    const encryptedVendorDetail = insertVendorDetail.map((X) =>
      Object.assign(
        {},
        ...Object.keys(X).map((key) => ({
          [key]: encrypt(X[key]),
        }))
      )
    );
    try {
      const response = await Post(`InserVendorDetail`, encryptedVendorDetail);
      if (response.data.ResponseCode === '100') {
        // enqueueSnackbar('Supplier created successfully!', { variant: 'success' });
        console.log('response.data', response.data);
      } else {
        // enqueueSnackbar('Supplier creation failed! ', {
        //   variant: 'error',
        // });
        console.log('response.data', response.data);
      }
    } catch (error) {
      console.error('Error while creating API request (InsertVenderDetail):', error);
      // enqueueSnackbar('Supplier creation failed! Error in API ', {
      //   variant: 'error',
      // });
    }
  };

  const InsertVendorGradingScale = async (vendorGrading) => {
    const encryptedVendorGrading = Object.assign(
      {},
      ...Object.keys(vendorGrading).map((key) => ({
        [key]: encrypt(vendorGrading[key]),
      }))
    );
    try {
      const response = await Post(`InsertVenderGradingScale`, encryptedVendorGrading);
      if (response.data.ResponseCode === '100') {
        // enqueueSnackbar('Supplier created successfully!', { variant: 'success' });
        console.log('response');

        // reset();
      } else {
        enqueueSnackbar('Supplier creation failed! ', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error while creating API request (InsertVenderGrading):', error);
      // enqueueSnackbar('Supplier creation failed! Error in API ', {
      //   variant: 'error',
      // });
    }
  };

  const InsertVenderPersonnel = async (vendorPersonnel) => {
    const encryptedVendorPersonnel = vendorPersonnel.map((X) =>
      Object.assign(
        {},
        ...Object.keys(X).map((key) => ({
          [key]: encrypt(X[key]),
        }))
      )
    );
    try {
      const response = await Post(`InsertVenderPersonnel`, encryptedVendorPersonnel);
      if (response.data.ResponseCode === '100') {
        console.log('InsertVenderPersonnel success', response.data);
      }
    } catch (error) {
      console.error('Error while creating API request (InsertVenderPersonnel):', error);
    }
  };

  const InsertVenderSupply = async (VendorSupply) => {
    const encryptedVendorSupply = VendorSupply.map((X) =>
      Object.assign(
        {},
        ...Object.keys(X).map((key) => ({
          [key]: encrypt(X[key]),
        }))
      )
    );
    try {
      const response = await Post(`InsertVenderSupplyChain`, encryptedVendorSupply);
      if (response.data.ResponseCode === '100') {
        console.log('Insert Vender Supply success', response.data);
      }
    } catch (error) {
      console.error('Error while creating API request (InsertVenderSupply):', error);
    }
  };

  const InsertVendorCertificate = async (formDataToSend) => {
    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Append the form fields to formData
      formData.append('VenderID', formDataToSend.VenderID);
      formData.append('CertificateID', formDataToSend.CertificateID);
      formData.append('CertificateFrom', formDataToSend.CertificateFrom);
      formData.append('CertificateTo', formDataToSend.CertificateTo);
      formData.append('Rating', '1');
      formData.append('NoValidityLimit', formDataToSend.NoValidityLimit);
      formData.append('FileName', formDataToSend.FileName);
      formData.append('Description', formDataToSend.Description);

      // Append the file
      formData.append('File', formDataToSend.FileToSend);

      // Send the request using Axios (or fetch if you prefer)
      const response = await Post('InsertFileinFolder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Log the response for success
      console.log('File uploaded successfully', response);
    } catch (error) {
      // Log the error in case of failure
      console.error('Error uploading file', error);
    }
  };

  const InsertBusinessLicenseNoFileinFolder = async () => {
    const formData = {
      FileName: BusinessLicenseNumberFile?.name,
      VenderID: currentSupplier?.VenderLibraryID,
      UserID: userID || 1,
      file: BusinessLicenseNumberFile,
    };
    try {
      const formData = new FormData();
      formData.append('FileName', BusinessLicenseNumberFile?.name);
      formData.append('VenderID', currentSupplier?.VenderLibraryID);
      formData.append('UserID', userID || 1);
      formData.append('File', BusinessLicenseNumberFile);

      const response = await Post(`InsertBusinessLicenseNoFileinFolder`, formData, {
        header: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.ResponseCode === '100') {
        console.log('File uploaded successfully', response);
      }
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };
  const InsertVendorLogoFileinFolder = async () => {
    const formData = {
      FileName: logo?.name,
      VenderID: currentSupplier?.VenderLibraryID,
      UserID: userID || 1,
      file: logo,
    };
    try {
      const formData = new FormData();
      formData.append('FileName', logo?.name);
      formData.append('VenderID', currentSupplier?.VenderLibraryID);
      formData.append('UserID', userID || 1);
      formData.append('File', logo);

      const response = await Post(`InsertVendorLogoFileinFolder`, formData, {
        header: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.ResponseCode === '100') {
        console.log('File uploaded successfully', response);
      }
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  // console.log('OnBoardingDTLID', OnBoardingDTLID);
  // insert vendor data
  const InsertVendorData = async (newdata) => {
    const insertVendorData = {
      VenderName: newdata.VenderName,
      VenderCode: '',
      Address1: newdata.Address1,
      Address2: newdata.Address2,
      ZipCode: newdata.ZipCode,
      City: newdata.City,
      CountryID: newdata.CountryID,
      FaxNo: newdata.FaxNo,
      PhoneNumber: newdata.PhoneNumber,
      Website: newdata.Website,
      ShortName: newdata?.ShortName || 'N/A',
      UserID: userID || 1,
      Province: newdata.Province,
      MainExportMarketId: 0,

      // ProductGroupid: selectedGroup[0], // Convert array to comma-separated string
      // ProductPortfolioID: selectedPortfolio,
      // ProductCategoriesID: selectedCategory,
      ProductGroupid: '0',
      ProductPortfolioID: '0',
      ProductCategoriesID: '0',

      OnBoardingEmail: newdata.OnBoardingEmail,
      IndustryTypeID: newdata?.IndustryTypeID || '2',
      NoOfEmployeesID: newdata.NoOfEmployeesID,
      PercentageOfExportBusinessID: newdata.PercentageOfExportBusinessID,
      ExperienceInBusinessTypeID: '0',
      ShippingTermsID: newdata.ShippingTermsID,
      BusinessTypeID: newdata.BusinessTypeID,
      YearsInBusinessID: newdata.YearsInBusinessID,
      YearsInEuropeanBusinessID: newdata.YearsInEuropeanBusinessID,
      BusinessPercentageInEuropeanID: newdata.BusinessPercentageInEuropeanID,
      AssortmentRangeID: '0', //newdata.AssortmentRangeID
      AssortmentStrategyID: '0',
    };

    const UpdateVendorData = {
      VenderLibraryID: currentSupplier?.VenderLibraryID,
      VenderName: newdata.VenderName,
      VenderCode: currentSupplier?.VenderCode,
      Address1: newdata.Address1,
      Address2: newdata.Address2,
      ZipCode: newdata.ZipCode,
      City: newdata.City,
      CountryID: newdata.CountryID,
      FaxNo: newdata.FaxNo,
      PhoneNumber: newdata.PhoneNumber,
      Website: newdata.Website,
      ShortName: newdata?.ShortName || 'N/A',
      UserID: userID || 1,
      Province: newdata.Province,
      MainExportMarketId: '0',

      // ProductGroupid: selectedGroup[0], // Convert array to comma-separated string
      // ProductPortfolioID: selectedPortfolio,
      // ProductCategoriesID: selectedCategory,
      ProductGroupid: '0',
      ProductPortfolioID: '0',
      ProductCategoriesID: '0',

      OnBoardingEmail: newdata.OnBoardingEmail,
      IndustryTypeID: newdata?.IndustryTypeID || '2',
      NoOfEmployeesID: newdata.NoOfEmployeesID,
      PercentageOfExportBusinessID: newdata.PercentageOfExportBusinessID,
      ExperienceInBusinessTypeID: '0',
      ShippingTermsID: newdata.ShippingTermsID,
      BusinessTypeID: newdata.BusinessTypeID,
      YearsInBusinessID: newdata.YearsInBusinessID,
      YearsInEuropeanBusinessID: newdata.YearsInEuropeanBusinessID,
      BusinessPercentageInEuropeanID: newdata.BusinessPercentageInEuropeanID,
      AssortmentRangeID: '0', //newdata.AssortmentRangeID
      AssortmentStrategyID: '0',
      UpdatedDate: getCurrentDateFormatted(),
      UpdatedByUserID: userID || 1,
    };

    const types = [
      { type: 'Vertical Integration', ids: newdata.VerticalIntegrationID },
      { type: 'Supplier Type', ids: SupplierType },
      { type: 'Facility', ids: newdata?.FacilityId },
      { type: 'Customer', ids: newdata?.CustomerID || [UserData[0]?.CustomerId] },
      { type: 'Main Export Market', ids: newdata.MainExportMarketId },
      { type: 'Experience in Business', ids: newdata.ExperienceInBusinessTypeMultipleID },
      { type: 'ProductGroup', ids: newdata.ProductGroupid },
    ];

    const encryptedVendorData = Object.assign(
      {},
      ...Object.keys(insertVendorData).map((key) => ({
        [key]: encrypt(insertVendorData[key]),
      }))
    );

    const encryptedUpdateVendorData = Object.assign(
      {},
      ...Object.keys(UpdateVendorData).map((key) => ({
        [key]: encrypt(UpdateVendorData[key]),
      }))
    );

    try {
      let response;

      // Check if currentSupplier exists, then use Put, else use Post
      if (currentSupplier?.VenderLibraryID) {
        response = await Put(`UpdateVendor`, encryptedUpdateVendorData); // Update existing vendor
      } else {
        response = await Post(`InsertVender`, encryptedVendorData); // Insert new vendor
      }

      if (response.data.ResponseCode === '100') {
        // reset();

        // router.push(paths.dashboard.Supplier.Laws.root);
        function generateAndSendRequests() {
          types.forEach(({ type, ids }) => {
            // Ensure that ids is always an array, even if it's a single value
            const idsArray = Array.isArray(ids) ? ids : [ids];

            idsArray.forEach((id) => {
              const body = [
                {
                  VenderID:
                    currentSupplier?.VenderLibraryID ||
                    decrypt(response.data?.ServiceRes[0]?.VenderLibraryID),
                  ID: id,
                  Type: type,
                },
              ];
              InsertVendorDetail(body);
            });
          });
        }
        const vendorGrading = {
          VenderID:
            currentSupplier?.VenderLibraryID ||
            decrypt(response.data?.ServiceRes[0]?.VenderLibraryID),
          AboutSupplier: newdata.AboutSupplier,
          Annualturnover: newdata.Annualturnover,
          AmtSign: newdata.AmtSign,
          Capacity: newdata.Capacity,
          CapacityUnit: newdata?.CapacityUnit || '0',
          AuditInstitute: '',
          DBID: '',
          BSCIFrom: '1999-01-01',
          BSCITo: '1999-01-01',
          Rating: 'A',
          AuditInstituteSEDEX: '',
          CertificateNoSEDEX: '',
          ValidityFromSEDEX: '1999-01-01',
          ValidityToSEDEX: '1999-01-01',
          AuditInstituteSA: '',
          CertificateNoSA: '',
          ValidityFromSA: '1999-01-01',
          ValidityToSA: '1999-01-01',
          FactoryArea: '0', //newdata.FactoryArea
          NumberofEmployees: '0', //newdata.NumberofEmployees
          WorkingHours: '0', //newdata.WorkingHours
          BusinessLicenseNumber: newdata.BusinessLicenseNumber,
        };
        const PersonnalData = contacts.map((contact) => {
          return {
            VenderLibraryID:
              currentSupplier?.VenderLibraryID ||
              decrypt(response.data?.ServiceRes[0]?.VenderLibraryID),
            ContactType: contact.ContactType,
            PersonName: contact.PersonName,
            Designation: contact.Designation,
            CellNo: contact.CellNo,
            EmailAddress: contact.EmailAddress,
          };
        });

        const VenderSupply = supplies.map((supply) => {
          return {
            VenderLibraryID:
              currentSupplier?.VenderLibraryID ||
              decrypt(response.data?.ServiceRes[0]?.VenderLibraryID),
            CountryId: supply?.CountryId,
            MaterialorProcess: supply?.MaterialorProcess,
            AgentTradingCompany: supply?.AgentTradingCompany || '',
            FactoryName: supply?.FactoryName || '',
            Address: supply?.Address,
            ContactPerson: supply?.ContactPerson,
            PhoneNumber: supply?.PhoneNumber,
            Email: supply?.Email,
            TypeID: supply?.TypeID,
            AdditionalInformation: supply?.AdditionalInformation || '',
          };
        });
        if (tableData?.length > 0) {
          tableData?.map(async (data) => {
            const formDataToSend = {
              VenderID:
                currentSupplier?.VenderLibraryID ||
                decrypt(response.data?.ServiceRes[0]?.VenderLibraryID),
              CertificateID: data.CertificateID,
              CertificateFrom: format(new Date(data?.CertificateFrom), 'yyyy-MM-dd'),
              CertificateTo: format(new Date(data?.CertificateTo), 'yyyy-MM-dd'),
              Description: data.Description,
              NoValidityLimit: data.NoValidityLimit == true ? 1 : 0 || 0,
              FileName: data.FileName,
              FileToSend: data.FileToSend,
            };
            await InsertVendorCertificate(formDataToSend);
          });
        }
        await generateAndSendRequests();
        await InsertVendorGradingScale(vendorGrading);
        await InsertVenderPersonnel(PersonnalData);
        await InsertVenderSupply(VenderSupply);
        // Post Vendor Department Data start //
        if (!currentSupplier) {
          const depData = {
            VenderLibraryID: response?.data?.ServiceRes[0]?.VenderLibraryID,
            DepartmentID: getUserData()[0].Designation,
          };
          await Post('InsertVenderDept', depData);
        }
        // Post Vendor Department Data end //
        await InsertBusinessLicenseNoFileinFolder();
        await InsertVendorLogoFileinFolder();
        const encryptedStatus = encrypt(OnBoardingDTLID);
        const StatusData = {
          OnBoardingDTLID: encryptedStatus,
        };
        await Put(`UpdateSupplierResponedStatus`, StatusData);
        enqueueSnackbar('Supplier created successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar('Supplier creation failed! ', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error while creating API request (InsertVender):', error);
      enqueueSnackbar('Supplier creation failed! Error in API ', {
        variant: 'error',
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      // enqueueSnackbar(currentSupplier ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.supplierDatabase.root);
      const newdata = {
        ...data,
        // CountryID,
        ShortName: 'N/A',
        CustomerID: [UserData[0]?.CustomerId] || selectedCustomers,
        MainExportMarketId: selectedMarkets,
        ExperienceInBusinessTypeMultipleID: selectedExperienceInBusinessTypeID,
        FacilityId: '0', //selectedFacilities
        ProductPortfolioID: '0', // selectedPortfolio,
        VerticalIntegrationID: '0', //selectedVerticalIntegration
        ProductCategoriesID: '0', //selectedCategory
        ProductGroupid: '0', //selectedGroup
        UserID: userID || 1,
      };

      if (contacts.length <= 0 || supplies.length <= 0) {
        enqueueSnackbar('Please add at least one Contact Info and Supply Chain!', {
          variant: 'warning',
        });
        return;
      }

      if (currentSupplier?.VenderLibraryID) {
        await Promise.all([
          Delete(`DeleteVendorDetail?VenderID=${currentSupplier?.VenderLibraryID}`),
          Delete(`DeleteVendorPersonal?VenderID=${currentSupplier?.VenderLibraryID}`),
          Delete(`DeleteVendorSupplyChain?VenderID=${currentSupplier?.VenderLibraryID}`),
          Delete(`DeleteVenderGradingScale?VenderID=${currentSupplier?.VenderLibraryID}`),
        ]);
      }
      await InsertVendorData(newdata);

      setOpenDialog(true);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {/* Supplier Information */}
      <Grid xs={12} md={12}>
        <Card>
          {/* {!mdUp && <CardHeader title="Details" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Company Information
          </Typography>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={6}>
              <Typography variant="subtitle2">
                Supplier Name <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField name="VenderName" placeholder="Legal Business Name" />
            </Grid>

            {/* <Grid spacing={1.5} xs={12} md={6}>
           
              <Typography variant="subtitle2">
                Short Name <span style={{ color: 'red' }}>*</span>
              </Typography>
              <RHFTextField name="ShortName" placeholder="Short Name" />
            </Grid> */}

            {/* <Grid item xs={12} md={6}>
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
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
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
              <Controller
                name="CountryID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={country}
                    getOptionLabel={(option) => option.CountryName || ''}
                    isOptionEqualToValue={(option, value) => option.Country_id === value}
                    value={country.find((init) => init.Country_id === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.Country_id : '');
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
              {/* <RHFAutocomplete
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
              /> */}
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
              <Typography variant="subtitle2">
                Phone <span style={{ color: 'red' }}>*</span>
              </Typography>
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
              <RHFTextField name="Website" placeholder="Web Address" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Main Export Market <span style={{ color: 'red' }}>*</span>
              </Typography>
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
          {/* <Grid container spacing={1.5} sx={{ p: 1.5 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Product Portfolio <span style={{ color: 'red' }}>*</span>
              </Typography>

              <Controller
                name="ProductPortfolioID"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={productPortfolio}
                    getOptionLabel={(option) => option.ProductPortfolioName || ''}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.ProductPortfolioID : '');
                      setSelectedPortfolio(newValue?.ProductPortfolioID || null);
                      setSelectedCategory(null); // Reset Category when Portfolio changes
                      setSelectedGroup(null); // Reset Group when Portfolio changes
                    }}
                    value={
                      productPortfolio.find(
                        (portfolio) => portfolio.ProductPortfolioID === field.value
                      ) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Product Portfolio"
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Product Category <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="ProductCategoriesID"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={productCategory}
                    getOptionLabel={(option) => option.ProductCategoriesName || ''}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.ProductCategoriesID : '');
                      setSelectedCategory(newValue?.ProductCategoriesID || null);
                      setSelectedGroup(null); // Reset Group when Category changes
                    }}
                    value={
                      productCategory.find((cat) => cat.ProductCategoriesID === field.value) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Product Category"
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Product Group <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="ProductGroupid"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    {...field}
                    autoHighlight
                    disableCloseOnSelect
                    options={productGroup}
                    getOptionLabel={(option) => option.ProductGroupName || ''}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map((group) => group.ProductGroupID));
                      setSelectedGroup(newValue.map((group) => group.ProductGroupID));
                    }}
                    value={
                      productGroup.filter((group) => field.value?.includes(group.ProductGroupID)) ||
                      []
                    }
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} style={{ marginRight: 8 }} />
                        {option.ProductGroupName}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Product Group"
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
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid spacing={1.5} xs={12} md={4}>
            <Typography variant="subtitle2">
              Vertical Integration <span style={{ color: 'red' }}>*</span>
            </Typography>

            <Controller
              name="VerticalIntegrationID"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  multiple
                  {...field}
                  autoHighlight
                  disableCloseOnSelect
                  options={verticalIntegration}
                  getOptionLabel={(option) => option.Name || ''}
                  onChange={(event, newValue) => {
                    field.onChange(newValue.map((group) => group.VVIID));
                    setSelectedVerticalIntegration(newValue.map((group) => group.VVIID));
                  }}
                  value={
                    verticalIntegration.filter((group) => field.value?.includes(group.VVIID)) || []
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} style={{ marginRight: 8 }} />
                      {option.Name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Vertical Integration"
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
                            key={option.VVIID}
                            label={option.Name}
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
          <Grid container spacing={1.5} sx={{ p: 1.5 }}>
            <Grid spacing={1.5} xs={12} md={6}>
              <Typography variant="subtitle2">
                Capacity per Month <span style={{ color: 'red' }}>*</span>{' '}
                <span style={{ color: 'grey', fontSize: '12px', fontWeight: 'lighter' }}>
                  (Please select the appropriate unit for your product)
                </span>
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
                    onDelete={() =>
                      DeleteBusinessLogoByID(
                        BusinessLogoByID[BusinessLogoByID.length - 1]?.VenderID
                      )
                    }
                    deleteIcon={<Iconify icon="solar:trash-bin-trash-bold" width={16} />}
                    sx={{ maxWidth: 260 }}
                  />
                ) : null}
              </Box>
            </Box>
          </Grid>

          {/* <Grid container spacing={1.5} sx={{ p: 1.5 }}>
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
              {/* <Controller
                name="ExperienceInBusinessTypeID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={ExpInBusinessType}
                    getOptionLabel={(option) => option.Value || ''}
                    isOptionEqualToValue={(option, value) =>
                      option.ExperienceInBusinessTypeID === value
                    }
                    value={
                      ExpInBusinessType.find(
                        (init) => init.ExperienceInBusinessTypeID === field.value
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.ExperienceInBusinessTypeID : '0');
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
              /> */}
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
          </Box>
        </Card>
      </Grid>

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
                    <TableCell>Actions</TableCell>
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
                      <TableCell>
                        <IconButton onClick={() => handleContactDelete(index)} color="error">
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, pb: 1.5, mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleAddContact}>
              Add More
            </Button>
          </Box>
        </Card>
      </Grid>

      {/* Supply Chain */}

      {/* <Grid xs={12} md={12}>
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

                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supplies.map((supply, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <RHFAutocomplete
                          name={`supplies[${index}].TypeID`}
                          value={
                            typeOfSupply.find((type) => type.PartyTypeid == supply.TypeID)
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
                      <TableCell>
                        <IconButton onClick={() => handleSupplyDelete(index)} color="error">
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, pb: 1.5, mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleAddSupply}>
              Add More
            </Button>
          </Box>
        </Card>
      </Grid> */}

      {/* Certificates and Patents */}
      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Certificates and Patents
          </Typography>
          <Grid container spacing={3} sx={{ p: 1.5 }}>
            <Typography variant="subtitle2" sx={{ p: 2 }}>
              Please upload all the certificates and patents the company has obtained:
            </Typography>
            <Grid container spacing={3} xs={12} md={12}>
              <Grid container xs={12} md={8} sx={{ mt: 2 }}>
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

                {/* <Grid spacing={2} xs={12} md={12}>
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
                </Grid> */}

                <Grid container spacing={2} xs={12} md={12}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">
                      Validity From <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Controller
                      name="CertificateFrom"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DesktopDatePicker
                          format="dd/MM/yyyy"
                          value={CertificateFromSA || null}
                          onChange={(newValue) => {
                            setValidityFromSA(newValue);
                            field.onChange(format(newValue, 'yyyy-MM-dd'));
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      )}
                    />
                  </Grid>

                  {/* ValidityToSA Date Field */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">
                      Validity To <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Controller
                      name="CertificateTo"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DesktopDatePicker
                          format="dd/MM/yyyy"
                          value={CertificateToSA || null}
                          onChange={(newValue) => {
                            setValidityToSA(newValue);
                            field.onChange(format(newValue, 'yyyy-MM-dd'));
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={12} md={4}>
                <Upload
                  name="FileName"
                  file={selectedFile}
                  accept={{ 'application/pdf': ['.pdf'] }}
                  onDrop={handleDropSingleFile}
                  sx={{ mt: 2 }}
                  multiple
                />
                <Box>{selectedFile?.name}</Box>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mx: 2, mb: 2 }}
              onClick={handleAdd} // Call handleAdd on click
            >
              Add
            </Button>
          </Box>
          <Scrollbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Certificate </TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Validity from</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <>
                    <TableRow key={index}>
                      <TableCell>{row.CertificateType}</TableCell>
                      <TableCell>{row.Description}</TableCell>
                      <TableCell>{fDate(row?.CertificateFrom)}</TableCell>
                      <TableCell>{fDate(row?.CertificateTo)}</TableCell>
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
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenConfirm(index)}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </>
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
              <Box>
                <Typography variant="body1">Supplier's Logo</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {!VenderLogoByID[VenderLogoByID.length - 1]?.FileUrl && (
                  <UploadBox
                    name="LogoFile"
                    file={logo}
                    accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
                    onDrop={handleLogoFile}
                  // multiple
                  />
                )}
                <Box
                  sx={{
                    fontSize: 12,
                    minWidth: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {logo ? (
                    logo?.name
                  ) : (
                    <Link
                      href={VenderLogoByID[VenderLogoByID.length - 1]?.FileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {VenderLogoByID[VenderLogoByID.length - 1]?.FileUrl && (
                        <Avatar src={VenderLogoByID[VenderLogoByID.length - 1]?.FileUrl || '#'} />
                      )}
                    </Link>
                  )}
                  {logo || VenderLogoByID.length > 0 ? (
                    <Button
                      onClick={() => {
                        logo
                          ? setLogo(null)
                          : DeleteLogo(VenderLogoByID[VenderLogoByID.length - 1]?.VenderID);
                      }}
                      size="small"
                      sx={{ fontSize: 12 }}
                      variant="text"
                      color="error"
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button variant="contained" color="primary">
                Upload
              </Button>
            </Box> */}
          </Box>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, mt: 2 }}>
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
        </Box>
      </Grid>
    </>
  );

  return (
    <>
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
      </FormProvider>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        }
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you a lot for your submission. It is safe to close your browser now.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

SupplierOnboardForm.propTypes = {
  currentSupplier: PropTypes.object,
};

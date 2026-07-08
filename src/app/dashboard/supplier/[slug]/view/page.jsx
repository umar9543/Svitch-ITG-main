'use client';

import { Button, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { decrypt } from 'src/api/encryption';
import { useParams } from 'next/navigation';
import SupplierNewEditForm from 'src/sections/supplier/supplier-new-edit-form';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { LoadingScreen } from 'src/components/loading-screen';
import { getDecryptedUserData } from 'src/utils/getUser';
import uuidv4 from 'src/utils/uuidv4';
import Iconify from 'src/components/iconify';
import { pdf } from '@react-pdf/renderer';
import { useSnackbar } from 'src/components/snackbar';
import SupplierSummaryPDF from 'src/sections/supplier/supplier-summary-pdf';

const page = () => {
  const settings = useSettingsContext();
  const { slug } = useParams();
  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;
  const { enqueueSnackbar } = useSnackbar();

  const [currentSupply, setCurrentSupply] = useState({});
  const [currentSupplierContact, setCurrentSupplierContact] = useState({});
  const [vendorSupply, setVendorSupply] = useState([]);
  const [currentCertificate, setCurrentCertificate] = useState([]);
  const [surveyDetail, setSurveyDetail] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const lookupsCacheRef = useRef(null);

  const decryptObjectKeys = (data) => {
    const decryptedData = data.map((item) => {
      const decryptedItem = {};
      Object.keys(item).forEach((key) => {
        decryptedItem[key] = decrypt(item[key]);
      });
      return decryptedItem;
    });
    return decryptedData;
  };

  const GetSupplierByID = async () => {
    try {
      const res = await Get(`GetSupplierDataByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentSupply(decryptedData[0]);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting supplierdata by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting supplier by ID', error);
    }
  };

  const GetSupplierCertificateByID = async () => {
    try {
      const res = await Get(`GetCertificateByID?VenderID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentCertificate(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting certificates by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting certificates by ID', error);
    }
  };

  const getCountries = async () => {
    try {
      const res = await Get(`GetCountry?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setAllCountries(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting country by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country by ID', error);
    }
  };

  const getSupplierContact = async () => {
    try {
      const res = await Get(`GetVenderPersonnelByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentSupplierContact(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting supplierdata by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting supplier by ID', error);
    }
  };

  const getVendorSupply = async () => {
    try {
      const res = await Get(`GetVenderSupplyChainByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setVendorSupply(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting supplierdata by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting supplier by ID', error);
    }
  };

  const GetSeverDetailBySupplierID = async () => {
    try {
      const res = await Get(`GetSeverDetailBySupplierID?SupplierID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const data = res.data.Data;
        const decryptedData = Array.isArray(data) && data.length > 0 ? decryptObjectKeys(data) : [];
        const dataWithUniqueKey = decryptedData.map((item) => ({
          ...item,
          uniqueKey: uuidv4(),
        }));

        setSurveyDetail(dataWithUniqueKey);
      }
    } catch (error) {
      console.log('error getting survey detail by supplier ID', error);
      setSurveyDetail([]);
    }
  };

  const fetchLookups = useCallback(async () => {
    if (lookupsCacheRef.current) return lookupsCacheRef.current;

    const safeGet = async (url) => {
      try {
        const res = await Get(url);
        if (res.data.ResponseCode === '100') {
          return decryptObjectKeys(res.data.ServiceRes);
        }
      } catch (e) {
        console.log('lookup fetch error', url, e);
      }
      return [];
    };

    const [
      contactTypes,
      partyTypes,
      countries,
      noOfEmployees,
      perOfExpBusiness,
      expInBusinessType,
      perExpBusinessEuro,
      shippingTerms,
      yearsInBusiness,
      businessType,
      mainExportMarket,
    ] = await Promise.all([
      safeGet(`GetCustomerContactType?UserID=${userID}`),
      safeGet(`GetCustomerPartyType?UserID=${userID}`),
      safeGet(`GetCountry?UserID=${userID}`),
      safeGet(`GetNoOfEmployees?UserID=${userID}`),
      safeGet(`GetPercentageOfExportBusiness?UserID=${userID}`),
      safeGet(`GetExperienceInBusinessType?UserID=${userID}`),
      safeGet(`GetBusinessPercentageInEuroPe?UserID=${userID}`),
      safeGet(`GetShippingTerms?UserID=${userID}`),
      safeGet(`GetYearsInBusiness?UserID=${userID}`),
      safeGet(`GetBusinessType?UserID=${userID}`),
      safeGet(`GetCountriesDataForExportMarket?UserID=${userID}`),
    ]);

    const yearsInBusinessID = currentSupply?.YearsInBusinessID;
    const yearsInEuroBusiness = yearsInBusinessID
      ? await safeGet(
          `GetYearsInEuropeanBusiness?UserID=${userID}&YearsInBusinessID=${yearsInBusinessID}`
        )
      : [];

    const result = {
      contactTypes,
      partyTypes,
      countries,
      noOfEmployees,
      perOfExpBusiness,
      expInBusinessType,
      perExpBusinessEuro,
      shippingTerms,
      yearsInBusiness,
      yearsInEuroBusiness,
      businessType,
      mainExportMarket,
    };

    lookupsCacheRef.current = result;
    return result;
  }, [userID, currentSupply]);

  const exportPDF = useCallback(async () => {
    try {
      setPdfLoading(true);
      const lookups = await fetchLookups();

      const origin = window.location.origin;
      const blob = await pdf(
        <SupplierSummaryPDF
          currentSupplier={currentSupply}
          contacts={Array.isArray(currentSupplierContact) ? currentSupplierContact : []}
          supplies={vendorSupply}
          certificates={currentCertificate}
          surveyDetail={surveyDetail}
          lookups={lookups}
          svitchLogoUrl={`${origin}/favicon/logo.png`}
          conradLogoUrl={`${origin}/logo/fullLogo.png`}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Supplier_Summary_${currentSupply?.VenderName || 'Export'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      enqueueSnackbar('PDF exported successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      enqueueSnackbar('Failed to export PDF', { variant: 'error' });
    } finally {
      setPdfLoading(false);
    }
  }, [
    currentSupply,
    currentSupplierContact,
    vendorSupply,
    currentCertificate,
    surveyDetail,
    fetchLookups,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          GetSupplierByID(),
          getCountries(),
          getSupplierContact(),
          getVendorSupply(),
          GetSupplierCertificateByID(),
          GetSeverDetailBySupplierID(),
        ]);
        setisLoading(false);
      } catch (error) {
        console.error('error loading all the required api', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Supplier Summary"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Supplier Database', href: paths.dashboard.supplier.root },
          { name: 'Supplier Summary' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:file-export-line" />}
            onClick={exportPDF}
            disabled={isLoading || pdfLoading}
          >
            {pdfLoading ? 'Exporting...' : 'Export PDF'}
          </Button>
        }
      />
      {!isLoading ? (
        <SupplierNewEditForm
          currentSupplier={currentSupply}
          currentSupplierContact={currentSupplierContact}
          vendorSupply={vendorSupply}
          allCountries={allCountries}
          currentCertificate={currentCertificate}
          surveyDetail={surveyDetail}
          setisLoading={setisLoading}
          viewMode
        />
      ) : (
        <LoadingScreen
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
          }}
        />
      )}
    </Container>
  );
};

export default page;

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useState, use, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { countries } from 'src/assets/data';
import {
  _roles,
  JOB_SKILL_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
  JOB_WORKING_SCHEDULE_OPTIONS,
} from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
  RHFMultiCheckbox,
  RHFUploadBox,
  RHFUpload,
} from 'src/components/hook-form';
import {
  Autocomplete,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import CustomTable from 'src/components/CustomTable/CustomTable';
import ContactsTable from './ContactsTable';
import { UploadBox } from 'src/components/upload';
import { height, width } from '@mui/system';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { getPrefixes } from 'src/utils/PrefixUtility';
import { Delete, Get, Post, Put } from 'src/utils/AxiosHelper';
import { decrypt, encrypt } from 'src/api/encryption';
import { getDecryptedUserData, getUserData } from 'src/utils/getUser';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { trimForUrl } from 'src/utils/urlFormatter';

// ----------------------------------------------------------------------

export default function UserNewEditForm({
  currentUser,
  currentUserContact,
  customerSupply,
  slug,
  customerMembership,
  customerAttachment,
}) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const [contactType, setContactType] = useState([]);
  const [partyType, setPartyType] = useState([]);
  const [membership, setMembership] = useState([]);
  const [country, setCountry] = useState([]);
  const [countryCode, setCountryCode] = useState([]);
  const [attachmentDocList, setAttachmentDocList] = useState([]);

  // Assuming you have these states to manage the selected file, description, and file type ID
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [fileTypeId, setFileTypeId] = useState('');
  const [newCustomerAttachment, setNewCustomerAttachment] = useState(customerAttachment || []);

  const [isLoading, setisLoading] = useState(true);

  // console.log('currentUser', currentUser);
  const { enqueueSnackbar } = useSnackbar();

  const titles = getPrefixes();

  const formatDateTime = (date) => {
    const options = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return new Date(date).toLocaleString('en-US', options);
  };

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setSelectedFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);

  // Example usage:
  const date = new Date();
  // console.log(formatDateTime(date)); // Output example: 6/6/2021 3:34:39 PM

  const GetCustomerContactType = async () => {
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
  const GetCustomerPartyType = async () => {
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

  const GetCustomerMembership = async () => {
    try {
      const res = await Get(`GetCustomerMembership?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setMembership(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting customer membership by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting customer membership by ID', error);
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

  const GetCountryCode = async () => {
    try {
      const res = await Get(`GetCountryCode?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCountryCode(decryptedData);
      } else if (res.data.ResponseCode === '-1') {
        console.log('error in getting country code by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country code by ID', error);
    }
  };
  const GetAttachmentDocList = async () => {
    try {
      const res = await Get(`GetCustomerAttachmentDocumentList?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setAttachmentDocList(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting attachments docs by ID', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting attachments docs by ID', error);
    }
  };

  const [userData, setUserData] = useState(getDecryptedUserData());

  useEffect(() => {
    const data = getDecryptedUserData();
    setUserData(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          GetCustomerContactType(),
          GetCustomerPartyType(),
          GetCustomerMembership(),
          GetAttachmentDocList(),
          GetCountry(),
          GetCountryCode(),
        ]);
        setisLoading(false);
      } catch (error) {
        console.error('error loading all the required api', error);
      }
    };

    fetchData();
  }, []);

  const NewUserSchema = Yup.object().shape({
    CustomerName: Yup.string().required('Customer name is required'),
    Address1: Yup.string().required('Address is required'),
    Country: Yup.string().required('Country is required'),
    City: Yup.string().required('City is required'),
    Website: Yup.string().required('Website is required'),
    ContactNo: Yup.string().required('Contact number is required'),
    FaxNo: Yup.string().required('Fax number is required'),
    // title: Yup.string().required('Title is required'),
    // content: Yup.string().required('Content is required'),
    // employmentTypes: Yup.array().min(1, 'Choose at least one option'),
    // role: Yup.string().required('Role is required'),
    // skills: Yup.array().min(1, 'Choose at least one option'),
    // workingSchedule: Yup.array().min(1, 'Choose at least one option'),
    // benefits: Yup.array().min(1, 'Choose at least one option'),
    // locations: Yup.array().min(1, 'Choose at least one option'),
    // expiredDate: Yup.mixed().nullable().required('Expired date is required'),
    // salary: Yup.object().shape({
    //   type: Yup.string(),
    //   price: Yup.number().min(1, 'Price is required'),
    //   negotiable: Yup.boolean(),
    // }),
    // experience: Yup.string(),
  });

  // Function to map IDs to their respective display names
  const mapMembershipIDsToObjects = (ids, membershipList) => {
    if (!ids) return [];
    return ids
      .map((id) => {
        return membershipList.find((item) => item.MembershipOrganizationsID === id);
      })
      .filter((item) => item);
  };

  // const mapCountryIDsToObjects = (ids, countryList) => {
  //   return ids
  //     .map((id) => {
  //       return countryList.find((item) => item.Country_id === id);
  //     })
  //     .filter((item) => item);
  // // };
  // console.log('customerMembership', customerMembership);
  // console.log('newcustomerAttachment', newCustomerAttachment);
  // console.log('currentUser', currentUser);

  const defaultValues = useMemo(
    () => ({
      CustomerName: currentUser?.CustomerName || '',
      Commission: currentUser?.Commission || 0,
      Address1: currentUser?.Address1 || '',
      Address2: currentUser?.Address2 || '',
      ContactNo: currentUser?.ContactNo || '',
      FaxNo: currentUser?.FaxNo || '',
      Website: currentUser?.Website || '',
      City: currentUser?.City || '',
      Country: currentUser?.Country || '',
      CustomerNo: currentUser?.CustomerNo || '',
      CustomerTypeID: currentUser?.CustomerTypeID || 1,
      ParentGroupID: currentUser?.ParentGroupID || 3,
      Aliass: currentUser?.Aliass || '',
      imgOriginalLogo: currentUser?.imgOriginalLogo || '',
      imgWaterMark: currentUser?.imgWaterMark || '',
      imgBarcode: currentUser?.imgBarcode || '',
      IndustryTypeRetail: currentUser?.IndustryTypeRetail || false,
      IndustryTypeWholesale: currentUser?.IndustryTypeWholesale || false,
      IndustryTypeWarehouse: currentUser?.IndustryTypeWarehouse || false,
      IndustryTypeImporter: currentUser?.IndustryTypeImporter || false,
      IsActive: userData[0]?.IsActive || false,
      UserID: currentUser?.UserID || userData[0]?.UserID || 1,
      IsGlobal: currentUser?.IsGlobal || 1,
      CreationDate: currentUser?.CreationDate || formatDateTime(new Date()),
      UpdatedDate: formatDateTime(new Date()),
      PFICode: currentUser?.PFICode || 'SSBLi2',
      UpdatedByUserID: currentUser?.UpdatedByUserID || 1,
      IsCustomerSupplyChain: currentUser?.IsCustomerSupplyChain || 0,

      Membership: customerMembership?.map((item) => item.MembershipOrganizationsID) || [],

      contacts: currentUserContact
        ? currentUserContact.map((contact) => ({
            DBName: contact.DBName || 'ILV_Version2',
            CustomerDetailID: contact.CustomerDetailID || '',
            Contact_Type_ID: contact.Contact_Type_ID || '',
            PrefixID: contact.PrefixID || '',
            Buyer_Name: contact.Buyer_Name || '',
            CustomerID: contact.CustomerID || '',
            Designation: contact.Designation || '',
            Img_Foto: contact?.Img_Foto || '',
            CellNo: contact.CellNo || '',
            Email: contact.Email || '',
            UserID: contact.UserID || userData[0]?.UserID || 1,
          }))
        : [
            {
              DBName: 'ILV_Version2',
              Contact_Type_ID: '',
              PrefixID: '',
              Buyer_Name: '',
              CustomerID: '',
              Designation: '',
              Img_Foto: '',
              CellNo: '',
              Email: '',
              UserID: userData[0]?.UserID || 1,
            },
          ],
      supplies: customerSupply
        ? customerSupply.map((supply) => ({
            DBName: supply.DBName || 'ILV_Version2',
            CustomerSupplyChainID: supply.CustomerSupplyChainID || '',
            CustomerID: supply.CustomerID || '',
            PartyTypeId: supply.PartyTypeId || '',
            CompnayName: supply.CompnayName || '',
            CountryId: supply.CountryId || '',
            Address: supply.Address || '',
            ContactPerson: supply.ContactPerson || '',
            PhoneNumber: supply.PhoneNumber || '',
            Email: supply.Email || '',
            UserID: supply.UserID || userData[0]?.UserID || 1,
          }))
        : [
            {
              // DBName: 'ILV_Version2',
              CustomerID: '',
              PartyTypeId: '',
              CompnayName: '',
              CountryId: '',
              Address: '',
              ContactPerson: '',
              PhoneNumber: '',
              Email: '',
              UserID: userData[0]?.UserID || 1,
            },
          ],
    }),
    [currentUser, customerMembership, currentUserContact, customerSupply]
  );

  const [contacts, setContacts] = useState(defaultValues.contacts);

  const [supplies, setSupplies] = useState(defaultValues.supplies);

  // contact functions
  const handleContactAutocompleteChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    if (field === 'Contact_Type_ID') {
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
    setValue(`contacts[${index}].${field}`, updatedContacts[index][field]);
  };

  const handleContactInputChange = (index, field, event) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = event.target.value;
    setContacts(updatedContacts);
    setValue(`contacts[${index}].${field}`, event.target.value);
  };

  // console.log('contactUserContact', currentUserContact);
  const handleContactDelete = async (index) => {
    console.log('handleContactDelete', index);
    const contactToDelete = contacts[index];
    console.log('contactToDelete', contactToDelete.CustomerDetailID);
    if (contactToDelete.CustomerDetailID) {
      try {
        // Call the API to delete the contact
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

    // Remove the contact from the UI
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const handleAddContact = () => {
    const newContact = currentUserContact
      ? {
          DBName: 'ILV_Version2',
          CustomerDetailID: '',
          Contact_Type_ID: '',
          PrefixID: '',
          Buyer_Name: '',
          CustomerID: '',
          Designation: '',
          Img_Foto: '',
          CellNo: '',
          Email: '',
          UserID: userData[0]?.UserID || 1,
        }
      : {
          DBName: 'ILV_Version2',
          Contact_Type_ID: '',
          PrefixID: '',
          Buyer_Name: '',
          CustomerID: '',
          Designation: '',
          Img_Foto: '',
          CellNo: '',
          Email: '',
          UserID: userData[0]?.UserID || 1,
        };
    setContacts([...contacts, newContact]);
  };

  // supply functions
  const handleAddSupply = () => {
    const newSupply = customerSupply
      ? {
          DBName: 'ILV_Version2',
          CustomerSupplyChainID: '',
          PartyTypeId: '',
          CompnayName: '',
          CountryId: '',
          Address: '',
          ContactPerson: '',
          PhoneNumber: '',
          Email: '',
          UserID: userData[0]?.UserID || 1,
        }
      : {
          // DBName: 'ILV_Version2',
          PartyTypeId: '',
          CompnayName: '',
          CountryId: '',
          Address: '',
          ContactPerson: '',
          PhoneNumber: '',
          Email: '',
          UserID: userData[0]?.UserID || 1,
        };
    console.log(supplies);
    console.log('newSupply', newSupply);
    setSupplies([...supplies, newSupply]);
  };

  const handleSupplyAutocompleteChange = (index, field, value) => {
    const updatedSupplies = [...supplies];
    if (field === 'CountryId') {
      const selectedCountry = country.find((c) => c.CountryName === value);
      updatedSupplies[index][field] = selectedCountry ? selectedCountry.Country_id : '';
    } else if (field === 'PartyTypeId') {
      const selectedPartyType = partyType.find((type) => type.PartyType === value);
      updatedSupplies[index][field] = selectedPartyType ? selectedPartyType.PartyTypeId : '';
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
    console.log('handleSupplyDelete', index);
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

  // reference and attachment handle
  const handleAddAttachment = () => {
    const newAttachment = {
      CustomerAttachmentID: '', // Example ID, should be generated appropriately
      CustomerAttachmentListID: fileTypeId,
      CustomerID: userData[0]?.CustomerId || '', // Assuming a CustomerID
      AttachmentFile: selectedFile,
      Description: description,
      CreationDate: formatDateTime(new Date()),
      UserID: userData[0]?.UserID || 1, // Example UserID, should be fetched appropriately
      FileName: selectedFile ? selectedFile.name : '',
      FolderName:
        trimForUrl(
          attachmentDocList.find((doc) => doc.CustomerAttachmentListID === fileTypeId)
            ?.AttachmentName
        ) || '',
      FilePath: '',
      FileNameOriginal: selectedFile ? selectedFile.name : '',
      AttachmentType:
        attachmentDocList.find((doc) => doc.CustomerAttachmentListID === fileTypeId)
          ?.AttachmentName || '',
      UploadedByName: userData[0]?.UserName || 1,
    };

    setNewCustomerAttachment((prev) => [...prev, newAttachment]);
    console.log('newAttachment', newAttachment);
    // Reset the input fields
    setSelectedFile(null);
    setDescription('');
    // setFileTypeId('');
  };

  const handleAttachmentAutocompleteChange = (field, value) => {
    const selectedDoc = attachmentDocList.find((doc) => doc.AttachmentName === value);
    setFileTypeId(selectedDoc ? selectedDoc.CustomerAttachmentListID : '');
  };

  const handleAttachmentDelete = async (index) => {
    console.log('handleAttachmentDelete', index);
    const attachmentToDelete = newCustomerAttachment[index];

    if (attachmentToDelete.CustomerAttachmentID) {
      try {
        // Call the API to delete the attachment row
        const response = await Delete(
          `DeleteCustomerRefAndAttachment?CustomerAttachmentID=${attachmentToDelete.CustomerAttachmentID}`
        );
        if (response.data.ResponseCode === '100') {
          console.log('Attachment deleted successfully from the server');
        } else {
          console.error('Failed to delete attachment from the server', response.data);
        }
      } catch (error) {
        console.error('Error while deleting attachment from the server', error);
      }
    }

    // Remove the attachment row from the UI
    const updatedAttachment = newCustomerAttachment.filter((_, i) => i !== index);
    setNewCustomerAttachment(updatedAttachment);
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // useEffect(() => {
  //   if (!isLoading) {
  //     methods.reset(defaultValues);
  //   }
  // }, [isLoading, defaultValues, methods]);

  // useEffect(() => {
  //   const cons = decryptObjectKeys([
  //     {
  //       DBName: '+qPFEg7tn0hMS59ZGBRE1uUG3tQUsX5z',
  //       CustomerSupplyChainID: 'Fnaf8q7iEc2IUo5NEe476w==',
  //       CustomerID: 'Fnaf8q7iEc2IUo5NEe476w==',
  //       CountryId: 'Fnaf8q7iEc2IUo5NEe476w==',
  //       PartyTypeId: 'Fnaf8q7iEc2IUo5NEe476w==',
  //       CompnayName: 'DG11pG6V9gOaO7KuUEQuJA==',
  //       Address: 'DG11pG6V9gOaO7KuUEQuJA==',
  //       ContactPerson: 'DG11pG6V9gOaO7KuUEQuJA==',
  //       PhoneNumber: 'DG11pG6V9gOaO7KuUEQuJA==',
  //       Email: 'DG11pG6V9gOaO7KuUEQuJA==',
  //       UserID: 'IJc65OPtkO1Hzu1MBZfhbQ==',
  //     },
  //   ]);
  //   console.log('cons', cons);
  //   const dec = decryptObjectKeys([
  //     {
  //       DBName: 'WAi9vJ3WLr0JyVED8Q4KluCzK0UaEVI6',
  //       CustomerSupplyChainID: 'dey7nX7Dgk2IqTLGkf5VgQ==',
  //       CustomerID: 'AFFQ+53qmrichiTiHHJ0tQ==',
  //       PartyTypeId: 'QPXgWR0mxFO8VZuI/bSO8Q==',
  //       CompnayName: '4LffSBuXV250YTckKzBK1s7qhbk3J249A9gu5jqnlEI=',
  //       CountryId: 'TrRDbMALbhLVQHeZ9lAUOg==',
  //       Address: 'fCXB7KkJaB2oq705BBPqBY2wQeOrQOFVVxuZ877KeoM=',
  //       ContactPerson: 'GzxUlEx8EOIw/DV79Zk0ZfAWc6AEQuRX',
  //       PhoneNumber: 'gUKQOmtAPiYl73sfgGdDR/d7kac9X4kg',
  //       Email: 'PB9Hnoad9w5J3QfjyFJa5ALwOdjC+jKJzKBzcOCkidw=',
  //       UserID: 'mJwgbFisX9m8+J+/6FfD8g==',
  //     },
  //   ]);
  //   console.log('dec', dec);
  // }, []);

  useEffect(() => {
    if (currentUser) {
      methods.reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const SubmitMembership = async (newMembership) => {
    // console.log('MembershipData', newMembership);
    try {
      const encryptedMembership = Object.assign(
        {},
        ...Object.keys(newMembership).map((key) => ({
          [key]: encrypt(newMembership[key]),
        }))
      );
      // console.log(' encryptedMembership', encryptedMembership);

      await Post(`InsertCustomerMemberShipDetail`, encryptedMembership).then((res) => {
        if (res.data.ResponseCode == '100') {
          console.log('submit MembershipData success', res);
        } else if (res.data.ResponseCode == '-1') {
          console.log('submit MembershipData failed', res);
        }
      });
    } catch (error) {
      console.log('submit MembershipData error', error);
    }
  };

  const SubmitContact = async (contactDetails) => {
    try {
      const encryptedContact_Detail = contactDetails.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );
      if (slug !== undefined) {
        await Promise.all(
          encryptedContact_Detail.map((x) =>
            Put(`UpdateCustomerDetail`, x).then((res) => {
              if (res.data.ResponseCode == '100') {
                console.log('update ContactData success', res);
              } else if (res.data.ResponseCode == '-1') {
                console.log('update ContactData failed', res);
              }
            })
          )
        );
      } else {
        await Promise.all(
          encryptedContact_Detail.map((x) =>
            Post(`InsertCustomerDetail`, x).then((res) => {
              if (res.data.ResponseCode == '100') {
                console.log('add ContactData success', res);
              } else if (res.data.ResponseCode == '-1') {
                console.log('add ContactData failed', res);
              }
            })
          )
        );
      }
    } catch (error) {
      console.log('error submitting customer contact details', error);
    }
  };

  const SubmitSupply = async (supplyDetails) => {
    console.log('supplyDetails', supplyDetails);
    try {
      const encryptedSupply_Detail = supplyDetails.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );
      console.log('encryptedSupply_Detail', encryptedSupply_Detail);
      if (slug !== undefined) {
        await Promise.all(
          encryptedSupply_Detail.map((x) =>
            Put(`UpdateCustomerSupplyChain`, x).then((res) => {
              if (res.data.ResponseCode == '100') {
                console.log('update SupplyData success', res);
              } else if (res.data.ResponseCode == '-1') {
                console.log('update SupplyData failed', res);
              }
            })
          )
        );
      } else {
        await Promise.all(
          encryptedSupply_Detail.map((x) =>
            Post(`InsertCustomerSupplyChain`, x).then((res) => {
              if (res.data.ResponseCode == '100') {
                console.log('add SupplyData success', res);
              } else if (res.data.ResponseCode == '-1') {
                console.log('add SupplyData failed', res);
              }
            })
          )
        );
      }
    } catch (error) {
      console.log('error submitting customer supply details', error);
    }
  };

  const SubmitAttachments = async (attachmentDetails) => {
    console.log('attachmentDetails to send', attachmentDetails);
    try {
      const uploadPromises = attachmentDetails.map(async (attachment) => {
        const formData = new FormData();
        formData.append('FolderName', attachment.FolderName);
        formData.append('FileName', attachment.FileName);
        formData.append('CustomerAttachmentListID', attachment.CustomerAttachmentListID);
        formData.append('UserID', attachment.UserID);
        formData.append('CustomerID', attachment.CustomerID);
        formData.append('AttachmentFile', attachment.AttachmentFile);
        formData.append('Description', attachment.Description);
        // formData.append('CustomerAttachmentID', attachment.CustomerAttachmentID);
        // formData.append('CreationDate', attachment.CreationDate);
        // formData.append('FilePath', attachment.FilePath);
        // formData.append('FileNameOriginal', attachment.FileNameOriginal);
        // formData.append('AttachmentType', attachment.AttachmentType);
        // formData.append('UploadedByName', attachment.UploadedByName);

        const response = await Post('InsertCustomerRefAndAttachment', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        //  fetch(
        //   'https://SvitchAPI.integraerp-b2b.com:8004/mapi/InsertCustomerRefAndAttachment',
        //   {
        //     method: 'POST',
        //     body: formData,
        //   }
        // );

        if (!response.ok) {
          throw new Error(`Failed to upload attachment: ${attachment.FileName}`);
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      console.log('Successfully submitted attachments', results);
    } catch (error) {
      console.log('error submitting customer AttachmentData details', error);
    }
  };

  const SubmitMaster = async (resolve, data) => {
    const membershipIDs = data.Membership.join(',');

    if (slug !== undefined) {
      try {
        const formDataToSend = {
          ...data,
          CustomerID: currentUser?.CustomerID,
          contacts: undefined, // or null, or remove this line if you want to keep the original value
          Membership: undefined, // or null, or remove this line if you want to keep the original value
          supplies: undefined, // or null, or remove this line if you want to keep the original value
          Document: undefined,
          Description: undefined,
          file: undefined,
        };
        console.log('formDataToSend for Update', formDataToSend);
        const keysToExclude = ['contacts', 'supplies', 'Membership'];

        const encryptedCustomer_Master = Object.assign(
          {},
          ...Object.keys(formDataToSend).map((key) => ({
            [key]: keysToExclude.includes(key) ? formDataToSend[key] : encrypt(formDataToSend[key]),
          }))
        );
        console.log('encryptedCustomer_Master for Update', encryptedCustomer_Master);

        const updMasterData = await Put(`UpdateCustomer`, encryptedCustomer_Master);
        if (updMasterData.data.ResponseCode == '100') {
          console.log('Update MasterData success', updMasterData);
          const newMembership = {
            MembershipOrganizationsID: '',
            MembershipOrganizationsIDs: membershipIDs,
            CustomerID: customerMembership
              ? customerMembership[0]?.CustomerID
              : currentUser?.CustomerID,
            Type: customerMembership ? customerMembership[0]?.Type : 'SSBLi2',
            UserID: userData[0]?.UserID,
          };
          const contactDetails = contacts;
          const supplyDetails = supplies.map((x) => ({
            ...x,
            DBName: x.DBName || 'ILV_Version2',
            CustomerSupplyChainID: x.CustomerSupplyChainID || 1,
          }));

          const attachmentDetails = newCustomerAttachment.map((x) => ({
            ...x,
            CustomerID: x.CustomerID || currentUser?.CustomerID,
          }));
          SubmitMembership(newMembership);
          SubmitContact(contactDetails);
          SubmitSupply(supplyDetails);
          SubmitAttachments(attachmentDetails);
        } else if (updMasterData.data.ResponseCode == '-1') {
          console.log('Update MasterData failed', updMasterData);
        }

        resolve(encryptedCustomer_Master);
      } catch (error) {
        console.error('Error while Updating Customer', error);
        resolve(error);
      }
    } else {
      try {
        const formDataToSend = {
          ...data,
          contacts: undefined, // or null, or remove this line if you want to keep the original value
          Membership: undefined, // or null, or remove this line if you want to keep the original value
          supplies: undefined, // or null, or remove this line if you want to keep the original value
          Document: undefined,
          Description: undefined,
          file: undefined,
        };
        console.log('formDataToSend', formDataToSend);
        const keysToExclude = ['contacts', 'supplies', 'Membership'];

        const encryptedCustomer_Master = Object.assign(
          {},
          ...Object.keys(formDataToSend).map((key) => ({
            [key]: keysToExclude.includes(key) ? formDataToSend[key] : encrypt(formDataToSend[key]),
          }))
        );
        console.log('encryptedCustomer_Master', encryptedCustomer_Master);

        const subMasterData = await Post('InsertCustomer', encryptedCustomer_Master);
        if (subMasterData.data.ResponseCode == '100') {
          console.log('Add MasterData success', subMasterData.data.ServiceRes);
          const CustomerID = decrypt(subMasterData?.data?.ServiceRes[0]?.CustomerID);

          console.log('recievedCustomerID', CustomerID);
          // Create the newMembership object with the required values
          const newMembership = {
            MembershipOrganizationsID: '',
            MembershipOrganizationsIDs: membershipIDs,
            CustomerID: customerMembership ? customerMembership[0]?.CustomerID : CustomerID,
            Type: customerMembership ? customerMembership[0]?.Type : 'SSBLi2',
            UserID: customerMembership ? customerMembership[0]?.UserID : userData[0]?.UserID,
          };

          const contactDetails = contacts.map((x) => ({ ...x, CustomerID: CustomerID }));
          const supplyDetails = supplies.map((x) => ({ ...x, CustomerID: CustomerID }));
          const attachmentDetails = newCustomerAttachment.map((x) => ({
            ...x,
            CustomerID: CustomerID,
          }));
          SubmitMembership(newMembership);
          SubmitContact(contactDetails);
          SubmitSupply(supplyDetails);
          SubmitAttachments(attachmentDetails);
        } else if (subMasterData.data.ResponseCode == '-1') {
          console.log('Add Mastedata Failed', subMasterData.data.ResponseMessage);
        }

        resolve(encryptedCustomer_Master);
      } catch (error) {
        console.log('Error while Adding Customer', error);
        resolve(error);
      }
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => SubmitMaster(resolve, data));
      // reset();
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.customerDatabase.root);

      // const attachmentDetails = newCustomerAttachment.map((x) => ({
      //   ...x,
      //   CustomerID: '22',
      // }));
      // SubmitAttachments(attachmentDetails);

      // console.info('DATA', data);
    } catch (error) {
      console.error('error whilw submitting', error);
    }
  });

  const renderDetails = (
    <>
      {/* User Information */}

      <Grid xs={12} md={12}>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Title, short description, image...
          </Typography> */}
        <Card>
          {/* {!mdUp && <CardHeader title="Details" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            User Information
          </Typography>

          <Grid container spacing={1.5} sx={{ p: 1.5 }}>
            <Grid spacing={1.5} xs={12} md={6}>
              <Typography variant="subtitle2">Customer Name</Typography>
              <RHFTextField name="CustomerName" placeholder="John Doe..." />
            </Grid>

            <Grid spacing={1.5} xs={12} md={6}>
              {/* <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="content" /> */}
              <Typography variant="subtitle2">Short Name</Typography>
              <RHFTextField name="Aliass" placeholder="Johny..." />
            </Grid>
          </Grid>

          <Grid spacing={1.5} xs={12} md={12}>
            <Typography variant="subtitle2">Address Line 1</Typography>
            <RHFTextField name="Address1" placeholder="14th Street NewYork..." />
          </Grid>
          <Grid spacing={1.5} xs={12} md={12}>
            <Typography variant="subtitle2">Address Line 2</Typography>
            <RHFTextField name="Address2" placeholder="14th Street NewYork..." />
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Country</Typography>
              <RHFAutocomplete
                name="Country"
                autoHighlight
                placeholder="USA"
                options={country.map((option) => option.CountryName)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">City</Typography>
              <RHFTextField name="City" placeholder="City" />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Web Address</Typography>
              <RHFTextField name="Website" placeholder="https://www.office.com..." />
            </Grid>
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Phone</Typography>
              <RHFTextField name="ContactNo" placeholder="+1 234567890..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Fax</Typography>
              <RHFTextField name="FaxNo" placeholder="123450..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Zip Code</Typography>
              <RHFTextField name="CustomerNo" placeholder="781211..." />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Membership Information */}

      <Grid xs={12} md={12}>
        <Card>
          {/* {!mdUp && <CardHeader title="Details" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Membership Information
          </Typography>
          <Grid spacing={1.5} xs={12} md={4}>
            <Controller
              name="Membership"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  options={membership}
                  getOptionLabel={(option) => option.MembershipOrganization1}
                  value={mapMembershipIDsToObjects(field.value, membership)}
                  onChange={(_, newValue) => {
                    field.onChange(newValue.map((item) => item.MembershipOrganizationsID));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // onClick={GetCustomerMembership}
                      variant="outlined"
                      label="Membership"
                      placeholder="Select Membership"
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Card>
      </Grid>

      {/* Contact Information */}
      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Contacts
          </Typography>
          <Scrollbar>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 200 }}>Contact Type</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Title</TableCell>
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
                        <RHFAutocomplete
                          name={`contacts[${index}].Contact_Type_ID`}
                          value={
                            contactType.find(
                              (type) => type.Contact_Type_ID === contact.Contact_Type_ID
                            )?.Contact_Type || ''
                          }
                          onChange={(event, value) =>
                            handleContactAutocompleteChange(index, 'Contact_Type_ID', value)
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
                      </TableCell>
                      <TableCell>
                        <RHFAutocomplete
                          name={`contacts[${index}].PrefixID`}
                          value={
                            titles.find((title) => title.PrefixID === contact.PrefixID)
                              ?.PrefixValue || ''
                          }
                          onChange={(event, value) =>
                            handleContactAutocompleteChange(index, 'PrefixID', value)
                          }
                          autoHighlight
                          placeholder="Select Title"
                          options={titles.map((option) => option.PrefixValue)}
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
                          name={`contacts[${index}].Buyer_Name`}
                          value={contact.Buyer_Name}
                          onChange={(event) => handleContactInputChange(index, 'Buyer_Name', event)}
                          placeholder="John Doe..."
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`contacts[${index}].Designation`}
                          value={contact.Designation}
                          onChange={(event) =>
                            handleContactInputChange(index, 'Designation', event)
                          }
                          placeholder="John Doe..."
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`contacts[${index}].CellNo`}
                          value={contact.CellNo}
                          onChange={(event) => handleContactInputChange(index, 'CellNo', event)}
                          placeholder="+1 234567890..."
                        />
                      </TableCell>
                      <TableCell>
                        <RHFTextField
                          name={`contacts[${index}].Email`}
                          value={contact.Email}
                          onChange={(event) => handleContactInputChange(index, 'Email', event)}
                          type="email"
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
                    <TableCell sx={{ minWidth: 180 }}>Company Name</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Country</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Address</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Contact Person</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Phone Number</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Email</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supplies.map((supply, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <RHFAutocomplete
                          name={`supplies[${index}].PartyTypeId`}
                          value={
                            partyType.find((type) => type.PartyTypeId === supply.PartyTypeId)
                              ?.PartyType || ''
                          }
                          onChange={(event, value) =>
                            handleSupplyAutocompleteChange(index, 'PartyTypeId', value)
                          }
                          autoHighlight
                          placeholder="Select Party Type"
                          options={partyType.map((option) => option.PartyType)}
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
                          name={`supplies[${index}].CompnayName`}
                          placeholder="Company Name"
                          value={supply.CompnayName}
                          onChange={(event) => handleSupplyInputChange(index, 'CompnayName', event)}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFAutocomplete
                          name={`supplies[${index}].CountryId`}
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
      </Grid>

      {/* Reference & Attachment */}

      <Grid xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Reference & Attachment
          </Typography>
          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Document</Typography>
              <RHFAutocomplete
                name="Document"
                autoHighlight
                placeholder="Document"
                options={attachmentDocList.map((option) => option.AttachmentName)}
                getOptionLabel={(option) => option}
                onChange={(event, value) => {
                  handleAttachmentAutocompleteChange('FileTypeId', value);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Description
              </Typography>
              <RHFTextField
                name="Description"
                placeholder="File Name..."
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
              <RHFUpload
                name="file"
                file={selectedFile}
                onDrop={handleDropSingleFile}
                sx={{ mt: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 1.5, mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleAddAttachment}>
                  Add More
                </Button>
              </Box>
            </Grid>
            <Grid spacing={1.5} xs={12} md={8}>
              <Scrollbar>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Document</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Uploaded By</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {newCustomerAttachment?.map((reference, index) => (
                        <TableRow key={index}>
                          <TableCell>{reference.AttachmentType}</TableCell>
                          <TableCell>{reference.Description}</TableCell>
                          <TableCell>{reference.UploadedByName}</TableCell>
                          <TableCell>{reference.CreationDate}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleAttachmentDelete(index)} color="error">
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Grid>
          </Grid>
        </Card>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            mt: 2,
          }}
        >
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
            {!currentUser ? 'Create Customer' : 'Save Changes'}
          </LoadingButton>
        </Box>
      </Grid>
    </>
  );

  // const renderProperties = (
  //   <>
  //     {/* {mdUp && (
  //       <Grid md={4}>
  //         <Typography variant="h6" sx={{ mb: 0.5 }}>
  //           Properties
  //         </Typography>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Additional functions and attributes...
  //         </Typography>
  //       </Grid>
  //     )} */}

  //     <Grid xs={12} md={12}>
  //       <Typography variant="h6" sx={{ mb: 0.5 }}>
  //         Contact Information
  //       </Typography>
  //       {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //         Additional functions and attributes...
  //       </Typography> */}
  //       <Card>
  //         <Grid spacing={1.5} xs={12} md={12}>
  //           {!mdUp && <CardHeader title="Contact Information" />}
  //         </Grid>

  //         <Stack spacing={3} sx={{ p: 3 }}>
  //           <Stack spacing={1}>
  //             <Typography variant="subtitle2">Employment type</Typography>
  //             <RHFMultiCheckbox
  //               row
  //               spacing={4}
  //               name="employmentTypes"
  //               options={JOB_EMPLOYMENT_TYPE_OPTIONS}
  //             />
  //           </Stack>

  //           <Stack spacing={1}>
  //             <Typography variant="subtitle2">Experience</Typography>
  //             <RHFRadioGroup row spacing={4} name="experience" options={JOB_EXPERIENCE_OPTIONS} />
  //           </Stack>

  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Role</Typography>
  //             <RHFAutocomplete
  //               name="role"
  //               autoHighlight
  //               placeholder="Member"
  //               options={_roles.map((option) => option)}
  //               getOptionLabel={(option) => option}
  //               renderOption={(props, option) => (
  //                 <li {...props} key={option}>
  //                   {option}
  //                 </li>
  //               )}
  //             />
  //           </Stack>

  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Skills</Typography>
  //             <RHFAutocomplete
  //               name="skills"
  //               placeholder="+ Skills"
  //               multiple
  //               disableCloseOnSelect
  //               options={JOB_SKILL_OPTIONS.map((option) => option)}
  //               getOptionLabel={(option) => option}
  //               renderOption={(props, option) => (
  //                 <li {...props} key={option}>
  //                   {option}
  //                 </li>
  //               )}
  //               renderTags={(selected, getTagProps) =>
  //                 selected.map((option, index) => (
  //                   <Chip
  //                     {...getTagProps({ index })}
  //                     key={option}
  //                     label={option}
  //                     size="small"
  //                     color="info"
  //                     variant="soft"
  //                   />
  //                 ))
  //               }
  //             />
  //           </Stack>

  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Working schedule</Typography>
  //             <RHFAutocomplete
  //               name="workingSchedule"
  //               placeholder="+ Schedule"
  //               multiple
  //               disableCloseOnSelect
  //               options={JOB_WORKING_SCHEDULE_OPTIONS.map((option) => option)}
  //               getOptionLabel={(option) => option}
  //               renderOption={(props, option) => (
  //                 <li {...props} key={option}>
  //                   {option}
  //                 </li>
  //               )}
  //               renderTags={(selected, getTagProps) =>
  //                 selected.map((option, index) => (
  //                   <Chip
  //                     {...getTagProps({ index })}
  //                     key={option}
  //                     label={option}
  //                     size="small"
  //                     color="info"
  //                     variant="soft"
  //                   />
  //                 ))
  //               }
  //             />
  //           </Stack>

  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Locations</Typography>
  //             <RHFAutocomplete
  //               name="locations"
  //               type="country"
  //               placeholder="+ Locations"
  //               multiple
  //               options={countries.map((option) => option.label)}
  //               getOptionLabel={(option) => option}
  //             />
  //           </Stack>

  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Expired</Typography>
  //             <Controller
  //               name="expiredDate"
  //               control={control}
  //               render={({ field, fieldState: { error } }) => (
  //                 <DatePicker
  //                   {...field}
  //                   format="dd/MM/yyyy"
  //                   slotProps={{
  //                     textField: {
  //                       fullWidth: true,
  //                       error: !!error,
  //                       helperText: error?.message,
  //                     },
  //                   }}
  //                 />
  //               )}
  //             />
  //           </Stack>

  //           <Stack spacing={2}>
  //             <Typography variant="subtitle2">Salary</Typography>

  //             <Controller
  //               name="salary.type"
  //               control={control}
  //               render={({ field }) => (
  //                 <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
  //                   {[
  //                     {
  //                       label: 'Hourly',
  //                       icon: <Iconify icon="solar:clock-circle-bold" width={32} sx={{ mb: 2 }} />,
  //                     },
  //                     {
  //                       label: 'Custom',
  //                       icon: <Iconify icon="solar:wad-of-money-bold" width={32} sx={{ mb: 2 }} />,
  //                     },
  //                   ].map((item) => (
  //                     <Paper
  //                       component={ButtonBase}
  //                       variant="outlined"
  //                       key={item.label}
  //                       onClick={() => field.onChange(item.label)}
  //                       sx={{
  //                         p: 2.5,
  //                         borderRadius: 1,
  //                         typography: 'subtitle2',
  //                         flexDirection: 'column',
  //                         ...(item.label === field.value && {
  //                           borderWidth: 2,
  //                           borderColor: 'text.primary',
  //                         }),
  //                       }}
  //                     >
  //                       {item.icon}
  //                       {item.label}
  //                     </Paper>
  //                   ))}
  //                 </Box>
  //               )}
  //             />

  //             <RHFTextField
  //               name="salary.price"
  //               placeholder="0.00"
  //               type="number"
  //               InputProps={{
  //                 startAdornment: (
  //                   <InputAdornment position="start">
  //                     <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
  //                   </InputAdornment>
  //                 ),
  //               }}
  //             />
  //             <RHFSwitch name="salary.negotiable" label="Salary is negotiable" />
  //           </Stack>

  //           <Stack spacing={1}>
  //             <Typography variant="subtitle2">Benefits</Typography>
  //             <RHFMultiCheckbox
  //               name="benefits"
  //               options={JOB_BENEFIT_OPTIONS}
  //               sx={{
  //                 display: 'grid',
  //                 gridTemplateColumns: 'repeat(2, 1fr)',
  //               }}
  //             />
  //           </Stack>
  //         </Stack>
  //       </Card>
  //     </Grid>
  //   </>
  // );

  // const renderActions = (
  //   <>
  //     {mdUp && <Grid md={4} />}
  //     <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
  //       <FormControlLabel
  //         control={<Switch defaultChecked />}
  //         label="Publish"
  //         sx={{ flexGrow: 1, pl: 3 }}
  //       />

  //       <LoadingButton
  //         type="submit"
  //         variant="contained"
  //         size="large"
  //         loading={isSubmitting}
  //         sx={{ ml: 2 }}
  //       >
  //         {!currentUser ? 'Create User' : 'Save Changes'}
  //       </LoadingButton>
  //     </Grid>
  //   </>
  // );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {renderProperties}

        {renderActions} */}
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
  currentUserContact: PropTypes.object,
  customerSupply: PropTypes.array,
  slug: PropTypes.string,
  customerMembership: PropTypes.array,
  customerAttachment: PropTypes.array,
  // decryptObjectKeys: PropTypes.func,
};

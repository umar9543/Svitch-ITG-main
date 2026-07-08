import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { _roles } from 'src/_mock';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';

const ContactsTable = ({
  contacts,
  contactType,
  onDeleteContact,
  handleAutocompleteChange,
  getContactTypeById,
  handleInputChange,
  titles,
}) => {
  const handleDelete = (index) => {
    onDeleteContact(index);
  };

  const handleSingleAutocompleteChange = (index, name, value) => {
    handleAutocompleteChange(index, name, value);
  };

  return (
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
          {contacts !== null &&
            contacts.map((contact, index) => (
              <TableRow key={index}>
                <TableCell>
                  <RHFAutocomplete
                    name={`Contact_Type_ID-${index}`}
                    value={getContactTypeById(contact.Contact_Type_ID)}
                    onChange={(event, value) =>
                      handleSingleAutocompleteChange(index, 'Contact_Type_ID', value)
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
                    name={`PrefixID-${index}`}
                    value={
                      titles.find((title) => title.PrefixID === contact.PrefixID)?.PrefixValue || ''
                    }
                    onChange={(event, value) =>
                      handleSingleAutocompleteChange(index, 'PrefixID', value)
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
                    name={`Buyer_Name-${index}`}
                    value={contact.Buyer_Name}
                    onChange={handleInputChange}
                    placeholder="John Doe..."
                  />
                </TableCell>
                <TableCell>
                  <RHFTextField
                    name={`Designation-${index}`}
                    value={contact.Designation}
                    onChange={handleInputChange}
                    placeholder="John Doe..."
                  />
                </TableCell>
                <TableCell>
                  <RHFTextField
                    name={`CellNo-${index}`}
                    value={contact.CellNo}
                    onChange={handleInputChange}
                    placeholder="+1 234567890..."
                  />
                </TableCell>
                <TableCell>
                  <RHFTextField
                    name={`Email-${index}`}
                    value={contact.Email}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="john@mail.com..."
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(index)} color="error">
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContactsTable;

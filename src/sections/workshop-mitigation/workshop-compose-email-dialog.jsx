'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import Editor from 'src/components/editor';

// ----------------------------------------------------------------------

const DEFAULT_TEMPLATE = `<p>Dear Valued Supplier,</p>
<p>This session is designed to support all partners with updated compliance requirements and collaboration processes.</p>
<p>Please register for the workshop using the link below: [Zoom Registration Link]</p>
<p><strong>Workshop Details:</strong></p>
<ul>
  <li>Date: [Workshop Date]</li>
  <li>Time: [Time + Time Zone]</li>
  <li>Platform: Zoom (registration required)</li>
</ul>
<p>After registration, you will receive a confirmation email with the meeting link.</p>
<p>If you have any questions, please feel free to contact us at info@applied-csr.com.</p>
<p>Thank you and we look forward to your participation.</p>
<p>Kind regards,<br/>CEI Conrad Electronic Int'l (HK) Ltd. Team</p>`;

export default function WorkshopComposeEmailDialog({
  open,
  onClose,
  workshopDetails = {},
  onSave,
}) {
  const [content, setContent] = useState(DEFAULT_TEMPLATE);

  useEffect(() => {
    if (open) {
      setContent(DEFAULT_TEMPLATE);
    }
  }, [open]);

  const handleSave = () => {
    onSave?.(content);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Compose Email
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Editor
          simple
          id="workshop-email-body"
          value={content}
          onChange={(v) => setContent(v)}
          placeholder="Write invitation message..."
          sx={{ minHeight: 360 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WorkshopComposeEmailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  workshopDetails: PropTypes.object,
  onSave: PropTypes.func,
};

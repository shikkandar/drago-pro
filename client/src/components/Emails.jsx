import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { API_URLS } from './services/api.urls';
import useApi from '../hooks/useApi';
import { Checkbox, Box, List } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import Email from './Email';
import NoMails from './common/NoMails';
import { EMPTY_TABS } from '../constants/Constants';

function Emails() {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [refereshScreen, setRefereshScreen] = useState(false);
  const { openDrawer } = useOutletContext();
  const { type } = useParams();
  const getEmailsService = useApi(API_URLS.getEmailFromType);
  const moveEmailsToBinService = useApi(API_URLS.moveEmailsToBin);
  const deleteEmailService = useApi(API_URLS.deleteEmails);

  useEffect(() => {
    getEmailsService.call({}, type);
    // console.log(getEmailsService?.response);
  }, [type, refereshScreen]);

  const selectAllEmails = (e) => {
    if (e.target.checked) {
      const emails = Array.isArray(getEmailsService?.response) ? getEmailsService.response.map((email) => email._id) : [];
      setSelectedEmails(emails);
    } else {
      setSelectedEmails([]);
    }
  };

  const deleteSelectedEmails = () => {
    if (type === 'bin') {
      deleteEmailService.call(selectedEmails);
    } else {
      moveEmailsToBinService.call(selectedEmails);
    }
    setRefereshScreen((prevState) => !prevState);
  };

  return (
    <Box style={openDrawer ? { marginLeft: 250, width: 'calc(100%-250px)' } : { width: '100%' }}>
     
      <Box style={{ padding: '20px 10px 0 10px', display: 'flex', alignItems: 'center' }}>
        <Checkbox size="small" onChange={selectAllEmails} />
        <DeleteOutline onClick={deleteSelectedEmails} />
      </Box>
      <List>
        {Array.isArray(getEmailsService?.response) && getEmailsService.response.length > 0 ? (
          getEmailsService.response.map((email) => (
            <Email
              key={email._id}
              email={email}
              selectedEmails={selectedEmails}
              setRefereshScreen={setRefereshScreen}
              setSelectedEmails={setSelectedEmails}
            />
          ))
        ) : (
          <NoMails message={EMPTY_TABS[type]} />
        )}
      </List>
    </Box>
  );
}

export default Emails;

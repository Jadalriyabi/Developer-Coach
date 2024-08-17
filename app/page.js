'use client';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
  Switch,
} from '@mui/material';
import { blue, grey, red } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello, I am Dev Coach, your personal Software Engineering AI companion. How can I help you land that $100,000+ job today?',
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Add darkMode state

  const sendMessage = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage('');

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        {
          role: 'assistant',
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const backgroundColor = darkMode ? grey[900] : grey[100];
  const chatBackgroundColor = darkMode ? grey[800] : grey[200];
  const textColor = darkMode ? 'white' : 'black';
  const inputTextColor = darkMode ? grey[300] : grey[900]; // Light text on dark background, dark text on light background
  const inputLabelColor = darkMode ? grey[400] : grey[700]; // Adjust label color
  const inputBorderColor = darkMode ? grey[700] : grey[500]; // Adjust border color
  const buttonBackgroundColor = darkMode ? grey[700] : grey[200];
  const buttonHoverBackgroundColor = darkMode ? grey[600] : grey[300];
  const avatarBackgroundColor = darkMode ? grey[700] : grey[200];
  const dividerColor = darkMode ? grey[700] : grey[300];
  const iconColor = darkMode ? 'white' : 'black';

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor={backgroundColor}
    >
      <Stack
        direction="column"
        spacing={2}
        flexGrow={1}
        width="100%"
        maxWidth="1200px"
        mx="auto"
        my={2}
        px={isMobile ? 2 : 4}
        py={isMobile ? 1 : 2}
        bgcolor={chatBackgroundColor}
        borderRadius={2}
        boxShadow={2}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Link href="https://github.com/Jadalriyabi/Dev-Coach">
            <Avatar
              src="/logo.png"
              alt="GitHub"
              sx={{
                width: isMobile ? 40 : 50,
                height: isMobile ? 40 : 50,
                bgcolor: avatarBackgroundColor,
              }}
            />
          </Link>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            sx={{ color: iconColor }}
          />
        </Box>
        <Divider sx={{ bgcolor: dividerColor }} />
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="calc(100vh - 250px)"
        >
          {messages.map((message, index) => (
            <Box
            key={index}
            display="flex"
            justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }
          >
            <Box
              bgcolor={
                message.role === 'assistant'
                  ? darkMode
                    ? grey[700] // Dark mode color for assistant messages
                    : grey[300] // Light mode color for assistant messages
                  : blue[600] // User messages background
              }
              color={textColor}
              borderRadius={4}
              p={1.6}
              margin="10px 0"
              boxShadow="3px 3px 10px rgba(0, 0, 0, 0.5)"
            >
              <Typography>{message.content}</Typography>
            </Box>
          </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2} height="40px">
          <Button
            variant="contained"
            onClick={clearChat}
            sx={{
              bgcolor: red[500],
              ':hover': { bgcolor: red[700] },
              marginRight: 'auto',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: '0.9rem',
              textTransform: 'none',
              border: 'none'
            }}
          >
            <span style={{ marginRight: '8px' }}>
              <svg
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-.5.5H10a.5.5 0 0 1 0-1H6V6z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h1.5a1 1 0 0 1 1-1H14.5zM6 2h12v13H6V2z" />
              </svg>
            </span>
            Clear 
          </Button>
          <TextField
            label="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              input: { color: inputTextColor },
              label: { color: inputLabelColor },
              fieldset: { borderColor: inputBorderColor },
              bgcolor: darkMode ? grey[800] : grey[200], // Match the image background
              height: '100%', // Makes the input field take up the full height
              '& .MuiOutlinedInput-root': {
                height: '100%', // Makes the input field take up the full height
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{ bgcolor: blue[600], ':hover': { bgcolor: blue[500] } }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
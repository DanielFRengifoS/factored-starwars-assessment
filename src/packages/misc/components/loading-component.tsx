import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  animation: ${spin} 2s linear infinite;
`;

const Loading = () => {
  return (
    <Container>
      <Logo src="https://cdn.shopify.com/s/files/1/1009/9676/products/LCS_STRWRS_YD_C_CRCL_grande.png?v=1494013187" alt="Star Wars Logo" />
      <p>Loading...</p>
    </Container>
  );
};

export default Loading;
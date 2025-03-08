import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthContext } from '../managers/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../assets/PopLensLogo.png';
import ReviewModal from './ReviewModal';


const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #15202B;
  color: white;
  padding-left: 150px;
`;

const Sidebar = styled.div`
  width: 275px;
  padding: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
  border-right: 1px solid #38444d;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 600px;
  border-right: 1px solid #38444d;
`;

const RightSidebar = styled.div`
  width: 350px;
  padding: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px 45px;
  border-radius: 25px;
  border: none;
  background-color: #273340;
  color: white;
  font-size: 15px;

  &::placeholder {
    color: #8899a6;
  }

  &:focus {
    outline: none;
    background-color: #15202B;
    border: 1px solid #E91E63;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #8899a6;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
  font-size: 20px;
  border-radius: 25px;
  margin: 4px 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
  }
`;

const LogoContainer = styled.div`
  padding: 12px 16px;
  margin-bottom: 4px 0;
  
  img {
    width: 100px;
    height: 25px;
  }
`;

const LogButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 16px;
  color: white;
  text-decoration: none;
  font-style: italic;
  font-size: 20px;
  border-radius: 25px;
  margin: 4px 0;
  margin-top: 20px;
  border: none;
  width: 100%;
  cursor: pointer;
  position: relative; // Add this
  overflow: hidden; // Add this
  transition: transform 0.2s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(233,30,99,0.9), rgba(194,24,91,0.9));
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 2;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #192734;
  border-radius: 8px;
  border: 1px solid #38444d;
  display: none;
  z-index: 1000;
`;
const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const ThreeDots = styled.button`
  background: none;
  border: none;
  color: #8899a6;
  padding: 8px;
  cursor: pointer;
  margin-left: auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  width: 32px;
  height: 32px;
  min-width: 32px;
  position: relative;
  
  ${ProfileContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
    color: #E91E63;
  }

  &:hover + ${DropdownMenu}, &:hover ~ ${DropdownMenu}, & ~ ${DropdownMenu}:hover {
    display: block;
  }
`;
const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: rgba(233, 30, 99, 0.1);
    color: #E91E63;
  }
`;

const Layout: React.FC = () => {
  const { user, logout } = useAuthContext();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <LogoContainer>
          <img src={logo} alt="PopLens Logo" />
        </LogoContainer>
        <NavItem to="/home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
          </svg>
          Home
        </NavItem>
        <NavItem to={`/profile/${user?.username}`}>
          <ProfileContainer>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Profile
            </div>
            <ThreeDots>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </ThreeDots>
            <DropdownMenu>
              <DropdownItem onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </ProfileContainer>
        </NavItem>
        <NavItem to="/films">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
          </svg>
          Films
        </NavItem>
        <NavItem to="/books">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
          </svg>
          Books
        </NavItem>
        <NavItem to="/games">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
          Games
        </NavItem>
        <LogButton as="button" onClick={() => setIsReviewModalOpen(true)}>
          <span>Pop a Review!</span>
        </LogButton>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
      <RightSidebar>
        <SearchContainer>
          <SearchIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </SearchIcon>
          <SearchBar
            type="text"
            placeholder="Search PopLens"
          />
        </SearchContainer>
      </RightSidebar>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </LayoutContainer>
  );
};

export default Layout;
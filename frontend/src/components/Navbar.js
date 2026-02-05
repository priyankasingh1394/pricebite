import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import { getCurrentLocation } from '../store/slices/locationSlice';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #764ba2;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #667eea;
  }

  &.active {
    color: #667eea;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 2px;
      background: #667eea;
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LocationBadge = styled.div`
  background: #f0f9ff;
  color: #2563eb;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e0f2fe;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:first-child {
    border-bottom: 1px solid #e0e0e0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #667eea;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 999;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 15px 20px;
  color: #666;
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background: #f8f9fa;
    color: #667eea;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { currentLocation } = useSelector(state => state.location);

  useEffect(() => {
    // Get user location on mount
    if (!currentLocation) {
      dispatch(getCurrentLocation());
    }
  }, [dispatch, currentLocation]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <NavContainer>
        <NavContent>
          <Logo to="/">
            🛒 PriceBite
          </Logo>

          <NavLinks>
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </NavLink>
            <NavLink to="/products" className={location.pathname === '/products' ? 'active' : ''}>
              Products
            </NavLink>
            <NavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </NavLink>
            <NavLink to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </NavLink>
          </NavLinks>

          <UserMenu>
            {currentLocation && (
              <LocationBadge>
                📍 {currentLocation.city || 'Detecting...'}
              </LocationBadge>
            )}

            {isAuthenticated ? (
              <>
                <UserAvatar onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  {getUserInitials()}
                </UserAvatar>
                
                {isUserMenuOpen && (
                  <DropdownMenu>
                    <DropdownItem to="/profile">
                      👤 My Profile
                    </DropdownItem>
                    <DropdownItem to="/shopping-lists">
                      📝 Shopping Lists
                    </DropdownItem>
                    <DropdownItem to="/settings">
                      ⚙️ Settings
                    </DropdownItem>
                    <DropdownItem to="/orders">
                      📦 My Orders
                    </DropdownItem>
                    <DropdownItem as="button" onClick={handleLogout}>
                      🚪 Logout
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                  Login
                </NavLink>
                <NavLink to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                  Sign Up
                </NavLink>
              </>
            )}
          </UserMenu>

          <MobileMenuButton onClick={toggleMobileMenu}>
            ☰
          </MobileMenuButton>
        </NavContent>
      </NavContainer>

      <MobileMenu isOpen={isMenuOpen}>
        <MobileNavLink to="/" onClick={toggleMobileMenu}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/products" onClick={toggleMobileMenu}>
          Products
        </MobileNavLink>
        <MobileNavLink to="/about" onClick={toggleMobileMenu}>
          About
        </MobileNavLink>
        <MobileNavLink to="/contact" onClick={toggleMobileMenu}>
          Contact
        </MobileNavLink>
        
        {!isAuthenticated && (
          <>
            <MobileNavLink to="/login" onClick={toggleMobileMenu}>
              Login
            </MobileNavLink>
            <MobileNavLink to="/register" onClick={toggleMobileMenu}>
              Sign Up
            </MobileNavLink>
          </>
        )}
        
        {isAuthenticated && (
          <>
            <MobileNavLink to="/profile" onClick={toggleMobileMenu}>
              👤 My Profile
            </MobileNavLink>
            <MobileNavLink to="/shopping-lists" onClick={toggleMobileMenu}>
              📝 Shopping Lists
            </MobileNavLink>
            <MobileNavLink to="/settings" onClick={toggleMobileMenu}>
              ⚙️ Settings
            </MobileNavLink>
            <MobileNavLink to="/orders" onClick={toggleMobileMenu}>
              📦 My Orders
            </MobileNavLink>
            <MobileNavLink as="button" onClick={() => { handleLogout(); toggleMobileMenu(); }}>
              🚪 Logout
            </MobileNavLink>
          </>
        )}
      </MobileMenu>
    </>
  );
};

export default Navbar;

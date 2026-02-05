import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../theme';
import Input from '../common/Input';
import Button from '../common/Button';

const SearchBarContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchInput = styled(Input)`
  padding-right: 120px;
  font-size: ${theme.typography.fontSize.base};
`;

const SearchActions = styled.div`
  position: absolute;
  right: ${theme.spacing[2]};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: ${theme.spacing[1]};
  align-items: center;
`;

const ActionButton = styled(motion.button)`
  background: none;
  border: none;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  color: ${theme.colors.neutral[600]};
  transition: all ${theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[800]};
  }
`;

const SuggestionsDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.neutral[200]};
  border-top: none;
  border-radius: 0 0 ${theme.borderRadius.lg} ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  max-height: 400px;
  overflow-y: auto;
  z-index: ${theme.zIndex.dropdown};
`;

const SuggestionItem = styled(motion.div)`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
  
  &:hover {
    background-color: ${theme.colors.primary[50]};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.base};
  object-fit: cover;
`;

const SuggestionContent = styled.div`
  flex: 1;
`;

const SuggestionTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[1]};
`;

const SuggestionMeta = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.neutral[600]};
  display: flex;
  gap: ${theme.spacing[2]};
`;

const CategoryBadge = styled.span`
  background-color: ${theme.colors.primary[100]};
  color: ${theme.colors.primary[700]};
  padding: 2px ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.base};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const PriceInfo = styled.span`
  color: ${theme.colors.secondary[600]};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const RecentSearches = styled.div`
  padding: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.neutral[200]};
`;

const RecentTitle = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[3]};
`;

const RecentTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

const RecentTag = styled(motion.button)`
  background-color: ${theme.colors.neutral[100]};
  color: ${theme.colors.neutral[700]};
  border: none;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  
  &:hover {
    background-color: ${theme.colors.neutral[200]};
  }
`;

const SearchBar = ({ 
  value, 
  onChange, 
  onSubmit, 
  suggestions = [], 
  recentSearches = [],
  showSuggestions,
  onSuggestionSelect,
  onClearRecent,
  isLoading = false 
}) => {
  return (
    <SearchBarContainer>
      <SearchInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit();
          } else if (e.key === 'Escape') {
            onSuggestionSelect(null);
          }
        }}
        placeholder="Search for products, brands, categories..."
        size="md"
      />
      
      <SearchActions>
        {isLoading ? (
          <ActionButton disabled>
            🔍
          </ActionButton>
        ) : (
          <>
            <ActionButton
              onClick={() => onSuggestionSelect(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Clear search"
            >
              ✕
            </ActionButton>
            <ActionButton
              onClick={onSubmit}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Search"
            >
              🔍
            </ActionButton>
          </>
        )}
      </SearchActions>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <SuggestionsDropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.id}
                onClick={() => onSuggestionSelect(suggestion)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, backgroundColor: theme.colors.primary[50] }}
                whileTap={{ scale: 0.98 }}
              >
                <SuggestionImage 
                  src={suggestion.image || '/api/placeholder/40/40'}
                  alt={suggestion.name}
                />
                <SuggestionContent>
                  <SuggestionTitle>{suggestion.name}</SuggestionTitle>
                  <SuggestionMeta>
                    <CategoryBadge>{suggestion.category}</CategoryBadge>
                    <PriceInfo>₹{suggestion.minPrice}</PriceInfo>
                  </SuggestionMeta>
                </SuggestionContent>
              </SuggestionItem>
            ))}
            
            {recentSearches.length > 0 && (
              <RecentSearches>
                <RecentTitle>Recent Searches</RecentTitle>
                <RecentTags>
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <RecentTag
                      key={search}
                      onClick={() => onChange(search)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {search}
                    </RecentTag>
                  ))}
                  <RecentTag
                    onClick={onClearRecent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All
                  </RecentTag>
                </RecentTags>
              </RecentSearches>
            )}
          </SuggestionsDropdown>
        )}
      </AnimatePresence>
    </SearchBarContainer>
  );
};

export default SearchBar;

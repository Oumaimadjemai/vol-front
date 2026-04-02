// FeatureCheckboxList.jsx - Version corrigée et stable
import React from 'react';
import { Checkbox, Button } from '@mui/material';
import { CheckSquare, Square, Shield } from 'lucide-react';

const FeatureCheckboxList = ({ features, selectedFeatures, onFeatureToggle, onSelectAll, disabled }) => {
  const selectedCount = selectedFeatures?.length || 0;
  const totalCount = features.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  const getFeatureIcon = (featureValue) => {
    const icons = {
      bookings: '📅',
      hotels: '🏨',
      flights: '✈️',
      cars: '🚗',
      activities: '🎯',
      dashboard: '📊',
      transfers: '🚌',
      restaurants: '🍽️',
      tours: '🗺️',
      users: '👥',
      reports: '📈',
      settings: '⚙️',
    };
    return icons[featureValue] || '🔘';
  };

  // Vérifier que les features sont valides
  const validFeatures = features.filter(f => f && f.value);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#00C0E8]" />
          <span className="text-sm text-gray-600">
            {selectedCount} / {totalCount} sélectionnée{totalCount > 1 ? 's' : ''}
          </span>
        </div>
        
        <Button
          onClick={onSelectAll}
          disabled={disabled}
          size="small"
          variant="outlined"
          startIcon={isAllSelected ? null : <CheckSquare className="w-3 h-3" />}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            fontSize: '0.7rem',
            padding: '4px 12px',
            borderColor: '#e5e7eb',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#00C0E8',
              color: '#00C0E8',
            },
          }}
        >
          {isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </Button>
      </div>

      {/* Liste - avec clé unique et valeur par défaut */}
      <div className="space-y-2">
        {validFeatures.map((feature, index) => {
          // Utiliser feature.value comme clé, ou id, ou index en dernier recours
          const featureKey = feature.value || feature.id || `feature-${index}`;
          const featureValue = feature.value || feature.id;
          const isSelected = selectedFeatures ? selectedFeatures.includes(featureValue) : false;
          
          return (
            <div
              key={featureKey}
              onClick={() => !disabled && onFeatureToggle(featureValue)}
              className={`
                flex items-center justify-between p-3 rounded-xl cursor-pointer
                transition-all duration-200 border
                ${isSelected 
                  ? 'bg-[#00C0E8]/5 border-[#00C0E8]' 
                  : 'bg-white border-gray-100 hover:border-gray-200'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getFeatureIcon(featureValue)}</span>
                <span className="font-medium text-gray-700 text-sm">
                  {feature.label}
                </span>
              </div>
              
              <Checkbox
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onFeatureToggle(featureValue);
                }}
                disabled={disabled}
                sx={{
                  '&.Mui-checked': {
                    color: '#00C0E8',
                  },
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCheckboxList;